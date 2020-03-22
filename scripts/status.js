/**
 * @function
 * @param request
 * @param response
 * @param next
 * */
function send404(request, response, next){
	response.status(404);
	response.format({
						"text/html": ()=>{
							response.render("error",
											{
												statusCode: 404,
												message: `Page ${request.url} not found.`
											});
						},
						"text/plain": ()=>{
							response.send(`404: ${request.url} not found`).end();
						},
						"default": ()=>{response.end();}
					})
}

/**
 * @function
 * @param request
 * @param response
 * @param next
 * */
function send401(request, response, next){
	response.status(401).end();
}

/**
 * @function
 * @param request
 * @param response
 * @param next
 * */
function send200(request, response, next){
	response.status(200).end();
}

module.exports = {
	send200,
	send404,
	send401
};