const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	response.app.locals.db.collections.stats
		.find().toArray((up, result)=>{
			if(up) next(up);
			response.format({
				"text/html": ()=>{
					response.render("stats", {
						orderStats: result,
						loggedIn: response.locals.user !== undefined,
						user: response.locals.user
					});
				},
				"application/json": ()=>{
					response.status(200).json(result);
				}
			});
	})
}
module.exports = router;