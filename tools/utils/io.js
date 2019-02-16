const FS = require("fs");
const Path = require("path");
exports.listFiles = function listFiles(path, regex = /./) {
  let names = FS.readdirSync(path);
  let files = [];
  let dirs = [];
  for (let name of names) {
    let targetPath = Path.join(path, name);
    if (FS.statSync(targetPath).isFile()) {
      if (!!targetPath.match(regex)) {
        files.push(targetPath);
      }
    }
    else {
      dirs.push(targetPath);
    }
  }
  for (let dir of dirs) {
    files.push.apply(files,listFiles(dir, regex));
  }
  return files;
}
