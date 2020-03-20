function submit(){
	let requestBody = {
			name: document.getElementById("name").value,
			min_order: parseFloat(document.getElementById("min_order").value),
			delivery_fee: parseFloat(document.getElementById("delivery_fee").value)
		};

	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4 && xhttp.status === 200){
			let newId = JSON.parse(xhttp.responseText)._id;
			redirect(newId);
		}
	};
	xhttp.open("POST", "/restaurants", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(JSON.stringify(requestBody));
}

function redirect(id){
	window.location.replace(`/restaurants/${id}`)
}