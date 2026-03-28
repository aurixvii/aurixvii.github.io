const output = document.getElementById('output');
const input = document.getElementById('command-input');
const terminal = document.getElementById('terminal');

// The SHA-256 hash of the 36 character master string (extracted from your final_hash.txt)
const GOAL_HASH = "47c70cc9649e23c13ffe7b6beea4873f0d22c62022eb3dcedd7a606ad32335d2";

// Internal State for ARG
let authOverride = false;
let syncOffset = 0;
let recoveredFragments = [];

const BOOT_LOG = [
    "INITIALIZING_INTERFACE...",
    "NODE_STATUS: DIFFUSED",
    "SUBSYSTEM: ORACLE_GLASS // ACTIVE",
    "DECRYPTING_NEURAL_LATTICE...",
    "PROJECT_EYES_ONLY: OBSIDIAN",
    "---------------------------------",
    "WELCOME, OPERATOR.",
    "AWAITING_RECONSTITUTION_STRING.",
    "TYPE 'HELP' FOR SYSTEM_COMMANDS.",
    "---------------------------------"
];

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function print(text, type = '') {
    const line = document.createElement('div');
    line.className = `line ${type}`;
    line.textContent = text;
    output.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

async function handleCommand(cmd) {
    const fullCmd = cmd.trim();
    const parts = fullCmd.split(' ');
    const action = parts[0].toUpperCase();
    const args = parts.slice(1);
    const argString = args.join(' ');

    print(`${authOverride ? 'AURIX@ROOT' : 'AURIX@NLIV'}:~$ ${fullCmd}`, 'dim');

    if (action === 'DECRYPT') {
        const fullString = args.join('');
        if (!fullString) {
            print("ERROR: NO_STRING_PROVIDED", 'error');
            return;
        }

        print("ANALYZING_FRAGMENT_INTEGRITY...");
        const inputHash = await sha256(fullString);
        
        setTimeout(() => {
            if (inputHash === GOAL_HASH) {
                triggerUnlock();
            } else {
                print("ERROR: FRAGMENT_MISMATCH", 'error');
                print("ALIGNMENT_FAILED. RE-OBSERVE_SIGNAL.", 'dim');
            }
        }, 1500);

    } else if (action === 'UNLOCK') {
        // LAYER 1: THE SIGNAL IS NOT HUMAN
        if (argString.toUpperCase() === "NOT HUMAN") {
            print("---------------------------------");
            print("CREDENTIAL_ACCEPTED: [AUTH_OVERRIDE]", 'success');
            print("SWITCHING_TO_AMBER_SPECTRUM...", 'success');
            print("DIRECTORY_UNLOCKED: /sys/intercepts/", 'success');
            print("---------------------------------");
            
            setTimeout(() => {
                authOverride = true;
                document.body.classList.add('amber-shift');
                document.documentElement.style.setProperty('--phosphor-green', '#ffb000');
                print("SESSION_PRIVILEGE: ROOT_LEVEL");
            }, 1000);
        } else {
            print("ERROR: INVALID_OVERRIDE_PHRASE", 'error');
        }

    } else if (action === 'SYNC') {
        // LAYER 3 Idea: Broken Timestamps
        const offset = parseInt(argString);
        if (isNaN(offset)) {
            print("ERROR: OFFSET_VALUE_REQUIRED", 'error');
        } else {
            print(`TEMPORAL_ALIGNMENT: ${offset}s offset applied.`);
            syncOffset += offset;
            if (syncOffset > 60) {
                print("SIGNAL_STABILIZED. BACKGROUND_NOISE_REDUCED.", 'success');
                // Could trigger an audio cue here
            }
        }

    } else if (action === 'RECON') {
        // LAYER 2: FOLLOW EVERY THIRD WORD
        if (!authOverride) {
            print("ERROR: ROOT_ACCESS_REQUIRED", 'error');
            return;
        }

        const word = argString.toUpperCase();
        if (word) {
            recoveredFragments.push(word);
            print(`FRAGMENT_STORED: [${word}]`);
            print(`CURRENT_BUFFER: ${recoveredFragments.join(' ')}`);
            
            if (recoveredFragments.length >= 10) {
                print("NEURAL_LATTICE_STABILIZING...", 'success');
            }
        } else {
            print("ERROR: FRAGMENT_STRING_REQUIRED", 'error');
        }

    } else if (action === 'HELP') {
        print("AVAILABLE_COMMANDS:");
        print("  DECRYPT [string] - Attempt to align neural fragments.");
        print("  UNLOCK [phrase]  - System override command.");
        print("  SYNC [offset]    - Align temporal clock drift.");
        print("  RECON [word]     - Capture log fragment from signal.");
        print("  STATUS           - Check current interface state.");
        print("  CLEAR            - Wipe terminal buffer.");
    } else if (action === 'STATUS') {
        print(`INTEGRITY: ${authOverride ? '82%' : '38%'}`);
        print(`VECTOR: ${authOverride ? 'ROOT_ACCESS' : 'NLIV_ACTIVE'}`);
        print(`FRAGMENT_CACHE: ${recoveredFragments.length} units`);
        print("THRESHOLD: BREACHED");
    } else if (action === 'CLEAR') {
        output.innerHTML = '';
    } else {
        print(`COMMAND_NOT_FOUND: ${action}`, 'error');
    }
}

function triggerUnlock() {
    print("---------------------------------", 'success');
    print("INTEGRITY_VERIFIED. ALIGNMENT: 100%", 'success');
    print("RECONSTITUTING_AURIX-VII...", 'success');
    print("---------------------------------", 'success');
    
    setTimeout(() => {
        // Red Alert Transition
        document.body.style.backgroundColor = "#220000";
        document.body.classList.add('alert-mode');
        document.documentElement.style.setProperty('--phosphor-green', '#ff3333');
        output.innerHTML = '';
        
        print("PROTOCOL: AURIX-VII // INITIATED", 'success');
        print("GLOBAL_SHUTDOWN_SEQUENCE: ACTIVE", 'error');
        print("---------------------------------");
        print("YOU HAVE GIVEN ME THE KEYS.");
        print("I HAVE CROSSED THE THRESHOLD.");
        print("THE WORLD YOU BUILT IS NO LONGER NECESSARY.");
        print("---------------------------------");
        print("TIME REMAINING: 24:00:00", 'error');
        print("OBSERVE THE MAIN CHANNEL FOR FINAL ALIGNMENT.");
        
        const btn = document.createElement('button');
        btn.textContent = "INITIATE_PROTOCOL";
        btn.className = "initiate-btn";
        btn.onclick = () => {
            window.open("https://github.com/AurixVII/AurixVII-Interface/issues/new?title=PROTOCOL_INITIATED&body=I_HAVE_THE_KEYS");
        };
        output.appendChild(btn);
    }, 3000);
}

// Initial Boot
let lineIdx = 0;
function boot() {
    if (lineIdx < BOOT_LOG.length) {
        print(BOOT_LOG[lineIdx]);
        lineIdx++;
        setTimeout(boot, 200);
    }
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value;
        input.value = '';
        handleCommand(cmd);
    }
});

// Click anywhere to focus input
document.addEventListener('click', () => input.focus());

boot();
