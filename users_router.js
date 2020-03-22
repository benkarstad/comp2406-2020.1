const
	express = require("express");

let router = express.Router();

router.get("/", respond);

function respond(request, response, next){
	next();
}

module.exports = router;