const
	express = require("express"),
	fs = require("fs"),
	mongo = require('mongodb'),
	njk = require("nunjucks"),

	config = require("./config.json"),

	mongoc = mongo.MongoClient;
function init(){
	const
		app = express();

	app.locals.restaurants = {};
	app.locals.orderStats = {};
	app.locals.maxRestaurantId = 0;

	mongoc.connect(config.db.url, (up, client)=>{
		if(up) throw up;
		else{
			let db = client.db(config.db.name);
			app.locals.db = {
				client: client,
				collections: {
					users: db.collection("users"),
					restaurants: db.collection("restaurants"),
					stats: db.collection("stats")
				}
			}
		}
	});

	app.listen(config.port);
	console.log(`Server listening at http://localhost:${config.port}`);

	//configure express to use nunjucks
	njk.configure("views",{express: app});
	app.set("view engine", "njk");

	//TODO: something about being logged in

	//publicly available routes
	app.use((request, response, next)=>{ //log request info
		console.log(`${request.method} request for ${request.url}`);
		next();
	}); //log request information to console
	app.use(/^\/$/, requireRouter("index_router")); //serve homepage
	app.use(/^\/stats/, requireRouter("stats_router")); //serve stats page
	app.use(/^\/restaurants/, requireRouter("restaurants_router")); //serve restaurant information
	app.use(/^\/addrestaurant/, requireRouter("addrestaurant_router")); //add restaurant information
	app.use(/^\/register/, requireRouter("register_router")); //register a new account
	app.use(/^\/login/, requireRouter("login_router")); //login to an existing account
	app.use(express.static(config.publicDir)); //serve static server assets


	//routes only available to logged-in sessions
	app.use(/^\/order/, requireRouter("order_router")); //serve order form and accept orders

	app.use(send404);// send a 404 response if nothing is found
}

function requireRouter(name){
	return require(`./${config.routerDir}/${name}`);
}

function send404(request, response, next){
	response.status(404);
	response.format({
		"text/html": ()=>{
			response.render("error",
				{
					statusCode: 404,
					message: `Page ${request.url} not found.`
				});
		},
		"text/plain": ()=>{
			response.send(`404: ${request.url} not found`).end();
		},
		"default": ()=>{response.end();}
	})
}

init();