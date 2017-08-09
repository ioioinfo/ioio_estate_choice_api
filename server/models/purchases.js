var _ = require('lodash');
var EventProxy = require('eventproxy');

var purchases = function(server) {
	return {
		// 保存
		save_purchase : function(house_id, user_id, cb){
			var query = `insert IGNORE into purchases (house_id, user_id, state, created_at, updated_at, flag )
			values
			(?, ?, "成功", now(), now(), 0
			)
			`;
			var coloums = [house_id, user_id];
			server.plugins['mysql'].query(query, coloums, function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},
		//个人订购
		get_purchase_byUser : function(user_id,cb){
			var query = `select id, house_id, user_id, state, created_at, updated_at
			from purchases where flag = 0 and user_id = ?
			`;

			server.plugins['mysql'].query(query,[user_id], function(err, results) {
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

module.exports = purchases;
