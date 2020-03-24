function searchUsers(){
	let query = document.getElementById("searchBar").value;

	window.location.replace(`/users?name=${query}`);
}