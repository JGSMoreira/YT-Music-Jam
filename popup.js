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

      const lista = document.getElementById("music-list-body");
      lista.innerHTML = "";

      for (let i = 0; i < valorArmazenado.length; i++) {
        const musica = valorArmazenado[i];

        const item = document.createElement("tr");
        item.classList.add("music-item");

        const titulo = document.createElement("td");
        titulo.classList.add("music-item-title");
        titulo.textContent = musica.titulo;

        const artista = document.createElement("td");
        artista.classList.add("music-item-artist");
        artista.textContent = musica.artista;

        const tempo = document.createElement("td");
        tempo.classList.add("music-item-time");
        tempo.textContent = musica.tempo;

        item.appendChild(titulo);
        item.appendChild(artista);
        item.appendChild(tempo);

        lista.appendChild(item);
      }
    }
  });
}

atualizarFila();
atualizarMusica();

const intervalUpdateMusica = setInterval(atualizarMusica, 1000);
