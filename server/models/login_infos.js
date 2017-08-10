var _ = require('lodash');
var EventProxy = require('eventproxy');

var login_infos = function(server) {
	return {
        // 保存
		save_login : function(token_id, user_id, cb){
			var query = `insert IGNORE into login_infos (token_id, user_id, created_at, updated_at, flag )
			values
			(?, ?, now(), now(), 0
			)
			`;
			var coloums = [token_id, user_id];
			server.plugins['mysql'].query(query, coloums, function(err, results) {
				if (err) {
					console.log(err);
					cb(true,results);
					return;
				}
				cb(false,results);
			});
		},
        //查询 user_id
        get_user_id : function(token_id,cb){
            var query = `select user_id
            from login_infos where flag = 0 and token_id = ?
            `;

            server.plugins['mysql'].query(query,[token_id], function(err, results) {
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

module.exports = login_infos;
