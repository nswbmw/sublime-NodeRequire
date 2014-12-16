var path = require('path');
var ls = require('list-directory-contents');

var FILE_PATH = process.argv[2];
var RELATIVE_PATH = process.argv[3];
var ABSOLUTE_PATH = path.join(FILE_PATH, RELATIVE_PATH);
var ABSOLUTE_PATH_FOLDER = path.dirname(ABSOLUTE_PATH);

function filterPath(pathArr) {
  var _pathArr = [];
  var _path;
  for (var i = 0; i < pathArr.length; i++) {
    _path = pathArr[i];
    if (_path === FILE_PATH || _path.match(/package\.json$/)) {
      continue;
    }
    var fileRegResult = _path.match(/(.+)\.(js|node|json)$/);
    if (fileRegResult) {
      _pathArr.push(path.relative(ABSOLUTE_PATH_FOLDER, _path));
      continue;
    }
    var thirdPartyRegResult = _path.match('node_modules' + path.sep + '(.+)' + path.sep + '$');
    if (thirdPartyRegResult) {
      _pathArr.unshift(thirdPartyRegResult[1]);
      continue;
    }
    if (_path.match('node_modules' + path.sep + '(.+)?' + path.sep + '.+$')) {
      break;
    }
  };
  return _pathArr;
}

function formatCompletions(pathArr) {
  var _completionsArr = [];
  pathArr.forEach(function (_path) {
    if (RELATIVE_PATH.match(/^\./) && !_path.match(/\.(js|node|json)/)) {
      return;
    }
    _path = path.join(RELATIVE_PATH, _path);
    var _completionsTip = _path.match(/^[^./].*\.(js|node|json)/) ? './' + _path : _path;
    var _completionsStr = _completionsTip.replace(path.extname(_completionsTip), '').replace(RELATIVE_PATH, '');
    _completionsArr.push('("' + _completionsTip + '","' + _completionsStr + '")');
  });
  return '[' + _completionsArr.join(',') + ']';
}

ls(ABSOLUTE_PATH_FOLDER, function (err, tree) {
  if (err) {
    console.log('[]');
    return;
  }
  var pathArr = filterPath(tree);
  var completions = formatCompletions(pathArr);
  console.log(completions);
});