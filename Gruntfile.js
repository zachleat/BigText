module.exports = function( grunt ) {
	'use strict';

	function loadConfig( path ) {
		var glob = require( "glob" ),
			object = {},
			key;

		glob.sync( "*", {
			cwd: path
		}).forEach(function( option ) {
			key = option.replace( /\.js$/, "" );
			if( !object.hasOwnProperty( key ) ) {
				object[ key ] = {};
			}
			grunt.util._.extend( object[ key ], require( path + option ) );
		});

		return object;
	}

	var config = {
			pkg: grunt.file.readJSON( "package.json" ),
			banner: grunt.file.read( "grunt/banner.txt" )
		};

	grunt.util._.merge( config, loadConfig( "./grunt/config-lib/" ), loadConfig( "./grunt/config/" ) );

	grunt.initConfig( config );

	require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

	grunt.loadTasks( "grunt" );

};
