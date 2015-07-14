module.exports = function (grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				reporter: require('jshint-stylish') // use jshint-stylish to format errors
			},
      main: ['Gruntfile.js', 'src/js/main.js']
		},
    
		sync: {
			options: {
        nonull: true
			},
      jquery: {
        expand: true,
        cwd: 'src/vendors/jquery/dist/',
        src: '*',
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      },
      jquerytemplate: {
        expand: true,
        cwd: 'src/vendors/jquerytemplate/',
        src: ['jquery.tmpl.min.js', 'jquery.tmpl.js'],
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      },
      materialize: {
        expand: true,
        cwd: 'src/vendors/materialize/dist/js/',
        src: '*',
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      },
      twittertypeahead: {
        expand: true,
        cwd: 'src/vendors/twittertypeahead/dist/',
        src: ['typeahead.bundle.min.js', 'typeahead.bundle.js'],
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      },
      materialdesign: {
        files: [{
          cwd: 'src/vendors/materialize/font/material-design-icons/',
          src: '**',
          dest: 'font/material-design-icons/'
        }],
        pretend: false,
        verbose: true
      },
      roboto: {
        files: [{
          cwd: 'src/vendors/materialize/font/roboto/',
          src: '**',
          dest: 'font/roboto/'
        }],
        pretend: false,
        verbose: true
      },
      animatecss: {
        expand: true,
        cwd: 'src/vendors/animatecss/',
        src: ['animate.min.css', 'animate.css'],
        dest: 'css/',
        flatten: true,
        filter: 'isFile'
      },
      spotifyjsapi: {
        expand: true,
        src: 'src/vendors/spotifyjsapi/spotify-web-api.js',
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      }, 
      localstoragedb: {
        expand: true,
        src: ['src/vendors/localstoragedb/localstoragedb.js', 'src/vendors/localstoragedb/localstoragedb.min.js'],
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      },         
      mainjs: {
        expand: true,
        src: ['src/js/main.js', 'spotifykeys.js'],
        dest: 'js/',
        flatten: true,
        filter: 'isFile'
      }        
		},

    sass: { 
      expanded: {
        options: {
          style: 'expanded',
          noCache: true
        },
        files: {
          'css/materialize.css': 'src/vendors/materialize/sass/materialize.scss',
        }
      },

      min: {
        options: {
          style: 'compressed',
          noCache: true
        },
        files: {
          'css/materialize.min.css': 'src/vendors/materialize/sass/materialize.scss',
        }
      }
    },

		less: {
			main: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'main-css-map.map',
          sourceMapFilename: 'css/main-css-map.map'
        },      
				src: 'src/less/main.less',
				dest: 'css/main.css'
			}
    },
    
		cssmin: {
			main: {
				src: ['css/main.css'],
				dest: 'css/main.min.css'
			}        
		},

    uglify: {
      options: {
        sourceMapRoot: 'js/',
        sourceMap: 'js/main.js.map'
      },
      target : {
        src : 'src/js/main.js',
        dest : 'js/main.min.js'
      }
    },

		watch: {
			materialize: {
				files: [
          'src/vendors/materialize/sass/**/*'
				],
				tasks: ['sass', 'cssmin']
			},      
			javascript: {
				files: [
					'src/js/main.js'
				],
				tasks: ['jshint', 'uglify', 'sync:mainjs']
			},
			less: {
				files: 'src/less/main.less',
				tasks: ['less:main', 'cssmin']
			}      
		}     
    
     
	});
	

	grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');	
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-contrib-clean');
  
  



  grunt.registerTask('default', ['jshint', 'sync', 'sass', 'less', 'cssmin', 'uglify']);

};
