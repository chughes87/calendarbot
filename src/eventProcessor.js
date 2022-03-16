const {
  trim, filter, toPairs, join, reduce, lensPath, prop, path, groupBy, map,
  pick, over, lens, assoc, pipe, paths,
} = require('ramda');
const moment = require('moment');

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const formatDate = start =>
  `${dayNames[start.getDay()]} ${start.getMonth() + 1}/${start.getDate()}`;
const formatTimes = ([start, end]) =>
  `${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;
const newDate = x => new Date(x);
const startPath = ['start', 'dateTime'];
const endPath = ['end', 'dateTime'];
const formatEvents = pipe(
  map(({ summary, time }) => `${time} ${summary}`),
  join('\n'),
);

const nextHour = moment().add(1, 'hour');
const isInNextHour = date =>
  date.hour() === nextHour.hour() &&
    date.date() === nextHour.date();

const isInNextDate = date =>
  date.date() === moment().date() + 1;

const isInNextWeek = date =>
  date.date() <= moment().date() + 7;

const buildFilterEvents = comparator => pipe(
  path(['data', 'items']),
  filter(pipe(
    path(startPath),
    moment,
    comparator,
  )),
);

const filterNextHour = buildFilterEvents(isInNextHour);
const filterNextDate = buildFilterEvents(isInNextDate);
const filterNextWeek = buildFilterEvents(isInNextWeek);

const stringifyEvents = (shouldIncludeDate) => pipe(
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
    `${string}${shouldIncludeDate ? `${date}\n` : ''}${formatEvents(events)}\n\n`, ''),
  trim,
);

module.exports = {
  filterNextHour,
  filterNextDate,
  filterNextWeek,
  stringifyEvents,
};
