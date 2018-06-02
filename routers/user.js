
const
    User = require("../model/user/user.js");
    bcrypt = require('bcryptjs');
    crypto = require('crypto');
    mongoose = require('mongoose');
    ObjectId = require('mongodb').ObjectId;

function route(app) {
    app.post("/register", function (req, res) {
        
        var form = {
            email: req.body.email,
            password: req.body.password,
            }

        User.create(form, function (err, data) {
            if(err){
                res.json({status: 400, message: "Could not create DRIVER", err: err});
            }else{
                res.json({status: 200, message: "User created",email: data.email});
            }
        });
    });

   /*
    *********************  login route:****************************
        {
            email:""
            password:""
        }
    ***************************************************************
   */

    app.post('/login', function (req, res, next) {
        
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function (error, user) {
                if (error || !user) {
                    res.json({status: 404, message: "Please check the provided data and try again", err: error});
                    return next(error);
                }
                else if(user&&user.access=="vendor"){
                    res.json({status: 201, message: "Hi vendor", email:user.email});
                }
                else if(user&&user.access=="courier"){
                    res.json({status: 203, message: "Hi courier", email:user.email});
                }
                else{
                    res.json({status: 202, message: "Hi costumer",email:user.email});
                }
                
            });
        }
    })


     /*
    *********************  to find a single user by email:*********
        {
            email:""    Pass value as params
        }
    ***************************************************************
   */

    app.post('/user/person', function(req, res){

        User.findOne({email:req.body.email},"-password", function(err, doc){
            if(err){
                console.log(err)
                           
            }else{
                res.status(200).json({message:"Available  are displayed below", doc:doc})
            }
        })
    })

    /*
        Find Single user by params method
    */
    //  app.get('/user/person/:email', (req, res)=>{
    //     return User.find({email:req.params.email})
    //     .then(doc=>{
    //             return res.status(200).json({message:"Available "+ category+ " are displayed below", doc:doc})
    //         })

        
        /*
      To view all register users by admin
    */
    app.get('/allUsers', (req, res)=>{
        return User.find({},"-password")//.select("-password")   //.populate('User',"-password")
        .then(doc=>{
            return res.status(200).json({message:"All items", doc:doc})
        })
        .catch(err=>{
            return res.status(400).json({message:"Sorry an error has occured"})
        })
    })

    app.post('/editUser', (req, res)=>{
       return User.update({"email":req.body.email}, 
            {$set:req.body})
            .then(doc=>{
                return res.status(200).json({status:200, message:"Ads successfully Modified", doc:doc})
            })
            .catch(err=>{
                return res.status(400).json(err)
            })
    });

    // app.post('/user/update',(req, res)=>{
    //     return User.update({"email":req.body.email}, {$set:req.body} )
    //     .then(data=>{ 
    //     ("Successfully updated User");      
    //     return res.status(200,).json({data:data});
    //     })

    //     .catch(err=>{
    //     ("User Update Failed try again");
    //     return res.status(400).json(error);
    //     })
    
   
    // })


    app.delete('/deleteUser', (req, res)=>{
        return User.findOneAndRemove({"email":"req.body.email"})
            .then(ok =>{
                return res.status(200).json({status:200, message:"Item successfully deleted"})
            })
            .catch(err=>{
                return res.status(err).json(err)
            })
    })
    
}

module.exports.route = route;
