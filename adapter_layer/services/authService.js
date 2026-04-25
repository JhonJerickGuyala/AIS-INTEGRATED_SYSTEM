import * as AuthAdapter from '../adapters/authAdapter.js';
import validator from 'validator';

export const registerStudent = async (studentProfile) => {

    if (!studentProfile) {
        throw new Error('Student profile is required');
    }

    const requiredFields = ['firstName', 'lastName', 'dob', 'course', 'major', 'status', 'email', 'password'];
    for (const field of requiredFields) {
        if (!studentProfile[field]) {
            throw new Error(`${field} is required`);
        }
    }

    if (!validator.isEmail(studentProfile.email)) {
        throw new Error('Invalid email address');
    }

    if (studentProfile.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    return await AuthAdapter.create(studentProfile);
};

export const loginStudent = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  return { email, password };
};