const
	express = require("express"),
	jwt = require("jsonwebtoken"),

	auth = require("./scripts/auth"),
	status = require("./scripts/status"),

	config = require("./config"),

	secretKey = require("./secretKey");

let router = express.Router();

router.get("/", respondPage);
router.post("/",
			getUser,
			authenticate,
			auth.setToken,
			(request, response, next)=>{response.status(200).json({_id: response.locals.user._id})}
		);

function respondPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("login")
		}
	})
}

function getUser(request, response, next){
	const {username} = request.body;
	response.app.locals.db.collections.users.findOne({username}).then(
		(result)=>{
			if(result === null){
				status.send401(request, response, next);
				return
			}
			response.locals.user = result;
			next();
		}
	);
}

/*
 * Takes the password value from response.body and
 * 	validates it with the salt and passwordHash values
 * 	from response.locals.user
 * */
function authenticate(request, response, next){
	const
		{password} = request.body,
		{salt, passwordHash} = response.locals.user,
		hashKey = auth.saltHash(secretKey, salt);

	if(auth.validate(password, hashKey, passwordHash)){ //password is correct
		next(); //proceed to token creation
	}else{ //password is incorrect
		status.send401(request, response, next);
		return
	}
	next();
}

module.exports = router;