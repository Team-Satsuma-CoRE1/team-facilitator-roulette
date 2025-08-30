let members = [];
let selectedMembers = new Set();
let isSpinning = false;
let soundEnabled = true;
let currentRotation = 0;

async function loadMembers() {
    try {
        const response = await fetch('members.json');
        const data = await response.json();
        members = data.members;
        renderMemberList();
    } catch (error) {
        console.error('Failed to load members:', error);
        members = [
            { id: 1, name: "田中太郎", avatar: "🧑‍💻" },
            { id: 2, name: "佐藤花子", avatar: "👩‍💻" },
            { id: 3, name: "鈴木一郎", avatar: "👨‍💼" },
            { id: 4, name: "高橋美咲", avatar: "👩‍💼" },
            { id: 5, name: "伊藤健太", avatar: "🧑‍🎨" },
            { id: 6, name: "山田真理", avatar: "👩‍🎨" }
        ];
        renderMemberList();
    }
}

function renderMemberList() {
    const memberList = document.getElementById('memberList');
    memberList.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.dataset.memberId = member.id;
        
        card.innerHTML = `
            <span class="member-avatar">${member.avatar}</span>
            <span class="member-name">${member.name}</span>
        `;
        
        card.addEventListener('click', () => toggleMemberSelection(member.id));
        memberList.appendChild(card);
    });
}

function toggleMemberSelection(memberId) {
    const card = document.querySelector(`[data-member-id="${memberId}"]`);
    
    if (selectedMembers.has(memberId)) {
        selectedMembers.delete(memberId);
        card.classList.remove('selected');
    } else {
        selectedMembers.add(memberId);
        card.classList.add('selected');
    }
    
    updateSelectionCount();
    updateStartButton();
}

function updateSelectionCount() {
    document.getElementById('selectedCount').textContent = selectedMembers.size;
}

function updateStartButton() {
    const startButton = document.getElementById('startButton');
    startButton.disabled = selectedMembers.size < 2 || isSpinning;
}

function createRouletteWheel() {
    const wheel = document.getElementById('rouletteWheel');
    wheel.innerHTML = '';
    
    const selectedMembersList = Array.from(selectedMembers).map(id => 
        members.find(m => m.id === id)
    );
    
    const angleStep = 360 / selectedMembersList.length;
    const radius = 140;
    
    selectedMembersList.forEach((member, index) => {
        const angle = index * angleStep;
        const radians = (angle - 90) * Math.PI / 180;
        const x = Math.cos(radians) * radius + 150;
        const y = Math.sin(radians) * radius + 150;
        
        const item = document.createElement('div');
        item.className = 'roulette-item';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.transform = 'translate(-50%, -50%)';
        item.dataset.angle = angle;
        item.dataset.memberId = member.id;
        
        item.innerHTML = `
            <span class="avatar">${member.avatar}</span>
            <span>${member.name}</span>
        `;
        
        wheel.appendChild(item);
    });
}

function startRoulette() {
    if (isSpinning || selectedMembers.size < 2) return;
    
    isSpinning = true;
    updateStartButton();
    
    document.getElementById('resultDisplay').classList.add('hidden');
    
    createRouletteWheel();
    
    const wheel = document.getElementById('rouletteWheel');
    const selectedMembersList = Array.from(selectedMembers).map(id => 
        members.find(m => m.id === id)
    );
    
    const winnerIndex = Math.floor(Math.random() * selectedMembersList.length);
    const anglePerMember = 360 / selectedMembersList.length;
    const targetAngle = (360 - winnerIndex * anglePerMember) % 360;
    const totalRotation = 360 * (3 + Math.random() * 2) + targetAngle;
    
    let speed = 360;
    const deceleration = 0.95;
    const minSpeed = 0.5;
    
    wheel.classList.add('spinning');
    
    function animate() {
        if (speed > minSpeed) {
            currentRotation += speed / 60;
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            speed *= deceleration;
            requestAnimationFrame(animate);
        } else {
            currentRotation = totalRotation;
            wheel.style.transform = `rotate(${currentRotation}deg)`;
            wheel.classList.remove('spinning');
            
            setTimeout(() => {
                showWinner(selectedMembersList[winnerIndex]);
                isSpinning = false;
                updateStartButton();
            }, 500);
        }
    }
    
    if (soundEnabled) {
        playSpinSound();
    }
    
    animate();
}

function showWinner(winner) {
    const resultDisplay = document.getElementById('resultDisplay');
    const winnerAvatar = resultDisplay.querySelector('.winner-avatar');
    const winnerName = resultDisplay.querySelector('.winner-name');
    
    winnerAvatar.textContent = winner.avatar;
    winnerName.textContent = winner.name;
    
    resultDisplay.classList.remove('hidden');
    
    if (soundEnabled) {
        playWinSound();
    }
    
    showConfetti();
}

function showConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 6 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.vy += 0.1;
            
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
            
            if (particle.y > canvas.height) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animateConfetti();
}

function resetRoulette() {
    document.getElementById('resultDisplay').classList.add('hidden');
    const wheel = document.getElementById('rouletteWheel');
    wheel.style.transform = 'rotate(0deg)';
    currentRotation = 0;
    createRouletteWheel();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.classList.toggle('muted', !soundEnabled);
}

function playSpinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playWinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    
    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + i * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
        
        oscillator.start(audioContext.currentTime + i * 0.1);
        oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    
    document.getElementById('startButton').addEventListener('click', startRoulette);
    document.getElementById('resetButton').addEventListener('click', resetRoulette);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && !isSpinning && selectedMembers.size >= 2) {
            e.preventDefault();
            startRoulette();
        }
    });
});