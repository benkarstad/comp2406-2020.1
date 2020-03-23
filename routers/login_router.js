const
	express = require("express"),
	jwt = require("jsonwebtoken"),

	auth = require("../scripts/auth"),
	status = require("../scripts/status"),

	config = require("../serverconfig"),

	secretKey = require("../secretKey");

let router = express.Router();

router.get("/", respondPage);
router.post("/",
			getUser,
			authenticate,
			auth.setToken,
			status.send200
		);

function respondPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("login",{
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			})
		}
	})
}

function getUser(request, response, next){
	const {username} = request.body;
	response.app.locals.db.collections.users.findOne({username}).then(
		(result)=>{
			if(result === null){
				return status.send401(request, response, next);
			}
			response.locals.user = result;
			return next();
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
		return next(); //proceed to token creation
	}else{ //password is incorrect
		return status.send401(request, response, next);
	}
}

module.exports = router;