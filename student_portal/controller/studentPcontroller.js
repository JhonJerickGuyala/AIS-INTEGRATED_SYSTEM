export const register = async (req, res) => {
  const { firstName, lastName, dob, course, major, status, email, password, address } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'firstName, lastName, email, and password are required.'
    });
  }

  try {
    const adapterUrl = process.env.ADAPTER_URL;

    const response = await fetch(`${adapterUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        dob,
        course,
        major,
        status,
        email,
        password,
        address
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Adapter Layer error: ${response.status}`, errorText);
      return res.status(response.status).json({
        success: false,
        error: `Adapter Layer error: ${response.status}`
      });
    }

    const data = await response.json();

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: data
    });

  } catch (error) {
    console.error('Student Portal error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.'
    });
  }

  try {
    const adapterUrl = process.env.ADAPTER_URL;

    const response = await fetch(`${adapterUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Adapter Layer error: ${response.status}`, errorText);
      return res.status(response.status).json({
        success: false,
        error: `Adapter Layer error: ${response.status}`
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      studentProfile: data.studentProfile
    });

  } catch (error) {
    console.error('Student Portal error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};
