module.exports = {
	options: {
		// Use a .jshintrc file so the same options are reused in our editor.
		jshintrc: ".jshintrc"
	},
	src: [ "Gruntfile.js", "<%= pkg.config.src %>/**/*.js" ]
};
