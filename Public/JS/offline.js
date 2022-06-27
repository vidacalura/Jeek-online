let startSound = new Audio("../imgs/startSound.mkv");
startSound.crossOrigin = "anonymous";
let endSound = new Audio("../imgs/lichessCheckmate.mkv");
endSound.crossOrigin = "anonymous";

/* Menu de tempo */
const menu = document.querySelector(".menu");
const dropboxTempoLabel = document.querySelector(".dropbox-tempo-label");
const dropboxTempo = document.querySelector(".dropbox-tempo");
const dropboxTempoItens = document.querySelectorAll(".dropbox-tempo .option");
let dropboxTempoItensSelected = false;
const tempoLabel = document.querySelector(".tempo-h2");
const menuBtn = document.querySelector(".menu-btn");
const tabuleiroDiv = document.querySelector(".tabuleiro-div");
const blur = document.querySelectorAll(".blur-md");
let tempo, tempo_w, tempo_b;

dropboxTempoLabel.addEventListener("click", () => {
    if (!dropboxTempo.className.includes("active"))
        dropboxTempo.classList.add("active");
    else
        dropboxTempo.classList.remove("active");

});

dropboxTempoItens[0].addEventListener("click", () => {
    tempo = 15;
    dropboxTempoItensSelected = true;
    dropboxTempo.classList.remove("active");
});
dropboxTempoItens[1].addEventListener("click", () => {
    tempo = 30;
    dropboxTempoItensSelected = true;
    dropboxTempo.classList.remove("active");
});
dropboxTempoItens[2].addEventListener("click", () => {
    tempo = 60;
    dropboxTempoItensSelected = true;
    dropboxTempo.classList.remove("active");
});
dropboxTempoItens[3].addEventListener("click", () => {
    tempo = 120;
    dropboxTempoItensSelected = true;
    dropboxTempo.classList.remove("active");
});

for (const item of dropboxTempoItens){
    item.addEventListener("click", () => {
        tempoLabel.textContent = "Tempo: " + (tempo < 60 ? tempo + " s" : tempo / 60 + " min");
    });
}

menuBtn.addEventListener("click", () => {
    if (dropboxTempoItensSelected == true){
        startSound.play();

        menu.classList.add("hidden");

        for (const blured of blur){
            blured.classList.remove("blur-md");
        }

        tempo_w = tempo;
        tempo_b = tempo;

        tempo_w_p.textContent = (tempo % 60 == 0 ? Math.floor(tempo / 60) + ":" +
        Math.floor(tempo % 60) + "0" : Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60));
        tempo_b_p.textContent = (tempo % 60 == 0 ? Math.floor(tempo / 60) + ":" +
        Math.floor(tempo % 60) + "0" : Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60));

        // Inicialização do jogo
        clock();
        gridEventListener();
        passarBtn.addEventListener("click", passarVez);
        desistirBtn.addEventListener("click", desistir);
        backBtn.addEventListener("click", goBack);
        forwardBtn.addEventListener("click", goForward);
    }
    else{
        alert("Selecione o modo e tempo de jogo antes de iniciar a partida");
    }

});

/* Jogo */ 
let turn = "white";
let jogadas = 3;
const relogio_w = document.querySelector(".relogio-brancas");
const relogio_b = document.querySelector(".relogio-pretas");
const tempo_w_p = document.querySelector(".tempo-white");
const tempo_b_p = document.querySelector(".tempo-black");
const endgame_p = document.querySelector(".endgame-p");
let board = document.querySelector(".tabuleiro");
let returnBtnDiv = document.querySelector(".return-move-div");
let casas = [];
let casas_ativas = [];
let lances = -1;
let gameIsOver = false;
const passarBtn = document.querySelector(".botao-passar");
const desistirBtn = document.querySelector(".botao-desistir");
const restartBtn = document.querySelector(".botao-restart");
let movesBack = 0;
const backBtn = document.querySelector(".move-back");
const forwardBtn = document.querySelector(".move-forward");

createGrid();

// async func para tempo
async function clock(){

    setInterval(() => {
        if (gameIsOver == false){
            (turn == "white" ? tempo_w-- : tempo_b--);

            if (turn == "white"){

                tempo_w_p.textContent = (tempo_w % 60 < 10 ? Math.floor(tempo_w / 60) + ":" + "0" + Math.floor(tempo_w % 60)
                : Math.floor(tempo_w / 60) + ":" + Math.floor(tempo_w % 60));

                if (tempo_w < tempo / 10){
                    relogio_w.classList.add("tempo-caindo");
                }

            }
            else{

                tempo_b_p.textContent = (tempo_b % 60 < 10 ? Math.floor(tempo_b / 60) + ":" + "0" + Math.floor(tempo_b % 60)
                : Math.floor(tempo_b / 60) + ":" + Math.floor(tempo_b % 60));

                if (tempo_b < tempo / 10){
                    relogio_b.classList.add("tempo-caindo");
                }

            }


            if (tempo_w == 0){
                endgame_p.textContent = "Tempo esgotado! Brancas perdem!";
                restart();
            }
            else if (tempo_b == 0){
                endgame_p.textContent = "Tempo esgotado! Pretas perdem!";
                restart();
            }
        }

    }, 1000);


}

function passarVez(){

    if (jogadas < 3){
        if (turn == "white"){
            turn = "black";
        }
        else{
            turn = "white";
        }

        jogadas = 3;
    }

}

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

function gridEventListener(){

    for (const casa_ataque of casas){
        casa_ataque.addEventListener("click", (e) => {
            if (!casas_ativas.includes(casa_ataque.dataset.id)){
                if ((isConnected(Number(casa_ataque.dataset.id))) && (movesBack == 0) && (casas_ativas.length < 15)){
                    // Captar e registrar movimento
                    const peca = document.createElement("div");
                    
                    if (turn == "white")
                        peca.classList.add("peca-branca");
                    else
                        peca.classList.add("peca-preta");

                    casa_ataque.appendChild(peca);
                    casas_ativas.push(casa_ataque.dataset.id);

                    if(casas_ativas.length == 15){
                        endgame();
                    }

                    jogadas--;

                    if (jogadas == 0){
                        if (turn == "white"){
                            turn = "black";
                            jogadas = 3;
                        }
                        else{
                            turn = "white";
                            jogadas = 3;
                        }
                    }

                    lances++;
                    autoPass(casa_ataque.dataset.id);
                }
            }
        });
    }

}

function desistir(){

    if (turn == "white"){
        endgame_p.textContent = "Brancas desistem. Pretas ganham!";
    }
    else {
        endgame_p.textContent = "Pretas desistem. Brancas ganham!";
    }

    restart();

}

function goBack(){

    if (movesBack < casas_ativas.length)
        movesBack++;

    casas[Number(casas_ativas[casas_ativas.length - movesBack])].firstChild.classList.add("hidden");

}

function goForward(){

    casas[Number(casas_ativas[casas_ativas.length - movesBack])].firstChild.classList.remove("hidden");

    if (movesBack > 0)
        movesBack--;

}

function isConnected(casa_num){

    if (jogadas == 3){
        if ((casas_ativas.length == 1) &&
        (Number(casas_ativas[0]) == 
        (15 - casa_num))){
            alert("O primeiro lance não pode ser espelhado!");
            return false;
        }

        return true;
    }

    if (casa_num > 15 || casa_num < 0)
        return false;

    // Verifica se o lance é legal
    if ((casa_num != Number(casas_ativas[lances]) - 1) && (casa_num != Number(casas_ativas[lances]) + 1) &&
    (casa_num != Number(casas_ativas[lances]) - 4) && (casa_num != Number(casas_ativas[lances]) + 4)){
        if (jogadas != 1){
            return false;
        }
    }

    if ((Number(casas_ativas[lances]) % 4 == 0) && (casa_num == Number(casas_ativas[lances]) - 1)){
        return false;
    }

    if (((Number(casas_ativas[lances]) == 3) || (Number(casas_ativas[lances]) == 7) || 
    (Number(casas_ativas[lances]) == 11)) && (casa_num == Number(casas_ativas[lances]) + 1)){
        return false;
    }    

    // Permite apenas lances horizontais caso os primeiros 2 lances tenham sido horizontais
    if ((jogadas == 1) && ((Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) - 1) || 
    (Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) + 1))){
        if ((casa_num != Number(casas_ativas[lances]) - 1) && (casa_num != Number(casas_ativas[lances]) + 1)){
            if ((casa_num != Number(casas_ativas[lances - 1]) - 1) && (casa_num != Number(casas_ativas[lances - 1]) + 1)){
                return false;
            }

        }
    }

    // Permite apenas lances verticais caso os primeiros 2 lances tenham sido verticais
    if ((jogadas == 1) && ((Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) - 4) || 
    (Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) + 4))){
        if ((casa_num != Number(casas_ativas[lances]) - 4) && (casa_num != Number(casas_ativas[lances]) + 4)){
            if ((casa_num != Number(casas_ativas[lances - 1]) - 4) && (casa_num != Number(casas_ativas[lances - 1]) + 4)){
                return false;
            }

        }
    }

    // Verfica se os lances são simétricos
    if ((casas_ativas.length == 5) && 
    (turn == "black") &&
    (Number(casas_ativas[0]) + Number(casas_ativas[1]) + Number(casas_ativas[2])) == 
    ((15 - Number(casas_ativas[3])) + (15 - Number(casas_ativas[4])) + (15 - casa_num))){
        alert("O primeiro lance não pode ser espelhado!");
        return false;
    }
    
    if ((casas_ativas.length == 3) &&
    (turn == "black") &&
    (Number(casas_ativas[0]) + Number(casas_ativas[1])) == 
    ((15 - Number(casas_ativas[2])) + (15 - casa_num))){
        return false;
    }


    return true;

}

function autoPass(casa_num){

    casa_num = Number(casa_num);

    if (!isConnected(casa_num - 1) || casas_ativas.includes((casa_num - 1).toString())){
        if (!isConnected(casa_num + 1) || casas_ativas.includes((casa_num + 1).toString())){
            if (!isConnected(casa_num - 4) || casas_ativas.includes((casa_num - 4).toString())){
                if (!isConnected(casa_num + 4) || casas_ativas.includes((casa_num + 4).toString())){
                    if (jogadas != 3){
                        casa_ant = Number(casas_ativas[lances - 1]);
                        if (!isConnected(casa_ant - 1) || casas_ativas.includes((casa_ant - 1).toString())){
                            if (!isConnected(casa_ant + 1) || casas_ativas.includes((casa_ant + 1).toString())){
                                if (!isConnected(casa_ant - 4) || casas_ativas.includes((casa_ant - 4).toString())){
                                    if (!isConnected(casa_ant + 4) || casas_ativas.includes((casa_ant + 4).toString())){
                                        passarVez();
                                    }
                                }
                            }
                        }
                    }
                    else{
                        passarVez();
                    }
                }
            }
        }
    }

}

function endgame(){

    if (turn == "white"){
        endgame_p.textContent = "Vitória das brancas!";
    }
    else{
        endgame_p.textContent = "Vitória das pretas!";
    }

    restart();

}

function restart(){

    gameIsOver = true;
    endSound.play();

    passarBtn.classList.add("hidden");
    desistirBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");

    restartBtn.addEventListener("click", () => {
        casas = [];
        casas_ativas = [];
        jogadas = 3;
        lances = -1;
        turn = "white";
        gameIsOver = false;
        movesBack = 0;

        tempo_w_p.textContent = (tempo % 60 == 0 ? Math.floor(tempo / 60) + ":" +
        Math.floor(tempo % 60) + "0" : Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60));
        tempo_b_p.textContent = (tempo % 60 == 0 ? Math.floor(tempo / 60) + ":" +
        Math.floor(tempo % 60) + "0" : Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60));

        board.remove();
        board = document.createElement("section");
        board.classList = "tabuleiro w-auto mt-12";
        tabuleiroDiv.appendChild(board);

        tempo_w = tempo;
        tempo_b = tempo;

        if (relogio_w.className.includes("tempo-caindo")){
            relogio_w.classList.remove("tempo-caindo");
        }    
        if (relogio_b.className.includes("tempo-caindo")){
            relogio_b.classList.remove("tempo-caindo");
        }

        createGrid();
        gridEventListener();

        passarBtn.classList.remove("hidden");
        desistirBtn.classList.remove("hidden");
        restartBtn.classList.add("hidden");

        endgame_p.textContent = "";
        startSound.play();
    });

}

/* Key bindings */
document.addEventListener("keydown", (e) => {

    let key = e.key;

    if (key == 'p' || key == 'P'){
        passarVez();
    }
    else if(key == 'd' || key == 'D'){
        desistir();
    }
    else if(key == "ArrowLeft"){
        goBack();
    }
    else if(key == "ArrowRight"){
        goForward();
    }

});

board.addEventListener("contextmenu", (e) => {

    e.preventDefault();

});