const
	express = require("express");

let router = express.Router();

router.use(express.json()); //parse request json (if any)

router.get(/^\/$/, respondNames); //serve list of restaurant names
router.post(/^\/$/, addRestaurant); //add the provided restaurant to the server

router.get("/:id",
		   getRestaurant, //retrieve and parse the data for the id'ed restaurant
		   respondRestaurant); //serve the data for the id'ed restaurant
router.put("/:id", updateRestaurant);

function getRestaurant(request, response, next){
	let idParam = parseInt(request.params.id);
		response.locals.restaurantData = response.app.locals.restaurants[idParam];
	next();
}

function addRestaurant(request, response, next){
	if( request.body.name === undefined || //sends 400 error if information is missing
		request.body.min_order === undefined ||
		request.body.delivery_fee === undefined)
	{
		response.status(400).end();
		return
	}
	let newId = ++response.app.locals.maxRestaurantId;
	response.app.locals.restaurants[newId] = {
		id: newId,
		name: request.body.name,
		min_order: request.body.min_order,
		delivery_fee: request.body.delivery_fee,
		menu: []
	};
	response.status(200).json(response.app.locals.restaurants[newId]);
}

function updateRestaurant(request, response, next){
	let id = request.params.id;
	if(response.app.locals.restaurants[id] === undefined){
		response.status(404).send(`Restaurant ID:${id} does not exist.`);
	}
	request.body.id = id;
	response.app.locals.restaurants[id] = request.body;

	response.status(200).end();
}

function respondRestaurant(requent, response, next){
	response.format({
		"text/html": ()=>{
			response.render(
				"restaurant",
				{
					restaurant: {
						id: response.locals.restaurantData.id,
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
}

module.exports = router;