const port = "http://localhost:" + 80;
console.log(port);

let socket = io.connect(port);

const mensagensField = document.querySelector(".msgs");
const textbox = document.querySelector(".chat-txtbox");
const enviarBtn = document.querySelector(".chat-btn ");
enviarBtn.addEventListener("click", enviarMsg);
const desistirBtn = document.querySelector(".botao-desistir");
desistirBtn.addEventListener("click", desistir);
const passarBtn = document.querySelector(".botao-passar");
passarBtn.addEventListener("click", passarVez);
const revancheBtn = document.querySelector(".botao-restart");
revancheBtn.addEventListener("click", pedirRevanche);
const endgame_p = document.querySelector(".endgame-p");
const tempo_w_p = document.querySelector(".tempo-white");
const tempo_b_p = document.querySelector(".tempo-black");
const specsDiv = document.querySelector(".specs-div");
const specsIcon = document.querySelector(".specs-icon");
const telaCarregamento = document.querySelector(".tela-carregamento");
const main = document.querySelector("main");
let board = document.querySelector(".tabuleiro");
const tabuleiroDiv = document.querySelector(".tabuleiro-div");
let tabuleiro = [];

createGrid();
gridEventListener();
socket.emit("createPlayer", socket.id);


function createGrid(){

    let count = 0;
    let col_list = [];

    for (let i = 0; i < 4; i++){

        let col_list = [];
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

            col_list.push(casa);

            col.appendChild(casa);

            count++;
        }

        tabuleiro.push(col_list);
    }

}

function gridEventListener(){

    for (i = 0; i < tabuleiro.length; i++){
        for (j = 0; j < tabuleiro[i].length; j++){
            const y = i;
            const x = j;

            tabuleiro[y][x].addEventListener("click", () => {
                if (!tabuleiro[y][x].hasChildNodes()){
                    socket.emit("addPecaBackend", { y: y, x: x });
                }
            });
        }
    }

}

function addPeca(y, x, vezBrancas){

    // Registro do lance - Visual
    const peca = document.createElement("div");
                    
    if (vezBrancas == true)
        peca.classList.add("peca-branca");
    else
        peca.classList.add("peca-preta");


    tabuleiro[y][x].appendChild(peca);


}

function desistir(){

    socket.emit("desistir", null);

}

function passarVez(){

    socket.emit("passarVez", null);

}

function pedirRevanche(){

    // Se o pedido for aceito
        socket.emit("restart", null);
        restart();

}

function relogio(tempo_w, tempo_b){

    tempo_w_p.textContent = (tempo_w % 60 < 10 ? Math.floor(tempo_w / 60) + ":" + "0" + Math.floor(tempo_w % 60)
    : Math.floor(tempo_w / 60) + ":" + Math.floor(tempo_w % 60));

    tempo_b_p.textContent = (tempo_b % 60 < 10 ? Math.floor(tempo_b / 60) + ":" + "0" + Math.floor(tempo_b % 60)
    : Math.floor(tempo_b / 60) + ":" + Math.floor(tempo_b % 60));

}

function specs(quant_specs){

    if (specsDiv.className.includes("hidden"))
        specsDiv.classList.remove("hidden");

    specsIcon.textContent = " " + quant_specs;

}

function endGame(data){

    desistirBtn.classList.add("hidden");
    passarBtn.classList.add("hidden");
    revancheBtn.classList.remove("hidden");

    // Mostrar placar
    endgame_p.textContent = data.brancasPontos + " - " + data.pretasPontos + "   ";

    // Mostrar quem foi vitorioso
    endgame_p.textContent += "Vitória das " + (data.brancasGanham == true ? "brancas" : "pretas") + "!";

}

function mensagemJogo(msg){

    const mensagem_jogo = document.createElement("p");

    mensagem_jogo.textContent = msg;
    mensagem_jogo.className = "italic text-center px-6 text-jeek-gray-300";

    mensagensField.appendChild(mensagem_jogo);

}

function restart(){

    tabuleiro = [];
    board.remove();
    board = document.createElement("section");
    board.classList = "tabuleiro mt-12";
    tabuleiroDiv.appendChild(board);

    createGrid();
    gridEventListener();

    desistirBtn.classList.remove("hidden");
    passarBtn.classList.remove("hidden");
    revancheBtn.classList.add("hidden");

    endgame_p.textContent = " ";

}

/* Chat */
function enviarMsg(){

    socket.emit("chat", textbox.value);
    clearTextbox();

}

function regMsg(data){

    console.log(data.chatPlayer);

    if (data.chatPlayer != null){

        const mensagem = document.createElement("div");
        mensagem.classList.add("msg");

        const peca = document.createElement("div");
        peca.className = (data.chatPlayer == "brancas" ? "peca-branca-chat" : "peca-preta-chat");

        const mensagem_p = document.createElement("p");
        mensagem_p.classList.add("msg-p");

        mensagem_p.textContent = data.data;

        mensagem.appendChild(peca);
        mensagem.appendChild(mensagem_p);
        mensagensField.appendChild(mensagem);
        
    }

}

function clearTextbox(){

    textbox.value = "";

}


/* Listeners do server */
socket.on("chat", (data) => {
    regMsg(data);
});

socket.on("addPecaBackend", (data) => {
    addPeca(data.y, data.x, data.vezBrancas);
});

socket.on("endGame", (data) => {
    endGame(data);
});

socket.on("restart", (data) => {
    restart();
});

socket.on("desconexao", (data) => {
    mensagemJogo(data + " saíram do jogo, encerrando partida...");
});

socket.on("updateRelogio", (data) => {
    relogio(data.tempo_w, data.tempo_b);
});

socket.on("updateSpecs", (data) => {
    specs(data);
});

/* Tela de espera */
socket.on("updateConnections", (con) => {
    if (con >= 2){
        telaCarregamento.classList.add("hidden");
        main.classList.remove("hidden");
    }
});