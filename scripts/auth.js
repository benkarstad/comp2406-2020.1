const
	crypto = require("crypto"),
	jwt = require("jsonwebtoken"),
	status = require("./status"),

	config = require("../config"),

	sessionTimeout = config.sessionTimeout, //session length in milliseconds
	secretKey = require("../secretKey");


/**
 * generates random string of characters
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length){
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') //convert to hexadecimal format
		.slice(0,length); // return required number of characters
}

/**
 * hash password with sha512.
 * @function
 * @return {string} digest
 * @param {string} value - plaintext password value.
 * @param {string} salt - associated salt value.
 */
function saltHash(value, salt){
	let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
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
function validate(value, salt, hash){
	return hash === saltHash(value, salt);
}

/**
 * creates and stores a session token to be sent
 * @function
 * @param request
 * @param response
 * @param next
 * */
function setToken(request, response, next){
	const user = response.locals.user;
	//verify an authenticated user exists
	if(user === undefined) return next();
	// Create a new JSON web-token
	const token = jwt.sign({username: user.username}, secretKey,{
		algorithm: "HS256",
		expiresIn: sessionTimeout
	});

	// set the cookie as the token string
	response.cookie('token', token, { maxAge: sessionTimeout })

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

	// unset token === bad
	if (!token){
		return next();
	}

	let payload;
	try {
		//parse the session token
		payload = jwt.verify(token, secretKey);
	} catch (up) {
		if (up instanceof jwt.JsonWebTokenError) {
			return next();
		}
		// otherwise, return a bad request error
		return status.send400(request, response, next);
	}

	//retrieve the user from the database and set response.locals.user
	response.app.locals.db.collections.users.findOne({username: payload.username}).then(
		(user)=>{
			if(user === null){
				return next();
			}
			response.locals.user = user;
			return next();
		}
	)
}

function deleteToken(request, response, next){
	
}

module.exports = {
	genRandomString,
	saltHash,
	validate,
	setToken,
	verifyToken
};
