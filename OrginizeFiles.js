/** @param {NS} ns */
export async function main(ns) {
    var hostServer = ns.args[0];
    var scanFiles = ns.ls(hostServer);
    var txtFiles = searchForTXT(ns, scanFiles);
    ns.print(txtFiles)
    deleteFile(ns, txtFiles, hostServer);
}

function searchForTXT(ns, rawFiles){
    var splitByExtention = [];
    var sortedArray = [];

    for(var s in rawFiles){
        var x = rawFiles[s].split('.');
        splitByExtention.push(x[0]);
        splitByExtention.push(x[1]);
    }

    for(var s in splitByExtention){
        if(splitByExtention[s] === "txt"){
            sortedArray.push(splitByExtention[s-1] + "." + splitByExtention[s])
        }
    }
    return sortedArray
}


/**
 * Checks to see if there is already a text document on the server its currently on 
 * fileName = the txt file to save to the server this is currently running on
 * currentServerName = name of the server this is currently running on 
 */
function deleteFile(ns, FilesToDel, currentServerName) {
    for(var s in FilesToDel){
        if (ns.fileExists(FilesToDel[s], currentServerName)) {
            ns.rm("./" + FilesToDel[s]);
        }
    }
}


function sortTXTfiles(ns, txtFiles){
    var serverInfoFiles;
    var connectedServersFiles;
}