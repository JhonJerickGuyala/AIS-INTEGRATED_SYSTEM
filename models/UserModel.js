import pool from "../config/db.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (userProfile, email, password) => {

   if(email.trim() === '' || password.trim() === ""){
        const error = new Error ("Email and Password Required!")
        error.statusCode = 400;
        throw error;
    }

    if(!validator.isEmail(email)){
        const error = new TypeError ('Invalid Email Address.')
        error.statusCode = 400;
        throw error;
    }

    if(!validator.isStrongPassword(password)){
        const error = new TypeError(
            "Password is not strong enough.")
        error.statusCode = 400;
        throw error;
    }
    
    const[user] = await pool.query("SELECT email FROM usertbl WHERE email = ?", [email])
    if (user.length === 1){
        const error = TypeError(`The email ${email} is already used.`)
        error.statusCode = 400;
        throw error;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassowrd = bcrypt.hashSync(password, salt);

    const response = await fetch (
        `https://ais-simulated-legacy.onrender.com/api/students`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify(userProfile)
    });
    const result= await response.json();

    const [newUser] = await pool.query("INSERT INTO usertbl(email, password)VALUES(?,?)",
        [email, hashedPassowrd]
    );

    return newUser
}

export const login = async (email, password) =>{
    if(email.trim() === '' || password.trim() === ""){
        const error = new Error ("Email and Password Required!")
        error.statusCode = 400;
        throw error;
    }

    const [user] = await pool.query("SELECT * FROM usertbl WHERE email = ?", [email]);
    if(user.length == 0){
        const error = new Error(`An account with email: ${email} does not exist.`)
        error.statusCode = 400;
        throw error;
    }

    if(!bcrypt.compareSync(password, user[0].password)){
        const error = new Error ("Incorrect Password.")
        error.statusCode = 400;
        throw error;
    }

    const token = jwt.sign({id: user[0].id}, process.env.SECRET, {expiresIn: '1d'});
    return token;
}
