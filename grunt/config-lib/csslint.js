module.exports = {
	options: {
		// Use a .csslintrc file so the same options are reused in our editor.
		// See https://github.com/CSSLint/csslint/wiki/Rules
		csslintrc: ".csslintrc"
	},
	src: [ "<%= pkg.config.src %>/**/*.css" ]
};
