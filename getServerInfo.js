/** @param {NS} ns */
export async function main(ns) {
  /**
   * Current Server Info
   */
  var currentServerName = ns.args[0];
  var connectedHosts = ns.scan(currentServerName);

  /**
   * File Names
   * cServers = Text file that contains all the connected servers to this one
   * sInfo = Text file that contains all the server information for the server we are currently on
   */
  //var cServers =  "_ConnectedServers.txt";
  var sInfo =  "_ServerInfo.txt";

  /**
   * Send All data about server this is running on
   */
  var currentServerInformation = getServerInformation(ns, currentServerName);
  await sendDataToFile(ns, currentServerName, currentServerName + sInfo, currentServerInformation);
  //await sendDataToFile(ns, currentServerName, currentServerName + cServers, connectedHosts);

  /**
   * Loop through all connected servers and get the information about them
   */
  // for(var s in connectedHosts){
  //   var x = getServerInformation(ns, connectedHosts[s]);
  //   await sendDataToFile(ns, currentServerName, connectedHosts[s]+ sInfo, x);
  // }
}


/**
 * Writes data to txt file 
 * fn = File Name
 * Data is the data to write to the file
 * 'a' is to apend the data to the text document instead of writing over it
 */
async function writeData(ns, fn, data) {
  for (var i = 0; i < data.length; i++) {
    if (i < data.length - 1) {
      ns.write(fn, data[i] + ",", 'a');
    } else {
      ns.write(fn, data[i], 'a');
    }
  }
}

/**
 * Checks to see if there is already a text document on the server its currently on 
 * fileName = the txt file to save to the server this is currently running on
 * currentServerName = name of the server this is currently running on 
 */
async function deleteFile(ns, fileName, currentServerName) {
  if (ns.fileExists(fileName, currentServerName)) {
    ns.rm("./" + fileName);
  }
}

function getServerInformation(ns, serverName){
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

async function sendDataToFile(ns, Servername, FileName, dataToWrite,){
  /**
   * Check to see if the files exists on the server already
   */
  if (ns.fileExists(FileName, Servername)) {
    await deleteFile(ns, FileName, Servername);
  }

  /**
   * Write the data to a txt file for later usage
   */
  await writeData(ns, FileName, dataToWrite);

  await ns.scp(FileName, "home", Servername);
}