import express, { Application } from "express";
import path from "path";
import cors from "cors";
import login from "../routes/auth";
import users from "../routes/users";
import investigation from "../routes/investigation";
import documents from "../routes/files";
import commnets from "../routes/comments";
import cites from "../routes/cites";
const myParser = require("body-parser");
class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    login: "/api/login",
    users: "/api/usuarios",
    investigation: "/api/investigacion",
    documents: "/api/file",
    comment: "/api/comentario",
    cites: "/api/cita",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use(express.static("public"));
  //  this.app.use(express.json());
  this.app.use(myParser.json({limit: '200mb'}));
  this.app.use(myParser.urlencoded({limit: '200mb', extended: true}));
  //  this.app.use(myParser.text({ limit: "200mb" }));
   // this.app.use(myParser.urlencoded({ limit: "200mb", extended: true }));
  }

  routes() {
    this.app.use(this.apiPaths.login, login);
    this.app.use(this.apiPaths.users, users);
    this.app.use(this.apiPaths.investigation, investigation);
    this.app.use(this.apiPaths.documents, documents);
    this.app.use(this.apiPaths.comment, commnets);
    this.app.use(this.apiPaths.cites, cites);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server runing in: " + this.port);
    });
  }
}
export default Server;
