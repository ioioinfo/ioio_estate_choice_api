var _ = require('lodash');
var EventProxy = require('eventproxy');

var house_types = function(server) {
	return {
		//获得所有
		get_types : function(info, cb){
			var query = `select id, name, picture, created_at, updated_at
			from house_types where flag = 0
			`;

			if (info.thisPage) {
                var offset = info.thisPage-1;
                if (info.everyNum) {
                    query = query + " limit " + offset*info.everyNum + "," + info.everyNum;
                }else {
                    query = query + " limit " + offset*20 + ",20";
                }
            }

			server.plugins['mysql'].query(query, function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},

		//户型图查看
		get_types_byId : function(id,cb){
			var query = `select id, name,  picture, created_at, updated_at
			from house_types where flag = 0 and id = ?
			`;

			server.plugins['mysql'].query(query,[id], function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},


	};
};

module.exports = house_types;
