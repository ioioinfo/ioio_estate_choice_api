var _ = require('lodash');
var EventProxy = require('eventproxy');

var user_infos = function(server) {
	return {
		//获得所有
		get_users : function(info, cb){
			var query = `select id, name, phone, identify, number, address, created_at, updated_at
			from user_infos where flag = 0
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

		//查询指定用户
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
		//查询指定用户
		search_user_byId : function(id, cb){
			var query = `select id, name, phone, identify, number, address, created_at, updated_at, flag
			from user_infos where flag = 0 and id = ?
			`;
			server.plugins['mysql'].query(query,[id],function(err, results) {
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
