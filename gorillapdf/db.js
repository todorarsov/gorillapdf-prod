const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ServiceRating = require('./modules/schema/serviceRatingSchema');

module.exports = init = function(){
    ServiceRating.count(function (err, count) {
        if (!err && count === 0) {
            db.ServiceRating.insertOne( {"_id":1,"service_name":"TXT to PDF","rating_count":15,"rating_total":52});
ServiceRating.create( {"_id":2,"service_name":"PNG to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":3,"service_name":"Word to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":4,"service_name":"TXT to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":5,"service_name":"Ptotect PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":6,"service_name":"Unlock PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":7,"service_name":"Excel PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":8,"service_name":"Powerpoint to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":9,"service_name":"Compress PDF","rating_count":90,"rating_total":435});
ServiceRating.create( {"_id":10,"service_name":"ODT to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":11,"service_name":"ODS to PDF","rating_count":15,"rating_total":52} );
ServiceRating.create( {"_id":12,"service_name":"ODP to PDF","rating_count":15,"rating_total":52} );
        }
    });
}