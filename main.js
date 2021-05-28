require("dotenv").config();
const { LazyBrush } = require("lazy-brush");

window.LazyBrush = LazyBrush;

window.process = process;

console.log(process);
