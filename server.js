const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const app = express()
const hostname = '127.0.0.1';
const port = 5000;

mongoose.connect('mongodb+srv://mara:marapassword@cluster0.foa1t.mongodb.net', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true}
));

const { body, validationResult } = require('express-validator');
const { formatWithOptions } = require('util');
const e = require('express');

const requesterSchema  = new mongoose.Schema({
  firstName: String,
  lastName: String,    
  mobile: String,
  email: String,
  country: String,
  password: String,
  addressLine1: String, 
  addressLine2: String,
  city: String,
  state: String, 
  postcode: String,
})  
 

const Requester = mongoose.model('Requester', requesterSchema)

  var dataDb = [] 
 var isCorrect = false;

app.post("/login", (req, res)=>{
  console.log('Login ' )

  const pass= req.body.password
  const user = req.body.userName
  var existUser;
  var hashedPasswordFromDb;


  Requester.findOne({ email: user }, 'email password', function (err, requestor) {
    if (err) return handleError(err)
    console.log("email -> "+ requestor.email)
    console.log("hashedPasswordFromDb -> "+ requestor.password)
    // if(requestor.email == req.body.email ){
      hashedPasswordFromDb = requestor.password
    // }
    dataDb[0] = requestor.password

    console.log("pass -> "+pass)
    console.log("hashedPasswordFromDb -> "+ hashedPasswordFromDb)

    bcrypt.compare(pass, hashedPasswordFromDb, function(err, result) {
      if(err){
      console.log("Something went wrong ..." + err.message)
      
      }
          console.log("result "+ result)
          if(result == true){
         
            console.log("isCorrect set to "+ isCorrect)
            //res.send("OK");

           return res.redirect('reqtask.html')  
          }else{
            return res.send("User name or password was wrong") 
          }
    })
      })
  } )

  
// Post method to receive data from client via http body 
app.post("/registration", body('passwordConfirmation').custom((value, { req }) => {
  //  console.log("value password confirmation "+ value)
 //   console.log("value password "+ req.body.password)
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),[      
    body('Email', 'Email must be valid').isEmail(),
    body('Country' , 'Country field must not be empty').isLength({ min: 1 } ),
    body('Mobile', 'Mobile must be a number').isNumeric({no_symbols: false} ),
    body('password', 'Password must have at least 8 characters').isLength({ min: 8 }),
    body('FirstName', 'First name must have value').isLength({ min: 1 } ),
    body('LastName', 'Last name must have value').isLength({ min: 1 } ),
    body('AddressLine1', 'Address must have value').isLength({ min: 1 } ),
    body('City', 'City must have value').isLength({ min: 1 } ),
    body('State', 'State must have value').isLength({ min: 1 } ),
    body('Postcode', 'Postcode must have value').isLength({ min: 1 } )   
  ],
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        // Show errors messages 
      var errMsg = [];
      var err = errors.array() 
        for(var i=0; i<err.length; i++){
            console.log(err[i].msg)
            errMsg.push(err[i].msg + " | ")            
        }
         res.send("Data was not saved, the following errors occured: " + errMsg)
         return res.status(400)
    } 
    if (errors.isEmpty()) {

      // res.send('password ' + req.body.password);




       const saltRounds = 10;
       const plaintextPassword = req.body.password;
       const someOtherPlaintextPassword = 'asSWs';


       bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plaintextPassword, saltRounds, function(err, hash) {
       

       console.log("hashed password " + hash )

        // crreate object to enter the values in the database                      
        const requester = new Requester({
          firstName: req.body.FirstName,
          lastName: req.body.LastName,   
          mobile: req.body.Mobile,
          email: req.body.Email,
          country: req.body.Country,
          password: hash,
          addressLine1: req.body.AddressLine1,
          addressLine2: req.body.AddressLine2,
          city: req.body.City,
          state: req.body.State,
          postcode: req.body.Postcode,
      })
   
      // console.log(requester.FirstName + " " + requester.LastName + " " +  requester.Mobile + " " +requester.Email + " " + requester.Country + " " +  requester.password )
      // console.log(requester.AddressLine1 + " " + requester.AddressLine2 + " " +  requester.City + " " +requester.State + " " + requester.Postcode  )

      requester.save((err)=>{
        if(err){
          console.log(err)
        }
        else{
          console.log('Inserted succesfully')
          res.send("Data was successfully saved! ")
         return res.status("200").end()  
        }
    })    
        });
  });
    
    }  
})


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });


