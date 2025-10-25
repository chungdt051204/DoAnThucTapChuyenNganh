const connectDB = require("./database");
connectDB();
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
app.listen(port, () => {
  console.log("Server đang chạy với port", port);
});
