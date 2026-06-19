// --- ETAPA 1 LÓGICA ---
let volume = 50;
let timeAtMax = 0;
let stage1Interval;
let audio = document.getElementById('bg-audio');

function startStage1() {
    const url = document.getElementById('audio-url').value;
    if (url) {
        audio.src = url;
        audio.volume = 0.5;
        // Tenta rodar o áudio (navegadores mobile exigem interação antes)
        audio.play().catch(e => console.log("Erro de autoplay ou CORS no áudio."));
    }
    switchScreen('screen-intro', 'screen-stage1');
    
    stage1Interval = setInterval(() => {
        volume -= 2; 
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
    volume += 15; 
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
    
    // Frequência correta entre 70 e 76
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
    energy += 8;
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
    trumpet.play().catch(e => console.log("Erro ao reproduzir trombeta."));

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