/**
 * Module dependencies
 */

var walker = require('walker');



/**
 * [exports description]
 * @param  {[type]}   dir [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */

module.exports = function ls (dir, cb) {

  var spinlock;
  var results = [];

  walker(dir)
  .on('dir', function (entry, stat) {
    // Don't include top-level directory (`dir`) in result `tree`
    if (entry===dir) return;

    // End users should be able to do:
    // somepath.match(/^[^.]
    entry = entry.replace(/\/*$/, '/');

    results.push(entry);
  })
  .on('file', function (entry, stat) {
    // Don't include top-level directory (`dir`) in result `tree`
    if (entry===dir) return;
    results.push(entry);
  })
  .on('error', function (err){
    if (spinlock) return;
    spinlock = true;
    return cb(err);
  })
  .on('end', function (){
    if (spinlock) return;
    spinlock = true;
    return cb(null, results);
  });

};
