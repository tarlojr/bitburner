/** @param {NS} ns */
export async function main(ns) {
    var importData = ns.args[0];
    var importArray = importData.split(",");
    var target = importArray[0];
    const cashOut = importArray[5] * .75;
    const securityState = importArray[6] + 5;

    while(true) {
            if (ns.getServerSecurityLevel(target) > securityState) {
                await ns.weaken(target);
            } else if (ns.getServerMoneyAvailable(target) < cashOut) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        }
    }