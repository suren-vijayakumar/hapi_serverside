var Hapi = require('hapi');
var Inert = require('inert');
var Path = require('path');
var mongoose = require('mongoose');
var mongoDB = mongoose.connect('mongodb://localhost/tasks').connection;
var Task = mongoose.model('task', {text: String, complete: Boolean});

mongoDB.once('open', function(){
    console.log("CONNECTED TO MONGO!");
});


var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "public")
            }
        }
    }
});

server.connection({ port: 5000 });

server.start(function(){});

server.register(Inert, function () {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: "assets/views",
            index: true,
            listing: true
        }
    }
});

server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: function(request, reply) {
        reply.file('assets/' + request.params.param);
    }
});

server.route({
    method: 'GET',
    path: '/vendors/{param*}',
    handler: function(request, reply) {
        reply.file("vendors/" + request.params.param);
    }
});

server.route({
    method: 'GET',
    path: '/todos',
    handler: function(req, res, next) {
        return Task.find({}).exec(function (err, task) {
            if (err) throw new Error(err);
            res(JSON.stringify(task));
        });
    }
});

//successfully posts new task
server.route({
    method: 'POST',
    path: '/todos',
    handler: function(req, res) {
        var task = new Task({text: req.payload.text, complete: false});
        task.save(function(err){
            if(err) console.log('error ', err);
            res(task.toJSON());
        });
    }
});

//successfully deletes task
server.route({
    method: 'DELETE',
    path: '/todos/{id}',
    handler: function(req, res, next) {
        Task.findByIdAndRemove(req.params.id, req.body, function(err, task){
            return Task.find({}).exec(function(err, task){
                if(err) throw new Error(err);
                res(JSON.stringify(task));
            });
        });
    }
});

//successfully updates task completion
server.route({
    method: 'PUT',
    path: '/todos/{id}',
    handler: function(req, res, next) {
        Task.findOneAndUpdate({_id: req.params.id}, req.payload, function (err, task) {
            return Task.find({}).exec(function(err, task){
                if(err) throw new Error(err);
                res(JSON.stringify(task));
            });
        });
    }
});



