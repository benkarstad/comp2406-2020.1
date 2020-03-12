//TODO: GET restaurant data
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

	element = document.getElementById(id); //TODO: Inquire about this behaviour
	element.addEventListener("keydown", (event)=>{
		if(event.code === "Enter"){
			console.log(element.value);
			endEdit(id);
		}
	})
}

function endEdit(id){
	let element = document.getElementById(id);
	if(element.tagName !== "INPUT") return
}

function addCategory(){
	//TODO: Implement addCategory();
}

function save(){
	//TODO: Implement save();
}