const
	express = require("express"),
	router = express.Router();

router.get("/",
		   calculateStats,
		   respond);

/**
 * @function
 * aggregates all the orders for each restaurant and puts them in:
 * 		app.locals.stats:
 * 			[
 * 				{
 * 				 	name,
 * 				 	favItem,
 * 				 	orderCount,
 * 				 	avgOrder
 * 				},
 * 				...
 * 			]
 * */
function calculateStats(request, response, next){
	let promise = Promise.all([
		response.app.locals.db.collections.restaurants.find({}).toArray(),
		response.app.locals.db.collections.orders.find({}).toArray()]);

	//once all restaurants and orders have been retrieved, aggregate the data
	promise.then((result)=>{
		let allRestaurants = result[0],
			allOrders = result[1];

			response.locals.orderStats = [];

		for(let i in allRestaurants){
			let restaurant = allRestaurants[i];

			//select only this restaurant's orders
			let orders = allOrders.filter(order=>order.restaurantId.equals(restaurant._id));

				//combine all orders' item counts into one Object[]
			let items = orders.reduce((acc, curr)=>{
						for(let name in curr.items){
							let qty = curr.items[name];
							if(acc[name] === undefined) acc[name] = qty;
							else acc[name] += qty;
						}
						return acc;
					}, {});

			let favItem = Object.getOwnPropertyNames(items)
					.reduce((acc, cur)=>{ //select the item with the most orders
						return (items[cur]>items[acc] || items[acc] === undefined) ? cur : acc;
					}, "None Yet");

			let orderCount = orders.length,
				orderTotal = calcTotal(items, restaurant, orderCount),
				avgTotal = (orderTotal/orderCount).toFixed(2),
				stats = {
					name: restaurant.name,
					favItem,
					orderCount,
					total: orderTotal,
					avgTotal
				};

			console.log(items);
			response.locals.orderStats.push(stats);
		}
		console.log(response.locals.orderStats);
		return next();
	});
}

function respond(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("stats", {
				orderStats: response.locals.orderStats,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"application/json": ()=>{
			response.status(200).json(response.locals.orderStats);
		}
	});
}

/**
 * @function Calculates the total of the submitted order(s)
 * @param {Object} items - order stats of a restaurant
 * 		{
 *			<item name>: <qty ordered>,
 *			...
 *		}
 * @param {Object} restaurant - a restaurant object
 * @param {number} orderCount - number of orders (to multiply the delivery fee)
 *
 * */
function calcTotal(items, restaurant, orderCount){
	let	total = 0;
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
	total += restaurant.delivery_fee*orderCount;
	return total;
}

module.exports = router;