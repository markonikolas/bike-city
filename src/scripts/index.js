import Toggle from "./classes/Toggle";

/**
 * Without this fix, script will load before html
 * and Toggle will be undefined
 * Solution: Defer scripts loading.
 */
// const Menu = new Toggle('menu');

// window.onreload = function () {
// 	Menu.deregisterEvents()
// };
