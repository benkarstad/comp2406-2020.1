const
	mongo = require("mongodb"),
	config = require("./serverconfig"),

	restaurants = [
		{
			"name": "Aragorn's DORK BBQ",
			"min_order": 20,
			"delivery_fee": 5,
			"menu": [{
				"name": "Orc feet",
				"description": "Seasoned and grilled over an open flame.",
				"price": 5.5,
				"category": "Appetizers"
			}, {
				"name": "Pickled Orc fingers",
				"description": "Served with warm bread, 5 per order.",
				"price": 4,
				"category": "Appetizers"
			}, {
				"name": "Sauron's Lava Soup",
				"description": "It's just really spicy water.",
				"price": 7.5,
				"category": "Appetizers"
			}, {
				"name": "Eowyn's (In)Famous Stew",
				"description": "Bet you can't eat it all.",
				"price": 0.5,
				"category": "Appetizers"
			}, {
				"name": "The 9 rings of men.",
				"description": "The finest of onion rings served with 9 different dipping sauces.",
				"price": 14.5,
				"category": "Appetizers"
			}, {
				"name": "Buying the Farm",
				"description": "An arm and a leg, a side of cheek meat, and a buttered biscuit.",
				"price": 15.99,
				"category": "Combos"
			}, {
				"name": "The Black Gate Box",
				"description": "Lots of unidentified pieces. Serves 50.",
				"price": 65,
				"category": "Combos"
			}, {
				"name": "Mount Doom Roast Special with Side of Precious Onion Rings.",
				"description": "Smeagol's favorite.",
				"price": 15.75,
				"category": "Combos"
			}, {
				"name": "Morgoth's Scorched Burgers with Chips",
				"description": "Blackened beyond recognition.",
				"price": 13.33,
				"category": "Combos"
			}, {
				"name": "Slab of Lurtz Meat with Greens.",
				"description": "Get it while supplies last.",
				"price": 17.5,
				"category": "Combos"
			}, {
				"name": "Rangers Field Feast.",
				"description": "Is it chicken? Is it rabbit? Or...",
				"price": 5.99,
				"category": "Combos"
			}, {
				"name": "Orc's Blood Mead",
				"description": "It's actually raspberries - Orc's blood would be gross.",
				"price": 5.99,
				"category": "Drinks"
			}, {
				"name": "Gondorian Grenache",
				"description": "A fine rose wine.",
				"price": 7.99,
				"category": "Drinks"
			}, {"name": "Mordor Mourvedre", "description": "A less-fine rose wine.", "price": 5.99, "category": "Drinks"}]
		},
		{
			"name": "Frodo's Flapjacks",
			"min_order": 35,
			"delivery_fee": 6,
			"menu": [{
				"name": "Hobbit Hash",
				"description": "Five flapjacks, potatoes, leeks, garlic, cheese.",
				"price": 9,
				"category": "Breakfast"
			}, {
				"name": "The Full Flapjack Breakfast",
				"description": "Eight flapjacks, two sausages, 3 eggs, 4 slices of bacon, beans, and a coffee.",
				"price": 14,
				"category": "Breakfast"
			}, {
				"name": "Southfarthing Slammer",
				"description": "15 flapjacks and 2 pints of syrup.",
				"price": 12,
				"category": "Breakfast"
			}, {
				"name": "Beorning Breakfast",
				"description": "6 flapjacks smothers in honey.",
				"price": 7.5,
				"category": "Second Breakfast"
			}, {
				"name": "Shire Strawberry Special",
				"description": "6 flapjacks and a hearty serving of strawberry jam.",
				"price": 8,
				"category": "Second Breakfast"
			}, {
				"name": "Buckland Blackberry Breakfast",
				"description": "6 flapjacks covered in fresh blackberries. Served with a large side of sausage.",
				"price": 14.99,
				"category": "Second Breakfast"
			}, {
				"name": "Lembas",
				"description": "Three pieces of traditional Elvish Waybread",
				"price": 7.7,
				"category": "Elevenses"
			}, {
				"name": "Muffins of the Marish",
				"description": "A variety of 8 different types of muffins, served with tea.",
				"price": 9,
				"category": "Elevenses"
			}, {
				"name": "Hasty Hobbit Hash",
				"description": "Potatoes with onions and cheese. Served with coffee.",
				"price": 5,
				"category": "Elevenses"
			}, {
				"name": "Shepherd's Pie",
				"description": "A classic. Includes 3 pies.",
				"price": 15.99,
				"category": "Luncheon"
			}, {
				"name": "Roast Pork",
				"description": "An entire pig slow-roasted over a fire.",
				"price": 27.99,
				"category": "Luncheon"
			}, {
				"name": "Fish and Chips",
				"description": "Fish - fried. Chips - nice and crispy.",
				"price": 5.99,
				"category": "Luncheon"
			}, {
				"name": "Tea",
				"description": "Served with sugar and cream.",
				"price": 3,
				"category": "Afternoon Tea"
			}, {
				"name": "Coffee",
				"description": "Served with sugar and cream.",
				"price": 3.5,
				"category": "Afternoon Tea"
			}, {
				"name": "Cookies and Cream",
				"description": "A dozen cookies served with a vat of cream.",
				"price": 15.99,
				"category": "Afternoon Tea"
			}, {
				"name": "Mixed Berry Pie",
				"description": "Fresh baked daily.",
				"price": 7,
				"category": "Afternoon Tea"
			}, {
				"name": "Po-ta-to Platter",
				"description": "Boiled. Mashed. Stuck in a stew.",
				"price": 6,
				"category": "Dinner"
			}, {
				"name": "Bree and Apple",
				"description": "One wheel of brie with slices of apple.",
				"price": 7.99,
				"category": "Dinner"
			}, {
				"name": "Maggot's Mushroom Mashup",
				"description": "It sounds disgusting, but its pretty good",
				"price": 6.5,
				"category": "Dinner"
			}, {
				"name": "Fresh Baked Bread",
				"description": "A whole loaf of the finest bread the Shire has to offer.",
				"price": 6,
				"category": "Dinner"
			}, {
				"name": "Pint of Ale",
				"description": "Yes, it comes in pints.",
				"price": 5,
				"category": "Dinner"
			}, {
				"name": "Sausage Sandwich",
				"description": "Six whole sausages served on a loaf of bread. Covered in onions, mushrooms and gravy.",
				"price": 15.99,
				"category": "Supper"
			},
				{
					"name": "Shire Supper",
					"description": "End the day as you started it, with a dozen flapjacks, 5 eggs, 3 sausages, 7 pieces of bacon, and a pint of ale.",
					"price": 37.99,
					"category": "Supper"
				}]
		},
		{
			"name": "Lembas by Legolas",
			"min_order": 15,
			"delivery_fee": 3.99,
			"menu": [{
				"name": "Single",
				"description": "One piece of lembas.",
				"price": 3,
				"category": "Lembas"
			}, {
				"name": "Double",
				"description": "Two pieces of lembas.",
				"price": 5.5,
				"category": "Lembas"
			}, {
				"name": "Triple",
				"description": "Three pieces, which should be more than enough.",
				"price": 8,
				"category": "Lembas"
			}, {
				"name": "Second Breakfast",
				"description": "Two pieces of lembas with honey.",
				"price": 7.5,
				"category": "Combos"
			}, {
				"name": "There and Back Again",
				"description": "All you need for a long journey - 6 pieces of lembas, salted pork, and a flagon of wine.",
				"price": 25.99,
				"category": "Combos"
			}, {
				"name": "Best Friends Forever",
				"description": "Lembas and a heavy stout.",
				"price": 6.6,
				"category": "Combos"
			}]
		}
	],


	users = [
		{"username": "winnifred", "privacy": false},
		{"username": "lorene", "privacy": false},
		{"username": "cyril", "privacy": false},
		{"username": "vella", "privacy": false},
		{"username": "erich", "privacy": false},
		{"username": "pedro", "privacy": false},
		{"username": "madaline", "privacy": false},
		{"username": "leoma", "privacy": false},
		{"username": "merrill", "privacy": false},
		{"username": "jacquie", "privacy": false},
		{"username": "bobby", "privacy": false}
	];

let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect(config.db.url, function(err, client){
	if(err) throw err;

	db = client.db(config.db.name);

	usersdb = db.collection("users");
	restaurantsdb = db.collection("restaurants");

	Promise.all([
		restaurantsdb.deleteMany({}),
		restaurantsdb.insertMany(restaurants),
		usersdb.deleteMany({}),
		usersdb.insertMany(users)
	]).then(result=>process.exit(0));
});