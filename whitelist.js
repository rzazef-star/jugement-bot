const fs = require("fs");

const PATH = "./whitelist.json";

function get() {
    try {
        if (!fs.existsSync(PATH)) return [];
        const data = fs.readFileSync(PATH);
        if (!data.length) return [];
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function save(data) {
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    add(id) {
        const wl = get();
        if (!wl.includes(id)) {
            wl.push(id);
            save(wl);
        }
    },

    remove(id) {
        const wl = get().filter(x => x !== id);
        save(wl);
    },

    has(id) {
        return get().includes(id);
    },

    list() {
        return get();
    }
};
