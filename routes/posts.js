var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
    var categories = db.get('categories'); 
    categories.find({}, {}, function(err, categories){
        res.render('addpost', {
            'title': 'Add Post',
            'categories': categories
        });
    });
});

/* GET users listing. */
router.post('/add', upload.single('mainimage'), function(req, res, next) {
    var title = req.body.title; 
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if (req.file) {
        var mainimage = req.file.filename; 
    }
    else{
        var mainimage = 'noimage.jpg';
    }

    req.checkBody('title', 'Title field is required').notEmpty(); 
    req.checkBody('body', 'Body field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors)
    {
        res.render('addpost', {
            "errors": errors
        });
    } else {
        var posts = db.get('posts');
        posts.insert({
            "title": title, 
            "body": body, 
            "category": category, 
            "date": date,
            "author": author,
            "mainimage": mainimage
        }, function(err, post){
            if(err){
                res.send(err);
            }
            else {
                req.flash('success', 'Post Added');
                res.location('/'); 
                res.redirect('/');  
            }
        });
    }
});

/*router.get('/show/:category', function(req, res, next){
    var posts = db.get('posts');

    categories.find({category: req.params.category}, {}, function(req, res, next){
        res.render('index', {
            'title': req.params.categories,
            'categories': posts
        });
    });
});
*/
module.exports = router;
