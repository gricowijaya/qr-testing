const Validator = require('fastest-validator');
const qr = require('qr-image');
const valid = new Validator;
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
    }
}
