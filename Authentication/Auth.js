var jwt = require('jsonwebtoken');

const Auth=(req,res,next) => {
    const token=req.headers.authorization?.split(" ")[1]
   console.log(token)
    if(token){
        jwt.verify(token, 'Dibakar', function(err, decoded) {
           if(err){
              res.status(200).json({msg:"token not valid"})
           }else{
            const user_id = decoded.user_id
            req.user_id = user_id
            next()
           }
        })
    }else{
        res.send("Recheck password")
    }
}
module.exports ={Auth}