const crypto = require("crypto");

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

module.exports = {
	genRandomString,
	saltHash,
	validate
};
