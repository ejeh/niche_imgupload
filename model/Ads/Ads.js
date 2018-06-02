var db = global.db;
const
mongoose = require('mongoose');

const AdsSchema = new mongoose.Schema({
	
		itemsName:{type:String},
		category:{type:String},
		numberAvail:{type:String},
		price:{type:String},
		shopName:{type:String},
		shopLocation:{type:String}	
		

})

var Ads = mongoose.model("Ads", AdsSchema);
module.exports = Ads;


// var db = global.db;
// const
// mongoose = require('mongoose');
// uploads = require("/home/godfrey/nicheBackEnd/routers/Ads.js")
// Schema = mongoose.Schema;
// ObjectId = Schema.ObjectId;

// const AdsSchema = new Schema({
	
// 		itemsName:{type:String},
// 		category:{type:String},
// 		numberAvail:{type:String},
// 		price:{type:String},
// 		shopName:{type:String},
// 		shopLocation:{type:String},	
// 		uploads_id:{type:Schema.Types.ObjectId, ref:"uploads.files"}
		

// })

// module.exports = mongoose.model("Ads", AdsSchema)