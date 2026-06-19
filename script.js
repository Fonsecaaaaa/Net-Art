// --- ETAPA 1 LÓGICA ---
let volume = 50;
let timeAtMax = 0;
let stage1Interval;
let audio = document.getElementById('bg-audio');

// Link de música padrão (livre de direitos autorais) para garantir que funcione
const defaultMusic = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function startStage1() {
    let url = document.getElementById('audio-url').value;
    
    // Se o usuário não colocar nada, usa a música padrão
    if (!url) {
        url = defaultMusic;
    }

    audio.src = url;
    audio.volume = 0.5;
    
    // Tenta forçar o play imediatamente após a interação do usuário
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("O navegador bloqueou o áudio ou o link é inválido:", error);
        });
    }

    switchScreen('screen-intro', 'screen-stage1');
    
    stage1Interval = setInterval(() => {
        // BALANCEAMENTO: Cai mais devagar (1 em vez de 2)
        volume -= 1; 
        if (volume < 0) volume = 0;
        
        if (volume >= 100) {
            volume = 100;
            timeAtMax += 0.1; 
        } else {
            timeAtMax = 0; 
        }

        document.getElementById('volume-bar').style.width = volume + '%';
        document.getElementById('timer-stage1').innerText = `Segurando o máximo: ${timeAtMax.toFixed(1)}s`;
        if (audio.src) audio.volume = volume / 100;

        if (timeAtMax >= 5) {
            clearInterval(stage1Interval);
            startStage2();
        }
    }, 100);
}

function pumpVolume() { 
    // BALANCEAMENTO: Enche mais rápido a cada toque (25 em vez de 15)
    volume += 25; 
}

// --- ETAPA 2 LÓGICA ---
let tuneTimer;
function startStage2() { 
    switchScreen('screen-stage1', 'screen-stage2'); 
}

function tuneFrequency() {
    const val = document.getElementById('tuner').value;
    const noise = document.getElementById('static-noise');
    const status = document.getElementById('tuner-status');
    
    if (val >= 70 && val <= 76) {
        noise.innerText = "⭐ ⭐ ⭐ ⭐ ⭐";
        noise.style.color = "var(--brazil-yellow)";
        status.innerText = "Sinal Encontrado! Segure...";
        document.body.style.backgroundColor = "#001a09";
        
        if (!tuneTimer) {
            tuneTimer = setTimeout(() => { startStage3(); }, 3000);
        }
    } else {
        noise.innerText = "▓▒░▓▒░▒▓░▒▓";
        noise.style.color = "white";
        status.innerText = "Buscando sinal...";
        document.body.style.backgroundColor = "var(--bg-color)";
        clearTimeout(tuneTimer);
        tuneTimer = null;
    }
}

// --- ETAPA 3 LÓGICA ---
let energy = 0;
let stage3Interval;

function startStage3() {
    document.body.style.backgroundColor = "var(--bg-color)";
    switchScreen('screen-stage2', 'screen-stage3');
    
    stage3Interval = setInterval(() => {
        energy -= 3; 
        if (energy < 0) energy = 0;
        document.getElementById('energy-bar').style.width = energy + '%';
    }, 100);
}

function addEnergy() {
    energy += 12; // Enche mais rápido para garantir que funcione bem no mobile
    if (energy >= 100) {
        energy = 100;
        clearInterval(stage3Interval);
        startFinalStage();
    }
    document.getElementById('energy-bar').style.width = energy + '%';
}

// --- FINAL LÓGICA ---
function startFinalStage() {
    switchScreen('screen-stage3', 'screen-final');
    if (audio.src) audio.pause();
    
    let trumpet = document.getElementById('trumpet-audio');
    trumpet.volume = 1.0;
    
    let playPromise = trumpet.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Erro ao reproduzir trombeta."));
    }

    setTimeout(() => {
        document.getElementById('congrats-text').style.display = 'none';
        document.getElementById('net-art').style.display = 'block';
        document.body.style.backgroundColor = '#009c3b';
        
        setInterval(() => {
            document.body.style.backgroundColor = 
                document.body.style.backgroundColor === 'rgb(0, 39, 118)' ? '#009c3b' : '#002776';
        }, 500);

    }, 3000);
}

// --- UTILITÁRIOS ---
function switchScreen(hideId, showId) {
    document.getElementById(hideId).classList.remove('active');
    document.getElementById(showId).classList.add('active');
}
