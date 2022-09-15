/**
 * Tests for calendar API
 * 
 * @group integration
 */

const request = require('supertest');
const app = require('../../app')

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
});
