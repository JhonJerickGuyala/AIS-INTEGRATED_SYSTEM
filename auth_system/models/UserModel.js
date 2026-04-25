import pool from '../config/db.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const createUser = async (userProfile, email, password, legacyId) => {

  if (!email || !password) {
    const error = new Error('Email and Password are required.');
    error.statusCode = 400;
    throw error;
  }

  if (!validator.isEmail(email)){
    const error = new Error('Invalid email address.');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6){
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const [user] = await pool.query(
    "SELECT email FROM usertbl WHERE email = ?", [email]
  );

  if (user.length === 1) {
    const error = new Error(`The email ${email} is already used.`);
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await pool.query(
    "INSERT INTO usertbl (email, password, legacy_id) VALUES (?,?,?)",
    [email, hashedPassword, legacyId || null]
  );

  return newUser;
}

export const login = async (email, password) => {

    if(email.trim() === '' || password.trim() === ''){
        const error = new Error ('Email and password is required')
        error.statusCode = 400;
        throw error;
    }

    const [user] = await pool.query (
        "SELECT * FROM usertbl WHERE email = ?", [email]
    );

    if(user.length === 0){
        const error = new Error (
            `An account with the email ${email} does not exist.`
        )
        error.statusCode = 400;
        throw error;
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    
    if (!validPassword) {
        const error = new Error('Incorrect password'); 
        error.statusCode = 401; 
        throw error;
    }

    const token = jwt.sign(
        {id: user[0].id},
        process.env.SECRET,
        {expiresIn: '1d'}
    );
    return token;
}

export const getUser = async (id) => {
    if (parseInt(id) === NaN){
        throw new Error('Invalid id');
    }

    const [user] = await pool.query('SELECT * FROM usertbl WHERE id = ?', [id]);
    return user;
}

export const getUserByEmail = async (email) => {
  const [user] = await pool.query(
    'SELECT * FROM usertbl WHERE email = ?', [email]
  );
  return user[0];
}