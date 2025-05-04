/** @param {NS} ns */
export async function main(ns) {
    var importData = ns.args[0];
    var importArray = importData.split(",");
    var serverData = {
        serverName: importArray[0],
        rootAccess: importArray[1],
        requiredHackingLevel: importArray[2],
        numPortsRequired: importArray[3],
        maxRam: importArray[4]
    }
    var homeServer = "home"
    var availableCracks = {
        "BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
    };

    // var x = true;
    // while(x){
    //     hack(serverData.serverName);
    //     if(ns.hasRootAccess(serverData.serverName) == true){
    //         x = false;
    //     }
    //     await ns.sleep(100);
    // }
    await hack(serverData.serverName);

    function getNumCracks() {
		return Object.keys(availableCracks).filter(function (file) {
			return ns.fileExists(file, homeServer);
		}).length;
	}

    async function openPorts(server){
        for(var crack of Object.keys(availableCracks)){
            if(ns.fileExists(crack, homeServer)){
                var runCrack = availableCracks[crack];
                runCrack(server);
            }
        }
    }

    async function canHack(){
        var canHack = false;
        var access = serverData.rootAccess;
        var hackingLevelRequired = Number(serverData.requiredHackingLevel);
        var portsRequired = Number(serverData.numPortsRequired);
        // ns.print("access : " + access);
        // ns.print("hacking Level : " + hackingLevelRequired);
        // ns.print("Ports Required : " + portsRequired);

        if(access === "false"){
            if(hackingLevelRequired <= ns.getHackingLevel()){
                if(portsRequired <= getNumCracks()){
                    canHack = true;
                }else{
                    canHack = false;
                }
            }else{
                canHack = false;
            }
        }else{
            ns.print("access != False : " + access);
            canHack = false;
        }
        return canHack;
    }

    async function hack(server){
        if(await canHack() == true){
            if(serverData.numPortsRequired > 0){
                await openPorts(server);
            }
            await ns.nuke(server);
        }else {
            ns.print("Cant Hack : " + server);
        }
    }
}