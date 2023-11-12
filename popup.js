// runtime: background.js | tabs: content.js

async function playPause() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const ytMusicTab = tabs.find((tab) =>
      tab.url.includes("music.youtube.com")
    );
    if (!ytMusicTab) return;
    chrome.tabs.sendMessage(ytMusicTab.id, { action: "playPause" });
  });
}

async function atualizarMusica() {
  await chrome.runtime.sendMessage(
    { action: "getMusica" },
    function (response) {
      if (response?.musicaAtual) {
        const { musicaAtual } = response;

        document.getElementById("music-title").textContent =
          musicaAtual.tituloMusica;
        document.getElementById("music-artist").textContent =
          musicaAtual.artistaMusica;
        document.getElementById("music-cover").src = musicaAtual.arteAlbum;

        document
          .getElementById("container-cover")
          .addEventListener("click", () => playPause());

        document.getElementById("music-cover-back").src = musicaAtual.arteAlbum;
      }
    }
  );
}

async function tocarMusica(index) {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const ytMusicTab = tabs.find((tab) =>
      tab.url.includes("music.youtube.com")
    );
    if (!ytMusicTab) return;
    chrome.tabs.sendMessage(ytMusicTab.id, { action: "tocarMusica", index });
  });
}

function updateBotao(estaTocando) {
  if (estaTocando) document.getElementById("button").classList.add("pause");
  else document.getElementById("button").classList.remove("pause");
}

async function atualizarFila() {
  await chrome.runtime.sendMessage({ action: "getFila" }, function (response) {
    if (response?.fila) {
      const valorArmazenado = response.fila;

      const lista = document.getElementById("div-queue");
      lista.innerHTML = "";

      for (let i = 0; i < valorArmazenado.length; i++) {
        const musica = valorArmazenado[i];

        const item = document.createElement("div");
        item.classList.add("queue-item");
        item.addEventListener("click", function () {
          tocarMusica(i);
        });

        const itemMain = document.createElement("div");
        itemMain.classList.add("queue-item-main");

        const titulo = document.createElement("span");
        titulo.classList.add("queue-item-title");
        titulo.textContent = musica.titulo;

        const artista = document.createElement("span");
        artista.classList.add("queue-item-artist");
        artista.textContent = musica.artista;

        const tempo = document.createElement("span");
        tempo.classList.add("queue-item-time");
        tempo.textContent = musica.tempo;

        itemMain.appendChild(titulo);
        itemMain.appendChild(artista);
        item.appendChild(itemMain);
        item.appendChild(tempo);

        lista.appendChild(item);
      }
    }
  });
}

atualizarFila();
atualizarMusica();

const intervalUpdateMusica = setInterval(atualizarMusica, 1000);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.estaTocando) {
    const estaTocando = ["Pausar", "Pause"].includes(message.estaTocando);
    updateBotao(estaTocando);
  }

  if (message.tempoMusica) {
    import("./utils.js").then((utils) => {
      const [current, duration] = message.tempoMusica.split(" / ");

      const currentTime = utils.convertTimeString(current);
      const totalTime = utils.convertTimeString(duration);

      document.getElementById("music-time").textContent = message.tempoMusica;

      const timeBar = document.getElementById("music-time-bar");
      timeBar.max = totalTime;
      timeBar.value = currentTime;
    });
  }
});
