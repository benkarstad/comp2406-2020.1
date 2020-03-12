const
	express = require("express"),
	fs = require("fs"),
	njk = require("nunjucks"),

	config = require("./config.json");

function init(){
	const app = express();

	app.locals.restaurants = {};
	app.locals.orderStats = {};
	app.locals.maxRestaurantId = 0;

	//load all the restaurant data into memory
	fs.readdir("restaurants/", (up, files)=>{
		for(let index in files){
			fs.readFile(`restaurants/${files[index]}`,
						(up, data)=>{
							let restaurant = JSON.parse(data);
							app.locals.restaurants[restaurant.id] = restaurant;
							if(restaurant.id > app.locals.maxRestaurantId){
								app.locals.maxRestaurantId = restaurant.id;
							}
						});
		}
		app.listen(config.port);
		console.log(`Server listening at http://localhost:${config.port}`);
	});

	njk.configure('views',{express: app});

	app.set("view engine", "njk");

	app.use((request, response, next)=>{ //log request info
		console.log(`${request.method} request for ${request.url}`);
		next();
	}); //log request information to console
	app.use(/^\/$/, requireRouter("index_router")); //serve homepage
	app.use(/^\/order/, requireRouter("order_router")); //serve order form and accept orders
	app.use(/^\/stats/, requireRouter("stats_router")); //serve stats page
	app.use(/^\/restaurants/, requireRouter("restaurants_router")); //serve restaurant information
	app.use(/^\/addrestaurant/, requireRouter("addrestaurant_router")); //add restaurant information
	app.use(express.static(config.publicDir)); //serve static server assets
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