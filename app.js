var bodyParser  = require('body-parser'),
	express		= require('express'),
	app			= express(),
	ejs			= require('ejs'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	mongoose	= require('mongoose');

app.use(express.static("public"));
app.use(expressSanitizer());
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));



mongoose.connect('mongodb+srv://kushDB:bas@nT6542@kushmongo-9mgpi.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

var blogSchema = new mongoose.Schema({	
	title: String,
	image: String,
	body: String,
	date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema);

/*obj = {title: "First post", body: "This is the first post we make" , image: "https://images.unsplash.com/photo-1559677437-62c20d42dd27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"};

Blog.create(obj);*/

app.get("/", function(req, res){
	
	res.render("index");
	
});

app.get("/blogs" , function(req, res){
	
	Blog.find({}, function (err, fetchedBlog){
		if(err){
			console.log(err);
		}else{
			res.render("blogs" , {fetchedBlog : fetchedBlog});
			
		}
	});

});

app.get("/blogs/new" , function(req, res){
	res.render("new");
});

app.get("/blogs/:id" , function(req,res){
	var newID = req.params.id;
		
	Blog.findById(newID , function(err, morePost){
		if(err){
			console.log(err);
		}else{
			res.render("show" , {morePost:morePost});
		}
	});
	
});


app.post("/blogs" , function(req, res){
	req.body.post.body = req.sanitize(req.body.post.body);
	Blog.create(req.body.post , function(err , done){
		if(err){
			console.log(err);
			res.render("new");
		}else{
			
			res.redirect("blogs");
		}
	});
	
});

app.get("/blogs/:id/edit" , function(req, res){
	
	Blog.findById(req.params.id , function(err, foundPost){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit" , {blog:foundPost});
		}
	});
});


app.put("/blogs/:id" , function(req, res){
	req.body.post.body = req.sanitize(req.body.post.body);
	Blog.findByIdAndUpdate(req.params.id , req.body.post , function(err, updatedPost){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

app.delete("/blogs/:id" , function(req, res){
	console.log("came to the route");
	var newID = req.params.id;
	console.log(newID);
	Blog.findByIdAndRemove(newID, function(err){
		if(err){
			console.log("error");
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});


app.listen(3000, function(){
	console.log("Server listening at port 3000");
});