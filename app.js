// or using CommonJS
require('dotenv').config();
const express = require('express');
const controller = require('./controllers')
const app = express(); 
const {
    PORT,
    ENV
} = process.env;

// use the express.json()
app.use(express.json());
// All controllers should live here
app.get("/", function rootHandler(req, res, next) {
    try { 
          res.end("Hello world!");
    } catch(err) { 
        next(err);
    }
});

app.post("/register", controller.register);
app.get("/generate-qr", controller.generateQR);
app.get("/validator", controller.validation);

// to get the image so we can get the static file from the public images
app.use('/images', express.static('./public/images'));

app.listen(PORT, () => { console.log(`PORT ${PORT}`)});


