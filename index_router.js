const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("index");
		}
	});
}

module.exports = router;