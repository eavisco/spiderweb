(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new class{constructor(){this.devices=[],this.connections=[],this.nextDeviceId=1}addDevice(e,t,n){let r={id:`${e}-${this.nextDeviceId++}`,type:e,x:t,y:n,name:`${e.toUpperCase()}-${this.nextDeviceId-1}`,state:`online`,config:{hostname:`${e.toUpperCase()}-${this.nextDeviceId-1}`,interfaces:[]}};return this.devices.push(r),r}addConnection(e,t){if(e===t||this.connections.some(n=>n.from===e&&n.to===t||n.from===t&&n.to===e))return null;let n={id:`conn-${e}-${t}`,from:e,to:t,state:`connected`};return this.connections.push(n),n}updateDevicePosition(e,t,n){let r=this.devices.find(t=>t.id===e);r&&(r.x=t,r.y=n)}getDevice(e){return this.devices.find(t=>t.id===e)}getDeviceByIP(e){return this.devices.find(t=>t.config.ip===e)}setDeviceIP(e,t){let n=this.getDevice(e);n&&(n.config.ip=t)}isConnected(e,t){if(e===t)return!0;let n=new Set,r=[e];for(n.add(e);r.length>0;){let e=r.shift(),i=this.connections.filter(t=>t.from===e||t.to===e).map(t=>t.from===e?t.to:t.from);for(let e of i){if(e===t)return!0;n.has(e)||(n.add(e),r.push(e))}}return!1}},t=null,n=null,r=!1;document.querySelector(`#app`).innerHTML=`
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
`;var i=document.getElementById(`cli-panel`),a=document.getElementById(`close-cli`),o=document.getElementById(`cli-input`),s=document.getElementById(`terminal-output`),c=document.getElementById(`topology-canvas`),l=document.getElementById(`connections-svg`),u=document.getElementById(`cable-tool`),d=document.getElementById(`coord-display`);a.onclick=()=>i.classList.add(`translate-x-full`),u.onclick=()=>{r=!r,u.classList.toggle(`border-sky-500`,r),u.classList.toggle(`bg-sky-500/10`,r),u.classList.toggle(`text-sky-400`,r),r||(n=null,document.querySelectorAll(`.device`).forEach(e=>e.classList.remove(`ring-2`,`ring-sky-500`)))};function f(e){let t=document.createElement(`p`);t.classList.add(`mb-1`),t.textContent=e,s.appendChild(t),s.scrollTop=s.scrollHeight}o.onkeydown=n=>{if(n.key===`Enter`&&o.value.trim()){let n=o.value.trim().toLowerCase(),r=n.split(` `),i=t,a=e.getDevice(i);if(f(`spiderweb@local:~$ ${n}`),o.value=``,n===`help`)f(`Commands: ping <ip>, ip addr <ip>, ipconfig, clear, help`);else if(n.startsWith(`ip addr`))if(r.length<3)f(`Usage: ip addr <ip-address>`);else{let t=r[2];e.setDeviceIP(i,t),f(`Interface eth0 assigned IP: ${t}`)}else if(n.startsWith(`ping`)){let t=r[1];if(!t){f(`Usage: ping <ip-address>`);return}let n=e.getDeviceByIP(t);if(!n){f(`Pinging ${t}... Request timed out.`);return}f(`Pinging ${n.name} [${t}] with 32 bytes of data:`),e.isConnected(i,n.id)?(f(`Reply from ${t}: bytes=32 time<1ms TTL=64`),f(`Reply from ${t}: bytes=32 time<1ms TTL=64`),f(`Ping statistics: Packets: Sent = 2, Received = 2 (100% SUCCESS)`)):(f(`Request timed out.`),f(`Request timed out.`),f(`Ping statistics: Packets: Sent = 2, Received = 0 (100% loss)`))}else n===`clear`?s.innerHTML=`<p class="text-slate-500"># Console cleared.</p>`:n===`ipconfig`?(f(`Hostname . . . . . . . . . . . . : ${a?.name||`Local`}`),f(`Physical Address . . . . . . . . : ${i.toUpperCase()}`),f(`IPv4 Address . . . . . . . . . . : ${a?.config.ip||`0.0.0.0`}`)):f(`Error: Command unknown.`)}},c.ondragover=e=>e.preventDefault(),c.ondrop=t=>{t.preventDefault();let n=t.dataTransfer.getData(`text/plain`),r=c.getBoundingClientRect(),i=t.clientX-r.left,a=t.clientY-r.top;p(e.addDevice(n,i,a))},document.querySelectorAll(`[draggable="true"]`).forEach(e=>{e.ondragstart=t=>t.dataTransfer.setData(`text/plain`,e.dataset.type)});function p(n){let a=document.createElement(`div`);a.id=n.id,a.className=`device absolute cursor-pointer group z-10 transition-all`,a.style.left=`${n.x-24}px`,a.style.top=`${n.y-24}px`,a.innerHTML=`
        <div class="flex flex-col items-center gap-1">
            <div class="w-12 h-12 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-center ${n.type===`router`?`text-sky-400`:n.type===`switch`?`text-indigo-400`:`text-teal-400`} group-hover:scale-110 group-hover:border-sky-500/50 shadow-xl shadow-black/60 transition-all backdrop-blur-sm">
                ${n.type===`router`?`<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>`:n.type===`switch`?`<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`:`<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`}
            </div>
            <span class="text-[10px] font-mono text-slate-500 tracking-wider text-center">${n.name}</span>
        </div>
    `,a.onmousemove=e=>{d.textContent=`X: ${Math.round(n.x)} | Y: ${Math.round(n.y)}`},a.onclick=e=>{e.stopPropagation(),r?m(n.id):(document.getElementById(`cli-host`).textContent=n.name,i.classList.remove(`translate-x-full`),t=n.id)};let o=!1;a.onmousedown=e=>{r||(o=!0,e.stopPropagation())},window.addEventListener(`mousemove`,t=>{if(!o)return;let r=c.getBoundingClientRect(),i=t.clientX-r.left,s=t.clientY-r.top;e.updateDevicePosition(n.id,i,s),a.style.left=`${i-24}px`,a.style.top=`${s-24}px`,d.textContent=`X: ${Math.round(i)} | Y: ${Math.round(s)}`,h()}),window.addEventListener(`mouseup`,()=>o=!1),c.appendChild(a)}function m(t){n?(n!==t&&(e.addConnection(n,t),h()),document.getElementById(n).classList.remove(`ring-2`,`ring-sky-500`),n=null):(n=t,document.getElementById(t).classList.add(`ring-2`,`ring-sky-500`))}function h(){l.innerHTML=``,e.connections.forEach(t=>{let n=e.getDevice(t.from),r=e.getDevice(t.to);if(!n||!r)return;let i=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);i.setAttribute(`x1`,n.x),i.setAttribute(`y1`,n.y),i.setAttribute(`x2`,r.x),i.setAttribute(`y2`,r.y),i.setAttribute(`stroke`,`#475569`),i.setAttribute(`stroke-width`,`2`),i.setAttribute(`stroke-dasharray`,`4`),i.setAttribute(`class`,`animate-pulse opacity-50`),l.appendChild(i)})}