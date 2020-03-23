const
	express = require("express");

let router = express.Router();

router.use(/^\/$/, sendForm);

/*
 * Sends the form for adding a new restaurant to the site.
 * */
function sendForm(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("addrestaurant", {
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			})
		}
	})
}

module.exports = router;