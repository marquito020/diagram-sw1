import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import { dbConnet } from "./config/mongoose";

import loginRoutes from "./routes/login.routes";
import diagramRoutes from "./routes/diagram.routes";
import usuarioRoutes from "./routes/usuario.routes";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/usuario", usuarioRoutes);

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

console.log("Connecting to database...");
async function startServer() {
    try {
        await dbConnet();
        console.log("Database connected");
        io.on("connection", (socket) => {
            console.log("a user connected");

            socket.on("hello from client", () => {
                console.log("user disconnected");
            });
        });

        io.on("hello-from-client", (...args) => {
            console.log(args);
        });

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
        console.log("Error connecting to database");
        console.log(error);
    }
}

startServer();
