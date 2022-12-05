var yaml  = require('js-yaml'),
    q     = require('q'),
    fs    = require('q-io/fs'),
    util  = require('util');
    
function createTagFiles() {
  var contentTemplate = "---\nlayout: tag\ntitle: Posts with tag %s\ntag: %s\npermalink: /tags/%s/\nsitemap: false\n---";
  var fileNameTemplate = __dirname + "/../tags/%s.md";
  return fs.read(__dirname + '/../_data/tags.yml', {'charset': 'utf8', 'flags': 'r'})
  .then(function(content){
    return yaml.safeLoad(content);
  })
  .then(function(doc){
    var promises = Object.keys(doc).map(function(key){
      var tagText = doc[key].name;
      var fileName = util.format(fileNameTemplate, key);
      var content = util.format(contentTemplate, tagText, key, key);
      return fs.exists(fileName)
      .then(function(exists){
        if(!exists)
          return fs.write(fileName, content);
      });
    });
    return q.all(promises);
  });
};