const
	express = require("express");

let router = express.Router();

router.get(/^\/$/, respondNames); //serve list of restaurant names

router.get("/:id",
		   getRestaurant, //retrieve and parse the data for the id'ed restaurant
		   respondRestaurant); //serve the data for the id'ed restaurant

function getRestaurant(request, response, next){
	let idParam = parseInt(request.params.id);
	for(index in response.app.locals.restaurants){
		if(response.app.locals.restaurants[index].id === idParam){
			response.locals.restaurantData = response.app.locals.restaurants[index];
			break
		}
	}
	next();
}

function respondRestaurant(requent, response, next){
	response.format({
		"text/html": ()=>{
			response.render(
				"restaurantData",
				{restaurantData: response.locals.restaurantData});
		},
		"application/json": ()=>{
			response.status(200).json(response.locals.restaurantData);
		}
	});
	next();
}

function respondNames(request, response, next){
	let names = [];
	for(let key in response.app.locals.restaurants){

		names.push({
		  	id: response.app.locals.restaurants[key].id,
			name: response.app.locals.restaurants[key].name
		});
	}
	response.format({
		"text/html": ()=>{
			response.render(
				"restaurantNames",
				{restaurantNames: names});
		},
		"application/json": ()=>{
			response.status(200).json(names);
		}
	});
	next();
}

module.exports = router;