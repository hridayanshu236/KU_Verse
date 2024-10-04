const jwt = require("jsonwebtoken");

const generateToken = (id,res)=>{
    const token = jwt.sign({id},process.env.access_token_jwt, {expiresIn: "60m",});

    res.cookie("token", token, {
        maxAge : 50 *60 *1000,
        httpOnly:true,
        sameSite:"strict",
    });

}

module.exports= generateToken;