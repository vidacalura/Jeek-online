const username = document.getElementById("textbox-username");
const senha = document.getElementById("textbox-senha");
const logBtn = document.getElementById("log-btn");
const pErro = document.getElementById("texto-erro");

logBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch("/login", {
        method: "POST",
        headers: {
            "Content-type": "Application/JSON"
        },
        body: JSON.stringify({
            username: username.value.trim(),
            senha: senha.value.trim()
        })
    })
    .then((rawRes) => { return rawRes.json(); })
    .then((response) => {
        if (!response.error){
            window.location.pathname = "/";
        }
        else {
            pErro.textContent = response.error;
        }
    });

});