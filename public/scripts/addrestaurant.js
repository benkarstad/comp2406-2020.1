function submit(){
	let requestBody = {
			name: document.getElementById("name").value,
			min_order: document.getElementById("min_order").value,
			delivery_fee: document.getElementById("delivery_fee").value
		};

	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		console.log(xhttp.readyState);
		if(xhttp.readyState === 4 && xhttp.status === 200){
			let newId = JSON.parse(xhttp.responseText).id;
			redirect(newId);
		}
	};
	xhttp.open("POST", "/restaurants", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(JSON.stringify(requestBody));
}

function redirect(id){
	console.log("Redirecting");//TEMP
	window.location.replace(`/restaurants/${id}`)
}