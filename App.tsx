import Server from "./server/server";
import dotenv from 'dotenv'
dotenv.config();
const server = new Server();
server.listen();




