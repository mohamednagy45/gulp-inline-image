var through = require('through2'),
	datauri = require('datauri'),
	gutil = require('gulp-util'),
	path = require('path'),
	PluginError = gutil.PluginError;

// Name
const PLUGIN_NAME = 'gulp-inline-image';

module.exports = function (opts) {
	opts = opts || {};
	
	var rInlineImage = /inline-image\(['"]?([^'")]+)['"]?,?['"]?([^'")]+)?['"]?\)/mg;
	
	function inlineImage(file, encoding, callback) {
		
		if (file.isNull()) {
			return callback(null, file);
		}
		
		if (file.isStream()) {
			new PluginError(PLUGIN_NAME, 'This plugin does not support streams');
		}
		
		var baseDir = opts.baseDir || file.base;
		var src = file.contents.toString();
		var match;
		
		while (match = rInlineImage.exec(src)) {
			src = src.replace(match[0], 'url("'+datauri(path.resolve(baseDir, match[1].replace('/',path.sep)))+'")');
		}
		
		file.contents = new Buffer(src);
		return callback(null, file);
	}
	
	return through.obj(inlineImage);
};
