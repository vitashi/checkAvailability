/**
 * Tests for calendar API
 * 
 * @group integration
 */

const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../app')


describe('GET /api/calendar', () => {
  it('returns timeslots', async () => {
    const req = await request(app)
      .get('/api/calendar')
      .query('hostUserId=host_user_1')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(req.body).toMatchObject({
      timeslots: expect.arrayContaining(['2021-11-24T14:00:00.000']),
    });
  });

  it('returns 400 and json body if the hostUserID is not passed', async () => {
    const response = await request(app)
      .get('/api/calendar')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  })
});
