// const express           = require('express');
//       mongoose          = require("mongoose");
//       busboyBodyParser  = require("busboy-body-parser");
//       multer            = require('multer');
//       GridFsStorage     = require('multer-gridfs-storage')
//       Grid              = require('gridfs-stream');
//       path              = require("path");
//       crypto            = require('crypto');


// const app = express();


// // mongo URI 

// // const mongoURI ='mongodb://bobby:123456@ds237989.mlab.com:37989/niche_vendors'
// const mongoURI = 'mongodb://localhost/niche'

// // create mongo connection 
// const conn = mongoose.createConnection(mongoURI)


// function route(app){

//     // init gfs
//     let gfs; 
    
//     conn.once('open', () => {
//         // init straem
//       gfs = Grid(conn.db, mongoose.mongo);
//       gfs.collection('uploads')
//     })
    
    
//     //create storage engine
//     const storage = new GridFsStorage({
//         url: mongoURI,
//         file: (req, file) => {
//           return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//               if (err) {
//                 return reject(err);
//               }
//               const filename = buf.toString('hex') + path.extname(file.originalname);
//               const fileInfo = {
//                 filename: filename,
//                 bucketName: 'uploads'
//               };
//               resolve(fileInfo);
//             });
//           });
//         }
//       });
//       const upload = multer({ 
//           storage: storage ,
//           fileFilter: function (req, file, callback) {
//             var ext = path.extname(file.originalname);
//             if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//                 return callback(new Error('Only images are allowed'))
//             }
//             callback(null, true)
//         },
//         limits: {
//             fileSize: 1024 * 1024
//         },
//     })
    
    
    
//     app.get('/get', function(req, res){
//         res.render('secret')
//     })
    
//     // @route post /upload
//     // @desc uploads file to db
//     app.post('/upload', upload.single("file"), (req, res) => {
//         res.json({
//             responseMessage: 'file uploadloaded succesfully',
//         })
//         // res.json({ file: req.file})
//     })
    
//     //@route Get /files
//     // @desc display all files in json
    app.get("/getfiles", function (req, res) {
        // gfs.collection('uploads');
    
        // Get all image files
        // First check if files exist
        gfs.files.find({}).toArray(function (err, files) {
            if (!files || files.length === 0) {
                return res.json({
                    status: 404,
                    message: 'No file found',
                    err: err
    
                })
            } else {
                res.json({
                    status: 200,
                    message: "All files",
                    files: files
                })
                // res.render("secret", { files: files })
    
            }
        })
    })
    
//     //@route Get /image/:filename
//     //@desc Display image
//     app.get('/image/:filename', function (req, res) {
//         gfs.collection('uploads'); //set collection name to lookup into
    
//         /** First check if file exists */
//         gfs.files.findOne({ filename: req.params.filename },(err, file) => {
//             if (!file || file.length === 0) {
//                 return res.status(404).json({
//                     responseCode: 1,
//                     responseMessage: "error"
    
//                 });
    
//             }
    
//             /** create read stream */
//             /** set the proper content type */
//             if(file.contentType === "image/jpeg" || file.contentType === "image/png"
//                  || file.contentType === "image/jpg" || file.contentType ===" image/gif"){
    
//                      const readstream = gfs.createReadStream(file.filename);
//                        /** return response */
//                        return readstream.pipe(res);
//                  }else{
//                      res.status(404).json({
//                          err: 'Not an image'
//                      })
//                  }
//         });
    
//     });
    
//      // @route Delete /files/:id
//             // @desc Delete file
//             app.delete('/file/:id', function(req, res){
//                 gfs.collection('uploads');
                
//                 gfs.remove({ _id: req.params.id, root: 'uploads'}, function(err, files){
//                     if (err){
//                         return res.json({err:err})
//                     }
//                     else{
//                         res.json({
//                             status: 200,
//                             responseMessage: 'File successfully removed',
//                             files: files
//                         })
//                     }            
                
//                 })
//             })

// }

// module.exports.route = route;