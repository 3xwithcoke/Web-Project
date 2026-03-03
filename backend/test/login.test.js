const request = require("supertest");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe('Login User API', () => {

  const registerUser = async () => {
    const uniqueUsername = `testuser${Date.now()}`;
    const uniqueEmail = `test${Date.now()}@gmail.com`;
    const password = 'securepassword123';
    const phoneNumber = `9${Date.now()}`.slice(0, 10);

    const res = await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password,
        confirmPassword: password,
        phoneNumber
      });

    return { res, email: uniqueEmail, password, username: uniqueUsername };
  };

  it('should login successfully with correct credentials', async () => {
    const { email, password, username } = await registerUser();

    const loginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({ email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe(email);
    expect(loginRes.body.user.username).toBe(username);
  });

  it('should fail login when email is missing', async () => {
    const { password } = await registerUser();

    const loginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({ password });

    expect(loginRes.statusCode).toBe(400);
    expect(loginRes.body.message).toBe("All fields are required");
  });

  it('should fail login when password is missing', async () => {
    const { email } = await registerUser();

    const loginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({ email });

    expect(loginRes.statusCode).toBe(400);
    expect(loginRes.body.message).toBe("All fields are required");
  });

  it('should fail login with incorrect password', async () => {
    const { email } = await registerUser();

    const loginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({ email, password: 'wrongpassword' });

    expect(loginRes.statusCode).toBe(401);
    expect(loginRes.body.message).toBe("Invalid credentials");
  });

  it('should fail login for non-existent user', async () => {
    const loginRes = await request(BASE_URL)
      .post('/api/user/login')
      .send({ email: 'nonexistent@test.com', password: 'password123' });

    expect(loginRes.statusCode).toBe(401);
    expect(loginRes.body.message).toBe("User not found");
  });
});
