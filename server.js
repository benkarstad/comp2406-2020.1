const
	express = require("express"),
	mongo = require('mongodb'),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	njk = require("nunjucks"),

	status = require("./scripts/status"),
	auth = require("./scripts/auth"),

	config = require("./serverconfig"),

	mongoc = mongo.MongoClient;

function init(){
	const //create the app
		app = express();

	//connect and configure the mongoDataBase
	mongoc.connect(config.db.url, {useUnifiedTopology: true},
				   (err, client)=>{
		if(err) throw err;
		else{
			let db = client.db(config.db.name);
			app.locals.db = {
				client: client,
				collections: {
					users: db.collection("users"),
					restaurants: db.collection("restaurants"),
					orders: db.collection("orders"),
					sessions: db.collection("sessions")
				}
			};

			//at a regular interval, check the sessions collection for any expired sessions and remove them
			setInterval(()=>auth.session.cleanupSessions(app.locals.db.collections.sessions), config.sessionCleanupInterval);
		}
	});

	app.listen(config.port);
	console.log(`Server listening at http://localhost:${config.port}`);

	//configure express to use nunjucks
	njk.configure("views",{express: app});
	app.set("view engine", "njk");

	app.use((request, response, next)=>{ //log request info
		console.log(`${request.method} request for ${request.url}`);
		next();
	}); //log request information to console

	//parse request data (if any)
	app.use(bodyParser.json(), //json body
			bodyParser.urlencoded({extended: true}), //urlencoded body
			cookieParser()); //cookies

	app.use(/^\/logout/, requireRouter("logout_router")); //log out uf the current session

	app.use(auth.session.verifyToken, //validate session token and get user info
			auth.session.setToken); //provide an updated session token

	//route to other various paths
	app.use(/^\/$/, requireRouter("index_router")); //serve homepage
	app.use(/^\/order/, requireRouter("order_router")); //serve order form and accept orders
	app.use(/^\/orders/, requireRouter("orders_router")); //serve data regarding order history
	app.use(/^\/stats/, requireRouter("stats_router")); //serve stats page
	app.use(/^\/restaurants/, requireRouter("restaurants_router")); //serve restaurant information
	app.use(/^\/addrestaurant/, requireRouter("addrestaurant_router")); //add restaurant information
	app.use(/^\/register/, requireRouter("register_router")); //register a new account
	app.use(/^\/login/, requireRouter("login_router")); //login to an existing account
	app.use(/^\/users/, requireRouter("users_router")); //access/modify user information
	app.use(express.static(config.publicDir)); //serve static server assets

	app.use(status.send404);// send a 404 response if nothing is found
}

function requireRouter(name){
	return require(`./${config.routerDir}/${name}`);
}

init();