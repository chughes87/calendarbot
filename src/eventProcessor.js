const {
  trim, filter, toPairs, join, reduce, lensPath, prop, path, groupBy, map,
  pick, over, lens, assoc, pipe, paths,
} = require('ramda');

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

const isInNextHour = date => {
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1);
  return date.getHours() === nextHour.getHours() &&
    date.getDate() === nextHour.getDate();
}

const isInNextDate = date => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  return date.getDate() === nextDate.getDate();
}

const isInNextWeek = date => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return date.getDate() <= nextWeek.getDate();
}

const buildFilterEvents = comparator => pipe(
  path(['data', 'items']),
  filter(pipe(
    path(startPath),
    newDate,
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
