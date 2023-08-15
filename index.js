const express=require('express');
const { connection } = require('./config/db');
const { SignUpModel } = require('./Models/SignupModel');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Auth } = require('./Authentication/Auth');
// const {userMid}=require('./User');
const { UserModel } = require('./Models/UserModel');
 var cors = require('cors');

const app = express();

app.use(cors({
  origin : "*"
}))

 app.use(express.json());

 app.get("/", (req, res) => {
    res.send("Welcome to my mongodb")
 })

//   SignUp Method

app.post("/signup",async(req, res) => {
   const {fname,lname,email,password} = req.body
   const hash = bcrypt.hashSync(password, 5);
   try {
     const signUser=new SignUpModel({
      fname,
       lname,
        email,
        password:hash
     })

     await signUser.save()
     res.status(200).json({msg:"Successfully signed up"})
   } catch (error) {
    console.log(error)
    res.status(500).json({msg:"Error signing"})
   }
})


// Login Method

app.post("/login",async(req, res) => {
    const { email, password} =req.body
    
    const user=await SignUpModel.findOne({email})
    if(user){
        // console.log(user._id)
        const hashPassword =user.password
        bcrypt.compare(password, hashPassword, function(err, result) {
          if(result){
            var token = jwt.sign({ user_id:user._id }, 'Dibakar');
            res.json({token:token});
            console.log(token)
          }
          if(err){
            res.status(200).json({msg:"error"})
            // console.log(err)
          }
        });
    }
})



app.get("/product", async (req, res) => {
  const { type, sortby, page, limit, order} = req.query;
  console.log(sortby, order);
  let pageno = parseInt(page);
  let limitperpage = parseInt(limit)||9;
  let skip = (pageno - 1) * limitperpage;

  try {
    

    const filter={}
    if(type) filter.type={$regex:type, $options:"i"};
    let query = UserModel.find(filter);

    if (sortby && order) {
      let ordering = order === "asc" ? 1 : -1;
      let sortObj = {};
      sortObj[sortby] = ordering;
      query = query.sort(sortObj);
    }

    if (limitperpage) {
      query = query.skip(skip).limit(limitperpage);
    }

    const user = await query.exec(); // Execute the query

    const total = await UserModel.countDocuments(); // Use countDocuments() instead of deprecated count()

    res.json({ total, user });
  } catch (error) {
    res.json({ error: error });
  }
});

// app.post("/user/create",Auth, async (req, res) => {
//  const { title,category,description,content}=req.body;
//  const author_id=req.user_id
//  const user=await SignUpModel.findOne({_id: author_id})
  
//        const user_blog=new UserModel({
//            title,
//            category,
//            description,
//            email: user.email
//        })
//        await user_blog.save()
//        res.status(200).json({msg:"Successfully created"})
       
// })

// app.put("/user/edit/:id",Auth,async(req, res) => {
//    try {
//        const edit_id=req.params.id
//        const payload=req.body
   
//        const user_id=req.user_id
//        const sign_user=await SignUpModel.findOne({_id: user_id})
//        const sign_email=sign_user.email
//        console.log(sign_email)

//        const user=await UserModel.findOne({_id: edit_id})
//        const user_email=user.email
//        console.log(user_email)

//        if(sign_email===user_email) {
//            await UserModel.findByIdAndUpdate(edit_id,payload)
//            res.status(200).json({msg:"updated successfully"})
//        }else{
//            res.send("error updating")
//        }
//    } catch (error) {
//        console.log(error)
//    }
  
// })


// app.delete("/user/delete/:id",Auth,async(req,res) => {
//    try {
       
//       const delete_id = req.params.id
      
//        const user_id=req.user_id
//        const sign_user=await SignUpModel.findOne({_id: user_id})
//        const sign_email=sign_user.email
     

//       const user=await UserModel.findOne({_id:delete_id});
//       const user_mail=user.email
   

//       if(user_mail===sign_email) {
//          await UserModel.findByIdAndDelete({_id:delete_id});
//          res.send("deleted successfully");
//       }else{
//        res.send("deleted error");
//       }

//    } catch (error) {
//        console.log(error);
       
//    }
// })





 app.listen(8000,async()=>{
    await connection
    try {
        console.log("Connected successfully")
    } catch (error) {
        console.log(error)
    }
 })