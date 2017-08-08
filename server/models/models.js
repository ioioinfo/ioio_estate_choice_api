
exports.register = function(server, options, next){

    // server.expose('classes', require('./classes.js')(server));

  next();
}

exports.register.attributes = {
    name: 'models'
};
