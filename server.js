const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const cheerio = require("cheerio");

const port = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/foxNewsScraper";


const db = require("./models");
const app = express();


//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));




mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});




//Scraping
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from Fox News Health:" +
            "\n***********************************\n");
request("http://www.foxnews.com/health.html", function(error, response, html) {

  const $ = cheerio.load(html);



  $(".collection-article-list article").each(function(i, element) {
  	let results = {};

    const headline = $(element).find('.title').children('a').text();
    const summary = $(element).find('.dek').text();
    const url = $(element).find('.dek').children('a').attr('href');
    const image = $(element).find('img').attr('src');

    results.headline = headline,
    results.summary = summary,
    results.url = url,
    results.image = image

    // console.log(results);

    db.Article.find({'headline': headline})
    .then(function(dbArticle){
    	console.log(dbArticle.length);
    	// console.log(dbArticle[0].headline);

    	if (dbArticle.length === 0){
    		console.log('NAH BREH');
    		db.Article.create(results);
    	} else if (dbArticle.length === 1){
    		console.log('Article Exists');
    	};

 	  }).catch(function(err) {
      // If an error occurred, send it to the client
      console.log(err);
    });

  });

  // Log the results once you've looped through each of the elements found with cheerio
  
});

const routes = require("./controllers/articles.js");

app.use("/", routes);


app.listen(port, function() {
  console.log("App running on port " + port + "!");
});