module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      src: {
        files: 'src/**/*',
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js']
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'src'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('default', ['connect', 'watch']);
};
