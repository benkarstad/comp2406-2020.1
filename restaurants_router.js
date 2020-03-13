const
	express = require("express");

let router = express.Router();

router.use(express.json()); //parse request json (if any)

router.get(["/:id", "/:id*"], getRestaurant); //retrieve and parse the data for the id'ed restaurant
router.get("/:id/categories", respondCategories); //serve a more specific part of restaurants/:id
router.get("/:id/edit", respondEdit);
router.get("/:id", respondRestaurant); //serve the data for the id'ed restaurant

router.put("/:id", updateRestaurant); //update restaurant/:id with new data

router.get("/", respondNames); //serve list of restaurant names
router.post("/", addRestaurant); //add the provided restaurant to the server

function getRestaurant(request, response, next){
	let idParam = parseInt(request.params.id);
		response.locals.restaurantData = response.app.locals.restaurants[idParam];
		if(response.locals.restaurantData === undefined) send404(request, response, next);
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

function respondCategories(request, response, next){
	response.status(200).json(getCategories(response.locals.restaurantData.menu));
}

function respondEdit(request, response, next){
	response.render("editRestaurant", {
		title: `Edit ${response.locals.restaurantData.name}`,
		id: response.locals.restaurantData.id
	});
}

function getCategories(menuArray){
	return menuArray.reduce((catArray, item, index)=>{
			if(catArray.includes(item.category) === false)
				catArray.push(item.category);
			return catArray;
	}, [])
}

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

module.exports = router;