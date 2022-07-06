// const express = require("express"); // ES5  old version
// const cors = require("cors"); //way of import--- ES5  old version
import express from "express"; // ES6  latest version  express@5.0.0.beta.1
const app = express(); //it's express class
import cors from "cors"; //way of import---  ES6  latest version
import dotenv from "dotenv"; // enviroment file for security purpose
import connectDb from "./config/dbconfig.js";
import router from "./routes/userRoutes.js";
dotenv.config(); //config function in dotenv
console.log(process.env.EMAIL_PASS);

//cors policy
app.use(cors()); //for fix the error of cors policy

//JSON
app.use(express.json());
app.use(express.urlencoded());

// const port = process.env.PORT || 3030;
const port = 3330;
const DATABASE_URL = process.env.DATABASE_URL;

///----load Routes---///
app.use("/api/user", router);

app.get("/user", (req, res) => {
  res.send({ message: "success" });
});

///database connection
connectDb(DATABASE_URL);
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
