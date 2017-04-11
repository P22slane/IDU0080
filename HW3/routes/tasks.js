var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var open = require("open");
var async = require('async');
var Db = require('mongodb');
var Server = require('mongodb').Server;
var db = mongojs('mongodb://user:Datauser@ds119020.mlab.com:19020/mytasks', ['tasks','users','logs']);

// defining a function
var async_function = function(tasks, callback){
    process.nextTick(function(){
        db.tasks.find(function(err, tasks){
                if(err){
                    res.send(err);
                }
                callback(tasks);
            });
        
    });
};

// Get All Tasks
router.get('/tasks', function(req, res, next){
    
    async_function(true, function(tasks){
    // val == true
        res.json(tasks);
        console.log(tasks);
    });

    
});



// Get Single Task
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Save Task
router.post('/task', function(req, res, next){
    var task = req.body;
    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

//Save User
router.post('/log', function(req, res, next){
    var log = req.body;
    if(!log.description){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.log.save(log, function(err, log){
            if(err){
                res.send(err);
            }
            res.json(log);
        });
    }
});

//Save User
router.post('/user', function(req, res, next){
    var user = req.body;
    if(!user.email || !user.password){
        res.status(400);
        
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.user.save(user, function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }
});

// Delete Task
router.delete('/task/:id', function(req, res, next){

    async.waterfall([
        function _function1 (req) {
            return function (callback) {
                var something = req.params.id;
                console.log(something)
                callback (null, something);
           }
        },
        function _function2 (something, callback) {
            return function (callback) {
               var somethingelse = function () { // do something here };
               callback (err, somethingelse);
                }
            }
        }
    ], function (error, success) {
        if (error) { alert('Something is wrong!'); }
        return alert('Done!');
    });


    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

// Update Task
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};
    
    if(task.isDone){
        updTask.isDone = task.isDone;
    }
    if(task.date){
        updTask.date = task.date;
    }
    if(task.description){
        updTask.description = task.description;
    }
    if(task.title){
        updTask.title = task.title;
    }
    
    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
});

module.exports = router;