// function cleanMongoError(err){
//     if(err === undefined)
//         return;
//     if(err instanceof Error)
//         return { status:err.status, message:err.message };
//     if(err instanceof Object)
//         err = err.toJSON();
//     if(err['op'] != undefined){
//         if(err['op']['password'] != undefined) err['op']['password'] = undefined;
//         if(err['op']['__v'] != undefined) err['op']['__v'] = undefined;
//         if(err['op']['_id'] != undefined) err['op']['_id'] = undefined;
//         if(err['code'] != undefined) err['code'] = undefined;
//         if(err['index'] != undefined) err['index'] = undefined;
//     }
//     return err;
// }

// function polishData(data){
//     if(data instanceof Array){
//         for(const c in data)
//             data[c] = polishData(data[c]);
//         return data;
//     }
//     data = data.toJSON();
//     if(data['password'] != undefined) data['password'] = undefined;
//     if(data['__v'] != undefined) data['__v'] = undefined;
//     if(data['_id'] != undefined) data['_id'] = undefined;
//     return data;
// }

// module.exports = {cleanMongoError, polishData};