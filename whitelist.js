const fs = require("fs");
const path = "./whitelist.json";

function getWhitelist() {
    return JSON.parse(fs.readFileSync(path));
}

function saveWhitelist(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

module.exports = {
    isWhitelisted(id) {
        const data = getWhitelist();
        return data.users.includes(id);
    },

    add(id) {
        const data = getWhitelist();
        if (!data.users.includes(id)) {
            data.users.push(id);
            saveWhitelist(data);
        }
    },

    remove(id) {
        const data = getWhitelist();
        data.users = data.users.filter(user => user !== id);
        saveWhitelist(data);
    }
};