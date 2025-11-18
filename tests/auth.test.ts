import request from 'supertest';
import { app } from '../src/index';

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Registration successful');
  });

  //   it('should login and return JWT token', async () => {
  //     const res = await request(app)
  //       .post('/auth/login')
  //       .send({ email: 'test@example.com', password: '123456' });

  //     expect(res.status).toBe(200);
  //     expect(res.body.token).toMatch(/^eyJ/); // Basic JWT pattern
  //   });
});

// describe('About Us API', () => {
//   it('should return info when JWT is valid', async () => {
//     // First login to get token
//     const loginRes = await request(app)
//       .post('/auth/login')
//       .send({ email: 'test@example.com', password: '123456' });

//     const token = loginRes.body.token;

//     const res = await request(app)
//       .get('/about')
//       .set('Authorization', `Bearer ${token}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBeDefined();
//   });

//   it('should fail without JWT', async () => {
//     const res = await request(app).get('/about');
//     expect(res.status).toBe(401);
//   });
// });
