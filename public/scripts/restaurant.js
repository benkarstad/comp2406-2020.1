let restaurant;
let categories

function init(){
	let id = document.getElementById("id").innerText;
	getRestaurant(id);
}

/*
 * Retrieves the data of restaurant being shown.
 *
 * Params:
 *      String id: Id of the restaurant to be retrieved
 * */
function getRestaurant(id){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4 && xhttp.status === 200)
			restaurant = JSON.parse(xhttp.responseText);
	};
	xhttp.open("GET", `/restaurants/${id}`, true);
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

/*
 * If the indicated element is a SPAN, it will be converted into a textbox;
 * The supplied input will be saved and submitted to the server
 * To achieve the desired functionality, the id must correspond with an attribute of the restaurant object
 *
 * Params:
 * 		String id: the id to be edited.
 * */
function edit(id){
	let element = document.getElementById(id);
	if(element.tagName !== "SPAN") return;
	let contents = element.innerText; //TODO: get contents from restaurant object instead
	element.outerHTML = `<input type="text" id="${id}" value="${element.innerText}">`;
	
	document.getElementById(id).focus();
}

/*
 * If the indicated element is an INPUT, it will be converted back into a SPAN with innerHTML ov it's value;
 * The supplied input will be saved and submitted to the server
 * To achieve the desired functionality, the id must correspond with an attribute of the restaurant object
 *
 * Params:
 * 		String id: the id to be edited.
 * */
function endEdit(event, id){
	let element = document.getElementById(id);
	if(element.tagName !== "INPUT" || event.code !== "Enter") return;
	
	restaurant[id] = element.value;
	
	element.outerHTML = `<span id="${id}">${element.value}</span>`;
}

function addCategory(){
	let categoryName = document.getElementById("newCategory").value,
		menu = document.getElementById("menu");
	
	if(restaurant[categoryName] !== undefined) return; //No Duplicates
	
	let newCategory = document.createElement("div");
	newCategory.setAttribute("class", "category");
	newCategory.setAttribute("id", categoryName);
	newCategory.innerHTML =
		`<h3>${categoryName}</h3>`
	
	//TODO: Update Item creation Category Dropdown
}

function save(){
	console.log("Saving");
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4){
			if(xhttp.status === 200){
				alert("Saved Successfully");
			} else{
				alert(`${xhttp.status} | ${xhttp.responseText}`);
			}
		}
	};
	xhttp.open("PUT", `/restaurants/${restaurant.id}`, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "text/plain");
	xhttp.send(JSON.stringify(restaurant));
}