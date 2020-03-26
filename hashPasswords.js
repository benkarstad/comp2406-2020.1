/*
 * running this file will set the passwords of all users to their usernames,
 * useful when changing password storage protocols, so that all users' credentials are updated to the new system
 * NOTE: The security issues with this approach should be self-evident
 * */

const
	mongo = require('mongodb'),
	crypto = require("crypto"),

	auth = require("./scripts/auth"),

	config = require("./serverconfig"),
	secretKey = require("./secretKey"),

	mongoc = mongo.MongoClient;

let db,
	usersCollection;

//connect and configure the mongoDataBase
mongoc.connect(config.db.url, (err, client)=>{
	db = client.db(config.db.name);
	usersCollection = db.collection("users");

	usersCollection.find({}).toArray().then((users)=>{
		console.log(users);
		for(let index in users){
			let user = users[index];
			user.salt = crypto.randomBytes(64).toString("hex");

			let hashKey = auth.saltHash(secretKey, user.salt);

			user.passwordHash = auth.saltHash(user.username, hashKey);

			usersCollection.findOneAndReplace({_id: user._id}, user)
		}
	});
});

