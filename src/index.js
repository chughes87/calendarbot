const { pipe, tap, pipeWith, andThen, filter, path } = require('ramda');
const { pipeP } = require('./ramdaP');
const getEvents = require('./getEvents');
const processEvents = require('./processEvents');
const getSecret = require('./getSecret');
const sendSMS = require('./sendSMS');

const now = new Date();
const newDate = x => new Date(x);
const isNow = date =>
  date.getUTCHours() === (now.getUTCHours() + 1) &&
  date.getUTCDate() === now.getUTCDate();

module.exports.handler = () =>
  pipeP([
    getSecret,
    (auth) =>
      pipeP([
        getEvents,
        path(['data', 'items']),
        filter(pipe(path(['start', 'dateTime']), newDate, isNow)),
        processEvents,
        sendSMS(auth),
      ])(auth)
  ])('calendarbot_auth');

