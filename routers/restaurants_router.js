const
	express = require("express"),
	mongo = require("mongodb"),

	status = require("../scripts/status"),

	router = express.Router();

router.get(["/:id", "/:id*"], getRestaurant); //retrieve and parse the data for the id'ed restaurant
router.get("/:id/categories", respondCategories); //serve a more specific part of restaurants/:id
router.get("/:id/edit", respondEdit);
router.get("/:id", respondRestaurant); //serve the data for the id'ed restaurant

router.put("/:id", updateRestaurant); //update restaurant/:id with new data

router.get("/", respondNames); //serve list of restaurant names
router.post("/", addRestaurant); //add the provided restaurant to the server

function getRestaurant(request, response, next){
	let idParam;
	try{
		idParam = new mongo.ObjectID(request.params.id);
	}catch(err){
		return status.send404(request, response, next);
	}
	response.app.locals.db.collections.restaurants.findOne({_id: idParam}, (err, result)=>{
		if(err){
			next(err);
		}else{
			if(result === null) status.send404(request, response, next);
			response.locals.restaurantData = result;
			next();
		}
	});
}

function addRestaurant(request, response, next){
	if( request.body.name === undefined || //sends 400 error if information is missing
		request.body.min_order === undefined ||
		request.body.delivery_fee === undefined)
	{
		response.status(400).end();
		return
	}

	let newRestaurant = {
		name: request.body.name,
		min_order: request.body.min_order,
		delivery_fee: request.body.delivery_fee,
		menu: []
	};
	response.app.locals.db.collections.restaurants.insertOne(newRestaurant, (err, result)=>{
		if(err){
			next(err);
		}else{
			response.status(200).json(result.ops[0]);
		}
	});
}

function updateRestaurant(request, response, next){
	let _id;
	try{
		_id = new mongo.ObjectID(request.params.id);
	}catch(err){
		return status.send404(request, response, next);
	}
	delete request.body._id;
	response.app.locals.db.collections.restaurants.findOneAndReplace({_id}, request.body, (err, result)=>{
		if(err){
			next(err);
		}else response.status(200).end();
	});
}

function respondRestaurant(requent, response, next){
	response.format({
		"text/html": ()=>{
			response.render("restaurant", {
				restaurant: {
					_id: response.locals.restaurantData._id,
					name: response.locals.restaurantData.name,
					min_order: response.locals.restaurantData.min_order,
					delivery_fee: response.locals.restaurantData.delivery_fee
				},
				menu: response.locals.restaurantData.menu.reduce((menuObj, item)=>{
					menuObj[item.category] === undefined ?
						menuObj[item.category] = [item] :
						menuObj[item.category].push(item);
					return menuObj;
				}, {}),
				loggedIn: response.locals.user !== undefined,
				user: response.locals.user
			});
		},
		"application/json": ()=>{
			response.status(200).json(response.locals.restaurantData);
		}
	});
}

function respondNames(request, response, next){
	response.app.locals.db.collections.restaurants
		.find({}, {projection: {_id: 1, name: 1}}).toArray((err, result)=>{
		if(err){
			next(err);
		}else{
			response.format({
				"text/html": ()=>{
					response.render("restaurantNames", {
						restaurantNames: result,
						loggedIn: response.locals.user !== undefined,
						user: response.locals.user
					});
				},
				"application/json": ()=>{
					response.status(200).json(result);
				}
			});
		}
	})
}

function respondCategories(request, response, next){
	response.status(200).json(getCategories(response.locals.restaurantData.menu));
}

function respondEdit(request, response, next){
	response.render("editRestaurant", {
		title: `Edit ${response.locals.restaurantData.name}`,
		_id: response.locals.restaurantData._id,
		loggedIn: response.locals.user !== undefined,
		user: response.locals.user
	});
}

function getCategories(menuArray){
	return menuArray.reduce((catArray, item)=>{
			if(catArray.includes(item.category) === false)
				catArray.push(item.category);
			return catArray;
	}, [])
}

module.exports = router;