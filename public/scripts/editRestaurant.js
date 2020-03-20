let restaurant,
	categories;

/*
 * Requests restaurant data from the server and initializes
 *  */
function init(id){
	let restaurantXhttp = new XMLHttpRequest(),
		categoriesXhttp = new XMLHttpRequest();
	
	//request restaurant info
	restaurantXhttp.onreadystatechange = ()=>{
		if(restaurantXhttp.readyState !== 4 || restaurantXhttp.status !== 200) return;
		restaurant = JSON.parse(restaurantXhttp.responseText);
		console.log(restaurant);//TEMP
		document.getElementById("name").value = restaurant.name;
		document.getElementById("delivery_fee").value = parseFloat(restaurant.delivery_fee);
		document.getElementById("min_order").value = parseFloat(restaurant.min_order);
		
		if(restaurant !== undefined && categories !== undefined) updateMenu();
	};

	//request list of categories
	categoriesXhttp.onreadystatechange = ()=>{
		if(categoriesXhttp.readyState !== 4 || categoriesXhttp.status !== 200) return;
		categories = JSON.parse(categoriesXhttp.responseText);
		updateDropdown();
		
		if(restaurant !== undefined && categories !== undefined) updateMenu();
	};
	
	//send requests
	restaurantXhttp.open("GET", `/restaurants/${id}`, true);
	restaurantXhttp.setRequestHeader("Accept", "application/json");
	restaurantXhttp.send();
	
	categoriesXhttp.open("GET", `/restaurants/${id}/categories`, true);
	categoriesXhttp.setRequestHeader("Accept", "application/json");
	categoriesXhttp.send();
}

/*
 * Takes data from the page and creates a new category
 * updates restaurant to match
 * */
function addCategory(){
	let newCategoryElem = document.getElementById("newCategory"),
		newCategory = newCategoryElem.value;
	newCategoryElem.value = "";
	if(categories.includes(newCategory)) return;
	categories.push(newCategory);

	//add to New Item Dropdown and Menu
	updateMenu();
	updateDropdown();
}

/*
 * Creates a new Item and adds it to the specified Category
 * updates restaurant to match
 * */
function addItem(){
	let nameElem = document.getElementById("newItemName"),
		descriptionElem = document.getElementById("newItemDescription"),
		priceElem = document.getElementById("newItemPrice"),
		categoryElem = document.getElementById("newItemCategory"),

		name = nameElem.value,
		description = descriptionElem.value,
		price = parseFloat(priceElem.value),
		category = categoryElem.value,

		itemObj = {
			name,
			description,
			price,
			category
		};

	restaurant.menu.push(itemObj);
	updateMenu();
}

function save(){
	//pull new data from page
	restaurant.name = document.getElementById("name").value;
	restaurant.delivery_fee = parseFloat(document.getElementById("delivery_fee").value);
	restaurant.min_order = parseFloat(document.getElementById("min_order").value);

	//send saved data to server
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4){
			if(xhttp.status === 200){
				alert("Saved Successfully");
				window.location.replace(`/restaurants/${restaurant._id}`)
			} else{
				alert(`${xhttp.status} | ${xhttp.responseText}`);
			}
		}
	};
	xhttp.open("PUT", `/restaurants/${restaurant._id}`, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "text/plain");
	xhttp.send(JSON.stringify(restaurant));
}

function updateMenu(){
	let menuElement = document.getElementById("menu");
	menuElement.innerHTML = ""; //clear menu

	for(let i in categories){
		//initialize the category and add it to the menu
		let category = categories[i],
			categoryElem = document.createElement("div");
		categoryElem.setAttribute("class", "category", );
		categoryElem.setAttribute("id", category);
		categoryElem.innerHTML = `<h3>${category}</h3>`;
		menuElement.appendChild(categoryElem);

		//populate the category with items
		for(let j in restaurant.menu){
			let item = restaurant.menu[j];
			if(item.category !== category) continue;
			let itemElem = document.createElement("div");
			itemElem.setAttribute("class", "item");
			itemElem.innerHTML =
				`<h4>${item.name}: $${item.price}</h4>
				<span>${item.description}</span>`;
			categoryElem.appendChild(itemElem);
		}
	}
}

function updateDropdown(){
	let categoriesDDElem = document.getElementById("newItemCategory");
	categoriesDDElem.innerHTML = "";
	for(let i in categories){
		let category = categories[i];
		categoriesDDElem.innerHTML += `<option value="${category}">${category}</option>`
	}
}