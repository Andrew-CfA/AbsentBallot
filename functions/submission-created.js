// submission-created.js
// load the env file and make values accessible via process.env
require('dotenv').config(); //local instance of credentials

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  CONTACT_NUMBERS,
  BOT_NUMBER,
  BOT_MESSAGE,
  BOT_PMESSAGE 
} = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.handler = function(event, context, callback) {

    let payload = JSON.parse(event.body).payload;
    let CONTACT_NUMBERS = payload.data.phone;
  if(payload.data.fileToUpload)
  {
    Promise.all(
      // split the string of several messages into single numbers
      // send message to each of them
      CONTACT_NUMBERS.split(';').map(num => {
        return client.messages.create({
          from: BOT_NUMBER,
          to: num,
          body: BOT_PMESSAGE
        });
      })
    )
    .then(() => callback(null, { statusCode: 200, body: 'Created' }))
    .catch(e => {
      console.log(e);
      callback(e);
    });
  }
  else
    Promise.all(
      // split the string of several messages into single numbers
      // send message to each of them
      CONTACT_NUMBERS.split(';').map(num => {
        return client.messages.create({
          from: BOT_NUMBER,
          to: num,
          body: BOT_MESSAGE
        });
      })
    )
    .then(() => callback(null, { statusCode: 200, body: 'Created' }))
    .catch(e => {
      console.log(e);
      callback(e);
    });
};
