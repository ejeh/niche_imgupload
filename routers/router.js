function route(app){
    
// var login = require('./login');
var user = require('./user')
    Ads = require('./Ads');
    // upload = require('./upload')


user.route(app);
Ads.route(app);
// upload.route(app)

}
module.exports.route = route;
