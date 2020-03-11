//TODO: Use better for/forEach conventions.

const addImg = "images/add.png";
const removeImg = "images/remove.png";

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

/*
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

/*
 * Populates the dropdown menu with the names of provided restaurants.
 *
 * Params:
 *   Object[] restaurants: all the restaurants to be displayed.
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
		newNode.addEventListener("click", ()=>selectRestaurant(restaurant.id));
		dropdown.appendChild(newNode);
	}
}

/*
 * Displays all the categories of the chosen restaurant to the first column.
 * If order data would be lost in changing restaurants, prompts the user for confirmation
 *
 * Params:
 *   String restaurantName: The name of the selected restaurant.
 * */
function selectRestaurant(restaurantId){
	if(currentOrder.items.length !== 0 && //prompts user if data would be lost
		(document.getElementById("restaurantName") === restaurantId.name ||
			!confirm("Are you sure? You will lose your current order."))){
		return;
	}
	resetPage();

	//request restaurant data from server and display it to the user
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4 && xhttp.status === 200){
			let restaurant = JSON.parse(xhttp.responseText);
			var submitButton = document.getElementById("submitButton"),
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

/*
 * adds all the dishes of the selected category, their descriptions and their prices to the center column
 *
 * Params:
 * 	 String categoryName: the name of the selected category.
 *   Object restaurant: the restaurant object selected.
 * */
function selectCategory(restaurant, categoryName){
	let items = restaurant.menu.filter((item)=>{return item.category === categoryName;});
	let menuNode = document.getElementById("selection");
	clearNode(menuNode);
	for(let index in items){ //add each dish to the table
		let dish = items[index];
		let dishDiv = document.createElement("div");//the div for the whole entry
		dishDiv.appendChild(document.createElement("h3")); //item name
		dishDiv.lastChild.innerHTML = `${dish.name}<img class='addButton' src="${addImg}" alt="Add Item">`;
		dishDiv.appendChild(document.createElement("span")); //item price
		dishDiv.lastChild.innerText = `\$${dish.price.toFixed(2)}`;
		dishDiv.lastChild.classList.add("priceTag");
		dishDiv.appendChild(document.createElement("p")); //item description
		dishDiv.lastChild.innerHTML = `<h5>${dish.description}</h5>`;
		dishDiv.getElementsByClassName("addButton").item(0).addEventListener( //make it selectable
																			  "click", ()=>addToCart(dish, 1, restaurant)
		);
		menuNode.appendChild(dishDiv);
	}
}

/*
 * increments the count of the selected dish by one, adding it to the list if it isn't there,
 * calls the update() function
 *
 * Params:
 *   Object toAdd: the object of the menu item being added to the order.
 *   Integer amount: the number of that item being added (or removed).
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

/*
 * executes order 66
 *
 * Params:
 *   Node node: the HTML node to be cleared.
 * */
function clearNode(node){
	while(node.firstChild) node.removeChild(node.firstChild);
}

/*
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

/*
 * loads the restaurant content onto the main page
 *
 * Params:
 *   Object restaurant: the restaurant object to be rendered.
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

/*
 * updates the UI to display information about a new restaurant
 *
 * Params:
 *	Object restaurant: the restaurant object to be rendered.
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
		newNode.innerHTML = `${itemCount}x<h4>${item.name}</h4>`;
		newNode.appendChild(document.createElement("span"));
		newNode.lastChild.innerText = `\$${parseFloat(itemCount*item.price).toFixed(2)}`;
		newNode.lastChild.classList.add("priceTag");
		newNode.appendChild(document.createElement("img"));
		newNode.lastChild.classList.add("removeButton");
		newNode.lastChild.setAttribute("src", removeImg);
		newNode.lastChild.setAttribute("alt", "Remove Item");
		newNode.lastChild.addEventListener("click", ()=>{
			addToCart(item, -1, restaurant);
		});

		orderNode.appendChild(newNode);
	});
}

/*
 * updates listed restaurants, filtered based on #searchBox query (not cASE-sEnSitIVe)
 *
 * Params:
 *  Object[] restaurants: the names of all the restaurants to filter.
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

/*
 * logic for clicking the submit button
 *
 * Params:
 *	Object restaurant: the restaurant being ordered from.
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
				let responseObj = JSON.parse(xhttp.responseText);
				if(xhttp.status === 200){
					alert(`Order Submitted\nOrder ID: ${responseObj.orderID}`);
					resetPage();
				}else if(xhttp.status === 500){
					alert("Internal Server Error\nPlease Try Again");
				}else{
					alert("Something went Wrong\nPlease Try Again Later");
				}
			}
		};
		xhttp.open("POST", `/order/submit`, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({
			id: restaurant.id,
		  	items: items
		}));
	}else{
		alert(`Please order at least \$${restaurant.min_order} to submit`);
	}
}