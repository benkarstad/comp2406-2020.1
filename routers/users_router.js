const
	express = require("express"),
	mongo = require("mongodb"),
	crypto = require("crypto"),

	auth = require("../scripts/auth"),
	status = require("../scripts/status"),
	
	secretKey = require("../secretKey"),

	router = express.Router();

router.put("/profile", updateProfile);
router.get("/profile", redirectToUser);
router.use("/:_id", getUser);
router.get("/:_id", getOrderHistory, respondProfile);
router.get("/", respondUsers);
router.post("/",
	createUser,
	auth.session.setToken,
	status.send200);

function updateProfile(request, response, next){
	const
		whiteList = ["privacy"],
		maskedBody = whiteList.reduce((acc, curr)=>{
			if(request.body.hasOwnProperty(curr)){
				acc[curr] = request.body[curr];
			}
			return acc;
		}, {});
	response.app.locals.db.collections.users
		.findOneAndUpdate({_id: response.locals.user._id}, {$set: maskedBody});
}

function getUser(request, response, next){
	let _id;
	try{
		_id = new mongo.ObjectID(request.params._id);
	}catch(err){
		return status.send404(request, response, next);
	}
	response.app.locals.db.collections.users.findOne({_id})
		.then((user)=>{
			response.locals.userProfile = user;
			return next();
		});
}

function getOrderHistory(request, response, next){
	response.app.locals.db.collections.orders.find({userId: response.locals.userProfile._id})
		.sort({date: -1}).toArray().then((orders)=>{
			response.locals.userProfile.orders = orders;
			return next();
		})
}

function respondProfile(request, response, next){
	if(response.locals.userProfile.privacy === false ||
		(response.locals.user !== undefined && response.locals.userProfile.username === response.locals.user.username)){ //only show private accounts to that user
			return response.format({
				"text/html": ()=>{
					response.render(
						"userProfile",
						{
							userProfile: response.locals.userProfile,
							orders: response.locals.userProfile.orders,
							loggedIn: response.locals.user !== undefined,
							user: response.locals.user
						})
				}
			});
	}

	//otherwise, send a 404 Status
	status.send404(request, response, next);
}

function redirectToUser(request, response, next){
	if(response.locals.user === undefined) response.redirect("/login");
	response.redirect(`/users/${response.locals.user._id}`);
}

function respondUsers(request, response, next){
	response.app.locals.db.collections.users.find({privacy: false}).toArray()
		.then((users)=>{

			//filter user list by query:name
			let nameQuery = request.query.name === undefined ? "" : request.query.name;
			if(typeof nameQuery !== "string") status.send400(request, response, next);
			let queryExp = new RegExp(nameQuery, "i"),
				queriedUsers = users.filter((user)=>queryExp.test(user.username));

			//send filtered users to the client
			response.format({
				"text/html": ()=>{
					return response.render(
						"users",
					   {
					   		users: queriedUsers,
						   loggedIn: response.locals.user !== undefined,
						   user: response.locals.user
					   });
				},
				"application/json": ()=>{
					response.status(200).json(queriedUsers);
				}
			})
		});
}

/**
 * creates a new user and commits it to the database
 * @param request
 * @param response
 * @param next
 */
function createUser(request, response, next){
	response.app.locals.db.collections.users.findOne({username: request.body.username},
		(err, user)=>{ //if the username is available, create a new user
			if(user === null){
				let {username, privacy, password } = request.body;
				let salt = crypto.randomBytes(32).toString("hex"),
					hashKey = auth.saltHash(secretKey, salt),
					passwordHash = auth.saltHash(password, hashKey),
					
					newUser = {
						username,
						privacy,
						salt,
						passwordHash
					};
				
				response.app.locals.db.collections.users.insertOne(newUser,{},
					(err, newUser)=>{
						response.locals.user = newUser.ops[0];
						next();
					});
				
			}else{ //if the username is taken, send a 409 error
				return response.status(409).send();
			}
		})
}


module.exports = router;