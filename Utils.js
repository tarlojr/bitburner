/**
 * 
 * @param {Name of file to import} fileName 
 * @returns data from file imported
 */
export async function importData(ns, server, fileName) {
    var fileContents = [];
    //ns.print("Server : " + server + " File name : " + fileName);
    if (ns.fileExists(fileName, server)) {
        ns.print("Found file : " + fileName);
        fileContents = ns.read(fileName).split(",");
        ns.print("Read Data is : " + arrayToString(fileContents));
    } else {
        ns.print("Failed to find file : " + fileName);
        fileContents = null;
    }
    return fileContents;
}

export async function arrayToString(ns, importArray){
    var stringout = "";
    for(var x in importArray){
        if(x == importArray.length - 1){
        stringout += importArray[x];
        }else{
        stringout += importArray[x] + ",";
        }
    }
    //ns.print("Array To String Final : " + stringout);
    return stringout;
}

export async function compareArray(ns, array, toCompare){
    var isMatch = false;
    for(var x in array){
        //ns.print("looking at in compare array : " + array[x]);
        if(array[x] === toCompare){
            ns.print(array[x] + " is equal to " + toCompare);
            isMatch = true;
        }
    }
    return isMatch;
}
