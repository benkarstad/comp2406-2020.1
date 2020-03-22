function submitLogin(){
	let usernameField = document.getElementById("username"),
		passwordField = document.getElementById("password"),

		credentials = {
			username: usernameField.value,
			password: passwordField.value
		},

		xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4){
			if(xhttp.status === 200){
				window.location.replace(`/profile`);
			}
			else if(xhttp.status === 401){
				alert("Invalid Login Credentials")
			}
		}
	};
	xhttp.open("POST", "/login");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(credentials));
}