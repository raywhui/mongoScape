const express = require("express");
const db = require("../models");

const router = express.Router();

// Express Routing
router.get('/', function(req,res){
	db.Article
		.find({})
		.populate("comments")
		.then(function(dbArticle){

			let controllerToIndex = {
				articles: dbArticle
			};

			res.render('index', controllerToIndex);
		}).catch(function(err){
			res.json(err);
		});
});

router.get('/article', function(req,res){
	db.Article
		.find({})
		.populate('comments')
		.then(function(dbArticle){
			res.json(dbArticle);
		}).catch(function(err){
			res.json(err);
		});
});

router.get('/article/:id', function(req,res){
	db.Article
		.findOne({ _id: req.params.id })
		.populate("comments")
		.then(function(dbArticle){
			res.json(dbArticle);
		}).catch(function(err){
			res.json(err);
		});
});

// Route for saving/updating an Article's associated Note
router.post("/article/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comments
    .create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




module.exports = router;