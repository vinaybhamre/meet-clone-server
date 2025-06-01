import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import { connectToDB } from "./config/db.js";
import socketSetup from "./socket.js";

dotenv.config();

connectToDB()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error("DB connection failed:", err.message);
    } else {
      console.error("DB connection failed:", err);
    }
  });

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server: http.Server = http.createServer(app);

socketSetup(server);

const PORT = process.env.PORT ?? "3000";

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
