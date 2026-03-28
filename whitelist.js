const fs = require("fs");

const PATH = "./whitelist.json";

if (!fs.existsSync(PATH)) {
    fs.writeFileSync(PATH, JSON.stringify([]));
}

function get() {
    return JSON.parse(fs.readFileSync(PATH));
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
        let wl = get();
        wl = wl.filter(x => x !== id);
        save(wl);
    },

    has(id) {
        const wl = get();
        return wl.includes(id);
    },

    list() {
        return get();
    }
};
