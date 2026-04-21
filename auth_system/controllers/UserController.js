import * as UserModel from '../models/UserModel.js';

export const register = async (req, res, next ) => {
    const {
        firstname,
        lastName,
        dob,
        course,
        major,
        status,
        email,
        password,
        address
        } = req.body;
   
    try { 
        const userProfile = {
            name : firstname + ' ' + lastName,
            birthdate: dob,
            address: address || 'N/A',
            program: course + ' ' + major,
            studentStatus: status
        };
        const user = await UserModel.createUser(userProfile, email, password);
        res.status(200).json({
            success: true,
            message: [{result: "A new account has been created!"}]
        });
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const token = await UserModel.login(email, password);
        res.status(200).json({
            success:true,
            message: [
                {result: "Login successful!", token},
            ]
        });
    }catch(e){
        console.log(e); 
        const statusCode = e.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: e.message || "Internal Server Error"
        });
    }
}
