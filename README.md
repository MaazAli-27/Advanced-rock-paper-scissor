#Neon Clash: RPSLS Super Ultra
A highly interactive, cyberpunk-themed adaptation of the classic Rock, Paper, Scissors, Lizard, Spock game.
Report Bug • Request Feature

##About The Project
Neon Clash transforms the traditional game of Rock-Paper-Scissors-Lizard-Spock into a high-octane Arcade Fighter. Featuring Health Points (HP), combo multipliers, predictive machine-learning AI, cloud data persistence, and real-time Generative AI commentary, it pushes the boundaries of what can be achieved in a single-file web architecture.
Built entirely with pure HTML, Tailwind CSS, and vanilla JavaScript—requiring zero build tools or external asset hosting.

<img width="1907" height="900" alt="image" src="https://github.com/user-attachments/assets/c9fae7b9-fefd-49cb-83d6-752c9b9b474e" />

<img width="1892" height="905" alt="image" src="https://github.com/user-attachments/assets/22c07150-743f-459c-8198-90400a8fc264" />

<img width="1872" height="892" alt="image" src="https://github.com/user-attachments/assets/746c78d4-d72f-4f55-a485-672d37da563f" />



##Core Features
🎮 Arcade Fighter Gameplay
HP System: Replaces standard "Best of 3" rounds with a dynamic 100 HP combat system.
Combo Multipliers: Building a win streak increases your damage output incrementally (x1.25, x1.5, etc.).
Floating Combat Text: Real-time visual damage indicators and hit registers directly on the UI.

##Advanced Integrations
Gemini LLM Integration: Utilizes Google's Gemini API to generate real-time, context-aware cyberpunk taunts during battle, plus an "Esports Commentator" post-match analysis based on final stats.
Cloud Persistence: Automatically saves user statistics (Wins, Losses, Win Rate, Max Streak) and unlockable achievements to Firebase Firestore using anonymous authentication.

##Cyberpunk Aesthetics & UI
Glassmorphism HUD: Translucent panels with background blur and reactive neon borders.
Dynamic Animations: Screen shakes on impact, CSS keyframe clashes, and glitch effects for critical hits or system errors.
Canvas Particle Engine: Background floating geometry and explosive confetti upon victory.

##Procedural Audio
Zero External Assets: All sound effects (hover, click, win, lose, tie) are procedurally generated in real-time using the native browser Web Audio API (Oscillators & Gain Nodes).
Haptic Feedback: Native device vibration triggers on mobile devices during critical hits.

##Game Modes & Rules
Classic Mode
The traditional battle format.
🪨 Rock beats Scissors
📄 Paper beats Rock
✂️ Scissors beats Paper
RPSLS Mode (Lizard Spock)
Designed to statistically reduce the number of draw states, popularized by The Big Bang Theory.
✂️ Scissors cuts Paper & decapitates Lizard
📄 Paper covers Rock & disproves Spock
🪨 Rock crushes Scissors & crushes Lizard
🦎 Lizard poisons Spock & eats Paper
🖖 Spock smashes Scissors & vaporizes Rock
🤖 AI & Machine Learning Mechanics

The opponent AI operates on multiple layers of complexity depending on your selected difficulty:
Level 1 (Easy / Random): Standard RNG probability. Perfect for learning the game mechanics.
Level MAX (Tactical / Predictive): A custom Markov Chain-inspired algorithm. The system continuously logs your combat history, identifies your most frequent 2-move and 3-move patterns, calculates your most likely next move, and automatically executes its counter-attack. You must play erratically to defeat it.

Neural Taunts (Gemini): Every 3 rounds, or upon dealing massive damage, the AI feeds the current combat state into the Gemini LLM to generate a personalized, in-character insult.

##Technical Stack
Frontend Structure: HTML5
Styling: CSS3 & Tailwind CSS (via CDN)
Logic & Interactivity: Vanilla ES6 JavaScript
Graphics: HTML5 <canvas> (Custom particle engine)
Audio: Native AudioContext API
Backend / Database: Firebase Auth & Firestore (v11 SDK)
Generative AI: Google Gemini API (gemini-2.5-flash-preview)# Advanced-rock-paper-scissor
