/** @param {NS} ns */
export async function main(ns) {
  var target = ns.args[0];
  const cashOut = ns.args[1] * .75;
  const securityState = ns.args[2] + 5;

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