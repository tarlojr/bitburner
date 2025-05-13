import {importData, arrayToString, compareArray} from "./Utils.js";

/** @param {NS} ns */
export async function main(ns) {
    /**
     * Args for starting the file, if no args passed through the starting server is going to default to home
     */
    var currentServerName = ns.args[0];
    if(currentServerName ===  undefined){
        currentServerName = "home";
    }

    /**
     * A constructor for the serverInformation object
     * 
     * @param {Name of the server looking at} serverName 
     * @param {All the information from the serverInfo text File} serverInfo 
     * @param {All the servers you can connect to from this server} connectedServers
     */
    function ServerInformation(serverName, serverInfo, connectedServers){
        this.serverName = serverName,
        this.serverInfo = serverInfo,
        this.connectedServers = connectedServers
    }

    /**
     * Some Base Vars for the script
     */
    var mainDebug = false;
    var servers = [];
    var serverInformationFileName = "_ServerInfo.txt";
    var scriptsToCopy = ["HackServer.js", "GetServerInfoV2.js", "AutoRunDeploy.js"];

    /**
     * Main
     */

    //add host server to the ServerInformation object before the main loop runs.
    var hostServerInformationFileName = currentServerName + serverInformationFileName;
    var hostserverInfo = await canImportData(currentServerName, hostServerInformationFileName);
    var hostconnectedServers = await ns.scan(currentServerName);
    await addServersToObject(currentServerName, hostserverInfo, hostconnectedServers);

    while(true){
        for(var x in servers){
            for(var y in servers[x].connectedServers){
                //Grab all the server Names and add to an array
                var serverNames = servers.map(server => server.serverName);
                //var for the current server in the loop
                var currentServerInLoop = servers[x].connectedServers[y];
                //check if the current server name is in the ServerInformation object
                if(await compareArray(ns, serverNames, currentServerInLoop) == false){
                    //The filename for the information on the current server
                    var currentServerInformationFileName = currentServerInLoop + serverInformationFileName;
                    //importing all the information on the current server
                    var serverInfo = await canImportData(currentServerInLoop, currentServerInformationFileName);
                    //get all the connected servers to the current server
                    var connectedServers = await ns.scan(currentServerInLoop);

                    //copy all javascript files needed from the home server to the target one
                    await secureCopyFunction(scriptsToCopy, currentServerInLoop, "home");
                    //try to hack the current server
                    if(serverInfo != null){
                        await hackServer(currentServerInLoop, serverInfo);

                        //check to see if hack was sucessful
                        if(ns.hasRootAccess(currentServerInLoop)){
                            //if hack was sucessful add the server to the ServerInformation object
                            await addServersToObject(currentServerInLoop, serverInfo, connectedServers);
                            //start the AutoRunDeploy Script to make money and get hacking experence
                            await startAutoHackServer(currentServerInLoop, serverInfo);

                        }else{
                            //print out server information if the hack filed
                            ns.print("Failed to hack : " + currentServerInLoop);
                        }
                    }else{
                        ns.print("\n Main Loop \n");
                        ns.print("Failed to bring in serverInfo for :" + currentServerInLoop);
                    }                 
                }
            }
        }
        await ns.sleep(100);
    }

    /**
     * part about getting server informaion
     * -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * 
     * @param {Target Server} Server 
     */
    async function getServerInfo(Server){
        let pid = ns.exec("GetServerInfoV2.js", "home", 1, Server);
        while (ns.isRunning(pid)) {
            await ns.sleep(100);
        }
    }

    /**
     * 
     * @param {Target Server} server 
     * @param {Name Of file to import} fileName 
     * @returns 
     */
    async function canImportData(server, fileName){
        var data = await importData(ns, "home", fileName);
        if(data != null){
            return data;
        } else{
            await getServerInfo(server);
            await ns.sleep(100);
            var data = await importData(ns, server, fileName);
            if(data != null){
                return data;
            }else{
                ns.print("failed to import data for server : " + server + "fileName : " + fileName);
                return null;
            }
        }
    }

    /**
     * 
     * @param {Array or String of File Names to copy} scripts 
     * @param {Target Server} serverToCopyTo 
     * @param {Host Server / Server Saved on} serverToCopyFrom 
     */
    async function secureCopyFunction(scripts, serverToCopyTo, serverToCopyFrom){
        await ns.scp(scripts, serverToCopyTo, serverToCopyFrom);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 
     * @param {Name of current Server} ServerName 
     * @param {Array of Server Information ex. ports Required} serverInfo 
     * @param {Array of all servers connected to the current one} connectedServers 
     */
    async function addServersToObject(ServerName, serverInfo, connectedServers){
        const server = new ServerInformation(ServerName, serverInfo, connectedServers)
        servers.push(server);
    }

    //





    /**
     * part about hacking servers
     * 
     * -------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    /**
     * 
     * @param {Target Server} server 
     * @param {Information about the server} serverInfo 
     */
    async function hackServer(server, serverInfo){
        var hackServerArgs = await arrayToString(ns, serverInfo);

        if(ns.hasRootAccess(server) == false){
            let pid = ns.exec("HackServer.js", "home", 1, hackServerArgs);
            while (ns.isRunning(pid)) {
              await ns.sleep(100);
            }
        } else{
            ns.print("already Hacked : " + server);
        }
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------


    /**
     * Part to start running autohack script 
     * -------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * 
     * @param {Target Server} server 
     * @param {Information on the server} serverInfo 
     */
    async function startAutoHackServer(server, serverInfo){
        var startAutoHackServerDebug = false;
        var scriptToRun = "AutoRunDeploy.js";
        var ramCost = ns.getScriptRam(scriptToRun, server);
        var serverRam = serverInfo[4];
        var scriptsToRun = Math.floor(serverRam / ramCost);
        var startArgs = await arrayToString(ns, serverInfo);

        //Debug
        if(startAutoHackServerDebug == true){
            ns.print("\n startAutoHackServer Debug \n");
            ns.print("Passed Properties\n server : " + server + "\n server Info : " + serverInfo + "\n");
            ns.print("StartArgs : " + startArgs);

            await ns.sleep(1000);
        }

        if(scriptsToRun > 0 ){
            ns.exec(scriptToRun, server, scriptsToRun, startArgs);
        }
        await ns.sleep(100);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------

}