var _ = require('lodash');
var EventProxy = require('eventproxy');

var estate_areas = function(server) {
	return {
		//找房产项目信息
		get_estate_by_id : function(id,cb){
			var query = `select id, name, province, city, district, DATE_FORMAT(starting_date,'%Y-%m-%d') starting_date,
			DATE_FORMAT(end_date,'%Y-%m-%d') end_date, created_at, updated_at
			from estate_areas where flag = 0 and id = ?
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

module.exports = estate_areas;
