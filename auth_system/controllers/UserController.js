import * as UserModel from '../models/UserModel.js';

export const register = async (req, res, next ) => {

    const { firstname, lastName, dob, course, major, status, email, password, address, legacyId } = req.body;
   
    try { 
        const userProfile = {
            name : firstname + ' ' + lastName,
            birthdate: dob,
            address: address || 'N/A',
            program: course + ' ' + major,
            studentStatus: status
        };

        const user = await UserModel.createUser(userProfile, email, password, legacyId);
        res.status(200).json({ success: true, message: [{result: "A new account has been created!"}] });
    }catch(e){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const token = await UserModel.login(email, password);

        const user = await UserModel.getUserByEmail(email); 
        res.status(200).json({
            success: true,
            message: [
                { result: "Login successful!", token, legacy_id: user.legacy_id }
            ]
        });
    }catch(e){
        const statusCode = e.statusCode || 500;
        res.status(statusCode).json({ success: false, message: e.message || "Internal Server Error" });
    }
}

export const getByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.getUserByEmail(email);
    res.status(200).json(user);
  } catch(e) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.getUserByEmail(email);
        if (user) {

            return res.status(400).json({ success: false, message: "Email is already used." });
        }

        return res.status(200).json({ success: true, message: "Email is available." });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}