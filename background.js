let musicaAtual = null;
let fila = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  // console.log(activeTab);
  // Verifica se a URL da guia ativa pertence ao YouTube Music
  if (activeTab && activeTab.url.includes("music.youtube.com")) {
    // Injeta um script na página para acessar informações da música
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: (tab) => {
        chrome.runtime.sendMessage({ musicInfo });
      },
    });
  }
});

function verificarStatusMusica() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.url && activeTab.url.includes("music.youtube.com")) {
      chrome.tabs.sendMessage(activeTab.id, { action: "obterStatusMusica" });
    }
  });
}

function verificarFila() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.url && activeTab.url.includes("music.youtube.com")) {
      chrome.tabs.sendMessage(activeTab.id, { action: "getFila" });
    }
  });
}

const intervalObterFila = setInterval(verificarFila, 10000);
const intervalObterDadosMusica = setInterval(verificarStatusMusica, 1000);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message?.action === "getMusica") sendResponse({ musicaAtual });
  if (message?.action === "getFila") sendResponse({ fila });

  if (message?.musicaAtual) musicaAtual = message.musicaAtual;
  if (message?.fila) fila = message.fila;
});
