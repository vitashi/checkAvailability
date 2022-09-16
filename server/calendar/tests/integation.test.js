/**
 * Tests for calendar API
 * 
 * @group integration
 */

const request = require('supertest');
const HTTPStatusCodes = require('http-status-codes');
const app = require('../../app')

const statusCodes = HTTPStatusCodes.StatusCodes

describe('GET /api/calendar', () => {
  it('returns timeslots', async () => {
    const req = await request(app)
      .get('/api/calendar')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(req.body).toMatchObject({
      timeslots: expect.arrayContaining(['2021-11-24T14:00:00.000']),
    });
  });
  it('returns 404 and json body if the hostUserID is not passed', async () => {
    const response = await request(app)
      .get('/api/calendar')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(statusCodes.NOT_FOUND);
  })
});
