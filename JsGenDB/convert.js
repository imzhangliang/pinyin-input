const { pinyin } = require("pinyin-pro");

let res = pinyin("", { toneType: "none" });

function getPinyinStrings(word) {
    let pinyinStrList = '';
    if (word.length > 1) {
    pinyinStrList = [ pinyin(word, { toneType: "none" }).replace(/ /g, '') ];
    } else {
        pinyinStrList = pinyin(word, { multiple: true, toneType: "none" }).split(' ');
    }

    return pinyinStrList
}

function usage() {
    console.log("Usage: node convert.js <outfile>");
    process.exit(1);
}

// Import the 'fs' (File System) module
const fs = require('fs');

// Specify the path to the file you want to read
const filePath = 'words.txt'; // Change this to the path of your file
let outFile = process.argv[2];
if (!outFile) {
    usage();
}

try {
    res = []
    // Read the file synchronously
    const data = fs.readFileSync(filePath, 'utf8');
    process.stdout.write("Converting");
    // Output the content of the file
    for (let line of data.split('\n')) {
        word = line.trim();
        if (word.length == 0) {
            continue;
        }

        let pinyinList = getPinyinStrings(word);
        for (let py of pinyinList) {
            res.push([py, word]);
            if (res.length % 10000 == 1) {
                process.stdout.write(".");
            }
        }
    }
    fs.writeFileSync(outFile, JSON.stringify(res));
    process.stdout.write("\nDone!\n")

} catch (err) {
    // Handle the error if the file cannot be read
    console.error('Error reading the file:', err);
}