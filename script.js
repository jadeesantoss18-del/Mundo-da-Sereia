// ===== SPRITES PIXEL =====

function espelhar(metade, remendos) {

    const linhas = metade.map(function(l) {
        const m = l.padEnd(12, ".").slice(0, 12);
        return m + m.split("").reverse().join("");
    });

    (remendos || []).forEach(function(r) {
        const x = r[0], y = r[1], c = r[2];
        linhas[y] = linhas[y].slice(0, x) + c + linhas[y].slice(x + 1);
    });

    return linhas;
}

const PALETA = {
    K: "#1a1530", // contorno
    H: "#a8402c", // cabelo
    h: "#c8583a", // brilho do cabelo
    s: "#ffd2a0", // pele
    b: "#ff9aa8", // bochecha
    B: "#ff6b8b", // top de concha e boca
    W: "#ffd9e6", // concha clara
    g: "#1fcfb0", // cauda
    t: "#6eeccc", // cauda clara
    G: "#1b8a8a", // cauda escura
    k: "#1a1a2e", // olho do peixe
    o: "#ff9f1c", // peixe
    O: "#e36a00", // peixe escuro
    w: "#ffffff", // branco
    c: "#d9fbff", // bolha
    l: "#47d16c", // alga
    d: "#1d8a45", // alga escura
    S: "#ffe0f0", // concha clara (areia)
    P: "#ff8fc0", // concha rosa (areia)
    C: "#ff6f61", // coral
    D: "#c2413a"  // coral escuro
};

const SPRITES = {
    sereia: espelhar([
        "........KKKK",
        "......KKHHHH",
        ".....KHHhhHH",
        "....KHHHHHHH",
        "...KHHHsssss",
        "...KHHssssss",
        "...KHHsssKss",
        "...KHHsssKss",
        "...KHHsbbsss",
        "...KHHsssssB",
        "...KHHHHssss",
        "...KHHHHHsss",
        "..KHHHHHssss",
        "..KHHHHsBWBs",
        "..KHHKssKBBs",
        "..KHHKssKsss",
        "..KHHKssKsss",
        "..KHHKssKsss",
        "..KHHKssKggt",
        "..KHHKssKgtg",
        "..KHHHKKggtg",
        "..KHHHHKggtg",
        "...KHHHKgtgt",
        "....KKKKgGtg",
        "........KGgt",
        "........KgtG",
        ".........Kgt",
        ".........Kgt",
        "......KKKgtG",
        ".....KtttgtK",
        "....KtttttgK",
        "....KKKKKKKK"
    ], [
        // concha no cabelo
        [6, 2, "W"], [7, 2, "B"], [8, 2, "W"],
        [6, 3, "B"], [7, 3, "W"], [8, 3, "B"]
    ]),

    alga: [
        "....l.......",
        "...ll.......",
        "...lld......",
        "...lll......",
        "....ll......",
        "....lll...l.",
        "...lll...ll.",
        "...ll...lld.",
        "...lld..lll.",
        "....lll.ll..",
        "....llllld..",
        ".....llld...",
        "....lllll...",
        "...lldlll...",
        "...ll.lld...",
        "..lll..ll...",
        "..ll...lll..",
        "..ld....ll..",
        ".lll....lll.",
        ".ll.....lll."
    ],

    peixe: [
        "o....oooo...",
        "oo..ooooooo.",
        "oooooooowkoo",
        "oo..ooooooo.",
        "O....OOOO..."
    ],

    bolha: [
        "..cccc..",
        ".c....c.",
        "c..w...c",
        "c......c",
        "c......c",
        ".c....c.",
        "..cccc.."
    ],

    concha: [
        "..PPPP..",
        ".PSPSPP.",
        "PSPSPSPP",
        "PSPSPSPP",
        ".PPPPPP.",
        "..PPPP.."
    ],

    coral: [
        "C...C..C..",
        "C...C..C..",
        "CC.CC.CC..",
        ".CCCCCCC..",
        "..CCCCC...",
        "...CCD....",
        "...CD.....",
        "...CD.....",
        "...CD.....",
        "..CCDD...."
    ]
};

// desenha o sprite num canvas e devolve como imagem (data URL)
function criarSprite(nome) {

    const linhas = SPRITES[nome];
    const largura = Math.max(...linhas.map(function(l) { return l.length; }));

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = linhas.length;

    const ctx = canvas.getContext("2d");

    linhas.forEach(function(linha, y) {
        for (let x = 0; x < linha.length; x++) {
            const cor = PALETA[linha[x]];
            if (cor) {
                ctx.fillStyle = cor;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    });

    return {
        url: canvas.toDataURL(),
        largura: largura,
        altura: linhas.length
    };
}

// aplica os sprites em todo elemento com data-sprite
function aplicarSprites() {

    const cache = {};

    document.querySelectorAll("[data-sprite]").forEach(function(el) {

        const nome = el.dataset.sprite;
        const escala = Number(el.dataset.scale) || 4;

        if (!SPRITES[nome]) return;

        if (!cache[nome]) cache[nome] = criarSprite(nome);

        const s = cache[nome];

        el.style.width = (s.largura * escala) + "px";
        el.style.height = (s.altura * escala) + "px";
        el.style.backgroundImage = "url(" + s.url + ")";
    });
}

aplicarSprites();


// ===== CRUD =====

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


// ===== JOGO =====

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

        window.location.href = "index.html";

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

function caixa(el, dx, dy) {

    let r = el.getBoundingClientRect();

    return {
        esq: r.left + dx,
        dir: r.right - dx,
        topo: r.top + dy,
        base: r.bottom - dy
    };
}

setInterval(function() {

    if (!jogando) return;

    let s = caixa(sereia, 20, 8);
    let a = caixa(alga, 8, 6);

    let bateu =
        s.dir > a.esq &&
        s.esq < a.dir &&
        s.base > a.topo &&
        s.topo < a.base;


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
