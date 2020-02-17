//TODO: Use better for/forEach conventions.

const addImg = "add.png";
const removeImg = "remove.png";

let restaurants = [];

let currentRestaurantObj = null;
let currentCategoryObj = null;
let currentOrder = {
	items: [],
	amounts: [],
	subtotal: 0
};

function init(){
	//load restaurants into searchbar
	let dropdown = document.getElementById(
		"searchbar").getElementsByClassName(
			"dropdownContent").item(0);


	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		//requests an array of restaurant objects with just the name
		//full restaurant data will be requested once selected
		console.log(`Ready State: ${xhttp.readyState}`);
		if(xhttp.readyState === 4 && xhttp.status === 200){
			console.log(`Data Recieved:\n${JSON.parse(xhttp.responseText)}`);
			restaurants = JSON.parse(xhttp.responseText);
			restaurants.forEach((restaurant) => { //populate the dropdown with restaurants
				let newNode = document.createElement("p");
				newNode.innerText = restaurant.name;
				newNode.addEventListener("click", () => {
					selectRestaurant(restaurant)
				});
				dropdown.appendChild(newNode);
			});
		}
	};
	xhttp.open("GET", "/restaurants/names.json", true);
	xhttp.send();
	
	document.getElementById("submitButton").addEventListener("click", order)
}

/*
* Displays all the categories of the chosen restaurant to the first column.
* If order data would be lost in changing restaurants, prompts the user for confirmation
* */
function selectRestaurant(restaurant){
	//TODO: send AJAX request for restaurant data upon request.
	if(currentOrder.items.length !== 0 && //prompts user if data would be lost
		(currentRestaurantObj === restaurant ||
		!confirm("Are you sure? You will lose your current order."))) {
		return;
	}
	resetPage();
	
	//loads the restaurant content (i.e. restaurants[index]) onto the main page
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

	document.getElementById("restaurantName").innerText = restaurant.name;
	document.getElementById("restaurantInfo").innerHTML =
		`<h5>Minimum Order: \$${restaurant.min_order}<br/>`+
		`Delivery Charge: \$${restaurant.delivery_fee}</h5>`;
	
	update();
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
		dishDiv.lastChild.innerHTML = `${dish.name}<img class='addButton' src="${addImg}" alt="Add Item">`;
		dishDiv.appendChild(document.createElement("span")); //item price
		dishDiv.lastChild.innerText = `\$${dish.price.toFixed(2)}`;
		dishDiv.lastChild.classList.add("priceTag");
		dishDiv.appendChild(document.createElement("p")); //item description
		dishDiv.lastChild.innerHTML = `<h5>${dish.description}</h5>`;
		dishDiv.getElementsByClassName("addButton").item(0).addEventListener("click",()=>{ //make it selectable
			addToCart(dish, 1);
		});
		menuNode.appendChild(dishDiv)
	});
}

/*
* increments the count of the selected dish by one, adding it to the list if it isn't there,
* calls the update() function
* */
function addToCart(toAdd, amount){
	if(amount === 0) return;
	
	if(!currentOrder.items.includes(toAdd)){ //if its not on the cart, add it to the cart
		currentOrder.items.push(toAdd);
		currentOrder.amounts.push(amount);
	}
	else
	{
		let index = currentOrder.items.indexOf(toAdd);
		amount = Math.max(amount, -1*currentOrder.amounts[index]);
		if(currentOrder.amounts[index] + amount === 0){ //remove the item if all are removed
			currentOrder.items.splice(index, 1);
			currentOrder.amounts.splice(index, 1);
		}
		else currentOrder.amounts[index] += amount; //otherwise change the amount
	}
	
	currentOrder.subtotal += toAdd.price*amount; //update the subtotal to reflect this
	
	update();
}

/*
* executes order 66
* */
function clearNode(node){
	while(node.firstChild) node.removeChild(node.firstChild);
}

/*
* resets all html and js state to when the page was loaded
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

	currentRestaurantObj = null;
	currentCategoryObj = null;
	currentOrder.items = [];
	currentOrder.amounts = [];
	currentOrder.subtotal = 0;
}

/*
* displays a representation of the ordered items to the user
* */
function update(){
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
			addToCart(item, -1);
		});

		orderNode.appendChild(newNode);
	});
	
	//update #orderSummary
	let subtotal = currentOrder.subtotal.toFixed(2);
	let taxes = (0.1*subtotal).toFixed(2);
	let deliveryFee = currentRestaurantObj.delivery_fee.toFixed(2);
	let total = parseFloat(parseFloat(subtotal)+parseFloat(taxes)+parseFloat(deliveryFee)).toFixed(2);

	document.getElementById("subtotal").getElementsByClassName("priceTag")[0].innerText = `\$${subtotal}`;
	document.getElementById("taxes").getElementsByClassName("priceTag")[0].innerText = `\$${taxes}`;
	document.getElementById("deliveryFee").getElementsByClassName("priceTag")[0].innerText = `\$${deliveryFee}`;
	document.getElementById("total").getElementsByClassName("priceTag")[0].innerText = `\$${total}`;
	
	if(currentRestaurantObj === null){ //update the submit button text and style
		document.getElementById("submitButton").classList.add("noneSelected");
		document.getElementById("submitButton").innerText = "Please Select a Restaurant"
	}
	else{
			document.getElementById("submitButton").classList.remove("noneSelected");
			if(subtotal >= currentRestaurantObj.min_order)
			{
				document.getElementById("submitButton").classList.remove("nsf");
				document.getElementById("submitButton").innerText = "Order Now!";
			}
			else
			{
				document.getElementById("submitButton").classList.add("nsf");
				document.getElementById("submitButton").innerHTML = `You are \$${parseFloat(currentRestaurantObj.min_order - subtotal).toFixed(2)} short ;~;</br>Please Order More`;
			}
	}
}

/*
* updates listed restaurants based on search query
* */
function updateDropdown(){
	let queryString = document.getElementById("searchBox").value;
	let matchedRestaurants = restaurants.filter((restaurant)=>{
		return restaurant.name.includes(queryString);
	});
	console.log(`updateDropdown() called for ${queryString}`);
	
	
	let dropdown = document.getElementById(
		"searchbar").getElementsByClassName(
		"dropdownContent").item(0);
	console.log(dropdown);
	clearNode(dropdown);
	matchedRestaurants.forEach((restaurant)=>{
		let newNode = document.createElement("p");
		newNode.innerText = restaurant.name;
		newNode.addEventListener("click", ()=>{
			selectRestaurant(restaurant)
		});
		dropdown.appendChild(newNode);
	});
}

/*
* logic for clicking the submit button
* */
function order(){
	if(currentRestaurantObj === null){
		alert("No Restaurant Selected");
	}
	else if(currentOrder.subtotal >= currentRestaurantObj.min_order){ //submit the order
		alert("Order Submitted");
		resetPage();
	}
	else{
		alert(`Please order at least \$${currentRestaurantObj.min_order} to submit`);
	}
}