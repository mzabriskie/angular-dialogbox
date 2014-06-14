module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js']
		},
		watch: {
			test: {
				files: ['src/**/*.js', 'test/**/*.js'],
				tasks: ['test']
			}
		},
		karma: {
			options: {
				configFile: 'karma.conf.js'
			},
			single: {
				singleRun: true
			},
			continuous: {
				singleRun: false
			}
		}
	});

	grunt.registerTask('test', ['jshint', 'karma:single']);
};