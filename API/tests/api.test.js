require("dotenv").config();

describe("/api/ping", () => {

    it("Verifica a conexão com o servidor", async () => {
        await fetch("http://localhost:4000/api/ping")
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.message != null).toBe(true);
        });
    });

});

describe("/api/usuarios/cadastro", () => {

    it("Exemplo de cadastro comum", async () => {
        await fetch("http://localhost:4000/api/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-type": "Application/JSON",
                "token": process.env.token
            },
            body: JSON.stringify({
                username: "a" + (Math.floor(Math.random() * 100) ** 4),
                senha: "6532a1c6a665df76d127468cbc7806521437b1a976f4e203ad7c0134d407b24dd5d708e4476009bff8efef6f3f0d14a9b696f18def4d60051592cb39397a21ae"
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.message).toBe("Usuário cadastrado com sucesso!");
        });
    });

    it("Cadastro sem token", async () => {
        await fetch("http://localhost:4000/api/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                username: "b" + (Math.floor(Math.random() * 100) ** 4),
                senha: "6532a1c6a665df76d127468cbc7806521437b1a976f4e203ad7c0134d407b24dd5d708e4476009bff8efef6f3f0d14a9b696f18def4d60051592cb39397a21ae"
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.error != null).toBe(true);
        });
    });

    it("Cadastro com token inválido", async () => {
        await fetch("http://localhost:4000/api/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-type": "Application/JSON",
                "token": "token"
            },
            body: JSON.stringify({
                username: "b" + (Math.floor(Math.random() * 100) ** 4),
                senha: "6532a1c6a665df76d127468cbc7806521437b1a976f4e203ad7c0134d407b24dd5d708e4476009bff8efef6f3f0d14a9b696f18def4d60051592cb39397a21ae"
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.error != null).toBe(true);
        });
    });

    it.todo("Nome de usuário muito grande");

    it.todo("Nome de usuário nulo");

    it.todo("Nome de usuário muito pequeno");

    it.todo("Nome de usuário já em uso");

});

describe("/api/usuarios/login", () => {

    it.todo("Exemplo de login comum");

    it.todo("Login sem token");

    it.todo("Login com token inválido");

    it.todo("Login com senha descriptografada");

    it.todo("Usuário inexistente");

});

describe("/api/usuarios - PUT", () => {

    it("Update sem token", async () => {
        await fetch("http://localhost:4000/api/usuarios", {
            method: "PUT",
            headers: {
                "Content-type": "Application/JSON"
            },
            body: JSON.stringify({
                username: "teste",
                usernameNovo: "teste1234567890"
            })
        })
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.error == null).toBe(true);
        });
    });

    it.todo("Update com token inválido");

    it.todo("Nome de usuário já em uso");

    it.todo("Senha descriptografada");

    it.todo("Senha incorreta");

    it.todo("Username não condiz com senha");
    
    it.todo("Senha nova nula");

    it.todo("Novo username nulo");

});

describe("/api/usuarios - DELETE", () => {



});

describe("/api/usuarios/:username", () => {



});

describe("/api/usuarios/elo/:username", () => {



});

describe("/api/ranking", () => {



});

describe("/api/jogos", () => {


    
});

describe("/api/jogos/:codJogo", () => {


    
});