
const mongoose= require('mongoose')

const UserSchema=new mongoose.Schema({

    email:String,
    title:String,
    category:String,
    description:String,

},
{
    timestamps: true

})

const UserModel=mongoose.model('user',UserSchema)

module.exports = {UserModel}