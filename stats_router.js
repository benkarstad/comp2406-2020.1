const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	response.format({
		"text/html": function(){
			response.render(
				"stats",
				{
					title: "Order Statistics",
					orderStats: Object.values(response.locals.orderStats)
				});
		},
		"application/json": function(){
			response.json(JSON.stringify(response.locals.orderStats));
		}
	});

	next();
}
module.exports = router;