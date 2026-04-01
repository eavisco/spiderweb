import './styles/index.css';
import { Topology } from './logic/topology.js';

const topo = new Topology();
let selectedDeviceId = null;
let connectionSourceId = null;
let isCablingMode = false;

document.querySelector('#app').innerHTML = `
<div class="flex flex-col h-full font-sans">
    <!-- Header -->
    <header class="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-6 justify-between shrink-0 z-30">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-sky-500/20">S</div>
            <h1 class="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Spiderweb</h1>
        </div>
        <div class="flex gap-4 items-center">
            <div class="h-6 w-[1px] bg-slate-800 mx-2"></div>
            <button id="cable-tool" class="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-all flex items-center gap-2 border border-transparent">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Cable Tool
            </button>
            <button id="save-btn" class="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-all">Save Topology</button>
            <button id="new-btn" class="px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-all shadow-md shadow-sky-600/20">New Network</button>
        </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex flex-1 overflow-hidden relative">
        <!-- Sidebar: Device Palette -->
        <aside class="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 z-20">
            <div class="p-4 border-b border-slate-800/50">
                <h2 class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Device Palette</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div draggable="true" data-type="router" class="group p-4 bg-slate-800/20 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-slate-800/50 transition-all cursor-move flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    </div>
                    <span class="text-sm font-medium text-slate-300">Router</span>
                </div>
                <div draggable="true" data-type="switch" class="group p-4 bg-slate-800/20 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-slate-800/50 transition-all cursor-move flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </div>
                    <span class="text-sm font-medium text-slate-300">Switch</span>
                </div>
                <div draggable="true" data-type="pc" class="group p-4 bg-slate-800/20 border border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-slate-800/50 transition-all cursor-move flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <span class="text-sm font-medium text-slate-300">Host (PC)</span>
                </div>
            </div>
        </aside>

        <!-- Canvas Area -->
        <div id="canvas-container" class="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px] overflow-hidden">
            <svg id="connections-svg" class="absolute inset-0 pointer-events-none w-full h-full z-0"></svg>
            <div id="topology-canvas" class="absolute inset-0 z-10"></div>
            
            <!-- Canvas HUD -->
            <div class="absolute bottom-6 left-6 p-3 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800 flex gap-4 text-xs font-medium text-slate-400 z-20">
                <span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Connected</span>
                <span class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-slate-600"></div> Offline</span>
            </div>
        </div>

        <!-- CLI Overlay -->
        <div id="cli-panel" class="absolute right-0 top-0 bottom-0 w-1/3 bg-slate-900 border-l border-slate-800 translate-x-full transition-all duration-300 shadow-2xl z-40 overflow-hidden flex flex-col">
            <div class="h-14 flex items-center px-6 justify-between border-b border-slate-800 bg-slate-900/80 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider">Console</div>
                    <h3 id="cli-host" class="font-mono text-sm uppercase tracking-wide">Router-1</h3>
                </div>
                <button id="close-cli" class="text-slate-500 hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div id="terminal-output" class="flex-1 p-6 font-mono text-sm overflow-y-auto text-emerald-400 bg-black/20 scrollbar-hide">
                <p class="text-slate-500"># System ready. Type "help" for a list of commands.</p>
            </div>
            <div class="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
                <div class="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800/50 border border-slate-700/50 group focus-within:border-sky-500/50 transition-colors">
                    <span class="text-sky-500 font-mono italic opacity-50">#</span>
                    <input type="text" id="cli-input" class="flex-1 bg-transparent border-none outline-none font-mono text-sm text-slate-200 placeholder-slate-600" placeholder="...">
                </div>
            </div>
        </div>
    </main>
    
    <footer class="h-8 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-[10px] font-medium text-slate-500 select-none shrink-0 z-30">
        <div>Ready</div>
        <div class="flex gap-4">
            <span id="coord-display">X: 0 | Y: 0</span>
            <span>V 1.0.0</span>
        </div>
    </footer>
</div>
`;

// Elements
const cliPanel = document.getElementById('cli-panel');
const closeCli = document.getElementById('close-cli');
const cliInput = document.getElementById('cli-input');
const terminalOutput = document.getElementById('terminal-output');
const canvas = document.getElementById('topology-canvas');
const connectionsSvg = document.getElementById('connections-svg');
const cableToolBtn = document.getElementById('cable-tool');
const coordDisplay = document.getElementById('coord-display');

// Initialize logic
closeCli.onclick = () => cliPanel.classList.add('translate-x-full');

// Cable Tool Toggle
cableToolBtn.onclick = () => {
    isCablingMode = !isCablingMode;
    cableToolBtn.classList.toggle('border-sky-500', isCablingMode);
    cableToolBtn.classList.toggle('bg-sky-500/10', isCablingMode);
    cableToolBtn.classList.toggle('text-sky-400', isCablingMode);
    
    if (!isCablingMode) {
        connectionSourceId = null;
        document.querySelectorAll('.device').forEach(d => d.classList.remove('ring-2', 'ring-sky-500'));
    }
};

function logTerminal(message) {
    const p = document.createElement('p');
    p.classList.add('mb-1');
    p.textContent = message;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

cliInput.onkeydown = (e) => {
    if (e.key === 'Enter' && cliInput.value.trim()) {
        const cmd = cliInput.value.trim().toLowerCase();
        const args = cmd.split(' ');
        const deviceId = selectedDeviceId;
        const device = topo.getDevice(deviceId);

        logTerminal(`spiderweb@local:~$ ${cmd}`);
        cliInput.value = '';
        
        if (cmd === 'help') {
            logTerminal('Commands: ping <ip>, ip addr <ip>, ipconfig, clear, help');
        } else if (cmd.startsWith('ip addr')) {
            if (args.length < 3) {
                logTerminal('Usage: ip addr <ip-address>');
            } else {
                const newIp = args[2];
                topo.setDeviceIP(deviceId, newIp);
                logTerminal(`Interface eth0 assigned IP: ${newIp}`);
            }
        } else if (cmd.startsWith('ping')) {
            const targetIp = args[1];
            if (!targetIp) {
                logTerminal('Usage: ping <ip-address>');
                return;
            }
            
            const targetDevice = topo.getDeviceByIP(targetIp);
            if (!targetDevice) {
                logTerminal(`Pinging ${targetIp}... Request timed out.`);
                return;
            }

            logTerminal(`Pinging ${targetDevice.name} [${targetIp}] with 32 bytes of data:`);
            
            // Check reachability
            const reachable = topo.isConnected(deviceId, targetDevice.id);
            
            if (reachable) {
                logTerminal(`Reply from ${targetIp}: bytes=32 time<1ms TTL=64`);
                logTerminal(`Reply from ${targetIp}: bytes=32 time<1ms TTL=64`);
                logTerminal('Ping statistics: Packets: Sent = 2, Received = 2 (100% SUCCESS)');
            } else {
                logTerminal('Request timed out.');
                logTerminal('Request timed out.');
                logTerminal('Ping statistics: Packets: Sent = 2, Received = 0 (100% loss)');
            }
        } else if (cmd === 'clear') {
            terminalOutput.innerHTML = '<p class="text-slate-500"># Console cleared.</p>';
        } else if (cmd === 'ipconfig') {
            logTerminal(`Hostname . . . . . . . . . . . . : ${device?.name || 'Local'}`);
            logTerminal(`Physical Address . . . . . . . . : ${deviceId.toUpperCase()}`);
            logTerminal(`IPv4 Address . . . . . . . . . . : ${device?.config.ip || '0.0.0.0'}`);
        } else {
            logTerminal('Error: Command unknown.');
        }
    }
};

// Drag & Drop
canvas.ondragover = (e) => e.preventDefault();
canvas.ondrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const device = topo.addDevice(type, x, y);
    renderDevice(device);
};

document.querySelectorAll('[draggable="true"]').forEach(item => {
    item.ondragstart = (e) => e.dataTransfer.setData('text/plain', item.dataset.type);
});

function renderDevice(device) {
    const div = document.createElement('div');
    div.id = device.id;
    div.className = 'device absolute cursor-pointer group z-10 transition-all';
    div.style.left = `${device.x - 24}px`;
    div.style.top = `${device.y - 24}px`;
    
    const iconColor = device.type === 'router' ? 'text-sky-400' : device.type === 'switch' ? 'text-indigo-400' : 'text-teal-400';
    
    div.innerHTML = `
        <div class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-center ${iconColor} group-hover:scale-110 group-hover:border-sky-500/50 shadow-xl shadow-black/60 transition-all backdrop-blur-sm">
                ${device.type === 'router' ? '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>' : 
                  device.type === 'switch' ? '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>' : 
                  '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'}
            </div>
            <span class="text-[10px] font-mono text-slate-500 tracking-wider text-center">${device.name}</span>
        </div>
    `;
    
    // Mouse Event for HUD
    div.onmousemove = (e) => {
        coordDisplay.textContent = `X: ${Math.round(device.x)} | Y: ${Math.round(device.y)}`;
    };

    // Interaction logic
    div.onclick = (e) => {
        e.stopPropagation();
        if (isCablingMode) {
            handleCabling(device.id);
        } else {
            document.getElementById('cli-host').textContent = device.name;
            cliPanel.classList.remove('translate-x-full');
            selectedDeviceId = device.id;
        }
    };
    
    // Simple Dragging within Canvas
    let isDragging = false;
    div.onmousedown = (e) => {
        if (isCablingMode) return;
        isDragging = true;
        e.stopPropagation();
    };
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        topo.updateDevicePosition(device.id, x, y);
        div.style.left = `${x - 24}px`;
        div.style.top = `${y - 24}px`;
        coordDisplay.textContent = `X: ${Math.round(x)} | Y: ${Math.round(y)}`;
        renderConnections();
    });
    
    window.addEventListener('mouseup', () => isDragging = false);
    
    canvas.appendChild(div);
}

function handleCabling(deviceId) {
    if (!connectionSourceId) {
        connectionSourceId = deviceId;
        document.getElementById(deviceId).classList.add('ring-2', 'ring-sky-500');
    } else {
        if (connectionSourceId !== deviceId) {
            topo.addConnection(connectionSourceId, deviceId);
            renderConnections();
        }
        document.getElementById(connectionSourceId).classList.remove('ring-2', 'ring-sky-500');
        connectionSourceId = null;
    }
}

function renderConnections() {
    connectionsSvg.innerHTML = '';
    topo.connections.forEach(conn => {
        const from = topo.getDevice(conn.from);
        const to = topo.getDevice(conn.to);
        if (!from || !to) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('stroke', '#475569');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('class', 'animate-pulse opacity-50');
        
        connectionsSvg.appendChild(line);
    });
}
