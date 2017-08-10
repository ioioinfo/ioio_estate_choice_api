var _ = require('lodash');
var EventProxy = require('eventproxy');

var collections = function(server) {
	return {
		//根据用户id查询code
		get_account_byUser : function(user_id,cb){
			var query = `select code
			from collections where flag = 0 and user_id = ?
			order by created_at desc limit 1
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
		get_num_byUser : function(user_id,cb){
			var query = `select count(1)num
			from collections where flag = 0 and user_id = ?
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
		// 保存
		save_collection : function(house_id, user_id, code, cb){
			var query = `insert into collections (house_id, user_id, code, created_at, updated_at, flag )
			values
			(?, ?, ?, now(), now(), 0
			)
			`;
			var coloums = [house_id, user_id, code];
			server.plugins['mysql'].query(query, coloums, function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},
		//个人收藏展示
		get_collections_byUser : function(user_id,cb){
			var query = `select id, house_id, code, user_id, created_at, updated_at
			from collections where flag = 0 and user_id = ?
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
		//删除收藏
		delete_collection:function(id, cb){
			var query = `update collections set flag = 1, updated_at = now()
				where id = ? and flag =0
				`;
			server.plugins['mysql'].query(query, [id], function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},
		//查询是否存在
		search_collection : function(user_id, house_id, cb){
			var query = `select count(1) num
			from collections where flag = 0 and user_id = ? and house_id = ?
			`;

			server.plugins['mysql'].query(query,[user_id,house_id], function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},
		//取消收藏
		cancel_collection : function(user_id, house_id, cb){
			var query = `update collections set flag = 1, updated_at = now() where flag =0 and  user_id = ? and house_id = ?
			`;

			server.plugins['mysql'].query(query,[user_id,house_id], function(err, results) {
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

module.exports = collections;
