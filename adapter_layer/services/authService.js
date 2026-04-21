import * as AuthAdapter from '../adapters/authAdapter.js';
import validator from 'validator';

export const registerStudent = async (studentProfile) => {
    // Check if profile exists
    if (!studentProfile) {
        throw new Error('Student profile is required');
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dob', 'course', 'major', 'status', 'email', 'password'];
    for (const field of requiredFields) {
        if (!studentProfile[field]) {
            throw new Error(`${field} is required`);
        }
    }

    // Validate email format
    if (!validator.isEmail(studentProfile.email)) {
        throw new Error('Invalid email address');
    }

    // Validate password length
    if (studentProfile.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    return await AuthAdapter.create(studentProfile);
};
