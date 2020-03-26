const
	crypto = require("crypto"),
	jwt = require("jsonwebtoken"),
	status = require("./status"),

	config = require("../serverconfig"),

	sessionTimeout = config.sessionTimeout, //session length in milliseconds
	secretKey = require("../secretKey"),

	hashAlgorithm = "sha512";

/**
 * hash password
 * @function
 * @return {string} digest
 * @param {string} value - plaintext password value.
 * @param {string} salt - associated salt value.
 */
function saltHash(value, salt){
	let hash = crypto.createHmac(hashAlgorithm, salt);
	hash.update(value);
	return hash.digest('hex');
}

/**
 * verifies that the provided salt and password match the hash
 * @function
 * @return {boolean} result - returns true if the salted, hashed password matches the hash
 * @param {string} value
 * @param {string} salt
 * @param {string} hash
 * */
function verifyHash(value, salt, hash){
	return hash === saltHash(value, salt);
}

/**
 * creates and stores a session token to be sent, removing a previous token if it exists
 * an authenticated user must already be set at response.locals.user
 * @function
 * @param request
 * @param response
 * @param next
 * */
function setToken(request, response, next){
	const
		token = request.cookies.token,
		user = response.locals.user;

	//verify an authenticated user exists
	if(user === undefined) return next();

	// if there is a token, remove it
	if(token){
		response.cookie("token", null, {maxAge: 0}); //remove token from cookies

		response.app.locals.db.collections.sessions.deleteMany({token}); //remove token from the DB
	}

	// Create a new JSON web-token
	const newToken = jwt.sign({username: user.username}, secretKey, {
		algorithm: "HS256",
		expiresIn: sessionTimeout
	});

	response.cookie("token", newToken, { maxAge: sessionTimeout }); //set the cookie to the new token string

	response.app.locals.db.collections.sessions.insertOne({token: newToken}); //add the new token to the DB

	return next();
}

/**
 * purges the session token from the database and the client's cookies
 * also removes authenticated data from the response.locals.user property
 * @function
 * @param request
 * @param response
 * @param next
 * */
function unsetToken(request, response, next){
	const token = request.cookies.token;

	// if there is a token, remove it
	if(token){
		response.cookie("token", null, {maxAge: 0}); //remove token from cookies

		response.app.locals.db.collections.sessions.findOneAndDelete({token}); //remove token from the DB

		delete response.locals.user;
	}

	return next();
}

/**
 * verifies the validity of the current session token and retrieves the user data of the session owner
 * if the token is valid, the user's info will be set in response.locals.user.
 * @function
 * @param request
 * @param response
 * @param next
 * */
function verifyToken(request, response, next){
	const token = request.cookies.token;

	// no token === no good
	if(!token){
		return next();
	}

	//verify that the token is still valid
	let payload;
	try{
		//parse the session token
		payload = jwt.verify(token, secretKey);
	}catch(err){
		//remove the token, if it's invalid
		if(err instanceof jwt.JsonWebTokenError) {
			return unsetToken(request, response, next);
		}
		// otherwise, respond with a bad request error
		return status.send400(request, response, next);
	}

	response.app.locals.db.collections.sessions.findOne({token}) //find the DB entry for the token
		.then((result)=>{
			if(!result || !result.token) return unsetToken(request, response, next);
			//retrieve the user from the database and set response.locals.user
			response.app.locals.db.collections.users.findOne({username: payload.username})
				.then((user)=>{
					if(user === null){
						return next();
					}
					response.locals.user = user;
					return next();
				}
			)
		});
}

module.exports = {
	saltHash,
	verifyHash,
	session: {
		setToken,
		unsetToken,
		verifyToken
	}
};
