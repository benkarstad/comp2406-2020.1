const
	express = require("express"),
	crypto = require("crypto"),

	auth = require("../scripts/auth"),
	status = require("../scripts/status"),

	secretKey = require("../secretKey");

let router = express.Router();

router.get("/", respondPage);
router.post("/",
			registerUser,
			auth.session.setToken,
			status.send200);
function respondPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("register",
				{
					loggedIn: response.locals.user !== undefined,
					user: response.locals.user
				})
		}
	});
}

function registerUser(request, response, next){
	response.app.locals.db.collections.users.findOne({username: request.body.username},
		 (err, user)=>{
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
			}else{
				return response.status(409).send();
			}
		 })
}

module.exports = router;