// CRUD

let jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];

function mostrar() {
    let lista = document.getElementById("lista");

    if (!lista) return;

    lista.innerHTML = "";

    jogadores.forEach(function(jogador, i) {

        if (jogador.pontos == undefined) {
            jogador.pontos = 0;
        }

        lista.innerHTML +=
            "<tr>" +
            "<td>" + jogador.nome + "</td>" +
            "<td>" + jogador.idade + "</td>" +
            "<td>" + jogador.pontos + "</td>" +
            "<td>" +
            "<button onclick='editar(" + i + ")'>Editar</button> " +
            "<button onclick='excluir(" + i + ")'>Excluir</button>" +
            "</td>" +
            "</tr>";
    });

    localStorage.setItem("jogadores", JSON.stringify(jogadores));
}


function salvar() {

    let nome = document.getElementById("nome").value.trim();
    let idade = document.getElementById("idade").value;
    let id = document.getElementById("id").value;

    if (nome == "" || idade == "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (id == "") {

        jogadores.push({
            nome: nome,
            idade: idade,
            pontos: 0
        });

    } else {

        jogadores[id].nome = nome;
        jogadores[id].idade = idade;

        document.getElementById("id").value = "";
    }

    localStorage.setItem("jogadores", JSON.stringify(jogadores));

    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";

    mostrar();
}


function editar(i) {

    document.getElementById("nome").value =
        jogadores[i].nome;

    document.getElementById("idade").value =
        jogadores[i].idade;

    document.getElementById("id").value = i;
}


function excluir(i) {

    if (confirm("Deseja excluir este jogador?")) {

        jogadores.splice(i, 1);

        localStorage.setItem(
            "jogadores",
            JSON.stringify(jogadores)
        );

        mostrar();
    }
}


mostrar();


// JOGO

let sereia = document.getElementById("sereia");
let alga = document.getElementById("alga");
let inicio = document.getElementById("inicio");
let fim = document.getElementById("fim");

let pontos = 0;
let jogando = false;
let contador = null;


// JOGADOR

if (sereia) {

    if (jogadores.length == 0) {

        alert("Cadastre um jogador antes de jogar!");

        window.location.href = "jogador.html";

    } else {

        let ultimo = jogadores[jogadores.length - 1];

        document.getElementById("jogador").innerText =
            ultimo.nome;
    }
}


// COMEÇAR

function comecar() {

    if (!sereia || jogadores.length == 0) return;

    clearInterval(contador);

    pontos = 0;
    jogando = true;

    document.getElementById("pontos").innerText = "0";

    inicio.style.display = "none";
    fim.style.display = "none";

    sereia.classList.remove("pular");

    alga.classList.remove("alga-andando");
    alga.style.right = "-80px";

    void alga.offsetWidth;

    alga.classList.add("alga-andando");


    contador = setInterval(function() {

        pontos++;

        document.getElementById("pontos").innerText =
            pontos;

    }, 100);
}


// PULAR

function pular() {

    if (!jogando) return;

    if (sereia.classList.contains("pular")) return;

    sereia.classList.add("pular");

    setTimeout(function() {

        sereia.classList.remove("pular");

    }, 700);
}


// ESPAÇO

document.addEventListener("keydown", function(event) {

    if (event.code == "Space") {

        event.preventDefault();

        if (jogando) {
            pular();
        }
    }
});


// SALVAR PONTUAÇÃO

function salvarPontuacao() {

    let jogadorAtual =
        jogadores[jogadores.length - 1];

    if (!jogadorAtual) return;

    if (jogadorAtual.pontos == undefined) {
        jogadorAtual.pontos = 0;
    }

    if (pontos > jogadorAtual.pontos) {
        jogadorAtual.pontos = pontos;
    }

    localStorage.setItem(
        "jogadores",
        JSON.stringify(jogadores)
    );
}


// COLISÃO

setInterval(function() {

    if (!jogando) return;

    let s = sereia.getBoundingClientRect();
    let a = alga.getBoundingClientRect();

    let bateu =
        s.right - 25 > a.left + 20 &&
        s.left + 25 < a.right - 20 &&
        s.bottom - 15 > a.top + 15 &&
        s.top + 20 < a.bottom - 5;


    if (bateu) {

        jogando = false;

        clearInterval(contador);

        document.getElementById("final").innerText =
            pontos;

        salvarPontuacao();

        fim.style.display = "flex";

        alga.classList.remove("alga-andando");
    }

}, 30);