const
    mongoose = require('mongoose'),
    Ads = require('../model/Ads/Ads'),
    express = require('express'),
    ObjectId = require('mongodb').ObjectId
busboyBodyParser = require("busboy-body-parser");
multer = require('multer');
GridFsStorage = require('multer-gridfs-storage')
Grid = require('gridfs-stream');
path = require("path");
crypto = require('crypto');


const app = express();


// mongo URI 

// const mongoURI ='mongodb://bobby:123456@ds237989.mlab.com:37989/niche_vendors'
const mongoURI = 'mongodb://localhost/niche'

// create mongo connection 
const conn = mongoose.createConnection(mongoURI)

// app  = express.app()

function route(app) {
    let gfs;

    conn.once('open', () => {
        // init straem
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads')
    })


    //create storage engine
    const storage = new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });
    const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
        limits: {
            fileSize: 1024 * 1024
        },
    })


    /*
    =================================================================================================
        To Create an Ad/Items for sale
        // @route post /upload
        // @desc uploads file to db
    =================================================================================================
    */

    app.get('/get', function (req, res) {
        res.render('secret')
    })

    app.post('/createAds', upload.array('filename', 6), (req, res) => {
        return Ads.create(req.body)
            .then(doc => {
                return res.status(200).json(doc)
            })
        console.log('1')
            .catch(err => {
                return res.status(400).json(err);
            })
    })

    /*
    =================================================================================================
        To Delete specific items
    =================================================================================================
    */

    app.post('/deleteAds', (req, res) => {
        return Ads.findOneAndRemove({ "_id": ObjectId(req.body._id) })
            .then(ok => {
                return res.status(200).json({ status: 200, message: "Item successfully deleted" })
            })
            .catch(err => {
                return res.status(err).json(err)
            })
    })

    app.post('/editAds', (req, res) => {

        return Ads.update({ "_id": ObjectId(req.body._id) },
            {
                update:
                    {
                        $set:
                            req.body
                    }
            })
            .then(doc => {
                return res.status(200).json({ status: 200, message: "Ads successfully Modified" })
            })
            .catch(err => {
                return res.status(400).json(err)
            })
    });
    /*
    =================================================================================================
        to view all available items
    =================================================================================================
    */
    app.get('/all-items', (req, res) => {
        return Ads.find({})
            .then(doc => {
                return res.status(200).json({ message: "All items", doc: doc })
            })
            .catch(err => {
                return res.status(400).json({ message: "Sorry an error has occured" })
            })
    })
    app.get('/item/:id', (req, res, next) => {

        Ads.findById({ _id: req.params.id }).populate("uploads.files").exec(function (err, data) {
            if (err) {
                throw err
            } else {
                item = data
                console.log(item)

            }
        })
    })
        app.get('/img', (req, res) => {
            res.render('secret')
        })

        app.get('/items/:id/:filename', (req, res, next) => {
            var item = {};
            var image = {};
            return Ads.findById({ _id: req.params.id }, (err, data) => {
                item = data;
                console.log(item)
                res.json({ item: item }),
                    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                        if (file.contentType === "image/jpeg" || file.contentType === "image/png"
                            || file.contentType === "image/jpg" || file.contentType === " image/gif") {

                            item = data;
                            image = file;
                            console.log(image)
                            const readstream = gfs.createReadStream(file.filename);
                            /** return response */
                            return readstream.pipe(res);
                            // res.render('secret', {data:data, file:file});
                        }
                    })

            })

        })


        app.get('/item/:id/:filename', (req, res, next) => {
            var item = {};
            var image = {};
            return Ads.findById({ _id: req.params.id }, (err, data) => {
                item = data;
                // res.json({
                //     item:item,

                // })
                // res.end();
                // next()

                gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                    if (file.contentType === "image/jpeg" || file.contentType === "image/png"
                        || file.contentType === "image/jpg" || file.contentType === " image/gif") {

                        image = file;
                        console.log(item);
                        console.log(image)
                        const readstream = gfs.createReadStream(file.filename);
                        /** return response */
                        readstream.pipe(res);
                        //     res.json({
                        //     item:item,
                        //     image:image
                        // })

                    }
                });
            })


        })



        app.get('/items3/:id/:filename', (req, res, next) => {
            var item = [];
            var image = [];
            Ads.findById({ _id: req.params.id }, function (err, data) {
                if (err) {
                    throw err
                } else {
                    item = data
                    console.log(item)

                }
                gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
                    if (err) {
                        throw err
                    } else {
                        image = file
                        console.log(image)
                    }

                    res.render('fileDownload', { item: item, image: image })
                    // res.json({
                    //     item:item,
                    //     image:image
                    // })
                })


            })

        })

        /*
        =================================================================================================
            To Search by Category
        =================================================================================================
        */

        app.get('/categorySearch', (req, res) => {
            return Ads.find({ category: req.body.category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Electronic
        =================================================================================================
        */

        app.get('/categoryElectronics', (req, res) => {
            let category = "Electronics"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Fashion
        =================================================================================================
        */

        app.get('/categoryFashion', (req, res) => {
            let category = "Fashion"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Electronic
        =================================================================================================
        */

        app.get('/categoryFood', (req, res) => {
            let category = "Food"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Phones
        =================================================================================================
        */

        app.get('/categoryPhones', (req, res) => {
            let category = "Phones"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Phones
        =================================================================================================
        */

        app.get('/categoryCosmetics', (req, res) => {
            let category = "Cosmetics"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by Category Furnitures
        =================================================================================================
        */

        app.get('/categoryFurnitures', (req, res) => {
            let category = "Furnitures"
            return Ads.find({ category })
                .then(doc => {
                    return res.status(200).json({ message: "Available " + category + " are displayed below", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })




        /*
        =================================================================================================
            To Search by Items location
        =================================================================================================
        */

        app.get('/locationSearch', (req, res) => {
            return Ads.find({ shopLocation: req.body.shopLocation })
                .then(doc => {
                    return res.status(200).json({ message: "Available Electronics", doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

        /*
        =================================================================================================
            To Search by particular vendor
        =================================================================================================
        */

        app.post('/shopSearch', (req, res) => {
            return Ads.find({ shopName: req.body.shopName })
                .then(doc => {
                    return res.status(200).json({ message: "Available sales from " + shopName, doc: doc })
                })
                .catch(err => {
                    return res.status(400).json({ message: "Sorry an error has occured" })
                })
        })

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
                    // res.json({
                    //     status: 200,
                    //     message: "All files",
                    //     files: files
                    // })
                    res.render("secret", { files: files })

                }
            })
        })

        //@route Get /image/:filename
        //@desc Display image
        app.get('/image/:filename', function (req, res) {
            gfs.collection('uploads'); //set collection name to lookup into

            /** First check if file exists */
            gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).json({
                        responseCode: 1,
                        responseMessage: "error"

                    });

                }

                /** create read stream */
                /** set the proper content type */
                if (file.contentType === "image/jpeg" || file.contentType === "image/png"
                    || file.contentType === "image/jpg" || file.contentType === " image/gif") {

                    const readstream = gfs.createReadStream(file.filename);
                    /** return response */
                    return readstream.pipe(res);
                } else {
                    res.status(404).json({
                        err: 'Not an image'
                    })
                }
            });

        });

        // @route Delete /files/:id
        // @desc Delete file
        app.delete('/file/:id', function (req, res) {
            gfs.collection('uploads');

            gfs.remove({ _id: req.params.id, root: 'uploads' }, function (err, files) {
                if (err) {
                    return res.json({ err: err })
                }
                else {
                    res.json({
                        status: 200,
                        responseMessage: 'File successfully removed',
                        files: files
                    })
                }

            })
        })

    }

module.exports.route = route