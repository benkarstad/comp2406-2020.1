function savePrivacy(){
	let privacy = document.getElementById("private").checked;
	let xhttp = new XMLHttpRequest();

	xhttp.open("PUT", `/users/profile`);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({privacy}));
}