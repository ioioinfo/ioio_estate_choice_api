var _ = require('lodash');
var EventProxy = require('eventproxy');

var house_infos = function(server) {
	return {
		//获得所有
		get_houses_byBuilding : function(building_id,cb){
			var query = `select id, house_type_id, address, state, structure_area, total_price, per_price, product_type, garden_area,  building_id,  floor_num,  door_num,  created_at, updated_at
			from house_infos where flag = 0 and building_id = ?
			`;

			server.plugins['mysql'].query(query,[building_id], function(err, results) {
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

module.exports = house_infos;
