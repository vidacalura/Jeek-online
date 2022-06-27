let express = require("express");
const socket = require("socket.io");

let app = express();
const port = process.env.PORT || 5000;
let server = app.listen(port);


app.use(express.static("Public"));

let jogadas = 3;
let specs = 0;
let connections = 0;
let vezBrancas = true;
let tempo = 300, tempo_w = tempo, tempo_b = tempo;

const dados = {
    player: {
        'brancas': { playerId: null, pontos: 0, lances: 0 },
        'pretas': { playerId: null, pontos: 0, lances: 0 }
    },
    pecas_brancas: {
        'peca_branca1': { x: null, y: null },
        'peca_branca2': { x: null, y: null },
        'peca_branca3': { x: null, y: null },
        'peca_branca4': { x: null, y: null },
        'peca_branca5': { x: null, y: null },
        'peca_branca6': { x: null, y: null },
        'peca_branca7': { x: null, y: null },
        'peca_branca8': { x: null, y: null },
        'peca_branca9': { x: null, y: null },
        'peca_branca10': { x: null, y: null },
        'peca_branca11': { x: null, y: null },
        'peca_branca12': { x: null, y: null }
    },
    pecas_pretas: {
        'peca_preta1': { x: null, y: null },
        'peca_preta2': { x: null, y: null },
        'peca_preta3': { x: null, y: null },
        'peca_preta4': { x: null, y: null },
        'peca_preta5': { x: null, y: null },
        'peca_preta6': { x: null, y: null },
        'peca_preta7': { x: null, y: null },
        'peca_preta8': { x: null, y: null },
        'peca_preta9': { x: null, y: null },
        'peca_preta10': { x: null, y: null },
        'peca_preta11': { x: null, y: null },
        'peca_preta12': { x: null, y: null }
    }
}

relogio();

function isConnected(x, y){ 

    const lances_brancas = dados.player.brancas.lances;
    const lances_pretas = dados.player.pretas.lances;
    const total_lances = lances_brancas + lances_pretas;
    let lances_player, lance;

    if (total_lances == 15)
        return false;

    if ((x < 0 || x > 3) || (y < 0 || y > 3))
        return false;

    if (jogadas == 3){
        // Verificação de lance simétrico (1)

        return true;
    }

    // if movesBack != 0 -> false

    if (vezBrancas){
        lance = Object.values(dados.pecas_brancas); 
        lances_player = lances_brancas;
    }
    else {
        lance = Object.values(dados.pecas_pretas); 
        lances_player = lances_pretas;
    }

    // Verifica se o lance é legal
    if (jogadas == 2){
        if ((y != Number(lance[lances_player - 1].y) + 1) && (y != Number(lance[lances_player - 1].y) - 1) &&
        (x != Number(lance[lances_player - 1].x) + 1) && (x != Number(lance[lances_player - 1].x) - 1)){
                return false;  
        } 

        if ((y == Number(lance[lances_player - 1].y) + 1) || (y == Number(lance[lances_player - 1].y) - 1)){
            if ((x == Number(lance[lances_player - 1].x) + 1) || (x == Number(lance[lances_player - 1].x) - 1)){
                return false;  
            }
        }
    } 

    if (jogadas == 1){
        // Permite apenas lances horizontais caso os primeiros 2 lances tenham sido horizontais
        if (lance[lances_player - 1].y == lance[lances_player - 2].y){
            if (y != lance[lances_player - 1].y){
                return false
            }
            if ((x != Number(lance[lances_player - 1].x) + 1) && (x != Number(lance[lances_player - 1].x) - 1)){
                if ((x != Number(lance[lances_player - 2].x) + 1) && (x != Number(lance[lances_player - 2].x) - 1)){
                    return false;
                }
            }
        }

        // Permite apenas lances verticais caso os primeiros 2 lances tenham sido verticais
        if (lance[lances_player - 1].x == lance[lances_player - 2].x){
            if (x != lance[lances_player - 1].x){
                return false
            }
            if ((y != Number(lance[lances_player - 1].y) + 1) && (y != Number(lance[lances_player - 1].y) - 1)){
                if ((y != Number(lance[lances_player - 2].y) + 1) && (y != Number(lance[lances_player - 2].y) - 1)){
                    return false;
                }
            }
        }
    }

    // Verfica se os lances são simétricos (2 e 3)
    if (!vezBrancas){
        if (lances_brancas == lances_pretas + 1){
            if (lances_brancas == 3){
                // soma 6
            }
            else if (lances_brancas == 2){
                // soma 6
            }
        }
    }


    return true;

}

function regLance(lance, quant_lances, data){

    // Registro do lance - JS
    lance[quant_lances].x = data.x;
    lance[quant_lances].y = data.y;

    jogadas--;

    data.vezBrancas = vezBrancas;

    checkTurn();
    
    io.sockets.emit("addPecaBackend", data);

}

function checkTurn(){

    if (jogadas == 0){
        vezBrancas = (vezBrancas == true ? false : true);
        jogadas = 3;
    }

    if (dados.player.brancas.lances + dados.player.pretas.lances == 15){
        endGame(vezBrancas);
    }

}

async function relogio(){

    setInterval(() => {
        if (connections >= 2){
            (vezBrancas == true ? tempo_w-- : tempo_b--);
            io.sockets.emit("updateRelogio", { tempo_w, tempo_b });

            if (tempo_w == 0){
                endGame(false);
            }
            else if (tempo_b == 0){
                endGame(true);
            }
        }
    }, 1000);

}

function endGame(brancasGanham){

    if (brancasGanham){
        dados.player.brancas.pontos++;
    }
    else {
        dados.player.pretas.pontos++;
    }

    const brancasPontos = dados.player.brancas.pontos;
    const pretasPontos = dados.player.pretas.pontos;

    io.sockets.emit("endGame", { brancasPontos, pretasPontos, brancasGanham });

    // Parar relógio

}

function passarVez(id){

    if (jogadas != 3){
        if (id == dados.player.brancas.playerId){
            vezBrancas = false;
            jogadas = 3;
        }
        else if (id == dados.player.pretas.playerId){
            vezBrancas = true;
            jogadas = 3;
        }
    }

}

function desistir(id){

    if (id == dados.player.brancas.playerId){
        endGame(false);
    }
    else if (id == dados.player.pretas.playerId){
        endGame(true);
    }

}

function restart(){

    jogadas = 3;
    vezBrancas = true;

    for (const peca of Object.values(dados.pecas_brancas)){
        peca.x = null;
        peca.y = null;
    }

    for (const peca of Object.values(dados.pecas_pretas)){
        peca.x = null;
        peca.y = null;
    }

    dados.player.brancas.lances = 0;
    dados.player.pretas.lances = 0;

    tempo_w = tempo;
    tempo_b = tempo;

}


let io = socket(server);
io.on("connection", (socket) => {
    connections++;
    io.sockets.emit("updateConnections", connections);

    if (connections > 2){
        specs++;
        if (specs > 0)
            io.sockets.emit("updateSpecs", specs);
    }

    if (dados.player.brancas.playerId == null){
        dados.player.brancas.playerId = socket.id;
    }
    else if (dados.player.pretas.playerId == null){
        dados.player.pretas.playerId = socket.id;
    }

    /* Chat */
    socket.on("chat", (data) => {
        let chatPlayer = null;

        if (socket.id == dados.player.brancas.playerId){
            chatPlayer = "brancas";
        }
        else if (socket.id == dados.player.pretas.playerId){
            chatPlayer = "pretas";
        }

        io.sockets.emit("chat", { data, chatPlayer });
    });

    /* Jogo */
    socket.on("addPecaBackend", (data) => {
        if (isConnected(data.x, data.y)){
            let quant_lances = 0;

            if (socket.id == dados.player.brancas.playerId && vezBrancas == true){
                quant_lances = dados.player.brancas.lances;
                dados.player.brancas.lances++;

                const lance = Object.values(dados.pecas_brancas); 

                regLance(lance, quant_lances, data);
            }
            else if (socket.id == dados.player.pretas.playerId && vezBrancas == false){
                quant_lances = dados.player.pretas.lances;
                dados.player.pretas.lances++;

                const lance = Object.values(dados.pecas_pretas); 

                regLance(lance, quant_lances, data);
            }

        }

    });

    socket.on("desistir", (data) => {
        desistir(socket.id);
    });

    socket.on("passarVez", (data) => {
        passarVez(socket.id);
    });

    socket.on("restart", (data) => {
        restart();
        io.sockets.emit("restart", data);
    });

    socket.on("disconnect", () => {
        if (socket.id == dados.player.brancas.playerId){
            endGame(false);
            io.sockets.emit("desconexao", "brancas");
        }
        else if (socket.id == dados.player.pretas.playerId){
            endGame(true);
            io.sockets.emit("desconexao", "pretas");
        }
        else{
            specs--;
            io.sockets.emit("updateSpecs", specs);
        }
    });
});

/* to do

- Criar players apenas quando o botão na tela principal for apertado
- isGameOver
- game room (com captcha)
- Tela de espera
- revanche
- isConnected()
- autoPass()
- Voltar lances
- Tempo

*/