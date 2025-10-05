import jwt from 'jsonwebtoken'

const jwtMiddleware=(req,res,next)=>{
    // console.log("inside jwtmiddleware");

    const token=req.headers['authorization'].split(" ")[1]
    
    try {
        const jwtResponse=jwt.verify(token,process.env.JWT_SECRET)
        req.userId=jwtResponse.id
        // console.log("jwt userid : ",req.userId)
        // console.log("response",new Date(jwtResponse.iat * 1000).toLocaleString());  //iat stands for time when build the token
        next()
    } catch (error) {
        console.log("error in authorization : "+error);
        res.status(401).json("authorization fail")
    }
}

export default jwtMiddleware