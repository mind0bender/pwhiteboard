const { LazyBrush } = require("lazy-brush");

window.LazyBrush = LazyBrush;

window.isDev = process.env.NODE_ENV !== "production";
