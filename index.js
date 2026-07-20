import express from "express";
import cors from "cors";
import mongoose from "./db/index.js";
import router from "./routes/index.js";
const app = express();

const PORT = process.env.port || 3000;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB connected");
});
app.use(express.json());
app.use(cors());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log("port is", PORT);
});
