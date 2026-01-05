const express = require("express");

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/samurais", (req, res) => {
  res.send("Hello Samurais!");
});

app.post("/samurais", (req, res) => {
  res.send("Create Samurai handler!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
