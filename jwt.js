import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import db from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
dotenv.config();

app.post("/signin", async (req, res) => {
  let { username, password } = req.body;

  const genSalt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
  const hashPass = await bcrypt.hash(password.toString(), genSalt);

  const accessToken = await generateAccessToken();
  const genRefreshToken = await generateRefreshToken();

  const query =
    "insert into userInfo(username,pass,jwtToken,refreshToken) values(?,?,?,?)";

  db.query(
    query,
    [username, hashPass, accessToken, genRefreshToken],
    (err, result) => {
      if (err) {
        response(res, 400, "Failed Insert In Db", _);
      }

      response(res, 200, "Complete Insert In Db", result);
    }
  );
});

app.post("/dashboard", async (req, res) => {});

const generateAccessToken = async () => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        data: {
          username: "Tamim Islam",
        },
      },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.ACCEESSEXPIRESIN },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

const generateRefreshToken = async () => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        data: "tamim",
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESHEXPIRESIN,
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

function response(res, status, message, data) {
  res.status(status).json({ message, data });
}

const PORT = 3000;
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
