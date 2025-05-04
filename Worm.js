/** @param {NS} ns */
export async function main(ns) {
    /**
     * Data that needs to be brought in when new instance is created
     */
    var currentServerName = ns.args[0];
    
    /**
     * Data that can be brought in through the server this is currently running on
     */
    var connectedServersFileName = "_ConnectedServers.txt";
    var connectedServers;
    var serverInformationFileName = "_ServerInfo.txt";
    var serverInformation;


    /**
     * servers that have been looked at
     */
    var hackedServers = [];
    var failedHackedServers = [];
    var scanedServers = [];

    /**
     * 
     */
    function ServerInformation(serverName, serverInfo, connectedServers, isSearched){
        this.serverName = serverName;
        this.serverInfo = serverInfo;
        this.connectedServers = connectedServers;
        this.isSearched =isSearched;
    }

    
    /**
     * main loop
     */
    while(true){
        await stepsToHack(currentServerName);
        for(var x in connectedServers){

        }
        
    }


    


    /**
     * 
     * @param {server to check if it has been hacked } serverToCheck 
     * @returns 
     *  1 if server has been hacked
     *  2 if server was failed to hack
     *  3 if unkown server
     */
    function compareServers(serverToCheck){
        if(ns.hasRootAccess(serverToCheck) == true){
            ns.print("Has Root Access on : " + serverToCheck);
            if(compareArray(hackedServers, serverToCheck) == false){
                ns.print("adding server to array : " + serverToCheck);
                hackedServers.push(serverToCheck);
            }
            return 1
        }else{
            if(compareArray(failedHackedServers, serverToCheck) == true){
                return 2
            }else{
                return 3
            }
        }
    }

    /**
     * 
     * @param {Name of file to import} fileName 
     * @returns data from file imported
     */
    function importData(fileName) {
        var fileContents = [];
        if (ns.fileExists(fileName, currentServerName)) {
            ns.print("Found file : " + fileName);
            fileContents = ns.read(fileName).split(",");
            ns.print("Read Data is : " + arrayToString(fileContents));
        } else {
            ns.print("Failed to find file : " + fileName);
        }
        return fileContents;
    }

    async function stepsToHack(server){
        scanedServers.push(server);
        await getServerInfo(server);
        getConnectedServers(server);
    }

    async function hackServer(server){
        serverInformation = server + serverInformationFileName;
        var serverinfo = importData(serverInformation);
        var hackServerArgs = arrayToString(serverinfo);

        if(ns.hasRootAccess(cServersContents[s]) == false){
            let pid = ns.exec("HackServer.js", server, 1, hackServerArgs);
            while (ns.isRunning(pid)) {
              await ns.sleep(100);
            }
        }
    }
    
    function getConnectedServers(server){
        connectedServers = importData(server + connectedServersFileName);
        ns.print("connected Servers : " + arrayToString(connectedServers));
        for(var s in connectedServers){
            ns.print("s in connected servers is : " + connectedServers[s]);
            switch(compareServers(connectedServers[s])){
                case 1:
                    ns.print("Server : " + connectedServers[s] + " has Already been Hacked");
                    break;

                case 2:
                    ns.print("Server : " + connectedServers[s] + " Failed Last Time Trying Again");
                    hackServer(connectedServers[s]);
                    if(ns.hasRootAccess(connectedServers[s]) == true){
                        failedHackedServers = failedHackedServers.filter(item => item !== connectedServers[s]);
                        hackedServers.push(connectedServers[s]);
                    }
                    break;

                case 3:
                    ns.print("Server : " + connectedServers[s] + " is unknown trying to hack");
                    hackServer(connectedServers[s]);
                    if(ns.hasRootAccess(connectedServers[s]) == true){
                        hackedServers.push(connectedServers[s]);
                    }else{
                        failedHackedServers.push(connectedServers[s]);
                    }
                    break;
            }
        }
    }

    async function getServerInfo(Server){
        let pid = ns.exec("getServerInfo.js", Server, 1, Server);
        while (ns.isRunning(pid)) {
            await ns.sleep(100);
        }
    }
}

function arrayToString(importArray){
    var stringout = "";
    for(var x in importArray){
      if(x == importArray.length - 1){
        stringout += importArray[x];
      }else{
        stringout += importArray[x] + ",";
      }
    }
    return stringout;
}

function compareArray(array, toCompare){
    var isMatch = false;
    for(var x in array){
        if(array[x] == toCompare){
            isMatch = true;
        }
    }
    return isMatch;
}