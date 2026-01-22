import { Router } from "express";
import bcrypt from "bcryptjs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import query from "../controllers/dbQuery.mjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = Router();

router.post("/api/auth/register", async (req, res) => {
  // Handle user registration
  let { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).send(
      JSON.stringify({
        status: "error",
        message: "All fields are required.",
      }),
    );
  } else {
    if (
      typeof username != "string" ||
      typeof password != "string" ||
      typeof confirmPassword != "string" ||
      typeof email != "string"
    ) {
      res
        .status(400)
        .send(
          JSON.stringify({ status: "error", message: "incorrect data type" }),
        );
      return;
    }
    username = username.trim();
    email = email.trim();
    let emailFromdb = await query(`SELECT email FROM users WHERE email = ?`, [
      email,
    ]);
    let usernameFromdb = await query(
      `SELECT username FROM users WHERE username = ?`,
      [username],
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    if (password !== confirmPassword) {
      return res.status(409).send(
        JSON.stringify({
          status: "error",
          message: "Passwords do not match.",
        }),
      );
    } else if (emailFromdb.length > 0) {
      return res
        .status(409)
        .send(
          JSON.stringify({ status: "error", message: "Email already exists." }),
        );
    } else if (usernameFromdb.length > 0) {
      return res.status(409).send(
        JSON.stringify({
          status: "error",
          message: "Username already exists.",
        }),
      );
    } else {
      query(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [
        username,
        email,
        hashedPassword,
      ]).then((data) => {
        console.log("user registered: ", data);
      });
    }
    // Here you would typically save the user to the database
    // For now, we will just return a success message
    res
      .status(201)
      .send(JSON.stringify({ status: "success", message: "User registered." }));
    return; //res.redirect("/home");
  }
});

router.post("/api/auth/login", async (req, res) => {
  // Handle user login
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: "error",
      message: "Username and password are required.",
    });
  } else {
    let { username, password } = req.body;
    let userFromDb = await query(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (userFromDb.length === 0) {
      // Here you would typically check the credentials against the database
      return res.status(401).send(
        JSON.stringify({
          status: "error",
          message: "Invalid username or password.",
        }),
      );
    }
    const passwordfromDb = userFromDb[0].password;
    const isPasswordValid = bcrypt.compareSync(password, passwordfromDb);
    if (!isPasswordValid) {
      return res.status(401).send(
        JSON.stringify({
          status: "error",
          message: "Invalid username or password.",
        }),
      );
    } else {
      console.log("user logged in successfully");
      const payload = {
        _id: userFromDb[0].id,
      };
      const privateKey = process.env.JWT_KEY;

      const token = jwt.sign(payload, privateKey);
      console.log(`user id: ${userFromDb[0].id} token: ${token}`);
      res.cookie("token", token, {
        signed: true,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 100, // 30 days
      });

      //END OF TOKEN CREATION
      res
        .status(200)
        .send(
          JSON.stringify({ status: "success", message: "Login successful." }),
        );
      return;
    }
  }
});
router.post("/logout", (req, res) => {
  // Handle user logout
});
export default router;
