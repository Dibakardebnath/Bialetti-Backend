
const mongoose= require('mongoose')

const SignUpShema=new mongoose.Schema({

    fname:String,
     lname:String,
    email:String,
    password:String,
   
},
{
    timestamps: true

})

const SignUpModel=mongoose.model('signup',SignUpShema)

module.exports = {SignUpModel}