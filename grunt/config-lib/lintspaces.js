module.exports = {
	all: {
		src: [
			'<%= pkg.config.src %>/**/*.js',
			'<%= pkg.config.src %>/**/*.css',
			'<%= pkg.config.grunt %>/**/*.js',
			'<%= pkg.config.grunt %>/**/*.css'
		],
		options: {
			editorconfig: '.editorconfig'
		}
	}
};
