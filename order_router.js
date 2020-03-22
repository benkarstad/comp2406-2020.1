const
	express = require("express");
	mongo = require("mongodb");

let router = express.Router();

router.get("/", respondOrderPage);
router.post("/submit", submitOrder);

function respondOrderPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("order", {
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			})
		}
	});
}

function submitOrder(request, response, next){
	let _id = new mongo.ObjectID(request.body._id),
		responseStats = request.body;

	Promise.all([
		response.app.locals.db.collections.stats.findOne({_id}),
		response.app.locals.db.collections.restaurants.findOne({_id})
	]).then((result)=>{
		if(result[1] === null){
			next();
			return;
		}

		let orderTotal = calcTotal(request.body, result[1]);

		if(result[0] === null){
			let statDoc = {
				_id,
				name: result[1].name,
				orderCount: 0,
				totalSum: orderTotal,
				avgOrder: orderTotal.toFixed(2),
				favItem: "None Yet",
				items: {}
			};
			response.app.locals.db.collections.stats.insertOne(statDoc, (up, result)=>{
				if(up) next(up);
			});
		}else{
			result[0].orderCount++;
			result[0].totalSum+=orderTotal;
			result[0].avgOrder = (result[0].totalSum/result[0].orderCount).toFixed(2);
			for(let item in responseStats.items){
				let amount = responseStats.items[item];
				result[0].items[item] === undefined ?
					result[0].items[item] = amount :
					result[0].items[item] += amount;
			} //add each item's count to orderStats;

			result[0].favItem = Object.getOwnPropertyNames(result[0].items)
				.reduce((acc, cur, ind, arr)=>{
					return (result[0].items[cur]>result[0].items[acc] || result[0].items[acc] === undefined) ? cur : acc;
				}, "None Yet");

			response.app.locals.db.collections.stats.findOneAndReplace({_id}, result[0], (up, result)=>{
				if(up) next(up);
			})
		}
		response.status(200).json({orderID: result[0].orderCount});
	});
}

/*
 * Calculates the total of the submitted order
 *
 * Params:
 * Object restaurant: a restaurant object
 * 	Object order: order stats of a restaurant
 * 		{
 *			<item name>: <qty ordered>,
 *			...
 *		}
 * */
function calcTotal(order, restaurant){
	let	items = order.items,
		total = 0;
	for(let itemName in items){ //for all ordered items...
		for(let i in restaurant.menu){ //find it's price and add that to the total
			let itemObj = restaurant.menu[i];
			if(itemObj.name === itemName){
				total += itemObj.price*items[itemName];
				break
			}
		}
	}
	total *= 1.1;
	total += restaurant.delivery_fee;
	return total;
}
module.exports = router;