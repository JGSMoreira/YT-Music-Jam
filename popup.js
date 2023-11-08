function atualizarMusica() {
  chrome.runtime.sendMessage({ action: "getMusica" }, function (response) {
    if (response?.musicaAtual) {
      const valorArmazenado = response.musicaAtual;

      document.getElementById("music-title").textContent =
        valorArmazenado.tituloMusica;
      document.getElementById("music-artist").textContent =
        valorArmazenado.artistaMusica;
      document.getElementById("music-time").textContent =
        valorArmazenado.tempoMusica;

      document.getElementById("music-cover").src = valorArmazenado.arteAlbum;
      document.getElementById("music-cover-back").src =
        valorArmazenado.arteAlbum;
    }
  });
}

function atualizarFila() {
  chrome.runtime.sendMessage({ action: "getFila" }, function (response) {
    if (response?.fila) {
      const valorArmazenado = response.fila;

      const lista = document.getElementById("div-queue");
      lista.innerHTML = "";

      for (let i = 0; i < valorArmazenado.length; i++) {
        const musica = valorArmazenado[i];

        const item = document.createElement("div");
        item.classList.add("queue-item");

        const itemMain = document.createElement("div");
        itemMain.classList.add("queue-item-main");

        const titulo = document.createElement("span");
        titulo.classList.add("queue-item-title");
        titulo.textContent = musica.titulo;

        titulo.addEventListener("click", () => musica.play());

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
