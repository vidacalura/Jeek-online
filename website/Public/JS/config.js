const updateBtn = document.getElementById("update-usuario-btn");
const updatePerfilBtn = document.getElementById("update-perfil-btn");
const mudarUpdateBtn = document.getElementById("mudar-update");
const usernameUpdateTextbox = document.getElementById("update-nome");
const senhaTextbox = document.getElementById("senha-antiga");
const senhaUpdateTextbox = document.getElementById("update-senha");
const updateSenhaDiv = document.getElementById("update-senha-div");
const updateUsernameDiv = document.getElementById("update-username-div");
const updateDescricaoPerfil = document.getElementById("update-desc");
const updatePais = document.getElementById("update-pais");
const deletarContaBtn = document.getElementById("delete-usuario-btn");
deletarContaBtn.addEventListener("click", mostrarMenuDeletarUsuario);
const deletarUsuarioContainer = document.getElementById("deletar-usuario-container");
deletarUsuarioContainer.addEventListener("click", (e) => { mostrarMenuDeletarUsuario(e) });
const senhaDeletarTextbox = document.getElementById("senha-deletar-usuario");
const deletarUsuarioBtn = document.getElementById("deletar-conta-btn")
const usarSkinBtn = document.getElementById("usar-skin-btn");
const desativarSkinBtn = document.getElementById("desativar-skins-btn");

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

updatePerfilBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Update descrição de perfil
    if (updateDescricaoPerfil.value && updatePais.value) {
        await fetch("/usuarios", {
            method: "PUT",
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                descPerfil: updateDescricaoPerfil.value.trim(),
                pais: updatePais.value
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((response) => {
            if (!response.error){
                alert("Perfil atualizado com sucesso!")
            }
            else {
                alert(response.error);
            }
        });
    }
    else {
        alert("Preencha os dois campos antes de enviar.");
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

usarSkinBtn.addEventListener("click", async (e) => {
    e.preventDefault();


});

desativarSkinBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    
});

function mostrarMenuDeletarUsuario(e){

    if (deletarUsuarioContainer.className.includes("hidden")){
        deletarUsuarioContainer.classList.remove("hidden");
    }
    else {
        if (e.target.id == "deletar-usuario-container")
            deletarUsuarioContainer.classList.add("hidden");
    }

}

deletarUsuarioContainer.addEventListener("click", (e) => {
    if (e.target.id == "deletar-usuario-container"){
        deletarUsuarioContainer.classList.remove("add");
    }
});

/* Skins */
let skinSelecionada = null, corSelecionada = null;

fetch("/getSessao")
.then((res) => { return res.json(); })
.then(async (res) => {
    await fetch("https://jeek-online.vercel.app/api/skin/inventario/" + res.username)
    .then((res) => { return res.json(); })
    .then((res) => {
        if (res.skinClass) {
            mostrarSkins(res.skinClass);
            mostrarCoresSkins();
        }
        else {
            const inventarioSkinDiv = document.getElementById("inventario-skins");

            const skinsBtns = document.getElementById("skins-btns");
            skinsBtns.classList.add("hidden");

            const noSkins = document.createElement("p");
            noSkins.innerHTML = "Você não tem skins ainda :(";
            noSkins.className = "font-bold text-xl pb-4";

            const skinsText = document.createElement("p");
            skinsText.innerHTML = `
            Há diversas formas de se conseguir skins. <br>
            Você pode ganhar skins competindo em torneios e campeonatos online,
            <a href="/apoiar" class="underline"> contribuindo para o site financeiramente</a>
            ou ainda <a href="https://github.com/vidacalura/Jeek-online" class="underline">
            contribuindo no desenvolvimento do site</a>.
            `;

            inventarioSkinDiv.appendChild(noSkins);
            inventarioSkinDiv.appendChild(skinsText);
        }
    });
});

function mostrarSkins(skins) {
    const inventarioSkinDiv = document.getElementById("inventario-skins");
    inventarioSkinDiv.className = "flex gap-4 pb-8";

    let todasDivsSkins = [];
    for (const skin of skins) {
        const skinClass = skin.class_skin;

        const pecaDiv = document.createElement("div");
        pecaDiv.value = skinClass;
        pecaDiv.classList.add("skin-inventario-div");

        const peca = document.createElement("div");
        peca.classList.add("peca-branca");
        peca.style.color = "rgb(44, 44, 44)";

        const skinFrame = document.createElement("i");
        skinFrame.className = skinClass;

        peca.appendChild(skinFrame);
        pecaDiv.appendChild(peca);
        inventarioSkinDiv.appendChild(pecaDiv);

        todasDivsSkins.push(pecaDiv);

        pecaDiv.addEventListener("click", () => {
            console.log(pecaDiv.value)
            if (pecaDiv.className.includes("skin-inventario-div")) {
                pecaDiv.className = "skin-inventario-active";
                
                removerAtivoOutrasDivs(pecaDiv, todasDivsSkins);

                if (!skinSelecionada)
                    skinSelecionada = pecaDiv.value;
            }
            else {
                pecaDiv.className = "skin-inventario-div";

                skinSelecionada = null
            }
        });
    }
}

function mostrarCoresSkins() {
    const coresSkinDiv = document.getElementById("cores-skin");
    coresSkinDiv.className = "flex justifify-center gap-4 pb-8";

    const corDiv1 = document.createElement("div");
    corDiv1.value = "text-red";
    corDiv1.classList.add("skin-inventario-div");
    corDiv1.classList.add("cor-inventario-div");

    const cor1 = document.createElement("div");
    cor1.classList.add("cor-inventario");
    cor1.classList.add("bg-red");

    corDiv1.appendChild(cor1);

    const corDiv2 = document.createElement("div");
    corDiv2.value = "text-blue";
    corDiv2.classList.add("skin-inventario-div");
    corDiv2.classList.add("cor-inventario-div");

    const cor2 = document.createElement("div");
    cor2.classList.add("cor-inventario");
    cor2.classList.add("bg-blue");

    corDiv2.appendChild(cor2);

    const corDiv3 = document.createElement("div");
    corDiv3.value = "text-green-100";
    corDiv3.classList.add("skin-inventario-div");
    corDiv3.classList.add("cor-inventario-div");

    const cor3 = document.createElement("div");
    cor3.classList.add("cor-inventario");
    cor3.classList.add("bg-green-100");

    corDiv3.appendChild(cor3);

    const corDiv4 = document.createElement("div");
    corDiv4.value = "text-jeek-gray-200";
    corDiv4.classList.add("skin-inventario-div");
    corDiv4.classList.add("cor-inventario-div");

    const cor4 = document.createElement("div");
    cor4.classList.add("cor-inventario");

    corDiv4.appendChild(cor4);

    coresSkinDiv.appendChild(corDiv1);
    coresSkinDiv.appendChild(corDiv2);
    coresSkinDiv.appendChild(corDiv3);
    coresSkinDiv.appendChild(corDiv4);

    const todasDivsCores = document.querySelectorAll(".cor-inventario-div");
    todasDivsCores.forEach((corDiv) => {
        corDiv.addEventListener("click", () => {
            console.log(corDiv.value)
            if (corDiv.className.includes("skin-inventario-div")) {
                corDiv.classList.add("skin-inventario-active");
                corDiv.classList.remove("skin-inventario-div");
                
                removerAtivoOutrasDivs(corDiv, todasDivsCores);

                if (!corSelecionada)
                    corSelecionada = corDiv.value;
            }
            else {
                corDiv.classList.add("skin-inventario-div");
                corDiv.classList.remove("skin-inventario-active");

                corSelecionada = null
            }
        });
    });
}

function removerAtivoOutrasDivs(divAtiva, todasDivs) {
    todasDivs.forEach((div) => {
        if (div.className.includes("skin-inventario-active")) {
            if (div != divAtiva) {
                div.classList.remove("skin-inventario-active");
                div.classList.add("skin-inventario-div");
            }
        }
    })
}