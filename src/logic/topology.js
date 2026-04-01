export class Topology {
    constructor() {
        this.devices = [];
        this.connections = [];
        this.nextDeviceId = 1;
    }

    addDevice(type, x, y) {
        const id = `${type}-${this.nextDeviceId++}`;
        const device = {
            id,
            type,
            x,
            y,
            name: `${type.toUpperCase()}-${this.nextDeviceId - 1}`,
            state: 'online',
            config: {
                hostname: `${type.toUpperCase()}-${this.nextDeviceId - 1}`,
                interfaces: []
            }
        };
        this.devices.push(device);
        return device;
    }

    addConnection(fromId, toId) {
        // Prevent duplicate or self-connections
        if (fromId === toId) return null;
        if (this.connections.some(c => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId))) {
            return null;
        }

        const conn = {
            id: `conn-${fromId}-${toId}`,
            from: fromId,
            to: toId,
            state: 'connected'
        };
        this.connections.push(conn);
        return conn;
    }

    updateDevicePosition(id, x, y) {
        const d = this.devices.find(d => d.id === id);
        if (d) {
            d.x = x;
            d.y = y;
        }
    }

    getDevice(id) {
        return this.devices.find(d => d.id === id);
    }

    getDeviceByIP(ip) {
        return this.devices.find(d => d.config.ip === ip);
    }

    setDeviceIP(id, ip) {
        const d = this.getDevice(id);
        if (d) d.config.ip = ip;
    }

    // Basic reachability check (BFS)
    isConnected(startId, targetId) {
        if (startId === targetId) return true;
        
        const visited = new Set();
        const queue = [startId];
        visited.add(startId);

        while (queue.length > 0) {
            const currentId = queue.shift();
            
            // Find all neighbors
            const neighbors = this.connections
                .filter(c => c.from === currentId || c.to === currentId)
                .map(c => c.from === currentId ? c.to : c.from);

            for (const neighborId of neighbors) {
                if (neighborId === targetId) return true;
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push(neighborId);
                }
            }
        }
        return false;
    }
}
