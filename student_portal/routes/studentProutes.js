import express from 'express';
import * as studentPcontroller from '../controller/studentPcontroller.js';

const studentProutes = express.Router();

studentProutes.post('/register', studentPcontroller.register);
studentProutes.post('/login', studentPcontroller.login);

export default studentProutes;
