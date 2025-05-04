/** @param {NS} ns */
export async function main(ns) {
  /**
   * hostServer = the server that is running this program
   * cServerContents = array of all the connected servers
   * canHack = is a check to make sure the server can be hacked
   */
  var hostServer = ns.args[0];
  var cServersContents;
  var hackedServers = {
    sucessfulHack: [],
    failedHack: []
  };

  /**
   * Text files to import
   */
  var cServers = hostServer + "_ConnectedServers.txt";

  cServersContents = await importData(ns, cServers, hostServer);

  if(cServersContents.length > 0){
    for(var s in cServersContents){
      if(hackedServers.sucessfulHack.includes(cServersContents[s]) == false){
        ns.print("Server : " + cServersContents[s]);
        var fileName = cServersContents[s] + "_ServerInfo.txt";
        var serverinfo = importData(ns, fileName, hostServer);
        var hackServerArgs = arrayToString(serverinfo);
        
        if(ns.hasRootAccess(cServersContents[s]) == false){
          let pid = ns.exec("HackServer.js", hostServer, 1, hackServerArgs);
          while (ns.isRunning(pid)) {
            await ns.sleep(100);
          }
        }
       
        if(ns.hasRootAccess(cServersContents[s]) == true){
          hackedServers.sucessfulHack.push(cServersContents[s]);
          await ns.scp("getServerInfo.js",  cServersContents[s], "home");
          await ns.scp("AutoHack.js",  cServersContents[s], "home");
          await ns.scp("HackServer.js",  cServersContents[s], "home");
    
          // let pid = ns.exec("AutoHack.js", cServersContents[s], 1, cServersContents[s]);
          // while (ns.isRunning(pid)) {
          //   await ns.sleep(100);
          // }
        }else{
          hackedServers.failedHack.push(cServersContents[s]);
        }
      }else{
        ns.print("already Hacked")
      }
    }
  }

  // for(var s in cServersContents){
  //   ns.print("Current hostname : " + cServersContents[s]);
  //   var fileName = cServersContents[s] + "_ServerInfo.txt";
  //   var serverinfo = importData(ns, fileName, hostServer);
  //   if(serverinfo[1] === "false"){
  //     if(serverinfo[2] < ns.getHackingLevel()){
  //       if(serverinfo[3] === "0"){
  //         await ns.nuke(cServersContents[s]);
  //         canHack = true;
  //       }else{
  //         var brute = false;
  //         while(brute == false){
  //           brute = await ns.brutessh(cServersContents[s]);
  //         }
  //         await ns.nuke(cServersContents[s]);
  //         canHack = true;
  //       }
  //     }else{
  //       canHack = false;
  //     }
  //   }else{
  //     canHack = true;
  //   }
  //   if(canHack){
      // await ns.scp("getServerInfo.js",  cServersContents[s], "home");
      // await ns.scp("AutoHack.js",  cServersContents[s], "home");

      // let pid = ns.exec("AutoHack.js", cServersContents[s], 1, cServersContents[s]);
      // while (ns.isRunning(pid)) {
      //   await ns.sleep(100);
      // }
  //   }
  // }
}

/**
 * 
 * @param {*} ns 
 * @param {name of a file to import} fileName 
 * @param {server the file is saved on} hostServer 
 * @returns the data from the imported file as an array
 * 
 *  This is to import data from txt files to save on ram costs
 */
async function importData(ns, fileName, hostServer) {
  var fileContents;
  if (ns.fileExists(fileName, hostServer)) {
    fileContents = ns.read(fileName).split(",");
  } else {
    let pid = ns.exec("getServerInfo.js", hostServer, 1, hostServer);
    while (ns.isRunning(pid)) {
      await ns.sleep(100);
    }
    fileContents = ns.read(fileName).split(",");
  } 
  return fileContents;
}

/**
 * 
 * @param {*} ns 
 * @param {The Data that you want to print} dataToPrint 
 * 
 *  This is a test method for displaying data to troubleshoot
 */
function printData(ns, dataToPrint) {
  if (dataToPrint != null) {
    for (var i = 0; i < dataToPrint.length; i++) {
      ns.print(dataToPrint[i] + '\n');
    }
  } else {
    ns.print("No Data")
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
