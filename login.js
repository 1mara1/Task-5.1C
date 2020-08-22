const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const app = express()


mongoose.connect('mongodb+srv://mara:marapassword@cluster0.foa1t.mongodb.net', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true}
));

const { body, validationResult } = require('express-validator');
const { formatWithOptions } = require('util');





// Post method to receive data from client via http body 
app.post("/login", body('passwordConfirmation').custom((value, { req }) => {
  //  console.log("value password confirmation "+ value)
 //   console.log("value password "+ req.body.password)
    // if (value !== req.body.password) {
    //   throw new Error('Password confirmation does not match password');
    // }
    // return true;
  }),[      
    // body('Email', 'Email must be valid').isEmail(),
    // body('Country' , 'Country field must not be empty').isLength({ min: 1 } ),
    // body('Mobile', 'Mobile must be a number').isNumeric({no_symbols: false} ),
    // body('password', 'Password must have at least 8 characters').isLength({ min: 8 }),
    // body('FirstName', 'First name must have value').isLength({ min: 1 } ),
    // body('LastName', 'Last name must have value').isLength({ min: 1 } ),
    // body('AddressLine1', 'Address must have value').isLength({ min: 1 } ),
    // body('City', 'City must have value').isLength({ min: 1 } ),
    // body('State', 'State must have value').isLength({ min: 1 } ),
    // body('Postcode', 'Postcode must have value').isLength({ min: 1 } )   
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
   else {
        // match values against the db             



        

       
    }      
})



