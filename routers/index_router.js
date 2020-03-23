const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("index", {
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		}
	});
}

module.exports = router;