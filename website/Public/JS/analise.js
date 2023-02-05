const codJogo = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
import { PJNDecoder } from "./PJN.js";

/* Jogo */
const endgame_p = document.querySelector(".endgame-p");
let board = document.querySelector(".tabuleiro");
let movesBack = 0;
let jogadas = 0;
let todasCasas = [];
const backBtn = document.querySelector(".move-back");
const forwardBtn = document.querySelector(".move-forward");
const casasAtivas = [];

createGrid();

if (Number(codJogo) < 110) {
    window.location = "/404";
}

fetch("https://jeek-online.vercel.app/api/jogos/" + codJogo)
.then((rawRes) => { return rawRes.json(); })
.then((res) => {
    if (res.error) {
        window.location = "/404";
    }

    jogarMovimentos(res[0].PJN);
    mostrarDados(res[0]);
});

const infoHamburger = document.getElementById("info-hamburger");
infoHamburger.addEventListener("click", () => {
    const containerLeft = document.querySelector(".left-div-container");

    if (containerLeft.className.includes("hidden")){
        containerLeft.classList.remove("hidden");
        containerLeft.classList.add("absolute");
        containerLeft.classList.add("top-20");
        containerLeft.classList.add("left-0");
        containerLeft.classList.add("z-100");

        infoHamburger.className = "fa-solid fa-xmark";
    }
    else{
        containerLeft.className = "left-div-container hidden w-screen h-screen bg-jeek-gray-600 \
        opacity-[0.98] md:w-auto md:h-auto md:bg-none md:opacity-100 md:block md:absolute top-20 md:left-12";

        infoHamburger.className = "fa-solid fa-info rounded-full border border-white py-1 px-2";
    }
});

function createGrid(){

    let count = 0;

    for (let i = 0; i < 4; i++){

        const col = document.createElement("div");
        col.classList.add("coluna");
        board.appendChild(col);

        let casasCol = [];

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
            casasCol.push(casa);

            count++;
        }

        todasCasas.push(casasCol);
    }

}

function jogarMovimentos(PJN){

    const movimentos = PJNDecoder(PJN);

    for (const m of movimentos.casasAtivas){
        // Captar e registrar movimento
        const peca = document.createElement("div");
        
        if (m[2] == true)
            peca.classList.add("peca-branca");
        else
            peca.classList.add("peca-preta");

        todasCasas[m[0]][m[1]].appendChild(peca);
        casasAtivas.push([m[0], m[1]]);
        
        jogadas++;
    }

}


function mostrarDados(obj) {
    const { PJN, cod_vencedor, cod_jogador1, elo_jogador1, elo_jogador2, 
    username_jogador1, username_jogador2 } = obj;

    // Mostra o PJN
    const pjnTextbox = document.getElementById("pjn-textbox");
    pjnTextbox.textContent = PJN; 

    // Mostra os jogadores 
    const usernameBrancas = document.querySelector(".anon-brancas");
    usernameBrancas.textContent = `${username_jogador1} (${elo_jogador1})`;
    const usernamePretas = document.querySelector(".anon-pretas");
    usernamePretas.textContent = `${username_jogador2} (${elo_jogador2})`;

    // Mostra o vencedor
    if (cod_vencedor == cod_jogador1)
        endgame_p.textContent = username_jogador1 + " vence. Vitória das brancas.";
    else
        endgame_p.textContent = username_jogador2 + " vence. Vitória das pretas.";
}


function goBack(){

    if (movesBack < jogadas)
        movesBack++;

    todasCasas[casasAtivas[casasAtivas.length - movesBack][0]][casasAtivas[casasAtivas.length - movesBack][1]]
    .firstChild.classList.add("hidden");

}

function goForward(){

    todasCasas[casasAtivas[casasAtivas.length - movesBack][0]][casasAtivas[casasAtivas.length - movesBack][1]]
    .firstChild.classList.remove("hidden");

    if (movesBack > 0)
        movesBack--;

}

backBtn.addEventListener("click", goBack);
forwardBtn.addEventListener("click", goForward);

document.addEventListener("keydown", (e) => {
    let key = e.key;

    if(key == "ArrowLeft"){
        goBack();
    }
    else if(key == "ArrowRight"){
        goForward();
    }

});

board.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});