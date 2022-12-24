let socket = io();

const menuCloseBtn = document.getElementById("menu-x");
const menuNav = document.getElementById("menu-nav");
const menuNavBtn = document.getElementById("menu-hamburger");
menuNavBtn.addEventListener("click", () => {
    menuNav.classList.remove("hidden");
});
const btnJogarLocal = document.getElementById("btn-jogar-local");
btnJogarLocal.addEventListener("click", mostrarMenuJogarLocal);
const menuJogarLocal = document.getElementById("menu-jogar-local");
const xMenuJogarLocal = document.getElementById("x-menu-jogar-local");
xMenuJogarLocal.addEventListener("click", mostrarMenuJogarLocal);
const btnJogarOnline = document.querySelector(".btn-jogar-online");
btnJogarOnline.addEventListener("click", mostrarMenuJogarOnline);
const menuJogarOnline = document.getElementById("menu-jogar-online");
const xMenuJogarOnline = document.getElementById("x-menu-jogar-online");
xMenuJogarOnline.addEventListener("click", mostrarMenuJogarOnline);
const btnMenuEntrarPartida = document.getElementById("btn-menu-entrar-partida");
btnMenuEntrarPartida.addEventListener("click", mostrarMenuEntrarPartida);
const menuEntrarPartida = document.getElementById("menu-entrar-partida");
const xMenuEntrarPartida = document.getElementById("x-menu-entrar-partida");
xMenuEntrarPartida.addEventListener("click", mostrarMenuEntrarPartida);
const btnCriarPartida = document.getElementById("btn-criar-partida");
btnCriarPartida.addEventListener("click", () => {
    socket.emit("criarPartida", null);
});
const btnEntrarPartida = document.getElementById("entrar-partida-btn");
btnEntrarPartida.addEventListener("click", entrarSala);
const txtboxEntrarPartida = document.getElementById("codigo-sala-entrar");
const board = document.querySelector(".tabuleiro-simulacao");
let casas = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 500;

checarSessao();
createGrid();
simulacao();

menuNav.addEventListener("click", (e) => {
    if (e.target.id == menuNav.id)
        menuNav.classList.add("hidden");
});
menuCloseBtn.addEventListener("click", () => {
    menuNav.classList.add("hidden");
});

function createGrid(){

    let count = 0;

    for (let i = 0; i < 4; i++){

        const col = document.createElement("div");
        col.classList.add("coluna");
        board.appendChild(col);

        for (let j = 0; j < 4; j++){
            const casa = document.createElement("div");
            casa.dataset.id = count;
            casa.classList.add("casa");

            if (count == 0){
                casa.classList.add("casa1");
            }
            else if(count == 3){
                casa.classList.add("casa2");
            }
            else if(count == 12){
                casa.classList.add("casa3");
            }
            else if(count == 15){
                casa.classList.add("casa4");
            }

            col.appendChild(casa);

            casas.push(casa);

            count++;
        }
    }

}

async function simulacao(){

    const peca_branca = [];
    for (let i = 0; i < 8; i++){
        peca_branca[i] = document.createElement("div");
        peca_branca[i].classList.add("peca-branca");
    }

    const peca_preta = [];
    for (let i = 0; i < 8; i++){
        peca_preta[i] = document.createElement("div");
        peca_preta[i].classList.add("peca-preta");
    }

    casas[0].appendChild(peca_branca[0]);
    await sleep(sleepTime);
    casas[1].appendChild(peca_branca[1]);
    await sleep(sleepTime);
    casas[2].appendChild(peca_branca[2]);
    await sleep(sleepTime);

    casas[5].appendChild(peca_preta[0]);
    await sleep(sleepTime);
    casas[6].appendChild(peca_preta[1]);
    await sleep(sleepTime);
    casas[7].appendChild(peca_preta[2]);
    await sleep(sleepTime);

    casas[4].appendChild(peca_branca[3]);
    await sleep(sleepTime);

    casas[11].appendChild(peca_preta[3]);
    await sleep(sleepTime);
    casas[15].appendChild(peca_preta[4]);
    await sleep(sleepTime);  
    
    casas[12].appendChild(peca_branca[4]);
    await sleep(sleepTime);

    casas[9].appendChild(peca_preta[5]);
    await sleep(sleepTime);

    casas[13].appendChild(peca_branca[5]);
    await sleep(sleepTime);
    casas[14].appendChild(peca_branca[6]);
    await sleep(sleepTime);
    
}

function entrarSala(){

    if (txtboxEntrarPartida.value.length == 8 && txtboxEntrarPartida.value.slice(0, 2) == "JO"){
        const codigo = txtboxEntrarPartida.value.toUpperCase();

        socket.emit("redirecionarPartida", codigo);
    }
    else{
        alert("Código de sala inválido");
    }

}

function mostrarMenuJogarLocal(){

    if (menuJogarLocal.className.includes("hidden")){
        menuJogarLocal.classList.remove("hidden");
        menuJogarLocal.classList.add("absolute");
    }
    else{
        menuJogarLocal.classList.add("hidden");
        menuJogarLocal.classList.remove("absolute");
    }

}

function mostrarMenuJogarOnline(){

    if (menuJogarOnline.className.includes("hidden")){
        menuJogarOnline.classList.remove("hidden");
        menuJogarOnline.classList.add("absolute");
    }
    else{
        menuJogarOnline.classList.add("hidden");
        menuJogarOnline.classList.remove("absolute");
    }

}

function mostrarMenuEntrarPartida(){

    if (menuEntrarPartida.className.includes("hidden")){
        menuEntrarPartida.classList.remove("hidden");
        menuEntrarPartida.classList.add("absolute");
        menuJogarOnline.classList.remove("absolute");
        menuJogarOnline.classList.add("hidden");
    }
    else{
        menuEntrarPartida.classList.add("hidden");
        menuEntrarPartida.classList.remove("absolute");
    }

}

async function checarSessao(){

    const perfilSessao = document.getElementById("perfil-sessao");
    
    await fetch("http://localhost:5000/getSessao")
    .then((res) => { return res.json(); })
    .then((res) => {
        if (res.username){
            // Botão de perfil
            while (perfilSessao.childNodes.length != 0){
                perfilSessao.firstChild.remove();
            }

            const perfilLink = document.createElement("a");
            perfilLink.href = "/usuarios/" + res.username;

            const menuOption = document.createElement("div");
            menuOption.classList.add("menu-option");

            const pfp = document.createElement("i");
            pfp.className = "fa-solid fa-user";

            const username = document.createElement("p");
            username.textContent = res.username;
            username.className = "text-white cursor-pointer";

            menuOption.appendChild(pfp);
            menuOption.appendChild(username);
            perfilLink.appendChild(menuOption);
            perfilSessao.appendChild(perfilLink);

            // Botão de configurações da conta
            const configLink = document.createElement("a");
            configLink.href = "/configuracoes";

            const menuOption3 = document.createElement("div");
            menuOption3.classList.add("menu-option");

            const configEmoji = document.createElement("i");
            configEmoji.className = "fa-solid fa-gear";

            const configP = document.createElement("p");
            configP.textContent = "Configurações";

            menuOption3.appendChild(configEmoji);
            menuOption3.appendChild(configP);
            configLink.appendChild(menuOption3);

            // Botão de logout
            const sairLink = document.createElement("a");
            sairLink.href = "/sair";

            const menuOption2 = document.createElement("div");
            menuOption2.classList.add("menu-option");

            const sairEmoji = document.createElement("i");
            sairEmoji.className = "fa-solid fa-arrow-right-to-bracket";

            const sairP = document.createElement("p");
            sairP.textContent = "Sair";

            menuOption2.appendChild(sairEmoji);
            menuOption2.appendChild(sairP);
            sairLink.appendChild(menuOption2);
            menuNav.children[0].insertBefore(configLink, menuNav.children[0].children[menuNav.children[0].children.length - 1]);
            menuNav.children[0].insertBefore(sairLink, menuNav.children[0].children[menuNav.children[0].children.length - 1]);
        }
    });

}

txtboxEntrarPartida.addEventListener("keyup", (event) => {
    event.preventDefault();

    if (event.key == "Enter"){
        entrarSala();
    }
});

socket.on("roomIdReg", (data) => {
    const { codigo, id } = data;

    if (socket.id == id){
        const url = `/online?roomId=${codigo}`;
        window.location = url;
    }
});

socket.on("redirectPartida", (data) => {
    const { codigo, id } = data;

    if (socket.id == id){
        const url = `/online?roomId=${codigo}?entrar`;
        window.location = url;
    }

});

socket.on("erro404", (data) => {
    if (socket.id == data){
        window.location = "/404";
    }
});