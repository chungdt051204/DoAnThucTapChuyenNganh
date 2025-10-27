const cors = require("cors");
const connectDB = require("./database");
connectDB();
const express = require("express");
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.listen(port, () => {
  console.log("Server đang chạy với port", port);
});
