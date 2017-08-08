
exports.register = function(server, options, next){

    server.expose('estate_areas', require('./estate_areas.js')(server));
    server.expose('buildings', require('./buildings.js')(server));
    server.expose('user_infos', require('./user_infos.js')(server));
    server.expose('house_types', require('./house_types.js')(server));
    server.expose('house_infos', require('./house_infos.js')(server));
    server.expose('collections', require('./collections.js')(server));
    server.expose('purchases', require('./purchases.js')(server));

  next();
}

exports.register.attributes = {
    name: 'models'
};
