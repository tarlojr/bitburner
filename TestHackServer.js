/** @param {NS} ns */
export async function main(ns) {
    var args = "home,yes,1,1,8";
    let pid = ns.exec("HackServer.js", "home", 1, args);
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
}