  import * as AuthService from '../services/authService.js';
  import * as AuthAdapter from '../adapters/authAdapter.js';

const AUTH_SYSTEM_URL = process.env.AUTH_SYSTEM_URL;

  export const registerStudent = async (req, res) => {
    const { firstName, lastName, dob, course, major, status, email, password, address } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, error: 'Required fields are missing.' });
    }

    try {
        const checkResponse = await fetch(`${AUTH_SYSTEM_URL}/user/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!checkResponse.ok) {
            return res.status(400).json({ success: false, error: `The email ${email} is already used.` });
        }

        const studentProfile = { firstName, lastName, dob, course, major, status, email, password, address };
        const legacyResult = await AuthService.registerStudent(studentProfile);
        const legacyId = legacyResult._id || legacyResult.id;

        const authResponse = await fetch(`${AUTH_SYSTEM_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstName, lastName, dob, course, major, status, email, password, address, legacyId
            })
        });

        const authResult = await authResponse.json();

        if (!authResponse.ok) throw new Error(authResult.message || 'Auth System registration failed.');

        return res.status(201).json({
            success: true,
            message: { authSystem: authResult.message, legacy: legacyResult }
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

  export const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {

      const authResponse = await fetch(`${AUTH_SYSTEM_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const authResult = await authResponse.json();
      if (!authResponse.ok) throw new Error(authResult.message || 'Login failed.');

      const token = authResult.message?.[0]?.token;
      const legacyId = authResult.message?.[0]?.legacy_id; 

      if (!legacyId) throw new Error('No legacy ID found. Please register a NEW account.');

      const studentProfile = await AuthAdapter.getStudentProfile(legacyId);

      return res.status(200).json({ success: true, token, studentProfile });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };