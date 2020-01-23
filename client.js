let aragorn = {
	name: "Aragorn's Orc BBQ", //The name of the restaurant
	min_order: 20, //The minimum order amount required to place an order
	delivery_charge: 5, //The delivery charge for this restaurant
	//The menu
	menu: {
		//First category
		"Appetizers": {
			//First item of this category
			0: {
				name: "Orc feet",
				description: "Seasoned and grilled over an open flame.", //
				price: 5.50
			},
			1: {
				name: "Pickled Orc fingers",
				description: "Served with warm bread, 5 per order.",
				price: 4.00
			},
			2: { //Thank you Kiratchii
				name: "Sauron's Lava Soup",
				description: "It's just really spicy water.",
				price: 7.50
			},
			3: {
				name: "Eowyn's (In)Famous Stew",
				description: "Bet you can't eat it all.",
				price: 0.50
			},
			4: {
				name: "The 9 rings of men.",
				description: "The finest of onion rings served with 9 different dipping sauces.",
				price: 14.50
			}
		},
		"Combos": {
			5: {
				name: "Buying the Farm",
				description: "An arm and a leg, a side of cheek meat, and a buttered biscuit.",
				price: 15.99
			},
			6: {
				name: "The Black Gate Box",
				description: "Lots of unidentified pieces. Serves 50.",
				price: 65.00
			},
			7: {//Thanks to M_Sabeyon
				name: "Mount Doom Roast Special with Side of Precious Onion Rings.",
				description: "Smeagol's favorite.",
				price: 15.75
			},
			8: { //Thanks Shar[TA]
				name: "Morgoth's Scorched Burgers with Chips",
				description: "Blackened beyond recognition.",
				price: 13.33
				
			},
			10: {
				name: "Slab of Lurtz Meat with Greens.",
				description: "Get it while supplies last.",
				price: 17.50
			},
			11: {
				name: "Rangers Field Feast.",
				description: "Is it chicken? Is it rabbit? Or...",
				price: 5.99
			}
		},
		"Drinks": {
			12: {
				name: "Orc's Blood Mead",
				description: "It's actually raspberries - Orc's blood would be gross.",
				price: 5.99
			},
			13: {
				name: "Gondorian Grenache",
				description: "A fine rose wine.",
				price: 7.99
			},
			14: {
				name: "Mordor Mourvedre",
				description: "A less-fine rose wine.",
				price: 5.99
			}
		}	
	}
};

let legolas = {
	name: "Lembas by Legolas",
	min_order: 15,
	delivery_charge: 3.99,
	menu: {
		"Lembas": {
			0: {
				name: "Single",
				description: "One piece of lembas.",
				price: 3
			},
			1: {
				name: "Double",
				description: "Two pieces of lembas.",
				price: 5.50
			},
			2: { 
				name: "Triple",
				description: "Three pieces, which should be more than enough.",
				price: 8.00
			}
		},
		"Combos": {
			3: {
				name: "Second Breakfast",
				description: "Two pieces of lembas with honey.",
				price: 7.50
			},
			4: {
				name: "There and Back Again",
				description: "All you need for a long journey - 6 pieces of lembas, salted pork, and a flagon of wine.",
				price: 25.99
			},
			5: {
				name: "Best Friends Forever",
				description: "Lembas and a heavy stout.",
				price: 6.60
			}
		}
	}
};

let frodo = {
	name: "Frodo's Flapjacks",
	min_order: 35,
	delivery_charge: 6,
	menu: {
		"Breakfast": {
			0: {
				name: "Hobbit Hash",
				description: "Five flapjacks, potatoes, leeks, garlic, cheese.",
				price: 9.00
			},
			1: {
				name: "The Full Flapjack Breakfast",
				description: "Eight flapjacks, two sausages, 3 eggs, 4 slices of bacon, beans, and a coffee.",
				price: 14.00
			},
			2: { 
				name: "Southfarthing Slammer",
				description: "15 flapjacks and 2 pints of syrup.",
				price: 12.00
			}
			
		},
		"Second Breakfast": {
			3: {
				name: "Beorning Breakfast",
				description: "6 flapjacks smothers in honey.",
				price: 7.50
			},
			4: {
				name: "Shire Strawberry Special",
				description: "6 flapjacks and a hearty serving of strawberry jam.",
				price: 8
			},
			5: {
				name: "Buckland Blackberry Breakfast",
				description: "6 flapjacks covered in fresh blackberries. Served with a large side of sausage.",
				price: 14.99
			}
		},
		"Elevenses": {
			6: {
				name: "Lembas",
				description: "Three pieces of traditional Elvish Waybread",
				price: 7.70
			},
			7: {
				name: "Muffins of the Marish",
				description: "A variety of 8 different types of muffins, served with tea.",
				price: 9.00
			},
			8: {
				name: "Hasty Hobbit Hash",
				description: "Potatoes with onions and cheese. Served with coffee.",
				price: 5.00
			}
		},
		"Luncheon": {
			9: {
				name: "Shepherd's Pie",
				description: "A classic. Includes 3 pies.",
				price: 15.99
			},
			10: {
				name: "Roast Pork",
				description: "An entire pig slow-roasted over a fire.",
				price: 27.99
			},
			11: {
				name: "Fish and Chips",
				description: "Fish - fried. Chips - nice and crispy.",
				price: 5.99
			}
		},
		"Afternoon Tea": {
			12: {
				name: "Tea",
				description: "Served with sugar and cream.",
				price: 3
			},
			13: {
				name: "Coffee",
				description: "Served with sugar and cream.",
				price: 3.50
			},
			14: {
				name: "Cookies and Cream",
				description: "A dozen cookies served with a vat of cream.",
				price: 15.99
			},
			15: {
				name: "Mixed Berry Pie",
				description: "Fresh baked daily.",
				price: 7.00
			}
		},
		"Dinner": {
			16: {
				name: "Po-ta-to Platter",
				description: "Boiled. Mashed. Stuck in a stew.",
				price: 6
			},
			17: {
				name: "Bree and Apple",
				description: "One wheel of brie with slices of apple.",
				price: 7.99
			},
			18: {
				name: "Maggot's Mushroom Mashup",
				description: "It sounds disgusting, but its pretty good",
				price: 6.50
			},
			19: {
				name: "Fresh Baked Bread",
				description: "A whole loaf of the finest bread the Shire has to offer.",
				price: 6
			},
			20: {
				name: "Pint of Ale",
				description: "Yes, it comes in pints.",
				price: 5
			}
		},
		"Supper": {
			21: {
				name: "Sausage Sandwich",
				description: "Six whole sausages served on a loaf of bread. Covered in onions, mushrooms and gravy.",
				price: 15.99
			},
			22: {
				name: "Shire Supper",
				description: "End the day as you started it, with a dozen flapjacks, 5 eggs, 3 sausages, 7 pieces of bacon, and a pint of ale.",
				price: 37.99
			}
		}
	}
};

let restaurants = [aragorn, legolas, frodo];

let currentRestaurantObj = null;
let currentCategoryObj = null;
let currentOrder = {
	items: [],
	amounts: []
};

function init(){
	//load restaurants into searchbar
	let dropdown = document.getElementById(
		"searchbar").getElementsByClassName(
			"dropdownContent").item(0);
	
	restaurants.forEach((restaurant) => {
		let newNode = document.createElement("p");
		newNode.innerText = restaurant.name;
		newNode.addEventListener("click", ()=>{
			selectRestaurant(restaurant)
		});
		dropdown.appendChild(newNode);
	});
}
/*
* Displays all the categories of the chosen restaurant to the first column.
* If order data would be lost in changing restaurants, prompts the user for confirmation
* */
function selectRestaurant(restaurant){//TODO: display name, delivery-fee and min-order;
	if(currentOrder.items.length !== 0 &&
		(currentRestaurantObj === restaurant ||
		!confirm("Are you sure? You will lose your current order."))) {
		return;
	}
	resetPage();
	//loads the restaurant (i.e. restaurants[index]) onto the main page
	currentRestaurantObj = restaurant;
	let categoriesNode = document.getElementById("categories");
	clearNode(categoriesNode);
	Object.keys(restaurant.menu).forEach((categoryName)=>{ //add each category to the table
		let categoryP = document.createElement("p");
		categoryP.innerHTML = "<h2>"+categoryName+"</h2>";
		categoryP.addEventListener("click",()=>{ //make it selectable
			selectCategory(categoryName);
		});
		categoriesNode.appendChild(categoryP)
	});

	document.getElementById("restaurantName").innerText = restaurant.name
	document.getElementById("restaurantInfo").innerHTML =
		"<h5>Minimum Order: $" + restaurant.min_order+
		"<br/>Delivery Charge: $" + restaurant.delivery_charge + "</h5>";
}

/*
* adds all the dishes of the selected category, their descriptions and their prices to the center column
* */
function selectCategory(category){
	currentCategoryObj = currentRestaurantObj.menu[category];
	let menuNode = document.getElementById("selection");
	clearNode(menuNode);
	Object.keys(currentCategoryObj).forEach((dish)=>{ //add each dish to the table
		dish = currentCategoryObj[dish];
		let dishDiv = document.createElement("div");//the div for the whole entry
		dishDiv.appendChild(document.createElement("h3")); //item name
		dishDiv.lastChild.innerHTML = dish.name+"<span class='addButton'>&#43;</span>"; //TODO: replace span with image icon
		dishDiv.appendChild(document.createElement("span")); //item price
		dishDiv.lastChild.innerText = "$"+dish.price;
		dishDiv.lastChild.classList.add("priceTag");
		dishDiv.appendChild(document.createElement("p")); //item description
		dishDiv.lastChild.innerHTML = "<h5>"+dish.description+"</h5>";
		dishDiv.getElementsByClassName("addButton").item(0)
			.addEventListener("click",()=>{ //make it selectable
				addToCart(dish);
		});
		menuNode.appendChild(dishDiv)
	});
}

/*
* increments the count of the selected dish by one, adding it to the list if it isn't there,
* calls the updateOrder() function
* */
function addToCart(toAdd){
	if(currentOrder.items.includes(toAdd)) currentOrder.amounts[currentOrder.items.indexOf(toAdd)]++;
	else{
		currentOrder.items.push(toAdd);
		currentOrder.amounts.push(1);
	}
	updateOrder();
}

/*
* removes all children from the selected node
* */
function clearNode(node){
	while(node.firstChild) node.removeChild(node.firstChild);
}

/*
* resets all html and js state to when the page was loaded
* */
function resetPage() {
	clearNode(document.getElementById("categories"));
	clearNode(document.getElementById("selection"));
	clearNode(document.getElementById("summary"));

	currentRestaurantObj = null;
	currentCategoryObj = null;
	currentOrder.items = [];
	currentOrder.amounts = [];
}

/*
* displays a representation of the ordered items to the user
* */
function updateOrder(){
	let orderNode = document.getElementById("summary");
	clearNode(orderNode);
	currentOrder.items.forEach((item, index)=>{
		let newNode = document.createElement("div");
		let itemCount = currentOrder.amounts[index];
		newNode.innerHTML =
			itemCount + "x<h4>"+item.name+"</h4>";
		newNode.appendChild(document.createElement("span"));
		newNode.lastChild.innerText = "$"+itemCount*item.price;
		newNode.lastChild.classList.add("priceTag");
		//TODO: add button to remove order items
		orderNode.appendChild(newNode);
	});
}