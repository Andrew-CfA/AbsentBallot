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
const worker = Tesseract.create();

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Hello_world_c.svg/805px-Hello_world_c.svg.png';
// const defaultImage = 'https://i.redd.it/8h66m4nnyo331.jpg';
// const defaultImage = 'https://i.imgur.com/fun6Hrl.png';


function runOCR(url) {
  Tesseract.recognize(url)
      .then(function(result) {
          document.getElementById("text").value = result.text;
  }).progress(function(result) {
      document.getElementById("ocr_status").innerText = result["status"] + " (" +
          (result["progress"] * 100) + "%)";
  });      
}

document.getElementById("go_button").addEventListener("click", function(e) {
  var url = document.getElementById("url").value;
  runOCR(url);
});



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


