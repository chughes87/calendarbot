const { prop, curry, pipe, tap } = require('ramda')
const fs = require('fs')
const readline = require('readline')
const getSecret = require('./getSecret')
const { google } = require('googleapis')
const calendar = google.calendar('v3')

const tagLog = curry((tag, data) =>
  console.log(`${tag}: ${JSON.stringify(data, null, 2)}`)
)

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

getSecret(
  'calendarbot_auth',
  pipe(
    listEvents,
    tap(tagLog('events')),
  )
)

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth })
  calendar.events.list(
    {
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      const events = res.data.items
      if (events.length) {
        console.log('Upcoming 10 events:')
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date
          console.log(`${start} - ${event.summary}`)
        })
      } else {
        console.log('No upcoming events found.')
      }
    }
  )
}
