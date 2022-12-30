let socket = io();

const username = document.getElementById("textbox-username");
const senha = document.getElementById("textbox-senha");
const confirmacaoSenha = document.getElementById("textbox-conf-senha");
const cadBtn = document.getElementById("cad-btn");
const pErro = document.getElementById("texto-erro");

cadBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // const token = window.turnstileCallbackFunction();

    socket.emit("cadastro", { username: username.value, senha: senha.value, confirmacaoSenha: confirmacaoSenha.value });
});

socket.on("falhaCadastro", (data) => {

    if (data.id == socket.id)
        pErro.textContent = data.error;    

});

socket.on("sucessoCadastro", (data) => {

    if (data.id == socket.id)
        window.location.pathname = "/login";

});

window.turnstileCallbackFunction = function () {
    let token = null;
    const turnstileOptions = {
        //sitekey: '0x4AAAAAAABuTvNMvycoERPA', // site
        sitekey: '0x4AAAAAAABuUIEGB5gvB4g_', // localhost
        callback: function(tkn) {
            token = tkn
        }
    };
    turnstile.render('#captcha', turnstileOptions);

    return token;
};