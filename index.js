const fs = require('fs');
const program = require('commander');

let input;
let output;
const chatObject = {}
const regex = /(?:\[)((?:[\d]{2}[\.]{0,1}){3})[\D]+((?:[\d]{2}[\:]{0,1}){3})(?:\])[\s]([\w]*)[\:\s]([\s\S]+?)(?=\[)/gim;
// Groups:
// 1. Date
// 2. Time
// 3. Author
// 4. Text

program
  .arguments('<file> [out]')
  .action((file, out) => {
    console.log('====', file, out)
    input = `${file}.txt`;
    output = out ? `${out}.json` : `${file}.json`
  })

program.on('--help', () => {
  console.log('');
  console.log('Arguments:');
  console.log('<input file> \t name of the input file (wihtout file extension), must be *.txt file')
  console.log('[output file] \t name of the ouput file (wihtout file extension) will be saved in json format')
  console.log('\t\t default name of the ouput file is the input file name')
  console.log('');
  console.log('Examples:');
  console.log('  $ yarn start <input file name> [output file name]');
  console.log('  $ node index.js <input file name> [output file name]');
});


program.parse(process.argv)

fs.readFile(input, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  if (typeof data === 'string') {
    while ((found = regex.exec(data)) !== null) {
      const date = found[1];
      const time = found[2];
      const author = found[3];
      const text = found[4];
      chatObject[date] = chatObject[date] || {}
      chatObject[date][time] = { author, text }
    }
  }
  fs.writeFile(output, JSON.stringify(chatObject), 'utf8', (err) => {
    console.log('====', output)
    if (err) throw err
    console.log('success')
  });
});