import express from "express";
import helmet from "helmet";
import cors from "cors";
import * as path from "path";
import router from "./routes";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(router);

app.listen(3333);
