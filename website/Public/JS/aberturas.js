/* Jogo */
const nomeAbertura = document.getElementById("nome-abertura");
const descAbertura = document.getElementById("dados-abertura");
const barraAnalise = document.getElementById("barra-analise");
barraAnalise.style.height = "50%";
const voltarLinhaBtn = document.getElementById("voltar-linha");
voltarLinhaBtn.addEventListener("click", goBack);
let board = document.querySelector(".tabuleiro");
let movesBack = 0;
let jogadas = 0;
let todasCasas = [];
const casasAtivas = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));

createGrid();

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

async function colocarPecas(movimento) {
    for (const m of movimento) {
        const peca = document.createElement("div");
        (m.ehBrancas == true ? peca.classList.add("peca-branca") : peca.classList.add("peca-preta"));

        todasCasas[m.y][m.x].appendChild(peca);

        await sleep(500);
    }
}

function goBack(){
    window.location.reload();
}

function mostrarDadosAbertura(abertura) {
    colocarPecas(abertura.pecas);

    nomeAbertura.textContent = abertura.nome;
    descAbertura.textContent = abertura.desc;

    barraAnalise.style.height = abertura.pontuacao + "%";
}

document.addEventListener("keydown", (e) => {
    let key = e.key;

    if(key == "ArrowLeft"){
        goBack();
    }
});

board.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});


/* Linhas */
let linhaAnterior, linhaAtual;

const btnLinhas1 = document.getElementById("btns-linhas-1");
const btnAberturaHiro1 = document.getElementById("btn-abertura-hiro-1");;
const btnLinhasHiro2 = document.getElementById("btns-abertura-hiro-2");
const btnAberturaHiro2 = document.getElementById("btn-abertura-hiro-2");
const btnLinhasHiro3 = document.getElementById("btns-abertura-hiro-3");
const btnAberturaHiroA4 = document.getElementById("btn-abertura-hiro-a4");
const btnAberturaHiroD1 = document.getElementById("btn-abertura-hiro-d1");
const btnAberturaHiroD3 = document.getElementById("btn-abertura-hiro-d3");
const btnAberturaHiroA3 = document.getElementById("btn-abertura-hiro-a3");

const btnVarianteRaffles2 = document.getElementById("btn-variante-raffles-2");
const btnLinhasRaffles3 = document.getElementById("btns-variante-raffles-3");
const btnVarianteRaffles3 = document.getElementById("btn-variante-raffles-3");
const btnVarianteRafflesC4 = document.getElementById("btn-variante-raffles-c4");

const btnLinhasVicius2 = document.getElementById("btns-abertura-vicius-2");
const btnAberturaVicius1 = document.getElementById("btn-abertura-vicius-1")

btnAberturaHiro1.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLance1);
    btnLinhas1.classList.add("hidden");
    btnLinhasHiro2.classList.remove("hidden");
});

btnAberturaHiro2.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLance2);
    btnLinhasHiro2.classList.add("hidden");
    btnLinhasHiro3.classList.remove("hidden");
});

btnAberturaHiroA4.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLanceA4);
    btnLinhasHiro3.classList.add("hidden");
});

btnAberturaHiroD1.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLanceD1);
    btnLinhasHiro3.classList.add("hidden");
});

btnAberturaHiroD3.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLanceD3);
    btnLinhasHiro3.classList.add("hidden");
});

btnAberturaHiroA3.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaHiroLanceA3);
    btnLinhasHiro3.classList.add("hidden");
});

btnVarianteRaffles2.addEventListener("click", () => {
    mostrarDadosAbertura(varianteRafflesLance2);
    btnLinhasHiro2.classList.add("hidden");
    btnLinhasRaffles3.classList.remove("hidden");
});

btnVarianteRaffles3.addEventListener("click", () => {
    mostrarDadosAbertura(varianteRafflesLance3);
    btnLinhasRaffles3.classList.add("hidden");
});

btnVarianteRafflesC4.addEventListener("click", () => {
    mostrarDadosAbertura(varianteRafflesLanceC4);
    btnLinhasRaffles3.classList.add("hidden");
});

btnAberturaVicius1.addEventListener("click", () => {
    mostrarDadosAbertura(aberturaViciusLance1);
    btnLinhas1.classList.add("hidden");
    btnLinhasVicius2.classList.remove("hidden");
});