var _ = require('lodash');
var EventProxy = require('eventproxy');

var buildings = function(server) {
	return {
		//获得所有
		get_buildings : function(info,cb){
			var query = `select id, name, area_id, created_at, updated_at
			from buildings where flag = 0
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

		get_buildings_byArea : function(area_id,cb){
			var query = `select id, name, area_id, created_at, updated_at
			from buildings where flag = 0 and area_id = ?
			`;

			server.plugins['mysql'].query(query,[area_id], function(err, results) {
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

module.exports = buildings;
