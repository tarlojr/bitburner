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
     * 
     */
    var servers = [];
    //var connectedServersFileName = "_ConnectedServers.txt";
    var serverInformationFileName = "_ServerInfo.txt";

    /**
     * Main
     */
    var hostServerInformationFileName = currentServerName + serverInformationFileName;
    var hostserverInfo = await canImportData(currentServerName, hostServerInformationFileName);
    var hostconnectedServers = await ns.scan(currentServerName);
    await addServersToObject(currentServerName, hostserverInfo, hostconnectedServers);
    ns.print(servers[0].serverName);
    ns.print(servers[0].serverInfo);
    ns.print(servers[0].connectedServers);

    while(true){
        for(var x in servers){
            for(var y in servers[x].connectedServers){
                var serverNames = servers.map(server => server.serverName);
                //ns.print("ServerNames in loop : " + serverNames);
                ns.print("looking at server : " + servers[x].connectedServers[y] + " in loop");
                if(await compareArray(ns, serverNames, servers[x].connectedServers[y]) == false){
                    var currentServerInformationFileName = servers[x].connectedServers[y] + serverInformationFileName;

                    var serverInfo = await canImportData(servers[x].connectedServers[y], currentServerInformationFileName);

                    await transferScripts(servers[x].connectedServers[y]);

                    //ns.print("Hack Server Info to send server Name : " + servers[servers.length-1].serverName);
                    //ns.print("Hack Server Info to send server Info : " + servers[servers.length-1].serverInfo);
                    await hackServer(servers[x].connectedServers[y], serverInfo);

                    if(ns.hasRootAccess(servers[x].connectedServers[y])){
                        var connectedServers = await ns.scan(servers[x].connectedServers[y]);
                        await addServersToObject(servers[x].connectedServers[y], serverInfo, connectedServers);
                        await startAutoHackServer(servers[x].connectedServers[y], serverInfo);

                    }else{
                        ns.print("Failed to hack : " + servers[x].connectedServers[y]);
                    }
                    //await hackServer(servers[servers.length-1].serverName, servers[servers.length-1].serverInfo);
                    
                }
            }
        }
        var testprint = servers.map(server => server.serverName);
        ns.print("All servers : " + testprint);
        ns.print("---------------------------------------------------------");
        for(var x in servers){
            // for(var y in servers[x].connectedServers){
                
            // }
            ns.print("server : " + servers[x].serverName);
            ns.print("Connected Servers : " + servers[x].connectedServers);
        }
        ns.print("---------------------------------------------------------");
        await ns.sleep(100);
    }

    async function transferScripts(server){
        var scripts = ["HackServer.js", "getServerInfo.js", "AutoRunDeploy.js"];
        await ns.scp(scripts, server, "home");
    }



    /**
     * part about getting server informaion
     * 
     * -------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    async function getServerInfo(Server){
        let pid = ns.exec("getServerInfo.js", "home", 1, Server);
        while (ns.isRunning(pid)) {
            await ns.sleep(100);
        }
    }

    async function canImportData(server, fileName){
        var data = await importData(ns, "home", fileName);
        if(data != null){
            return data;
        } else{
            ns.print("Failed to import data for : " + server);
            await getServerInfo(server);
            var data = await importData(ns, server, fileName);
            if(data != null){
                return data;
            }else{
                ns.print("failed to import data for server : " + server + "fileName : " + fileName);
                return null;
            }
        }
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * 
     */

    async function addServersToObject(currentServerName1, serverInfo, connectedServers){
        const server = new ServerInformation(currentServerName1, serverInfo, connectedServers)
        servers.push(server);
    }

    //





    /**
     * part about hacking servers
     * 
     * -------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    async function hackServer(server, serverinfo){
        var hackServerArgs = await arrayToString(ns, serverinfo);
        ns.print("Hack Server Args : " + hackServerArgs);

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

    async function startAutoHackServer(server, serverStats){
        var ramCost = 2.2;
        var serverRam = serverStats[4];
        var scriptsToRun = Math.floor(serverRam / ramCost);
        var startargs = await arrayToString(ns, serverStats);
        ns.print("");
        ns.print("");
        ns.print("running autoHack script on : " + server);
        ns.print("Args Passing : " + serverStats);
        ns.print("");
        ns.print("");
        if(scriptsToRun > 0 ){
            ns.exec("AutoRunDeploy.js", server, scriptsToRun, startargs);
        }
        await ns.sleep(100);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------

}