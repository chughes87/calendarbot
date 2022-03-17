# calendarbot

Service for Google calendar SMS notifications.

This project is intended to be loaded into an AWS Lambda function and run every hour or on whatever schedule you choose. When run, this will check your Google calendar for events and send you an SMS message detailing the title and time of an event coming up in the next hour!

I added a "daily digest" that is sent each night at 9:30PM that will give you a summary of your events for the next day!

# requirements

You will need to set a few things up in order to utilize this tool:

- Twilio account and phone number
- Google account with a calendar
- AWS account
- Serverless account

You will need to make a Google "project" for this tool to be identified as and give that project domain level access over your Google account. Once you have done that, you will have a JWT that the bot will use for accessing your calendar. You will also need to give the bot permissions on the Google calendar side.

All secrets (Google JWT, Twilio keys, your phone number, the Twilio phone number) are expected to be in a single secret in AWS Secrets Manager. secret_example.json is an example of the values that will be expected to be in secrets manager.

# setup

Add a secret to your AWS secrets manager with the values indicated in secret_example.json. Copy the ARN of that secret and paste it in place of <SECRET_ARN> in serverless.yml. While you're there, enter your usual timezone in place of <YOUR_TIMEZONE>. Sorry, this tool won't work well for travelers...

Setup Serverless if you haven't already. See https://www.serverless.com/framework/docs/getting-started. Replace <YOUR_ORG> in package.json and serverless.yml with your Serverless org's name.

# deployment

Run `npm run build` and then `npm run deploy` and you should be good to go!
