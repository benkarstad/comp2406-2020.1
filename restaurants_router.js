const
	express = require("express");

let router = express.Router();

router.get(/^\/$/, respondNames); //serve list of restaurant names

router.get("/:id",
		   getRestaurant, //retrieve and parse the data for the id'ed restaurant
		   respondRestaurant); //serve the data for the id'ed restaurant

function getRestaurant(request, response, next){
	let idParam = parseInt(request.params.id);
		response.locals.restaurantData = response.app.locals.restaurants[idParam];
	next();
}

function respondRestaurant(requent, response, next){
	response.format({
		"text/html": ()=>{
			response.render(
				"restaurant",
				{
					restaurant: {
						name: response.locals.restaurantData.name,
						min_order: response.locals.restaurantData.min_order,
						delivery_fee: response.locals.restaurantData.delivery_fee
					},
					menu: response.locals.restaurantData.menu.reduce((menuObj, item, index)=>{
						menuObj[item.category] === undefined ?
							menuObj[item.category] = [item] :
							menuObj[item.category].push(item);
						return menuObj;
					}, {})
				});
		},
		"application/json": ()=>{
			response.status(200).json(response.locals.restaurantData);
		}
	});
	next();
}

function respondNames(request, response, next){
	let names = {restaurants: []};
	for(let key in response.app.locals.restaurants){

		names.restaurants.push({
		  	id: response.app.locals.restaurants[key].id,
			name: response.app.locals.restaurants[key].name
		});
	}
	response.format({
		"text/html": ()=>{
			response.render(
				"restaurantNames",
				{restaurantNames: names.restaurants});
		},
		"application/json": ()=>{
			response.status(200).json(names);
		}
	});
	next();
}

module.exports = router;