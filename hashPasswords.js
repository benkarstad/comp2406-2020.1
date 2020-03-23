const
	mongo = require('mongodb'),

	auth = require("./scripts/auth"),

	config = require("./serverconfig"),
	saltKey = require("./saltKey"),

	mongoc = mongo.MongoClient;

let db,
	usersCollection;

//connect and configure the mongoDataBase
mongoc.connect(config.db.url, (up, client)=>{
	db = client.db(config.db.name);
	usersCollection = db.collection("users");

	usersCollection.find({}).toArray().then((users)=>{
		console.log(users);
		for(let index in users){
			let user = users[index];
			user.salt = auth.genRandomString(64);

			let hashKey = auth.saltHash(saltKey, user.salt);

			user.passwordHash = auth.saltHash(user.password, hashKey);

			delete user.password;

			usersCollection.findOneAndReplace({_id: user._id}, user)
		}
	});
});

