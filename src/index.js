const { toPairs, join, reduce, lensPath, prop, path, groupBy, curry, tap, map, pick, over, lens, assoc, pipe, paths, useWith, props } = require('ramda');
const {JWT} = require('google-auth-library');
const getSecret = require('./getSecret');
const { google } = require('googleapis');

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const tagLog = curry((tag, log) => console.log(`${tag}: ${JSON.stringify(log, null, 2)}`));

const formatDate = (start) =>
  `${dayNames[start.getDay()]} ${start.getMonth()}/${start.getDate()}`;

const formatTimes = ([start, end]) =>
  `${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;

const newDate = x => new Date(x);
const startPath = ['start', 'dateTime'];
const endPath = ['end', 'dateTime'];

const formatEvents = pipe(
  map(({ summary, time }) => `${time} ${summary}`),
  join('\n')
)

const processEvents = pipe(
  map(pipe(
    over(lensPath(startPath), newDate),
    over(lensPath(endPath), newDate),
    over(lens(paths([startPath, endPath]), assoc('time')), formatTimes),
    over(lens(path(startPath), assoc('date')), formatDate),
    pick(['summary', 'time', 'date']),
  )),
  groupBy(prop('date')),
  toPairs,
  reduce((string, [date, events]) =>
    `${string}${date}\n${formatEvents(events)}\n\n`, '')
)

const main = (auth) => {
  const jwtClient = new google.auth.JWT(
    auth.client_email,
    null,
    auth.private_key,
    SCOPES
  );

  const calendar = google.calendar({
    version: 'v3',
    project: auth.project_number,
    auth: jwtClient
  });

  calendar.events.list({
    calendarId: auth.calendar_id,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (error, result) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    if (result.data.items.length) {
       console.log('result: ', processEvents(result.data.items))
    }
    else {
      console.log('No upcoming events found.');
    }
 });
};

getSecret('calendarbot_auth', main);
