describe("/api/ping", () => {

    it("Verifica a conexão com o servidor", () => {
        fetch("http://localhost:4000/api/ping")
        .then((rawRes) => { return rawRes.json(); })
        .then((res) => {
            expect(res.message != null).toBe(true)
        });
    });

});

describe("/api/usuarios/cadastro", () => {



});

describe("/api/usuarios/login", () => {



});

describe("/api/usuarios - PUT", () => {



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