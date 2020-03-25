const
	express = require("express"),
	mongo = require("mongodb"),
	status = require("../scripts/status"),
	utils = require("../scripts/utils"),

	router = express.Router();

router.get("/:_id", respondOrder);

function respondOrder(request, response, next){
	const _id = new mongo.ObjectID(request.params._id);

	response.app.locals.db.collections.orders.findOne({_id})
		.then((order)=>{
			const
				restaurantId = order.restaurantId,
				userId = order.userId;

			let promise = Promise.all([
				  response.app.locals.db.collections.users.findOne({_id: userId}),
				  response.app.locals.db.collections.restaurants.findOne({_id: restaurantId})
			  ]);

			promise.then((result)=>{
				const
					orderUser = result[0],
					orderRestaurant = result[1];

				//check that private user's orders are not shown to others
				if(orderUser.privacy === true &&
					(response.locals.user === undefined || !response.locals.user._id.equals(orderUser._id)))
					return status.send404(request, response, next);

				let subtotal = utils.calcSubtotal(order.items, orderRestaurant),
					tax = 0.1*subtotal,
					delivery_fee = orderRestaurant.delivery_fee,
					total = subtotal+tax+delivery_fee;

				let orderSummary = {
						subtotal: subtotal.toFixed(2),
						tax: tax.toFixed(2),
						delivery_fee: delivery_fee.toFixed(2),
						total: total.toFixed(2)
				};

				response.format({
					"text/html": ()=>{
						response.render("orderPage",
							{
								order,
								orderSummary,
								orderUser,
								orderRestaurant,
								loggedIn: response.locals.user !== undefined,
								user: response.locals.user
							})
					}
				});
			})
		})
}

module.exports = router;
