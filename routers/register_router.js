const
	express = require("express"),
	
    router = express.Router();

router.get("/", respondPage);

function respondPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("register",
				{
					loggedIn: response.locals.user !== undefined,
					user: response.locals.user
				})
		}
	});
}
module.exports = router;