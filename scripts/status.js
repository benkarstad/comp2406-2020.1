/**
 * @function
 * @param request
 * @param response
 * @param next
 * */
function send400(request, response, next){
	const
		status = 400,
		message = `${status}: Bad Request`;

	response.status(status);
	response.format({
		"text/html": ()=>{
			response.render("error", {
				statusCode: status,
				message,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"text/plain": ()=>{
			response.send(message).end();
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
function send400(request, response, next){
	const
		status = 400,
		message = "Bad Request";
	response.status(status);
	response.format({
		"text/html": ()=>{
			response.render("error", {
				statusCode: status,
				message,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"text/plain": ()=>{
			response.send(message).end();
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
	const
		status = 401,
		message = "Unauthorized";
	response.status(status);
	response.format({
		"text/html": ()=>{
			response.render("error", {
				statusCode: status,
				message,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"text/plain": ()=>{
			response.send(message).end();
		},
		"default": ()=>{response.end();}
	})
}

function send403(request, response, next){
	const
		status = 403,
		message = "Access Forbidden";
	response.status(status);
	response.format({
		"text/html": ()=>{
			response.render("error", {
				statusCode: status,
				message,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"text/plain": ()=>{
			response.send(message).end();
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
function send404(request, response, next){
	response.status(404);
	response.format({
		"text/html": ()=>{
			response.render("error", {
				statusCode: 404,
				message: `Page ${request.url} not found.`,
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
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
function send200(request, response, next){
	response.status(200).end();
}

module.exports = {
	send200,
	send401,
	send403,
	send404
};