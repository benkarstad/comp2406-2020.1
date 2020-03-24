const
	express = require("express"),
	mongo = require("mongodb"),

	status = require("../scripts/status"),

	router = express.Router();

router.put("/profile", updateProfile);
router.get("/profile", redirectToUser);
router.use("/:_id", getUser);
router.get("/:_id", getOrderHistory, respondProfile);
router.get("/", respondUsers);

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
	response.app.locals.db.collections.orders.find({username: response.locals.userProfile.username})
		.toArray().then((orders)=>{
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
	response.redirect(`/users/${response.locals.user._id}`);
}

function respondUsers(request, response, next){
	response.app.locals.db.collections.users.find({privacy: false}).toArray()
		.then((users)=>{
			console.log(users);//TEMP
			response.format({
				"text/html": ()=>{
					return response.render(
						"users",
					   {
					   		users,
						   loggedIn: response.locals.user !== undefined,
						   user: response.locals.user
					   });
				}
			})
		});
}

module.exports = router;