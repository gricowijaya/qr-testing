// or using CommonJS
require('dotenv').config();
const express = require('express');
const controller = require('./controllers')
const qr = require('qr-image');
const app = express(); 
const {
    PORT,
    ENV
} = process.env

// create the data
const data = qr.imageSync('http://google.com', { type: 'png' });


app.use(express.json());
// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.get("/generate-qr", controller.generateQR);
app.get("/validator", controller.validation);

// to get the image so we can get the static file from the public images
app.use('/images', express.static('./public/images'));

app.listen(PORT, () => { console.log(`PORT ${PORT}`)});


