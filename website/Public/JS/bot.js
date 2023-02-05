let startSound = new Audio("../imgs/startSound.mkv");
startSound.crossOrigin = "anonymous";
let endSound = new Audio("../imgs/lichessCheckmate.mkv");
endSound.crossOrigin = "anonymous";

class Jogador {
    constructor(nome, lado, pontos) {
        this.nome = nome;
        this.lado = lado;
        this.pontos = pontos;
    }
}

/* Jogo */ 
let movimentos = null;
let turn = "white";
let jogadas = 3;
const endgame_p = document.querySelector(".endgame-p");
let board = document.querySelector(".tabuleiro");
let tabuleiroDiv = document.querySelector(".tabuleiro-div");
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

const textbox = document.getElementById("chat-txtbox");
const enviarBtn = document.querySelector(".chat-btn ");

const usernameBrancas = document.querySelector(".anon-brancas");
const usernamePretas = document.querySelector(".anon-pretas");

let jogador = new Jogador("Você", "white", 0);
let jeekens = new Jogador("Jeekens (400)", "black", 0);

mostrarNomes();

createGrid();
gridEventListener();
jeekensEnviarMsg();

passarBtn.addEventListener("click", passarVez);
desistirBtn.addEventListener("click", desistir);
backBtn.addEventListener("click", goBack);
forwardBtn.addEventListener("click", goForward);


async function mostrarNomes() {

    await fetch("/getSessao")
    .then((res) => { return res.json(); })
    .then(async (res) => {
        if (res.username){
            jogador.nome = res.username + " (" + 
            await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + res.username)
            .then((res) => { return res.json() })
            .then((res) => { return res.elo })
            + ")";
        }

        usernameBrancas.textContent = jogador.nome;
        usernamePretas.textContent = jeekens.nome;
    });

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

    if (turn == jeekens.lado) {
        jeekensMovimentoRequest();
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
            if (turn == jogador.lado) {
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
                            endgame(turn);
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
                            passarVez();
                        }

                        lances++;
                        autoPass(casa_ataque.dataset.id);
                    }
                }
            }
        });
    }

}

async function jeekensMovimentoRequest(){

    const turno = (turn == "white" ? "B" : "P");

    const tabuleiro = [];
    let i = 0, j = 0, col = [];
    casas.forEach((casa) => {
        if (casa.childElementCount == 0) {
            col.push(".");
        }
        else if (casa.childNodes[0].classList[0] == "peca-branca") {
            col.push("B");
        }
        else {
            col.push("P");
        }

        if (j == 3){
            i++;
            j = 0;

            tabuleiro.push(col);
            col = [];
        }
        else {
            j++;
        }
    });

    if (!movimentos) {
        movimentos = "";
        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro.length; j++) {
                if (tabuleiro[i][j] == "B") {
                    switch (j) {
                        case 0:
                            movimentos += "A";
                            break;
                        case 1:
                            movimentos += "B";
                            break;
                        case 2:
                            movimentos += "C"
                            break;
                        case 3:
                            movimentos += "D"
                            break;
                    }

                    movimentos = movimentos + (i + 1) + " ";
                }
            }
        }

        const lances_ia = (jeekens.lado == "white" ? 0 : 1)
        await fetch("https://jeek-online-jeekens.vercel.app/jeekens/400elo", {
            method: "POST", 
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                turno,
                tabuleiro,
                movimentos,
                lances: lances_ia
            })
        })
        .then((res) => { return res.json(); })
        .then((res) => {
            jeekensMovimento(res);
        })
    }
    else {
        await fetch("https://jeek-online-jeekens.vercel.app/jeekens/400elo", {
            method: "POST", 
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                turno,
                tabuleiro,
                movimentos,
                lances: lances + 1
            })
        })
        .then((res) => { return res.json(); })
        .then((res) => {
            jeekensMovimento(res);
        })
    }

}

function jeekensMovimento(lance) {
    
    lance.forEach((m) => {
        let x = 0, y = 0;

        // Converte eixo X
        switch (m[0]) {
            case "d":
                x = 3;
                break;
            case "c":
                x = 2;
                break;
            case "b":
                x = 1;
                break;
            case "a":
                break;
        }

        // Converte eixo Y
        y = Number(m[1]) - 1;
        const casa = (4 * y) + x;
        
        // Joga peça
        const peca = document.createElement("div");              
        if (jeekens.lado == "white")
            peca.classList.add("peca-branca");
        else
            peca.classList.add("peca-preta");

        casas[casa].appendChild(peca);
        casas_ativas.push(String(casa));

        if(casas_ativas.length == 15){
            endgame(turn);
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
    });

    passarVez();
}

function desistir(){

    endgame(jeekens.lado);

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
        (turn == "black") && (jogadas == 1) &&
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
    (turn == "black") && (jogadas == 3) &&
    (Number(casas_ativas[0]) + Number(casas_ativas[1]) + Number(casas_ativas[2])) == 
    ((15 - Number(casas_ativas[3])) + (15 - Number(casas_ativas[4])) + (15 - casa_num))){
        alert("O primeiro lance não pode ser espelhado!");
        return false;
    }
    
    if ((casas_ativas.length == 3) &&
    (turn == "black") && (jogadas == 2) &&
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

function endgame(vencedor){

    if (jogador.lado == vencedor){
        jogador.pontos++;

        endgame_p.innerHTML = jogador.nome + " vence! <br>";
        endgame_p.innerHTML += jogador.pontos + " - " + jeekens.pontos;
    }
    else{
        jeekens.pontos++;

        endgame_p.innerHTML = jeekens.nome + " vence! <br>";
        endgame_p.innerHTML += jogador.pontos + " - " + jeekens.pontos;
    }

    restart();

}

function restart(){

    gameIsOver = true;
    endSound.play();

    passarBtn.classList.add("hidden");
    desistirBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");

}

restartBtn.addEventListener("click", () => {
    casas = [];
    casas_ativas = [];
    jogadas = 3;
    lances = -1;
    turn = "white";
    gameIsOver = false;
    movesBack = 0;

    const swap = jogador.lado;
    jogador.lado = jeekens.lado;
    jeekens.lado = swap;

    board.remove();
    board = document.createElement("section");
    board.classList = "tabuleiro w-auto mt-12";
    tabuleiroDiv.appendChild(board);

    usernameBrancas.textContent = (jogador.lado == "white" ? jogador.nome : jeekens.nome);
    usernamePretas.textContent = (jogador.lado == "black" ? jogador.nome : jeekens.nome);

    createGrid();
    gridEventListener();

    passarBtn.classList.remove("hidden");
    desistirBtn.classList.remove("hidden");
    restartBtn.classList.add("hidden");

    endgame_p.textContent = "";
    startSound.play();

    if (jeekens.lado == "white")
        jeekensMovimentoRequest();
});

/* Chat */
enviarBtn.addEventListener("click", () => enviarMsg(jogador, textbox.value));

textbox.addEventListener("keyup", (e) => {
    e.preventDefault();

    if (e.key == "Enter"){
        enviarMsg(jogador, textbox.value);
    }
});

function enviarMsg(remetente, texto){

    const text = texto.trim();

    const mensagem = document.createElement("div");
    mensagem.classList.add("msg");

    const peca = document.createElement("div");
    peca.className = (remetente.lado == "white" ? "peca-branca-chat" : "peca-preta-chat");

    const mensagem_p = document.createElement("p");
    mensagem_p.classList.add("msg-p");

    mensagem_p.textContent = text;

    const mensagensField = document.querySelector(".msgs");

    mensagem.appendChild(peca);
    mensagem.appendChild(mensagem_p);
    mensagensField.appendChild(mensagem);

    mensagensField.scrollTop = mensagensField.scrollHeight - mensagensField.clientHeight;
    
    if (!remetente.nome.includes("jeekens"))
        clearTextbox();

}

function jeekensEnviarMsg() {

    const jeekensFalas = [
        "Boa sorte! :)",
        "Espero não te desapontar, mestre!",
        "Irei dar meu melhor, mestre!",
        "Espero aprender muito com você, mestre!",
        "Vê se pega leve, mestre! :)",
        "Eu posso estar começando agora, mas um dia eu ainda vou te destruir :)",
        "Algum dia você ainda irá implorar por perdão :)"
    ];

    enviarMsg(jeekens, jeekensFalas[Math.floor(Math.random() * jeekensFalas.length)]);

}

function clearTextbox(){
    textbox.value = "";
}

/* Key bindings */
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key == 'p' || key == 'P'){
        passarVez();
    }
    else if(key == 'd' || key == 'D'){
        if (e.target.id != "chat-txtbox")
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