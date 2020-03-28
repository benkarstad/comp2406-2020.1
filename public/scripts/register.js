function submitRegistration(){
	let usernameField = document.getElementById("username"),
		privacyField = document.getElementById("privacy"),
		passwordField = document.getElementById("password"),
		confirmPasswordField = document.getElementById("confirmPassword"),

		credentials = {
			username: usernameField.value,
			privacy: privacyField.checked,
			password: passwordField.value
		};

	if(credentials.password !== confirmPasswordField.value){
		return alert("Password fields do not match.\nPlease Try Again.")
	}

		let xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = ()=>{
		if(xhttp.readyState === 4){
			if(xhttp.status === 200){
				window.location.replace(`/users/profile`);
			}
			else if(xhttp.status === 409){
				alert("Username Unavailable")
			}
		}
	};
	xhttp.open("POST", "/users");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(credentials));
}