/** @param {NS} ns */
export async function main(ns) {
    var args = ns.args[0];
    var importData = args.split(" ");
    var serverName = importData[0];
    var fileName = importData[1];
    var data = importData[2].split(",");

    if (ns.fileExists(fileName, serverName)) {
        deleteFile(fileName, serverName);
    }
    writeData(fileName, data);
    

    function writeData(fn, data) {
        for (var i = 0; i < data.length; i++) {
          if (i < data.length - 1) {
            ns.write(fn, data[i] + ",", 'a');
          } else {
            ns.write(fn, data[i], 'a');
          }
        }
    }
    function deleteFile(FilesToDel, currentServerName){
        if (ns.fileExists(FilesToDel, currentServerName)) {
            ns.rm("./" + FilesToDel);
        }
    }
}