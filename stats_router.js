const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render(
				"stats",
				{
					orderStats: Object.values(response.app.locals.orderStats)
				});
		},
		"application/json": ()=>{
			response.json(JSON.stringify(response.app.locals.orderStats));
		}
	});

	next();
}
module.exports = router;