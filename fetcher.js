const args = process.argv.slice(2);
const url = args[0];
const saveFile = args[1];

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fetcher = (url, cb) => {
  request(url, (err, res, body) => {
    if(err){
      console.log("An error occurred when requesting the URL.");
      return process.exit();
    }
    cb(body);
  });
}

const saver = (saveFile) => (data) => {
  fs.writeFile(saveFile, data, (err) => {
    if(err) throw err
    console.log(`Downloaded and saved ${data.length} bytes to ${saveFile}`);
  })
};

const verifier = (url, saveFile) => {
  let splitSave = saveFile.split('/');
  let dir = splitSave.slice(0, splitSave.length - 1).join("/");
  fs.stat(dir, (err, stats) => {
    if(err){
      console.log("Directory does not exist");
      return process.exit();
    }
  });
  fs.access(saveFile, fs.constants.F_OK, (err) => {
    //if does not exist then throw error
    if(err){
      fetcher(url, saver(saveFile));
    }else{
      rl.question("Are you sure you want to overwrite? y | n   ", (answer) => {
        if(answer.toLowerCase() === 'y'){
          fetcher(url, saver(saveFile));
        }else{
          return process.exit();
        }
        rl.close();
      });
    }
  });
}

verifier(url, saveFile);