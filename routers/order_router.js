const
	express = require("express"),
	mongo = require("mongodb"),
	status = require("../scripts/status"),

	router = express.Router();

//verify that user is logged in
router.use((request, response, next)=>{
	if(response.locals.user === undefined){
		return status.send403(request, response, next);
	}
	return next();
});

router.get("/", respondOrderPage);
router.post(
	"/submit",
	submitOrder,
	(request, response, next)=>{
		console.log(response.locals.order);
		response.status(200).json({orderID: response.locals.order._id})
	});

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
	let order = request.body;

	//add other information
	order.restaurantId = new mongo.ObjectID(order.restaurantId);
	order.userId = response.locals.user._id;
	order.date = new Date();

	//add order to database
	response.app.locals.db.collections.orders.insertOne(order, {},
	(err, order)=>{
		response.locals.order = order.ops[0];
		next();
	});

}
module.exports = router;