const fs = require('fs');
fs.writeFile('target.txt', 'a witty message', function (err, data){
  if(err) {
    throw err;
  }
  console.log("File saved!");
});
