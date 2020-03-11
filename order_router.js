const
	express = require("express");

let router = express.Router();

router.get("/", respondOrderPage);
router.post("/submit", express.json(), submitOrder);

function respondOrderPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("order", {body: {onload: "init()"}})
		}
	});
	next();
}

function submitOrder(request, response, next){
	let id = request.body.id,
		orderStats = response.app.locals.orderStats;

	if(orderStats[id] === undefined){ //create an object for that restaurant
		orderStats[id] = {
			id: id,
			name: response.app.locals.restaurants[id].name,
			orderCount: 0,
			totalSum: 0,
			avgOrder: 0,
			favItem: "None Yet",
			items: {}
		};
	}
	let stats = orderStats[id]; //stats for this restaurant
	stats.totalSum += calcTotal(request.body, response.app.locals.restaurants[id]);
	stats.orderCount++;
	stats.avgOrder = (stats.totalSum/stats.orderCount).toFixed(2);
	for(let item in request.body.items){
		let amount = request.body.items[item];
		stats.items[item] === undefined ?
			stats.items[item] = amount :
			stats.items[item] += amount;
	} //add each item's count to orderStats;

	//update most purchased item
	stats.favItem = Object.getOwnPropertyNames(stats.items)
		.reduce((acc, cur, ind, arr)=>{
			return (stats.items[cur]>stats.items[acc] || stats.items[acc] === undefined) ? cur : acc;
		}, "None Yet");

	response.status(200).json({orderID: stats.orderCount});
	next();
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