import * as UserController from "../controllers/UserController.js"
import express from "express";

const UserRoutes = express.Router();

UserRoutes.post('/register', UserController.register);
UserRoutes.post('/login', UserController.login)

export default UserRoutes;