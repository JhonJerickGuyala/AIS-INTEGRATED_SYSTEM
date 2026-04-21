import * as AuthService from '../services/authService.js';
import * as UserModel from '../../auth_system/models/UserModel.js';

export const registerStudent = async (req, res) => {
    const {firstName, lastName, dob, course, major, status, email, password, address} = req.body;

    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('Extracted fields:', {firstName, lastName, dob, course, major, status, email, password});

    // Validate required fields before processing
    if (!firstName || !lastName) {
        return res.status(400).json({
            success: false,
            error: 'firstName and lastName are required'
        });
    }

    try {
        const studentProfile = {
            firstName,
            lastName,
            dob,
            course,
            major,
            status,
            email,
            password,
            address
        };

        // Step 1: Send student profile to legacy system via adapter
        console.log('Step 1: Calling authService.registerStudent...');
        const legacyResult = await AuthService.registerStudent(studentProfile);
        console.log('✓ Legacy system response:', legacyResult);

        // Step 2: Store email/password in Auth_System database
        console.log('Step 2: Calling UserModel.createUser...');
        const userProfile = {
            name: firstName + ' ' + lastName,
            birthdate: dob,
            address: address || 'N/A',
            program: course + ' ' + major,
            studentStatus: status
        };
        const dbResult = await UserModel.createUser(userProfile, email, password);
        console.log('✓ Database result:', dbResult);

        res.status(201).json({
            success: true,
            message: {
                legacy: legacyResult,
                database: 'Account created successfully'
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        console.error('Stack:', error.stack);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};