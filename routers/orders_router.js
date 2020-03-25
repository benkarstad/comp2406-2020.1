const
	express = require("express"),
	mongo = require("mongodb"),
	status = require("../scripts/status"),

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

				response.format({
					"text/html": ()=>{
						response.render("orderPage",
							{
								order,
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
