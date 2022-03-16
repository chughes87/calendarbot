/* eslint-disable camelcase */
const { curry } = require('ramda');
const { google } = require('googleapis');

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

module.exports = curry((maxResults, {
  client_email,
  private_key,
  project_number,
  calendar_id,
}) => {
  const jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    SCOPES,
  );

  const calendar = google.calendar({
    version: 'v3',
    project: project_number,
    auth: jwtClient,
  });

  return calendar.events.list({
    calendarId: calendar_id,
    timeMin: (new Date()).toISOString(),
    maxResults: maxResults || 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
});
