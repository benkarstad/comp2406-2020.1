//TODO: Use better for/forEach conventions.

let restaurants = [];

let currentOrder = {
	items: [],
	amounts: [],
	subtotal: 0,
	export: function(){
		let output = {};
		for(let i = 0; i<this.items.length; i++){
			output[this.items[i].name] = this.amounts[i];
		}
		return output;
	}
};

/**
 * @function
 * requests restaurant name data and populates the dropdown menu to match.
 * sets event listener for #submitButton
 * */
function init(){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		//requests an array of restaurant objects with just the name
		//full restaurant data will be requested once selected
		if(xhttp.readyState === 4 && xhttp.status === 200){
			let restaurants = JSON.parse(xhttp.responseText);
			updateDropdown(restaurants);
			document.getElementById("searchBox").addEventListener(
				"keyup", ()=>filterDropdown(restaurants)
			);
		}
	};
	xhttp.open("GET", "/restaurants", true);
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();

	document.getElementById("submitButton").addEventListener("click", ()=>sendOrder(null));
}

/**
 * @function - Populates the dropdown menu with the names of provided restaurants.
 *
 * @param {Object[]} restaurants - restaurants: all the restaurants to be displayed.
 * */
function updateDropdown(restaurants){
	let dropdown = document.getElementById(
		"searchbar").getElementsByClassName(
		"dropdownContent").item(0);

	clearNode(dropdown);

	for(let index in restaurants){ //populate the dropdown with restaurants
		let restaurant = restaurants[index];
		let newNode = document.createElement("p");
		newNode.innerText = restaurant.name;
		newNode.addEventListener("click", ()=>selectRestaurant(restaurant._id));
		dropdown.appendChild(newNode);
	}
}

/**
 * @function
 * Displays all the categories of the chosen restaurant to the first column.
 * If order data would be lost in changing restaurants, prompts the user for confirmation
 *
 * @param {String} restaurantId: The id of the selected restaurant.
 * */
function selectRestaurant(restaurantId){
	if(currentOrder.items.length !== 0 && //prompts user if data would be lost
		!confirm("Are you sure? You will lose your current order.")){
		return;
	}
	resetPage();

	//request restaurant data from server and display it to the user
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4 && xhttp.status === 200){
			let restaurant = JSON.parse(xhttp.responseText);
			let submitButton = document.getElementById("submitButton"),
				submitBtnClone = submitButton.cloneNode(true);
			submitButton.parentNode.replaceChild(submitBtnClone, submitButton);

			document.getElementById("submitButton").addEventListener("click", ()=>sendOrder(restaurant));

			renderContent(restaurant);
		}
	};
	xhttp.open("GET", `/restaurants/${restaurantId}`, true);
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

/**
 * @function
 * adds all the dishes of the selected category, their descriptions and their prices to the center column
 *
 * @param {String} categoryName: the name of the selected category.
 * @param {Object} restaurant: the restaurant object selected.
 * */
function selectCategory(restaurant, categoryName){
	let items = restaurant.menu.filter((item)=>{return item.category === categoryName;});
	let menuNode = document.getElementById("selection");
	clearNode(menuNode);
	for(let index in items){ //add each dish to the table
		let dish = items[index];
		let dishDiv = document.createElement("div");//the div for the whole entry

		dishDiv.innerHTML =
`<h3>${dish.name}<i class="addButton material-icons">add_circle_outline</i></h3>
<span class="priceTag">\$${dish.price.toFixed(2)}</span>
<p><h5>${dish.description}</h5></p>`;

		dishDiv.getElementsByClassName("addButton")
			.item(0).addEventListener( //make it selectable
			  "click", ()=>addToCart(dish, 1, restaurant)
		);
		menuNode.appendChild(dishDiv);
	}
}

/**
 * @function
 * increments the count of the selected dish by one, adding it to the list if it isn't there,
 * calls the update() function
 *
 * @param {Object} toAdd: the object of the menu item being added to the order.
 * @param {number} amount: the number of that item being added (or removed).
 * @param {Object} restaurant: the restaurant being added to.
 * */
function addToCart(toAdd, amount, restaurant){
	if(amount === 0) return;

	if(!currentOrder.items.includes(toAdd)){ //if its not on the cart, add it to the cart
		currentOrder.items.push(toAdd);
		currentOrder.amounts.push(amount);
	}else{
		let index = currentOrder.items.indexOf(toAdd);
		amount = Math.max(amount, -1*currentOrder.amounts[index]);
		if(currentOrder.amounts[index] + amount === 0){ //remove the item if all are removed
			currentOrder.items.splice(index, 1);
			currentOrder.amounts.splice(index, 1);
		}else currentOrder.amounts[index] += amount; //otherwise change the amount
	}

	currentOrder.subtotal += toAdd.price*amount; //update the subtotal to reflect this

	update(restaurant);
}

/**
 * @function executes order 66
 *
 * @param {Node} node: the HTML node to be cleared.
 * */
function clearNode(node){
	while(node.firstChild) node.removeChild(node.firstChild);
}

/**
 * @function
 * manually resets all html and js state to when the page was loaded
 * */
function resetPage(){

	clearNode(document.getElementById("restaurantName"));
	clearNode(document.getElementById("restaurantInfo"));
	clearNode(document.getElementById("categories"));
	clearNode(document.getElementById("selection"));
	clearNode(document.getElementById("order"));

	document.getElementById("subtotal").getElementsByClassName("priceTag")[0].innerText = "$0.00";
	document.getElementById("taxes").getElementsByClassName("priceTag")[0].innerText = "$0.00";
	document.getElementById("deliveryFee").getElementsByClassName("priceTag")[0].innerText = "$0.00";
	document.getElementById("total").getElementsByClassName("priceTag")[0].innerText = "$0.00";
	document.getElementById("submitButton").classList.remove("nsf");
	document.getElementById("submitButton").classList.add("noneSelected");
	document.getElementById("submitButton").innerText = "Please Select a Restaurant";

	currentOrder.items = [];
	currentOrder.amounts = [];
	currentOrder.subtotal = 0;
}

/**
 * @function
 * loads the restaurant content onto the main page
 *
 * @param {Object} restaurant: the restaurant object to be rendered.
 * */
function renderContent(restaurant){
	let categoriesNode = document.getElementById("categories");
	clearNode(categoriesNode);

	//get all categories from restaurant Object
	let categories = restaurant.menu.reduce((acc, curr)=>{
		if(acc.includes(curr.category)) return acc;
		acc.push(curr.category);
		return acc;
	}, []);

	//add each category to the table
	for(let index in categories){
		let categoryName = categories[index];
		let categoryP = document.createElement("p");
		categoryP.innerHTML = `<h2>${categoryName}</h2>`;
		categoryP.addEventListener("click", ()=>selectCategory(restaurant, categoryName));
		categoriesNode.appendChild(categoryP);
	}

	document.getElementById("restaurantName").innerText = restaurant.name;
	document.getElementById("restaurantInfo").innerHTML =
		`<h5>Minimum Order: \$${restaurant.min_order}<br/>` +
		`Delivery Charge: \$${restaurant.delivery_fee}</h5>`;

	update(restaurant);
}

/**
 * @function
 * updates the UI to display information about a new restaurant
 *
 * @param {Object} restaurant: the restaurant object to be rendered.
 * */
function update(restaurant){
	//update #orderSummary
	let subtotal = currentOrder.subtotal.toFixed(2);
	let taxes = (0.1*subtotal).toFixed(2);
	let deliveryFee = restaurant.delivery_fee.toFixed(2);
	let total = parseFloat(parseFloat(subtotal) + parseFloat(taxes) + parseFloat(deliveryFee)).toFixed(2);

	document.getElementById("subtotal").getElementsByClassName("priceTag")[0].innerText = `\$${subtotal}`;
	document.getElementById("taxes").getElementsByClassName("priceTag")[0].innerText = `\$${taxes}`;
	document.getElementById("deliveryFee").getElementsByClassName("priceTag")[0].innerText = `\$${deliveryFee}`;
	document.getElementById("total").getElementsByClassName("priceTag")[0].innerText = `\$${total}`;

	document.getElementById("submitButton").classList.remove("noneSelected");
	if(subtotal>=restaurant.min_order){
		document.getElementById("submitButton").classList.remove("nsf");
		document.getElementById("submitButton").innerText = "Order Now!";
	}else{
		document.getElementById("submitButton").classList.add("nsf");
		document.getElementById("submitButton").innerHTML = `You are \$${parseFloat(restaurant.min_order - subtotal).toFixed(2)} short ;~;</br>Please Order More`;
	}

	//update #order
	let orderNode = document.getElementById("order");
	clearNode(orderNode);
	currentOrder.items.forEach((item, index)=>{ //add all ordered items to #order
		let newNode = document.createElement("div");
		let itemCount = currentOrder.amounts[index];
		newNode.innerHTML =
`${itemCount}x<h4>${item.name}</h4>
<span class="priceTag">\$${parseFloat(itemCount*item.price).toFixed(2)}</span>
<i class="removeButton material-icons">remove_circle_outline</i>`;
		newNode.getElementsByClassName("removeButton")
			.item(0).addEventListener("click", ()=>{
				addToCart(item, -1, restaurant);
			});

		orderNode.appendChild(newNode);
	});
}

/**
 * @function
 * updates listed restaurants, filtered based on #searchBox query (not cASE-sEnSitIVe)
 *
 * @param {Object[]} restaurants: the names of all the restaurants to filter.
 * */
function filterDropdown(restaurants){
	let queryString = document.getElementById("searchBox").value;
	let matchedRestaurants = [];
	for(let restaurant in restaurants){
		restaurant = restaurants[restaurant].name;
		if(restaurant.toUpperCase().includes(queryString.toUpperCase())){
			matchedRestaurants.push({"name": restaurant});
		}
	}
	updateDropdown(matchedRestaurants);
}

/**
 * logic for clicking the submit button
 *
 * @param {Object} restaurant: the restaurant being ordered from.
 * */
function sendOrder(restaurant){
	if(restaurant === null){
		alert("No Restaurant Selected");
	}else if(currentOrder.subtotal>=restaurant.min_order){ //submit the order
		let subtotal = currentOrder.subtotal.toFixed(2);
		let taxes = (0.1*subtotal).toFixed(2);
		let deliveryFee = restaurant.delivery_fee.toFixed(2);
		let total = parseFloat(parseFloat(subtotal) + parseFloat(taxes) + parseFloat(deliveryFee)).toFixed(2);

		let items = currentOrder.export();
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = ()=>{
			if(xhttp.readyState === 4){
				let status = xhttp.status;
				if(status === 200){
					let responseObj = JSON.parse(xhttp.responseText);
					alert(`Order Submitted\nOrder ID: ${responseObj.orderID}`);
					resetPage();
				}
				else if(status === 403){
					alert(xhttp.responseText);
				}
				else if(status === 500){
					alert("Internal Server Error\nPlease Try Again");
				}
				else{
					alert("Something went Wrong\nPlease Try Again Later");
				}
			}
		};
		xhttp.open("POST", `/order/submit`, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({
			restaurantId: restaurant._id,
		  	items: items
		}));
	}else{
		alert(`Please order at least \$${restaurant.min_order} to submit`);
	}
}