const
	express = require("express");

let router = express.Router();

router.get("/", respondOrderPage);
router.post("/submit", express.json(), submitOrder); //TODO: receive order information

function respondOrderPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("order", {body: {onload: "init()"}})
		}
	});
	next();
}

function submitOrder(request, response, next){//TODO: Fix submitOrder();
	console.log(request.body);//TEMP
	let id = request.body.id,
		orderStats = response.app.locals.orderStats;
	if(orderStats[id] === undefined){
		orderStats[id] = {
			id: id,
			orderCount: 0,
			totalSum: 0,
			avgOrder: 0,
			favItem: "None Yet",
			itemsOrdered: {}
		};
		let stats = orderStats[id];
		stats.totalSum += calcTotal(response.app.locals.restaurants[id], request.body.order);
		stats.orderCount++;
		stats.avgOrder = (stats.totalSum/stats.orderCount).toFixed(2);
		for(let index in request.body.order){
			let item = request.body.order[index];
			stats.itemsOrdered[item.item] === undefined ?
				stats.itemsOrdered[item.item] = item.amount :
				stats.itemsOrdered[item.item] += item.amount;
		} //add each item's count to orderStats;

		console.log(stats);//TEMP

		//update most purchased item
		stats.favItem = Object.getOwnPropertyNames(stats.itemsOrdered)
			.reduce((acc, cur, ind, arr)=>{
				return stats.itemsOrdered[cur]>stats.itemsOrdered[acc] ? curr : acc;
			});

		console.log(orderStats);//TEMP
		response.status(200).end();
		next();
	}
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
function calcTotal(restaurant, order){
	let total = 0;
	for(let itemName in order){
		for(let menuIndex in restaurant.menu){
			let menuItem = restaurant.menu[menuIndex];
			if(menuItem.name === itemName){
				total += menuItem.price;
				console.log(`\t${menuItem.price}`);//TEMP
				break
			}
		}
	}
	console.log(`-----------\n${total}`);//TEMP
}
module.exports = router;