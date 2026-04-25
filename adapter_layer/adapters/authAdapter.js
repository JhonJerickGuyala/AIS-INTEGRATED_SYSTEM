export const create = async (profile) => {
  const transformedProfile = {
    name: profile.firstName + ' ' + profile.lastName,
    birthdate: profile.dob,
    program: profile.course + ' ' + profile.major,
    address: profile.address || 'N/A',
    studentStatus: profile.status,
    email: profile.email,
    password: profile.password
  };

  console.log('Sending to legacy API:', JSON.stringify(transformedProfile, null, 2));

  try {
    const response = await fetch(
      `https://ais-simulated-legacy.onrender.com/api/students`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedProfile)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Legacy API Error: ${response.status}`, errorText);
      throw new Error(`Legacy API failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Legacy API Response:', result);
    return result;
  } catch (error) {
    console.error('Error communicating with legacy API:', error.message);
    throw error;
  }
}

export const getStudentProfile = async (legacyId) => {
  try {
    const response = await fetch('https://ais-simulated-legacy.onrender.com/api/students', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`Legacy API failed: ${response.status}`);

    const students = await response.json();
    
    // HAHANAPIN NIYA NA NGAYON GAMIT ANG ID, HINDI NA EMAIL!
    const student = students.find((item) => item._id === legacyId);

    if (!student) throw new Error(`Student profile not found for legacy ID: ${legacyId}`);

    return student;
  } catch (error) {
    throw error;
  }
};