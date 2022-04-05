const path = require("path");
const fs = require("fs");

const filepath = path.resolve(__dirname, "../answers-suggestions.json");

function store(key, value) {
  const data = load();
  data[key] = value;

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  return data;
}

function get(key, defaultValue = "") {
  return load()[key] || defaultValue;
}

function load() {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } else {
    return {};
  }
}

module.exports = {
  store,
  get,
};
