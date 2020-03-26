const
	express = require("express"),

	auth = require("../scripts/auth"),
	status = require("../scripts/status"),

	router = express.Router();

router.get("/",
		   auth.session.unsetToken,
		   (request, response, next)=>{
				response.redirect("/");
		   });

module.exports = router;