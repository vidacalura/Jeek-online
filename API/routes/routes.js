const db = require("../db/db");

const express = require("express");
const router = express.Router();

/* Rotas */
router.get("/ping", (req, res) => {
    res.status(200).json({ "message": "Pong!" });
});

router.post("/usuarios/cadastro", async (req, res) => {

    const { username, senha } = req.body;

    if (username && senha.length == 128){

        db.promise()
        .execute("INSERT INTO usuarios VALUES(?, ?, ?, CURDATE(), ?);", [
            randCod(),
            username,
            1000,
            senha
        ])
        .then(() => {
            res.status(200).json({ "message": "Usuário cadastrado com sucesso!" });
        })
        .catch((error) => {
            // Se código já estiver sendo usado
            if (error.sqlMessage.includes("for key 'usuarios.PRIMARY' (errno 1062)")){
                res.redirect(307, "/api/usuarios/cadastro");
            }
            // Se nome já estiver sendo usado
            else if (error.sqlMessage.includes("for key 'usuarios.username' (errno 1062)")){
                res.status(422).json({ "error": "Nome de usuário já está em uso" });
            }
            else {
                res.status(500).json({ "error": "Não foi possível cadastrar o usuário. Tente novamente mais tarde" });
            }
        });

    }
    else {
        res.status(422).json({ "error": "Nome de usuário ou senha inválidos" });
    }

});

router.post("/usuarios/login", (req, res) => {

    const { username, senha } = req.body;

    if (username && senha.length == 128){
        db.promise()
        .execute("SELECT cod_usuario FROM usuarios WHERE username = ? AND senha = ?;", [
            username,
            senha
        ])
        .then(([rows]) => {
            if (rows[0] != null){
                res.status(200).json({ "message": "Usuário encotrado com sucesso!" });
            }
            else {
                res.status(404).json({ "error": "Nome de usuário ou senha incorretos" });
            }
        })
        .catch ((error) => {
            res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
        });
    }
    else {
        res.status(422).json({ "error": "Nome de usuário ou senha inválidos" });
    }

});

router.put("/usuarios", async (req, res) => {

    const { username, usernameNovo, senhaNova } = req.body;

    if (username){
        if (usernameNovo){
            db.promise()
            .execute("UPDATE usuarios SET username = ? WHERE username = ?;", [
                usernameNovo,
                username
            ])
            .then(() => {
                if (senhaNova){
                    db.promise()
                    .execute("UPDATE usuarios SET senha = ? WHERE username = ?;", [
                        senhaNova,
                        usernameNovo
                    ])
                    .then(() => {
                        res.status(200).json({ "message": "Usuário atualizado com sucesso" });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(422).json({ "error": "Erro ao atualizar senha" });
                    });
                }
                else {
                    res.status(200).json({ "message": "Usuário atualizado com sucesso" });
                }
            })
            .catch((error) => {
                res.status(404).json({ "error": "Erro ao atualizar nome do usuário" });
            });
        }
        else {
            db.promise()
            .execute("UPDATE usuarios SET senha = ? WHERE username = ?;", [
                senhaNova,
                usernameNovo
            ])
            .then(() => {
                res.status(200).json({ "message": "Usuário atualizado com sucesso" });
            })
            .catch((error) => {
                console.log(error);
                res.status(422).json({ "error": "Erro ao atualizar senha" });
            });
        }
    }
    else {
        res.status(422).json({ "error": "Dados insuficientes" });
    }

});

router.delete("/usuarios", (req, res) => {

    const { username, senha } = req.body;
    
    if (username && senha){
        db.promise()
        .execute("DELETE FROM usuarios WHERE username = ? AND senha = ?;", [
            username,
            senha
        ])
        .then(() => {
            res.status(200).json({ "message": "Usuário deletado com sucesso" });
        })
        .catch((error) => {
            res.status(500).json({ "error": "Usuário ou senha incorreta" });
        });
    }
    else {
        res.status(422).json({ "error": "Dados insuficientes" });
    }

});

router.get("/jogos/:codJogo", (req, res) => {

    const codJogo = req.params.codJogo;

    if (codJogo){
        db.promise()
        .execute("SELECT * FROM jogos WHERE cod_jogo = ?;", [
            codJogo
        ])
        .then(([rows]) => {
            res.status(200).json(rows);
        })
        .catch((error) => {
            res.status(404).json({ "error": "Jogo não encontrado" });
        });
    }
    else {
        res.status(422).json({ "error": "Dados insuficientes" });
    }

});

// Registro de partida + update de rating
router.post("/jogos", (req, res) => {

    const { brancasGanham, PJN, usernameBrancas, usernamePretas } = req.body;
    let codJogador1, codJogador2, eloJogador1, eloJogador2;

    if (brancasGanham && PJN && usernameBrancas && usernamePretas){
        // Achar código dos usuários
        db.promise()
        .execute("SELECT cod_usuario, elo, username FROM usuarios WHERE username = ? OR username = ?;", [
            usernameBrancas,
            usernamePretas
        ])
        .then(([rows]) => {
            if (rows[1] != null){
                if (rows[0].username == usernameBrancas){
                    codJogador1 = rows[0].cod_usuario;
                    eloJogador1 = rows[0].elo;
                    codJogador2 = rows[1].cod_usuario;
                    eloJogador2 = rows[1].elo;
                }
                else {
                    codJogador1 = rows[1].cod_usuario;
                    eloJogador1 = rows[1].elo;
                    codJogador2 = rows[0].cod_usuario;
                    eloJogador2 = rows[0].elo;
                }

                const codVencedor = (brancasGanham == true ? codJogador1 : codJogador2);

                // Insere os dados no MySQL
                db.promise()
                .execute("INSERT INTO jogos (cod_jogador1, cod_jogador2, elo_jogador1, elo_jogador2, cod_vencedor, \
                PJN, username_jogador1, username_jogador2) VALUES(?, ?, ?, ?, ?, ?, ?, ?);", [
                    codJogador1,
                    codJogador2,
                    eloJogador1,
                    eloJogador2,
                    codVencedor,
                    PJN,
                    usernameBrancas,
                    usernamePretas
                ])
                .then(([rows2]) => {
                    // Calcula novo elo
                    const novosRatings = eloCalculator({ ratingBrancas: eloJogador1, ratingPretas: eloJogador2, brancasGanham });
                    eloJogador1 = novosRatings.ratingBrancas;
                    eloJogador2 = novosRatings.ratingPretas;

                    db.promise()
                    .execute("UPDATE usuarios SET elo = ? WHERE cod_usuario = ?;", [
                        eloJogador1,
                        codJogador1
                    ])
                    .then(([rows3]) => {
                        db.promise()
                        .execute("UPDATE usuarios SET elo = ? WHERE cod_usuario = ?;", [
                            eloJogador2,
                            codJogador2
                        ])
                        .then(([rows4]) => {
                            res.status(200).json({ "message": "Jogo cadastrado com sucesso" });
                        })
                        .catch((error) => {
                            res.status(500).json({ "error": "Erro ao setar novo elo" });
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({ "error": "Erro ao setar novo elo" });
                    });
                })
                .catch((error) => {
                    res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
                });
            }
            else {
                res.status(422).json({ "error": "Usuário(s) não encontrado(s)" });
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
        })
    }
    else {
        res.status(422).json({ "error": "Dados insuficientes" });
    }

});

// Retornar informações de um usuário (usuarios info + partidas)
router.get("/usuarios/:username", (req, res) => {

    const username = req.params.username;

    // Pega as informações do usuário
    db.promise()
    .execute("SELECT cod_usuario, elo, data_cad FROM usuarios WHERE username = ?;", [
        username
    ])
    .then(([rows]) => {
        if (rows[0] != null){
            // Pega as últimas partidas do usuário
            db.promise()
            .execute(`SELECT * FROM jogos \
            WHERE username_jogador1 = ? OR username_jogador2 = ?;`, [
                username,
                username
            ])
            .then(([rows2]) => {
                db.promise()
                .execute(`SELECT COUNT(*) AS contagem FROM jogos WHERE cod_vencedor = ${rows[0].cod_usuario} \
                UNION \
                SELECT COUNT(*) AS contagem FROM jogos WHERE cod_jogador1 = ${rows[0].cod_usuario} OR cod_jogador2 = ${rows[0].cod_usuario};`)
                .then(([rows3]) => {
                    res.status(200).json({
                        username,
                        elo: rows[0].elo,
                        dataCad: rows[0].data_cad,
                        partidas: rows3[1].contagem,
                        vitorias: rows3[0].contagem,
                        derrotas: rows3[1].contagem - rows3[0].contagem,
                        jogos: rows2
                    });
                })
                .catch((error) => {
                    res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
                });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
            });
        }
        else{
            res.status(404).json({ "error": "Usuário não encontrado" });
        }
    })
    .catch((error) => {
        res.status(500).json({ "error": "Não foi possível acessar o banco de dados. Tente novamente mais tarde" });
    });

});

router.get("/usuarios/elo/:username", (req, res) => {

    const username = req.params.username;

    db.promise()
    .execute("SELECT elo FROM usuarios WHERE username = ?;", [
        username
    ])
    .then(([rows]) => {
        if (rows[0] != null){
            res.status(200).json({ "elo": rows[0].elo });
        }
        else {
            res.status(422).json({ "error": "Não foi possível encontrar o usuário" });
        }
    })
    .catch((error) => {
        res.status(500).json({ "error": "Erro ao conectar com o banco de dados" });
    });

});

router.get("/ranking", (req, res) => {

    db.promise()
    .execute("SELECT username, elo FROM usuarios ORDER BY elo DESC LIMIT 10;")
    .then(([rows]) => {
        res.status(200).json(rows);
    })
    .catch((error) => {
        res.status(500).json({ "error": "Erro ao conectar com o banco de dados" });
    });

});

module.exports = router;

function randCod(){

    let int = "1";

    for (let i = 0; i < 5; i++){

        const rand = Math.floor(Math.random() * 10);

        int += rand;

    }

    return Number(int);

}


const winProbability = (ratingA, ratingB) => {

    return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));

}

const eloCalculator = (obj) => {

    let { ratingBrancas, ratingPretas, brancasGanham } = obj;

    // Novo rating brancas
    const scoreBrancas = (brancasGanham == true ? 1 : 0);
    ratingBrancas = Math.round(ratingBrancas + 16 * (scoreBrancas - winProbability(ratingBrancas, ratingPretas)));

    // Novo rating pretas
    const scorePretas = (brancasGanham == true ? 0 : 1);
    ratingPretas = Math.round(ratingPretas + 16 * (scorePretas - winProbability(ratingPretas, ratingBrancas))); 

    return { ratingBrancas, ratingPretas };

}