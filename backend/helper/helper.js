const jwt = require('jsonwebtoken');  // Import jwt
const secretKey = 'secretKey';  // Secret key for JWT

const employeeDB = require('../models/employee');  // Assuming you have a User model

module.exports = {

    authenticateJWT: async (req, res, next) => {
        try {
            const authHeaders = req.headers.authorization;  // Get the Authorization header
            if (authHeaders) {
                const authToken = authHeaders.split(' ')[1];  // Split the header to get the token

                // Verify and decode the token
                jwt.verify(authToken, secretKey, async (err, payload) => {
                    if (err) {
                        return res.status(403).json({ status: 403, message: 'Invalid or expired token' });
                    }

                    // Find the user by the decoded _id (from payload)
                    const user = await employeeDB.findOne({ _id: payload._id });
                    if (!user) {
                        return res.status(404).json({ status: 404, message: 'User not found' });
                    }

                    // Attach the user data to the request object (for use in other routes)
                    req.user = user;
                    next();  // Proceed to the next middleware or route handler
                });
            } else {
                return res.status(401).json({ status: 401, message: 'Authorization header missing' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 500, message: 'Server error' });
        }
    },

  vaildObject: async function (required, non_required, res) {
        let msg ='';
        let empty = [];
        let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';
        
        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] == '') {
                    empty.push(key)
    ;
                }
            }
        }
    
        if (empty.length != 0) {
            msg = empty.toString();
            if (empty.length > 1) {
                msg += " fields are required"
            } else {
                msg += " field is required"
            }
            res.status(400).json({
                'success': false,
                'msg': msg,
                'status': 400,
                 'body': {}
            });
            return;
        } else {
            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != "") {
                    msg = "Invalid security key";
                    res.status(403).json({
                        'success': false,
                        'msg': msg,
                        'status': 403,
                        'body': []
                    });
                    res.end();
                    return false;
                }
            }
            if (required.hasOwnProperty('password')) {
                
            }
            const marge_object = Object.assign(required, non_required);
            delete marge_object.checkexit;
    
            for(let data in marge_object){
                if(marge_object[data]==undefined){
                    delete marge_object[data];
                }else{
                    if(typeof marge_object[data]=='string'){
                        marge_object[data]=marge_object[data].trim();
                    } 
                }
            }
    
            return marge_object;
        }
    },


      success: function (res, message, body = {}) {
        return res.status(200).json({
            'success': true,
            'status': 200,
            'message': message,
            'body': body
        });
    },
    
    
    error: function (res, err, body = {}) {
        console.log(err, '===========================>error');
        
        let status = (typeof err === 'object') ? (err.status) ? err.status : 200 : 200;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        res.status(status).json({
            'success': false,
            'status': 400,
            'message': message,
            'body': body
        });
    },
};
