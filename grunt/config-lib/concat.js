module.exports = {
	options: {
		stripBanners: true
	},
	js: {
		src: [],
		dest: "<%= pkg.config.dist %>/<%= pkg.name %>.js"
	},
	jstest: {
		src: [],
		dest: "<%= pkg.config.dist %>/test/tests.js"
	}
};
