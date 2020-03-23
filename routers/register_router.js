const
	express = require("express");

let router = express.Router();

router.get("/", respond);
//TODO: Implement User Registration
function respond(request, response, next){
	next();
}

module.exports = router;