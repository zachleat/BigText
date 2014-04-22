module.exports = {
	dist: {
		options: {
			position: "top",
			banner: "<%= banner %>"
		},
		files: {
			src: [ "<%= pkg.config.dist %>/*.js", "<%= pkg.config.dist %>/*.css" ]
		}
	}
};
