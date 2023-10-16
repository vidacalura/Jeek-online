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
const board = document.querySelector(".tabuleiro-simulacao");
let casas = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 500;

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

    // 1. C2 C3
    casas[6].appendChild(peca_branca[0]);
    await sleep(sleepTime);
    casas[10].appendChild(peca_branca[1]);
    await sleep(sleepTime);

    // 2. A3 
    casas[8].appendChild(peca_preta[0]);
    await sleep(sleepTime);

    // 3. B1 B2 B3
    casas[1].appendChild(peca_branca[2]);
    await sleep(sleepTime);
    casas[5].appendChild(peca_branca[3]);
    await sleep(sleepTime);
    casas[9].appendChild(peca_branca[4]);
    await sleep(sleepTime);
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