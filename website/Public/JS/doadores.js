const painelDoadores = document.getElementById("painel-doadores");

fetch("http://localhost:4000/api/titulos/doadores")
.then((res) => { return res.json(); })
.then((res) => {
    if (res.doadores.length > 0){
        res.doadores.forEach((d) => {
            const doadorContainer = document.createElement("div");
            doadorContainer.className = "bg-jeek-gray-700 rounded-lg shadow-md py-4 px-6";

            const username = document.createElement("h2");
            username.className = "text-xl font-bold";
            username.textContent = d.doador;
            doadorContainer.appendChild(username);

            const valor = document.createElement("p");
            valor.classList.add("text-jeek-gray-100");
            valor.textContent = "R$ " + d.doações;
            doadorContainer.appendChild(valor);

            painelDoadores.appendChild(doadorContainer);
        });
    }
    else {
        window.location.href = "/";
    }
})