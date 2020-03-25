const
	express = require("express"),
	util = require("../scripts/utils"),
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
				orderTotal = util.calcTotal(items, restaurant, orderCount),
				avgTotal = (orderTotal/orderCount).toFixed(2),
				stats = {
					name: restaurant.name,
					favItem,
					orderCount,
					total: orderTotal,
					avgTotal
				};

			response.locals.orderStats.push(stats);
		}
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

module.exports = router;