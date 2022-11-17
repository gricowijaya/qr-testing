const Validator = require('fastest-validator');
const valid = new Validator;
module.exports = {
    generateQR: (req, res, next) => {
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
