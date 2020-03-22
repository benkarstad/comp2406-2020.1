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
 * creates and stores a session token
 * @function
 * @param request
 * @param response
 * @param next
 * */
function setToken(request, response, next){
	// Create a new JSON web-token
	const token = jwt.sign({username: response.locals.user.username}, secretKey,{
		algorithm: "HS256",
		expiresIn: sessionTimeout
	});

	// set the cookie as the token string
	response.cookie('token', token, { maxAge: sessionTimeout })
}

/**
 * verifies the validity of the current session token and retrieves the user data of the session owner
 * @function
 * @param request
 * @param response
 * @param next
 * */
function verifyToken(request, response, next){
	const token = request.cookies.token;

	// unset token === bad
	if (!token){
		return status.send401(request, response, next);
	}

	let payload;
	try {
		//parse the session token
		payload = jwt.verify(token, secretKey);
	} catch (up) {
		if (up instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return status.send401(request, response, next);
		}
		// otherwise, return a bad request error
		return status.send400(request, response, next);
	}

	//retrieve the user from the database and set response.locals.user
	response.app.locals.db.collections.users.findOne({username: payload.username}).then(
		(user)=>{
			if(user === null){
				return status.send401(request, response, next);
			}
			response.locals.user = user;
			next();
		}
	)
}

module.exports = {
	genRandomString,
	saltHash,
	validate,
	setToken,
	verifyToken
};
