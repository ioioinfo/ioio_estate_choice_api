var _ = require('lodash');
var EventProxy = require('eventproxy');

var user_infos = function(server) {
	return {
		//查询指定课程
		search_user_byNum : function(number, cb){
			var query = `select id, name, phone, identify, number, address, created_at, updated_at, flag
			from user_infos where flag = 0 and number = ?
			`;
			server.plugins['mysql'].query(query,[number],function(err, results) {
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

module.exports = user_infos;
