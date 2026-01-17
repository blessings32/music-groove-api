/**
 * Extracts a human-readable error message from various error types.
 * Handles:
 *   - Native Error objects (uses .message)
 *   - Objects with a 'message' property
 *   - String errors
 *   - Fallback for unknown error types
 * @param {any} err - The error object or value to extract a message from.
 * @returns {string} - The extracted error message.
 */
function getErrorMessage(err) {
  if (err instanceof Error) {
    // Standard JS Error object
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err) {
    // Custom error object with a 'message' property
    return String(err.message);
  }
  if (typeof err === "string") {
    // Error is a plain string
    return err;
  }
  // Fallback for unknown error types
  return "An unknown error occurred";
}

/**
 * Express error-handling middleware.
 * Catches errors thrown in routes/middleware and sends a JSON response.
 * - If headers are already sent, delegates to the default Express handler.
 * - Responds with HTTP 500 status and a structured JSON error object.
 * - Logs the error to the server console for debugging.
 * - Calls next() to ensure Express continues error handling chain.
 *
 * @param {any} err - The error thrown in the app.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    // If response has already started, delegate to default Express error handler
    return next(err);
  }
  // Send a JSON error response with status 500
  res.status(500).json({
    error: {
      message: getErrorMessage(err) || "An unexpected error occurred",
      code: err.code || "INTERNAL_SERVER_ERROR",
    },
  });
  // Log the error for server-side debugging
  console.error("Error:", err);
  // Call next() to allow further error handling if needed
  next();
}
