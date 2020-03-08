//TODO: order_router.js
const
	express = require("express");

let router = express.Router();

router.get("/", respondOrderPage);
//router.post();

function respondOrderPage(request, response, next){
	response.format({
		"text/html": ()=>{
			response.render("order", {body: {onload: "init()"}})
		}
	});
	next();
}

module.exports = router;