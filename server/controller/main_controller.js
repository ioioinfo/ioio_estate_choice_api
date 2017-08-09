// Base routes for item..
const uu_request = require('../utils/uu_request');
const uuidV1 = require('uuid/v1');
var eventproxy = require('eventproxy');
var service_info = "edication service";
var async = require('async');

var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body){
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			do_result(false, content, cb);
		} else {
			cb(true, null);
		}
	});
};
//所有post调用接口方法
var do_post_method = function(url,data,cb){
	uu_request.request(url, data, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			do_result(false, body, cb);
		} else {
			cb(true,null);
		}
	});
};
//处理结果
var do_result = function(err,result,cb){
	if (!err) {
		if (result.success) {
			cb(false,result);
		}else {
			cb(true,result);
		}
	}else {
		cb(true,null);
	}
};
exports.register = function(server, options, next) {

    server.route([
        //筹号获取用户信息
        {
            method: "GET",
            path: '/search_user_byNum',
            handler: function(request, reply) {
                var number = request.query.number;
                if (!number) {
                    return reply({"success":false,"message":"number null","service_info":service_info});
                }
                //查询
                server.plugins['models'].user_infos.search_user_byNum(number,function(err,rows){
                    if (!err) {

						return reply({"success":true,"rows":rows,"service_info":service_info});
					}else {
	                    return reply({"success":false,"message":rows.message,"service_info":service_info});
					}
				});

            }
        },
        //楼盘号获取大楼信息
        {
            method: "GET",
            path: '/get_buildings_byArea',
            handler: function(request, reply) {
                var area_id = request.query.area_id;
                if (!area_id) {
                    return reply({"success":false,"message":"area_id null","service_info":service_info});
                }
                //查询
                server.plugins['models'].buildings.get_buildings_byArea(area_id,function(err,rows){
                    if (!err) {

                        return reply({"success":true,"rows":rows,"service_info":service_info});
                    }else {
                        return reply({"success":false,"message":rows.message,"service_info":service_info});
                    }
                });
            }
        },
        //大楼获取房屋信息
        {
            method: "GET",
            path: '/get_houses_byBuilding',
            handler: function(request, reply) {
                var building_id = request.query.building_id;
                if (!building_id) {
                    return reply({"success":false,"message":"building_id null","service_info":service_info});
                }
                var info2 = {};
                var ep =  eventproxy.create("rows", "types",
					function(rows, types){
                        console.log("types:"+JSON.stringify(types));
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            if (types[row.house_type_id]) {
                                row.type_name = types[row.house_type_id].name;
                                row.type_picture = types[row.house_type_id].picture;
                            }
                        }
					return reply({"success":true,"rows":rows,"service_info":service_info});
				});
                //查询所有房子
                server.plugins['models'].house_infos.get_houses_byBuilding(building_id,function(err,rows){
                    if (!err) {
						ep.emit("rows", rows);
					}else {
						ep.emit("rows", []);
					}
				});
				server.plugins['models'].house_types.get_types(info2,function(err,rows){
                    if (!err) {
                        var type_map = {};
						for (var i = 0; i < rows.length; i++) {
						    type_map[rows[i].id] = rows[i];
						}
                        ep.emit("types", type_map);
					}else {
						ep.emit("types", {});
					}
				});

            }
        },
        //添加收藏
        {
            method: "POST",
            path: '/save_collection',
            handler: function(request, reply) {
                var house_id = request.payload.house_id;
                var user_id = request.payload.user_id;
                if (!house_id || !user_id) {
                    return reply({"success":false,"message":"house_id or user_id null","service_info":service_info});
                }
                //查询
                server.plugins['models'].collections.get_account_byUser(user_id,function(err,rows){
                    if (!err) {
                        var code = rows[0].num + 1;
                        console.log("code:"+code);
                        server.plugins['models'].collections.save_collection(house_id, user_id, code,function(err,result){
                            if (result.affectedRows>0) {
        						return reply({"success":true,"service_info":service_info});
        					}else {
        						return reply({"success":false,"message":result.message,"service_info":service_info});
        					}
                        });

                    }else {
                        return reply({"success":false,"message":rows.message,"service_info":service_info});
                    }
                });
            }
        },
        //获取个人收藏信息
        {
            method: "GET",
            path: '/get_collections_byUser',
            handler: function(request, reply) {
                var user_id = request.query.user_id;
                if (!user_id) {
                    return reply({"success":false,"message":"user_id null","service_info":service_info});
                }
                var info2 = {};

                var ep =  eventproxy.create("rows", "houses", "user",
                    function(rows, houses, user){
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            if (houses[row.house_id]) {
                                row.hourse = houses[row.house_id];
                            }
                        }
                    return reply({"success":true,"rows":rows,"user":user,"service_info":service_info});
                });

                //查询所有房子
                server.plugins['models'].collections.get_collections_byUser(user_id,function(err,rows){
                    if (!err) {
                        ep.emit("rows", rows);
                    }else {
                        ep.emit("rows", []);
                    }
                });
                server.plugins['models'].house_infos.get_houses(info2,function(err,rows){
                    if (!err) {
                        var house_map = {};
                        for (var i = 0; i < rows.length; i++) {
                            house_map[rows[i].id] = rows[i];
                        }
                        ep.emit("houses", house_map);
                    }else {
                        ep.emit("houses", {});
                    }
                });
                server.plugins['models'].user_infos.get_users(info2,function(err,rows){
                    if (!err) {
                        var user_map = {};
                        var user = {};
                        for (var i = 0; i < rows.length; i++) {
                            user_map[rows[i].id] = rows[i];
                        }
                        if (user_map[user_id]) {
                            user = user_map[user_id];
                        }
                        ep.emit("user", user);
                    }else {
                        ep.emit("user", {});
                    }
                });



            }
        },



    ]);

    next();
}

exports.register.attributes = {
    name: "main_controller"
};
