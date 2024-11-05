import { GrantType, setupKinde } from "@kinde-oss/kinde-node-express";
import { Application } from "express";
import createApp from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app: Application = createApp();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
