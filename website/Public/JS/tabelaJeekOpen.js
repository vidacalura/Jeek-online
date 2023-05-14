const usuariosContainer = document.getElementById("inscritos");

fetch("https://jeek-online.vercel.app/api/jeek-open")
.then((res) => { return res.json(); })
.then((res) => {
    if (res.error) {
        alert(res.error);
        return;
    }

    const usuarios = res.usuarios;
    for (let i = 0; i < usuarios.length; i++){
        const a = document.createElement("a");
        a.href = "/usuarios/" + usuarios[i].username;

        const userContainer = document.createElement("div");
        userContainer.classList.add("user-container-inscricao");
        userContainer.classList.add("bg-jeek-gray-500");

        const num = document.createElement("p");
        if (usuarios[i].posicao_tabela == null) {
            num.textContent = "-";
        }
        else {
            num.textContent = i + 1;
        }

        const username = document.createElement("p");
        username.textContent = usuarios[i].username;

        userContainer.appendChild(num);
        userContainer.appendChild(username);
        a.appendChild(userContainer);

        usuariosContainer.appendChild(a);
    }
});