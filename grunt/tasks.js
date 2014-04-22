module.exports = function(grunt) {
	"use strict";

	grunt.registerTask( "init", [ "mkdir" ] );

	grunt.registerTask( "default", [ "clean", "lint", "src", "test", "bytesize" ] );

	grunt.registerTask( "lint", [ "csslint", "jshint", "lintspaces" ] );
	grunt.registerTask( "src", [ "lint", "concat", "usebanner" ] );
	grunt.registerTask( "test", [ "qunit" ] );

	grunt.registerTask( "deploy", [ "default", "gh-pages" ] );

};
