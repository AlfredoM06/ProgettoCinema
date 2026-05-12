let signUpButton = document.getElementById('signUp');
let signInButton = document.getElementById('signIn');
let container = document.getElementById('container');
let forget = document.getElementById('forget');

let loginButton = document.getElementById('login');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

loginButton.addEventListener('click', (e) => {
	logIn(e);
});

document.addEventListener('DOMContentLoaded', function(){

    let user = JSON.parse(localStorage.getItem("utente"));
    let tipoUtente = user.tipo;

    if(tipoUtente == "B"){
            window.location.href = "homeUtente.html"
    }else if((tipoUtente == "A")){
        window.location.href = "homeAdmin.html"
    }
});



function logIn(e) {

	e.preventDefault();

	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;

	fetch("http://localhost:9015/api/login", {
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	.then(response => response.json())
	.then(json => {
		if (json.esito == "ok"){
		localStorage.setItem("utente", JSON.stringify(json.utente));

		let user = JSON.parse(localStorage.getItem("utente"));
        let tipoUtente = user.tipo;

		if (tipoUtente == "A"){

			
		window.location.href = "homeAdmin.html"
		}else if(tipoUtente == "B"){
			window.location.href = "homeUtente.html"
		}else{
			window.location.href = "SignIn.html"
		}

	} else {

		let dimenticata = ` <div style="color: red;"> Email o Password errate</div>`

						forget.innerHTML = dimenticata;
	}
	})
	.catch(err => console.log(err))

}
