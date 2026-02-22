
const svgs = {
    rock: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full"><path d="M50 5 L95 30 V70 L50 95 L5 70 V30 Z" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="50" r="28" fill="currentColor"/><path d="M50 15 L80 32 V68 L50 85 L20 68 V32 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>`,
    paper: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full"><path d="M20 10 H65 L85 30 V90 H20 Z" fill="none" stroke="currentColor" stroke-width="6"/><path d="M35 45 H65 M35 60 H65 M35 75 H55" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><rect x="25" y="20" width="20" height="20" fill="currentColor" opacity="0.4"/></svg>`,
    scissors: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full"><circle cx="30" cy="80" r="16" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="70" cy="80" r="16" fill="none" stroke="currentColor" stroke-width="6"/><path d="M38 72 L65 12 M62 72 L35 12" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><circle cx="50" cy="48" r="6" fill="currentColor"/></svg>`,
    lizard: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full"><path d="M10 75 L30 55 L55 35 H85 L100 45 L80 55 H55 L30 75 Z" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="65" cy="42" r="6" fill="currentColor"/><path d="M85 45 L100 35 M90 48 L100 45" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
    spock: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full"><path d="M35 95 L25 75 L75 75 L65 95 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M25 75 L10 55 L15 45 L30 50 Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M30 75 L20 20 L40 15 L45 45" fill="none" stroke="currentColor" stroke-width="6"/><path d="M70 75 L80 20 L60 15 L55 45" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="65" r="8" fill="currentColor"/></svg>`,
    neural_ghost: `<svg viewBox="0 0 100 100" class="fill-current w-full h-full opacity-40"><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="10 5"/><path d="M30 50 H70 M50 30 V70" stroke="currentColor" stroke-width="2" opacity="0.5"/><circle cx="50" cy="50" r="12" fill="currentColor" class="animate-pulse"/></svg>`
};

let stats = { total: 0, wins: 0, losses: 0, bestStreak: 0, ai: 'random' };
let history = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };
let pScore = 0, cScore = 0, currentStreak = 0, playing = false, isMuted = false, audioCtx = null, streamSpeed = 1.2;

const rules = {
    rock: { scissors: 'CRUSHES', lizard: 'CRUSHES' },
    paper: { rock: 'COVERS', spock: 'DISPROVES' },
    scissors: { paper: 'CUTS', lizard: 'DECAPITATES' },
    lizard: { spock: 'POISONS', paper: 'EATS' },
    spock: { scissors: 'SMASHES', rock: 'VAPORIZES' }
};

// Moving Boxes Background (Chalty Hwy Boxes)
const bgC = document.getElementById('bg-canvas');
const bgCtx = bgC.getContext('2d');
let boxes = [];

function initBg() {
    bgC.width = window.innerWidth; bgC.height = window.innerHeight;
    boxes = Array.from({ length: 60 }, () => ({
        x: Math.random() * bgC.width,
        y: Math.random() * bgC.height,
        s: Math.random() * 30 + 10,
        vy: Math.random() * 1.5 + 0.5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        color: Math.random() > 0.5 ? '0, 255, 255' : '255, 0, 85'
    }));
}

function drawBg() {
    bgCtx.clearRect(0, 0, bgC.width, bgC.height);
    boxes.forEach(b => {
        bgCtx.save();
        bgCtx.translate(b.x, b.y);
        bgCtx.rotate(b.rot);
        bgCtx.strokeStyle = `rgba(${b.color}, 0.3)`;
        bgCtx.fillStyle = `rgba(${b.color}, 0.05)`;
        bgCtx.lineWidth = 2;
        bgCtx.shadowBlur = 10;
        bgCtx.shadowColor = `rgba(${b.color}, 0.8)`;
        bgCtx.strokeRect(-b.s / 2, -b.s / 2, b.s, b.s);
        bgCtx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s);
        bgCtx.restore();

        b.y += b.vy * streamSpeed;
        b.rot += b.vRot;
        if (b.y > bgC.height + 50) {
            b.y = -50;
            b.x = Math.random() * bgC.width;
        }
    });
    requestAnimationFrame(drawBg);
}

// Particle System
const fxC = document.getElementById('fx-canvas');
const fxCtx = fxC.getContext('2d');
let particles = [];
function resize() { fxC.width = window.innerWidth; fxC.height = window.innerHeight; }
window.onresize = () => { resize(); initBg(); }; resize();

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.size = Math.random() * 8 + 2;
        this.speedX = (Math.random() - 0.5) * 28;
        this.speedY = (Math.random() - 0.5) * 28;
        this.life = 1;
        this.decayRate = Math.random() * 0.02 + 0.015;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.speedY += 0.3; this.life -= this.decayRate; }
    draw() { fxCtx.globalAlpha = this.life; fxCtx.fillStyle = this.color; fxCtx.beginPath(); fxCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); fxCtx.fill(); }
}

function triggerBurst(x, y, color) { for (let i = 0; i < 60; i++) particles.push(new Particle(x, y, color)); }
function animateFX() {
    fxCtx.clearRect(0, 0, fxC.width, fxCtx.canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateFX);
}
animateFX();

function logProtocol(msg) {
    const log = document.getElementById('protocol-log');
    if (!log) return;
    const div = document.createElement('div');
    div.className = 'log-item';
    div.textContent = `> ${msg}`;
    log.prepend(div);
    if (log.childNodes.length > 15) log.removeChild(log.lastChild);
}

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSfx(freq, type = 'sine', duration = 0.1, volume = 0.5) {
    if (isMuted || !audioCtx) return;
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = type; o.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(volume, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    o.start(); o.stop(audioCtx.currentTime + duration);
}

function hSfx() { initAudio(); playSfx(2500, 'sine', 0.02, 0.05); }
function toggleMute() { isMuted = !isMuted; document.getElementById('mute-icon').innerHTML = isMuted ? '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.53.45-1.18.81-1.92 1.06v2.06c1.3-.3 2.48-.87 3.45-1.63L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>' : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>'; }
function toggleAI() { stats.ai = stats.ai === 'random' ? 'predictive' : 'random'; document.getElementById('ai-btn').textContent = stats.ai === 'random' ? 'Random_Logic' : 'Tactical_AI'; logProtocol(`AI SWITCH: ${stats.ai.toUpperCase()}`); }

function playVictoryMusic() {
    [523, 659, 783, 1046, 1318].forEach((f, i) => setTimeout(() => playSfx(f, 'sine', 0.5, 0.4), i * 100));
}

function playDefeatMusic() {
    [300, 200, 150, 100].forEach((f, i) => setTimeout(() => playSfx(f, 'sawtooth', 0.6, 0.6), i * 150));
}

function playDrawMusic() {
    [440, 349, 440].forEach((f, i) => setTimeout(() => playSfx(f, 'triangle', 0.4, 0.4), i * 200));
}

function playRound(choice) {
    if (playing) return;
    playing = true;
    initAudio();
    streamSpeed = 15;
    history[choice]++;
    logProtocol(`YOU SELECTED: ${choice.toUpperCase()}`);

    const pD = document.getElementById('p-disp');
    const cD = document.getElementById('c-disp');
    const res = document.getElementById('res-text');

    pD.innerHTML = svgs.neural_ghost;
    cD.innerHTML = svgs.neural_ghost;
    pD.className = "w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center animate-pump color-rock";
    cD.className = "w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center transform scale-x-[-1] animate-pump color-paper";

    res.textContent = "SYNCHING...";

    [0, 400, 800].forEach((delay, i) => {
        setTimeout(() => {
            playSfx(500 + (i * 150), 'sawtooth', 0.1, 0.1);
        }, delay);
    });

    setTimeout(() => {
        streamSpeed = 1.2;
        let comp;
        if (stats.ai === 'random' || Math.random() < 0.2) {
            comp = ['rock', 'paper', 'scissors', 'lizard', 'spock'][Math.floor(Math.random() * 5)];
        } else {
            const top = Object.keys(history).reduce((a, b) => history[a] > history[b] ? a : b);
            const counters = { rock: ['paper', 'spock'], paper: ['scissors', 'lizard'], scissors: ['rock', 'spock'], lizard: ['rock', 'scissors'], spock: ['paper', 'lizard'] };
            comp = counters[top][Math.floor(Math.random() * 2)];
            logProtocol(`AI CALCULATED COUNTER`);
        }

        pD.innerHTML = svgs[choice];
        cD.innerHTML = svgs[comp];
        pD.className = `w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center animate-pop ${choice}-glow`;
        cD.className = `w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center transform scale-x-[-1] animate-pop ${comp}-glow`;

        const wave = document.getElementById('impact-wave');
        wave.classList.add('active-wave');
        document.getElementById('flash').classList.add('flash-active');
        setTimeout(() => {
            wave.classList.remove('active-wave');
            document.getElementById('flash').classList.remove('flash-active');
        }, 700);

        playSfx(70, 'square', 0.6, 1.0);
        document.getElementById('arena').style.animation = 'glitch-fx 0.3s both';
        setTimeout(() => document.getElementById('arena').style.animation = 'float-arena 6s ease-in-out infinite', 400);

        const pRect = pD.getBoundingClientRect();
        const cRect = cD.getBoundingClientRect();

        stats.total++;
        if (choice === comp) {
            currentStreak = 0;
            showResult("DRAW!", "IDENTICAL_PROTOCOLS", "text-yellow-400");
            logProtocol("STALEMATE DETECTED");
            playDrawMusic();
        } else if (rules[choice][comp]) {
            pScore++; currentStreak++;
            if (currentStreak > stats.bestStreak) stats.bestStreak = currentStreak;
            stats.wins++;
            triggerBurst(pRect.left + pRect.width / 2, pRect.top + pRect.height / 2, '#39ff14');
            showResult("VICTORY", `${choice.toUpperCase()} ${rules[choice][comp]} ${comp.toUpperCase()}`, "text-green-400 glitch");
            logProtocol("SUCCESS: YOU WIN");
            playVictoryMusic();
        } else {
            currentStreak = 0;
            cScore++; stats.losses++;
            triggerBurst(cRect.left + cRect.width / 2, cRect.top + cRect.height / 2, '#ff0055');
            showResult("DEFEAT", `${comp.toUpperCase()} ${rules[comp][choice]} ${choice.toUpperCase()}`, "text-pink-500 glitch");
            logProtocol("FAILURE: AI WINS");
            playDefeatMusic();
        }
        updateScoreHUD();
        playing = false;
    }, 1200);
}

function showResult(t, r, c) {
    const el = document.getElementById('res-text');
    el.textContent = t;
    el.className = `text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-widest mb-1 ${c}`;
    document.getElementById('rea-text').textContent = r;
}

function updateScoreHUD() {
    document.getElementById('player-score').textContent = pScore;
    document.getElementById('computer-score').textContent = cScore;
    const streakHUD = document.getElementById('streak-hud');
    if (currentStreak > 1) {
        streakHUD.classList.remove('opacity-0', 'translate-y-2');
        document.getElementById('streak-val').textContent = currentStreak;
    } else { streakHUD.classList.add('opacity-0', 'translate-y-2'); }
}

function toggleStats() {
    const modal = document.getElementById('stats-modal');
    modal.classList.toggle('hidden');
    if (modal.classList.contains('hidden')) return;
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-wins').textContent = stats.wins;
    document.getElementById('stat-losses').textContent = stats.losses;
    document.getElementById('stat-streak').textContent = stats.bestStreak;
    const rate = stats.total === 0 ? 0 : Math.round((stats.wins / stats.total) * 100);
    document.getElementById('stat-rate').textContent = rate + '%';
    document.getElementById('stat-circle').style.strokeDashoffset = 628.32 - (rate / 100) * 628.32;
}

function reset() {
    pScore = 0; cScore = 0; currentStreak = 0;
    stats = { total: 0, wins: 0, losses: 0, bestStreak: 0, ai: 'random' };
    history = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };
    updateScoreHUD();
    document.getElementById('p-disp').innerHTML = '';
    document.getElementById('c-disp').innerHTML = '';
    document.getElementById('res-text').textContent = "NEURAL_READY";
    logProtocol("SYSTEM CORE REBOOT");
}

window.onload = () => {
    initBg(); drawBg();
    Object.keys(svgs).forEach(k => {
        const el = document.getElementById(`icon-${k}`);
        if (el) el.innerHTML = svgs[k];
    });
    const wave = document.getElementById('neural-wave');
    if (wave) {
        for (let i = 0; i < 18; i++) {
            const b = document.createElement('div');
            b.className = 'wave-bar';
            wave.appendChild(b);
        }
    }
    const spec = document.getElementById('spectrum');
    if (spec) {
        for (let i = 0; i < 15; i++) {
            const b = document.createElement('div');
            b.className = 'spectrum-bar';
            spec.appendChild(b);
        }
    }
    setInterval(() => {
        document.querySelectorAll('.spectrum-bar').forEach(b => {
            b.style.height = (Math.random() * 80 + 10) + '%';
        });
        document.querySelectorAll('.wave-bar').forEach(b => {
            const h = playing ? (Math.random() * 90 + 10) : (Math.random() * 30 + 5);
            b.style.height = h + '%';
        });
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) {
            const now = new Date();
            uptimeEl.textContent = now.toTimeString().split(' ')[0];
        }
    }, 80);
};

