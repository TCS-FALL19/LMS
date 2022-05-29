const config = require ("../config/config.js");
const jwt = require("jsonwebtoken");


exports.validate= (req, res, next, role)=>{
    const token = req.cookies.token;
    if(!token){
        res.status(500).json({
            success: false,
            message: "please login to access this route"
        });
    }
    const decodedData = jwt.verify (token, config.secret);
    const user = decodedData.id;
    if(user.role === role){
        next();
    }else{
        res.status(500).json({
            success: false,
            message: "route is not accessible for this role"
        });

    }

    

}