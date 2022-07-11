let express = require("express");
const socket = require("socket.io");

let app = express();
const port = process.env.PORT || 5000;
let server = app.listen(port);


app.use(express.static("Public"));

let rooms_count = [];
let fila_espera = [];
//let specs = 0;
let connections_server = 0;
let tempo = 120;

const rooms = [];

for (let i = 0; i < 100; i++){
    rooms_count.push(i);

    rooms[i] = {
        dados: {
            'jogadas': 3,
            'vezBrancas': true,
            'connections': 0,
            'casasAtivas': [],
            'isGameOver': false
        },
        player: {
            'brancas': { playerId: null, pontos: 0, lances: 0, tempo: tempo },
            'pretas': { playerId: null, pontos: 0, lances: 0, tempo: tempo }
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
    };
}

relogio();

function isConnected(x, y, dados){ 

    if (dados.dados.isGameOver)
        return false;

    const lances_brancas = dados.player.brancas.lances;
    const lances_pretas = dados.player.pretas.lances;
    const total_lances = lances_brancas + lances_pretas;
    let lances_player, lance;

    if (total_lances == 15)
        return false;

    if ((x < 0 || x > 3) || (y < 0 || y > 3))
        return false;

    if (dados.dados.jogadas == 3 && dados.player.brancas.lances == 1){
        // Verificação de lance simétrico (1)
        if (dados.pecas_brancas.peca_branca1.x + dados.pecas_brancas.peca_branca1.y + x + y == 6){
            return false;
        }

        return true;
    }

    // if movesBack != 0 -> false

    if (dados.dados.vezBrancas){
        lance = Object.values(dados.pecas_brancas); 
        lances_player = lances_brancas;
    }
    else {
        lance = Object.values(dados.pecas_pretas); 
        lances_player = lances_pretas;
    }

    // Verifica se o lance é legal
    if (dados.dados.jogadas == 2){
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

    if (dados.dados.jogadas == 1){
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
                return false;
            }
            if ((y != Number(lance[lances_player - 1].y) + 1) && (y != Number(lance[lances_player - 1].y) - 1)){
                if ((y != Number(lance[lances_player - 2].y) + 1) && (y != Number(lance[lances_player - 2].y) - 1)){
                    return false;
                }
            }
        }
    }

    // Verfica se os lances são simétricos (2 e 3)
    if (!dados.dados.vezBrancas){
        if (lances_brancas == lances_pretas + 1){
            let pecas_brancas = [];
            let pecas_pretas = [];

            for (let i = 0; i < lances_brancas; i++){
                lance = Object.values(dados.pecas_brancas); 
                pecas_brancas.push(4 * Number(lance[i].y) + Number(lance[i].x));
            }

            for (let i = 0; i < lances_pretas; i++){
                lance = Object.values(dados.pecas_pretas); 
                pecas_pretas.push(4 * Number(lance[i].y) + Number(lance[i].x));
            }
            pecas_pretas.push(4 * y + x);


            if (dados.dados.jogadas == 1){
                if (pecas_brancas[0] + pecas_brancas[1] + pecas_brancas[2] ==
                    (15 - pecas_pretas[0]) + (15 - pecas_pretas[1]) + (15 - pecas_pretas[2])){
                        return false;
                    }
            }
            if (dados.dados.jogadas == 2){
                if (pecas_brancas[0] + pecas_brancas[1] ==
                    (15 - pecas_pretas[0]) + (15 - pecas_pretas[1])){
                        return false;
                    }
            }
        }
    }


    return true;

}

function regLance(lance, quant_lances, data){

    const roomNumber = data.room;

    // Registro do lance - JS
    lance[quant_lances].x = data.x;
    lance[quant_lances].y = data.y;

    rooms[roomNumber].dados.jogadas--;

    data.vezBrancas = rooms[roomNumber].dados.vezBrancas;

    checkTurn(data);
    
    io.sockets.emit("addPecaBackend", data);

    rooms[roomNumber].dados.casasAtivas.push([data.y, data.x]);

    const casasAtivas = rooms[roomNumber].dados.casasAtivas;

    io.sockets.emit("updateCasasAtivas", { roomNumber, casasAtivas });

}

function checkTurn(data){

    if (rooms[data.room].dados.jogadas == 0){
        rooms[data.room].dados.vezBrancas = (rooms[data.room].dados.vezBrancas == true ? false : true);
        rooms[data.room].dados.jogadas = 3;
    }

    if (rooms[data.room].player.brancas.lances + rooms[data.room].player.pretas.lances == 15){
        endGame(rooms[data.room].dados.vezBrancas, data.room);
    }

}

async function relogio(){

    setInterval(() => {
        for (let i = 0; i < rooms_count.length; i++){
            if (rooms[i].dados.connections >= 2 && rooms[i].dados.isGameOver == false){
                (rooms[i].dados.vezBrancas == true ? rooms[i].player.brancas.tempo-- : rooms[i].player.pretas.tempo--);

                const tempo_w = rooms[i].player.brancas.tempo;
                const tempo_b = rooms[i].player.pretas.tempo;
                const roomNumber = i;

                io.sockets.emit("updateRelogio", {tempo_w , tempo_b, roomNumber });

                if (tempo_w == 0){
                    endGame(false, roomNumber);
                }
                else if (tempo_b == 0){
                    endGame(true, roomNumber);
                }
            }
        }
    }, 1000);

}

function endGame(brancasGanham, roomNumber){

    if (brancasGanham){
        rooms[roomNumber].player.brancas.pontos++;
    }
    else {
        rooms[roomNumber].player.pretas.pontos++;
    }

    const brancasPontos = rooms[roomNumber].player.brancas.pontos;
    const pretasPontos = rooms[roomNumber].player.pretas.pontos;

    io.sockets.emit("endGame", { brancasPontos, pretasPontos, brancasGanham, roomNumber });

    rooms[roomNumber].dados.isGameOver = true;

}

function passarVez(id, roomNumber){

    if (rooms[roomNumber].dados.jogadas != 3){
        if (id == rooms[roomNumber].player.brancas.playerId){
            rooms[roomNumber].dados.vezBrancas = false;
            rooms[roomNumber].dados.jogadas = 3;
        }
        else if (id == rooms[roomNumber].player.pretas.playerId){
            rooms[roomNumber].dados.vezBrancas = true;
            rooms[roomNumber].dados.jogadas = 3;
        }
    }

}

function desistir(id, roomNumber){

    if (id == rooms[roomNumber].player.brancas.playerId){
        endGame(false, roomNumber);
    }
    else if (id == rooms[roomNumber].player.pretas.playerId){
        endGame(true, roomNumber);
    }

}

function restart(roomNumber){

    rooms[roomNumber].dados.jogadas = 3;
    rooms[roomNumber].dados.vezBrancas = true;

    for (const peca of Object.values(rooms[roomNumber].pecas_brancas)){
        peca.x = null;
        peca.y = null;
    }

    for (const peca of Object.values(rooms[roomNumber].pecas_pretas)){
        peca.x = null;
        peca.y = null;
    }

    rooms[roomNumber].player.brancas.lances = 0;
    rooms[roomNumber].player.pretas.lances = 0;

    rooms[roomNumber].player.brancas.tempo = tempo;
    rooms[roomNumber].player.pretas.tempo = tempo;

    rooms[roomNumber].dados.casasAtivas = [];

    // Trocar lados
    const tempId = rooms[roomNumber].player.brancas.playerId;
    rooms[roomNumber].player.brancas.playerId = rooms[roomNumber].player.pretas.playerId;
    rooms[roomNumber].player.pretas.playerId = tempId;

    const tempPont = rooms[roomNumber].player.brancas.pontos;
    rooms[roomNumber].player.brancas.pontos = rooms[roomNumber].player.pretas.pontos;
    rooms[roomNumber].player.pretas.pontos = tempPont;

    rooms[roomNumber].dados.isGameOver = false;

}

function createRoom(id1, id2){

    if (rooms_count.length > 0){
        if (rooms[rooms_count[0]].player.brancas.playerId == null){
            rooms[rooms_count[0]].player.brancas.playerId = id1;
        }
        if (rooms[rooms_count[0]].player.pretas.playerId == null){
            rooms[rooms_count[0]].player.pretas.playerId = id2;
        }

        io.sockets.emit("regRoom", rooms_count[0]);

        rooms[rooms_count[0]].dados.connections = 2;

        rooms_count.shift();
    }
    else {
        io.sockets.emit("serverFull", null);
    }

}

function disconnect(id){

    let roomNumber;

    connections_server--;
    io.sockets.emit("updateConnections", connections_server);

    if (fila_espera.includes(id)){
        let index = fila_espera.indexOf(id);

        fila_espera.splice(index, 1);
    }
    else {
        for (let i = 0; i < rooms_count.length; i++){

            if (rooms[i].player.brancas.playerId == id){
                roomNumber = i;
                break;
            }
            else if (rooms[i].player.pretas.playerId == id){
                roomNumber = i;
                break;
            }

        }
    }

    if (roomNumber >= 0){

        if (rooms[roomNumber].dados.connections == 1){
            // Libera a sala para novos usuários
            rooms[roomNumber].player.brancas.pontos = 0;
            rooms[roomNumber].player.pretas.pontos = 0;
            rooms[roomNumber].player.brancas.playerId = null;
            rooms[roomNumber].player.pretas.playerId = null;

            restart(roomNumber);

            rooms_count.push(roomNumber);
        }

        if (rooms[roomNumber].dados.connections == 2){
            if (rooms[roomNumber].dados.isGameOver == false){
                if (id == rooms[roomNumber].player.brancas.playerId){
                    const cor = "Brancas";

                    endGame(false, roomNumber);
                    io.sockets.emit("desconexao", { cor, roomNumber });
                    rooms[roomNumber].dados.connections--;
                }
                else if (id == rooms[roomNumber].player.pretas.playerId){
                    const cor = "Pretas";

                    endGame(true, roomNumber);
                    io.sockets.emit("desconexao", { cor, roomNumber });
                    rooms[roomNumber].dados.connections--;
                }
            }
        }
/*    else{
        specs--;
        io.sockets.emit("updateSpecs", specs);
    }
*/
    }

}


let io = socket(server);
io.on("connection", (socket) => {
    connections_server++;
    io.sockets.emit("updateConnections", connections_server);

    fila_espera.push(socket.id);

/*    if (connections_server > 2){
        specs++;
        if (specs > 0)
            io.sockets.emit("updateSpecs", specs);
    }
*/

    if (fila_espera.length == 2){
        createRoom(fila_espera[0], fila_espera[1]);

        fila_espera = [];
    }

    /* Chat */
    socket.on("chat", (data) => {
        let chatPlayer = null;

        if (socket.id == rooms[data.gameRoom].player.brancas.playerId){
            chatPlayer = "brancas";
        }
        else if (socket.id == rooms[data.gameRoom].player.pretas.playerId){
            chatPlayer = "pretas";
        }

        io.sockets.emit("chat", { data, chatPlayer });
    });

    /* Jogo */
    socket.on("addPecaBackend", (data) => {
        if (isConnected(data.x, data.y, rooms[data.room])){
            let quant_lances = 0;

            if (socket.id == rooms[data.room].player.brancas.playerId && rooms[data.room].dados.vezBrancas == true){
                quant_lances = rooms[data.room].player.brancas.lances;
                rooms[data.room].player.brancas.lances++;

                const lance = Object.values(rooms[data.room].pecas_brancas); 

                regLance(lance, quant_lances, data);
            }
            else if (socket.id == rooms[data.room].player.pretas.playerId && rooms[data.room].dados.vezBrancas == false){
                quant_lances = rooms[data.room].player.pretas.lances;
                rooms[data.room].player.pretas.lances++;

                const lance = Object.values(rooms[data.room].pecas_pretas); 

                regLance(lance, quant_lances, data);
            }

        }

    });

    socket.on("desistir", (data) => {
        desistir(socket.id, data);
    });

    socket.on("passarVez", (data) => {
        passarVez(socket.id, data);
    });

    socket.on("pedirRevanche", (data) => {
        io.sockets.emit("confirmarRevanche", data);
    });

    socket.on("recusarRevanche", (data) => {
        io.sockets.emit("revancheRecusada", data);
    });

    socket.on("restart", (data) => {
        restart(data);
        io.sockets.emit("restart", data);
    });

    socket.on("disconnect", () => {
        disconnect(socket.id);
    });

});

/* to do

- Menu para mostrar conexão do adversário (igual ao lichess)

*/