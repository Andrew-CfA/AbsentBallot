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


const ocr = document.querySelector('#ocr');
const input = ocr.querySelector('#ocr__input');
const img = ocr.querySelector('#ocr__img');
const output = ocr.querySelector('#ocr__output');
const form = ocr.querySelector('#ocr__form');


input.value = defaultImage;
img.src = defaultImage;


function myError(err, message) {	
	console.warn(`MyError: ${message || ''}`);
	console.error(err);
};

async function recognizeImage(image) {
	console.log('recognize START');
	worker.terminate();
	
	output.textContent = 'Waiting to start.';
	output.classList.remove('error');
	output.classList.add('processing');
	
	return worker.recognize(image)
		.progress(progress => {
			// console.log('progress', progress);
			output.innerHTML = `Processing...<br>Status: ${progress.status}<br>${Math.round(progress.progress * 100)}%`;
		}).then(result => {
			// console.log('result', result);

			output.classList.remove('processing');
			output.textContent = result.text;
		}).catch(err => {
			myError(err, 'caught error');
			output.classList.add('error');
			output.textContent = 'Error processing image.';
		}).finally(() => {
			console.log('recognize END');		
			worker.terminate();
		});
};

form.onsubmit = async e => {
	console.log('submit START');
	e.preventDefault();
	
	const imageUrl = input.value;
	img.src = imageUrl;
	
	await recognizeImage(imageUrl);
	
	console.log('submit END');
};





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


