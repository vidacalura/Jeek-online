const updateBtn = document.getElementById("update-usuario-btn");
const mudarUpdateBtn = document.getElementById("mudar-update");
const usernameUpdateTextbox = document.getElementById("update-nome");
const senhaTextbox = document.getElementById("senha-antiga");
const senhaUpdateTextbox = document.getElementById("update-senha");
const updateSenhaDiv = document.getElementById("update-senha-div");
const updateUsernameDiv = document.getElementById("update-username-div");
const deletarContaBtn = document.getElementById("delete-usuario-btn");
deletarContaBtn.addEventListener("click", mostrarMenuDeletarUsuario);
const deletarUsuarioContainer = document.getElementById("deletar-usuario-container");
const senhaDeletarTextbox = document.getElementById("senha-deletar-usuario");
const deletarUsuarioBtn = document.getElementById("deletar-conta-btn")

mudarUpdateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (mudarUpdateBtn.textContent.includes("Mudar senha")){
        mudarUpdateBtn.textContent = "Mudar username";

        updateSenhaDiv.classList.remove("hidden");
        updateUsernameDiv.classList.add("hidden");
    }
    else {
        mudarUpdateBtn.textContent = "Mudar senha";

        updateSenhaDiv.classList.add("hidden");
        updateUsernameDiv.classList.remove("hidden");
    }
});

updateBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Update de username
    if (updateSenhaDiv.className.includes("hidden")){
        await fetch("/usuarios", {
            method: "PUT",
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                usernameNovo: usernameUpdateTextbox.value
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((response) => {
            if (!response.error){
                alert("Nome de usuário atualizado com sucesso!")
            }
            else {
                alert(response.error);
            }
        });
    }
    // Update de senha
    else {
        await fetch("/usuarios", {
            method: "PUT",
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                senhaAtual: senhaTextbox.value,
                senhaNova: senhaUpdateTextbox.value
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((response) => {
            if (!response.error){
                alert("Senha atualizada com sucesso!")
            }
            else {
                alert(response.error);
            }
        });
    }

});

deletarUsuarioBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch("/usuarios", {
        method: "DELETE",
        headers: {
            "Content-type": "Application/JSON"
        },
        body: JSON.stringify({
            senha: senhaDeletarTextbox.value
        })
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((response) => {
        if (!response.error){
            window.location.pathname = "/";
            alert(response.message);
        }
        else{
            alert(response.error);
        }
    })

});


function mostrarMenuDeletarUsuario(){

    if (deletarUsuarioContainer.className.includes("hidden")){
        deletarUsuarioContainer.classList.remove("hidden");
    }

}

deletarUsuarioContainer.addEventListener("click", (e) => {
    if (e.target.id == "deletar-usuario-container"){
        deletarUsuarioContainer.classList.remove("add");
    }
});