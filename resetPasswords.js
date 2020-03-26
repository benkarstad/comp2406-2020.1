/*
 * running this file will generate new salts and set the passwords of all users to their usernames,
 * useful when changing password storage protocols, so that all users' credentials are updated to be compatible
 * NOTE: The security issues with this approach should be self-evident
 * */

const
	mongo = require('mongodb'),
	crypto = require("crypto"),

	auth = require("./scripts/auth"),

	config = require("./serverconfig"),
	secretKey = require("./secretKey"),

	mongoc = mongo.MongoClient;

//connect and configure the mongoDataBase
mongoc.connect(config.db.url, {useUnifiedTopology: true},(err, client)=>{

	let db = client.db(config.db.name),
		usersCollection = db.collection("users");

	usersCollection.find({}).toArray().then((users)=>{ //get all user profiles

		for(let index in users){ //reset their credentials
			let user = users[index];
			user.salt = crypto.randomBytes(32).toString("hex");

			const hashKey = auth.saltHash(secretKey, user.salt);

			user.passwordHash = auth.saltHash(user.username, hashKey);

			usersCollection.findOneAndReplace({_id: user._id}, user)
		}
		console.log("Done!")
	});
});

