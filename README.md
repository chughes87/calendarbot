# calendarbot
Service for Google calendar SMS notifications.

This project is intended to be loaded into an AWS Lambda function and run every hour or on whatever schedule you choose. When run, this will check your Google calendar for events and send you an SMS message detailing the title and time of an event coming up in the next hour!

# requirements
You will need to set a few things up in order to utilize this tool:
* Twilio account and phone number
* Google account with a calendar
* AWS account

You will need to make a Google "project" for this tool to be identified as and give that project domain level access over your Google account. Once you have done that, you will have a JWT that the bot will use for accessing your calendar. You will also need to give the bot permissions on the Google calendar side.

All secrets (Google JWT, Twilio keys, your phone number, the Twilio phone number) are expected to be in a single secret in AWS Secrets Manager.
