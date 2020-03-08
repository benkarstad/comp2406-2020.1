const
	express = require("express");

let router = express.Router();

router.use("/", respond);

function respond(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("index", {title: "Welcome to MealMobile"});
		}
	});
	next();
}

module.exports = router;