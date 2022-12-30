const rankingContainer = document.getElementById("ranking");

fetch("https://jeek-online.vercel.app/api/ranking")
.then((res) => { return res.json(); })
.then((res) => {

    if (res.error){
        alert(res.error);
    }
    else{ 
        for (let i = 0; i < res.length; i++){
            const userContainer = document.createElement("div");
            userContainer.classList.add("user-container");
            userContainer.classList.add("bg-jeek-gray-500");

            const num = document.createElement("p");
            num.textContent = i + 1;

            const username = document.createElement("p");
            username.textContent = res[i].username;

            const elo = document.createElement("p");
            elo.textContent = res[i].elo;

            userContainer.appendChild(num);
            userContainer.appendChild(username);
            userContainer.appendChild(elo);

            rankingContainer.appendChild(userContainer);
        }
    }

});