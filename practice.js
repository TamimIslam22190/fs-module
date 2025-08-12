import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import db from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
dotenv.config();

app.post("/signin", async (req, res) => {
  try {
    let { username, password } = req.body;

    const genSalt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    const hashPass = await bcrypt.hash(password.toString(), genSalt);

    const accessToken = await genarateAccessToken(username);
    const refreshToken = await genarateRefreshToken(username);

    const dbQuery =
      "insert into userInfo(username,pass,jwtToken,refreshToken) values(?,?,?,?)";

    db.query(
      dbQuery,
      [username, hashPass, accessToken, refreshToken],
      (err, result) => {
        if (err) {
          response(res, 400, "Failed to insert row", err);
        }

        const data = {
          result,
          accesstoken: accessToken,
        };
        response(res, 200, "Insert complete", data);
      }
    );
  } catch (error) {
    console.error(error);
  }
});

const authToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader.split(" ")[1];

  const query = "select * from userInfo where id  =  ?";

  db.query(query, [15], (err, result) => {
    if (err) response(res,500,"Not Found User",err)
    
    
  });

  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) {
      response(res, 401, "Invalid token", err);
    }
    req.user = user;
  });
  next();
};

app.get("/dashboard", authToken, async (req, res) => {
  try {
    response(res, 200, "You are authorized", req.user);
  } catch (error) {}
});

app.get("/refreshToken", async (req, res) => {
  try {
    const accessToken = await genarateAccessToken();
    const refreshToken = await genarateRefreshToken();

    const token = {
      accessToken,
      refreshToken,
    };

    

    response(res, 200, "Re-genarate accessToken and refreshToken", token);
  } catch (error) {}
});

const genarateAccessToken = async (username = "tamimislam") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        data: {
          username,
        },
      },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.ACCEESSEXPIRESIN },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

const genarateRefreshToken = async (username) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        data: {
          username,
        },
      },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.REFRESHEXPIRESIN },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

const response = (res, status, message, data) => {
  res.status(status).json({ message, data });
};

const PORT = 3000;
(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
