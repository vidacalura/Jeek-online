const inscricaoBtn = document.getElementById("inscricao-btn");

inscricaoBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch("/jeek-open/inscricao")
    .then((res) => { return res.json(); })
    .then((res) => {
        if (res.error) {
            alert(res.error);
            return;
        }

        alert(res.message);
        window.location.href += "#regulamento";
    });
});