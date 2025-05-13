/** @param {NS} ns */
export async function main(ns) {
    /**
   * Current Server Info
   */
    var importArgs = ns.args[0];
    var currentServerName = "";
    if(importArgs ===  undefined){
            currentServerName = "home";
        }else{
            currentServerName = importArgs;
    }
    ns.print("currentServerName : " + currentServerName);

    /**
     * Main Vars
     */
    //var MainDebug = false;
    var fileName =  currentServerName + "_ServerInfo.txt";

    sendDataToFile(currentServerName, fileName, getServerInformation(currentServerName));


    //Main Function
    async function sendDataToFile(Servername, FileName, dataToWrite,){
        //Check to see if the files exists on the server already
        if (ns.fileExists(FileName, Servername)) {
            await deleteFile(FileName, Servername);
        }

        //Write the data to a txt file for later usage
        await writeData(FileName, dataToWrite);

        //Copy the data Home
        await ns.scp(FileName, "home", Servername);
    }

    //Get everything about the server and return an array
    function getServerInformation(serverName){
        var serverStats = [];
        serverStats.push(serverName);
        serverStats.push(ns.hasRootAccess(serverName));
        serverStats.push(ns.getServerRequiredHackingLevel(serverName))
        serverStats.push(ns.getServerNumPortsRequired(serverName));
        serverStats.push(ns.getServerMaxRam(serverName));
        serverStats.push(ns.getServerMaxMoney(serverName));
        serverStats.push(ns.getServerMinSecurityLevel(serverName));
        return serverStats;
    }

    //Append all the data to a file
    async function writeData(fn, data) {
        for (var i = 0; i < data.length; i++) {
            if (i < data.length - 1) {
            ns.write(fn, data[i] + ",", 'a');
            } else {
            ns.write(fn, data[i], 'a');
            }
        }
    }

    //delete file if it already exists
    async function deleteFile(fileName, currentServerName) {
        if (ns.fileExists(fileName, currentServerName)) {
            ns.rm("./" + fileName);
        }
    }
}