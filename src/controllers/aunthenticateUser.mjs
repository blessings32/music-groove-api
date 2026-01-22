import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function authentication(req, res, next) {
  let token = req.signedCookies.token;
  if (!token) {
    console.log("no token found, redirecting to login");
    return res.status(401).json({
      code: "AUTH_REQUIRED",
      message: "No token provided",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.user = payload._id;
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Unauthorized");
  }
  next();
}

export default authentication;
