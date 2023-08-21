const jwt = require('jsonwebtoken'); 
const User = require('../models/userModel'); 
const asyncHandler = require('express-async-handler'); 

const protect  = asyncHandler(async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            //decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        catch(e){
            res.status(401).json({
            error: "UnAuthorized",
            status: false,
            });
        }
    }else{
        res.status(401).json({
          error: "UnAuthorized",
          status: false,
        });
    }
})
module.exports = protect;