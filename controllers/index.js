const Validator = require('fastest-validator');
const { User } = require('../db/models');
const qr = require('qr-image');
const valid = new Validator;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    JWT_SECRET_KEY
} = process.env
module.exports = {
    uploadImage: (file) => {
        return new Promise(async(resolve, reject) => {
            try {
                const uploadedFile = await imagekit.upload({
                    file,
                    fileName: 'qr-code'
                });

                const data = {
                    title: uploadedFile.name,
                    url: uploadedFile.url
                };

                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    },

    generateQR: async(req, res, next) => {
        try {
            // create the qr
            const data = qr.imageSync('http://google.com', { type: 'png' });
            const qrString = data.toString('base64'); 

            const qrImage = await uploadImage(qrString.toString('base64'));

            return res.status(200).json({
                status: true,
                message: "QR Generated",
                data: qrImage
            });
        } catch(err) {
            next(err);
        }
    },

    validation: (req, res, next) => {
        try {
            const request = {
                f_name: 0, 
                l_name: "anwar", 
                email: "jokoanwar@gmail.com", 
                phone_number: "083333", 
                age: 3, 
            }

            const schema = { 
                f_name: 'string|min:3|max:30', 
                l_name: "string|min:3|max:30", 
                email: "email", 
                phone_number: "string|min:10|max:12", 
                age: 'number', 
            }

            const validate = valid.validate(request, schema);

            if(validate.length) {
                return res.status(404).json({
                    status: true,
                    message: validate.message
                });
            }

            return res.status(200).json({
                status: true,
                message: "Email Validated"
            });
        } catch(err) {
            next(err);
        }
    },
    
    register: async (req, res, next) => {
        try {
            const {email, password } = req.body;

            const existUser = await User.findOne({ where: { email: email } });
            if (existUser) {
                return res.status(409).json({
                    status: false,
                    message: 'email already used!'
                });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                email: email,
                password: encryptedPassword
            });
            
            console.log(user)

            return res.status(201).json({
                status: true,
                message: 'success',
                data: {
                    email: user.email
                }
            });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password doesn\'t match!'
                });
            }

            const correct = await bcrypt.compare(password, user.password);
            if (!correct) {
                return res.status(400).json({
                    status: false,
                    message: 'email or password doesn\'t match!'
                });
            }

            // generate token
            payload = {
                id: user.id,
                email: user.email,
                login_type: user.login_type,
                role: user.role,
            };

            const token = jwt.sign(payload, JWT_SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: 'success',
                data: {
                    token: token
                }
            });
        } catch (err) {
            // console.log(err)
            next(err);
        }
    },

    whoami: (req, res, next) => {
        const user = req.user;

        try {
            return res.status(200).json({
                status: false,
                message: 'success',
                data: user
            });
        } catch (err) {
            next(err);
        }
    },
}
