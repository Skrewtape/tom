module.exports = function(grunt) {
    var dest = '/var/www/html/'
    var admin_dest = '/var/www/html/dist/'
    var player_dest = '/var/www/html/player/'    
    var backend_ip = grunt.option('backend_ip') || undefined;
    if(backend_ip == undefined){
        console.log('OOPS!  No backend ip was specified.');
        console.log('Usage : grunt --backend_ip=<backend ip>');
        return;
    }
  grunt.initConfig({
      uglify: {          
          options: {
              //mangle: {
              //    except: ['angular', 'Backbone']
              //},
              mangle:false,
              //mangleProperties: true,
              //exceptionsFiles: [ 'myExceptionsFile.json' ],              
              //reserveDOMCache: true,
              nameCache: '/tmp/grunt-uglify-cache.json'
          },
          my_stuff: {
              // files: {
              //     '/var/www/html/dist/js/my_stuff.min.js': [admin_dest+'js/my_stuff.js']
              // }
              
              files: [
                  {
                      '/var/www/html/dist/js/app.min.js': [admin_dest+'js/app.js']
                  },
                  {
                      '/var/www/html/dist/js/_bower.min.js': [admin_dest+'js/_bower.js']
                  },
                  {'/var/www/html/dist/js/app_html_templates.min.js':[admin_dest+'app_html_templates.js']},                  

                  {                  
                  expand: true,
                  cwd: 'src/app',
                  src: '**/*.js',
                  dest: admin_dest+'js_min/app'
                  
                  },
                  {
                      expand: true,
                      cwd: 'src/services',
                      src: '**/*.js',
                      dest: admin_dest+'js_min/services'
                      //'/var/www/html/dist/js/my_stuff.min.js': [admin_dest+'js/my_stuff.js']
                  },
                  {
                      expand: true,
                      cwd: 'src/directives',
                      src: '**/*.js',
                      dest: admin_dest+'js_min/directives'
                      //'/var/www/html/dist/js/my_stuff.min.js': [admin_dest+'js/my_stuff.js']
                  }
              ]
          }
      },
      shell: {
	    makeRevHistory: {
		command: ["git log --pretty=format:'%H<msgst>%b<msge>' | fgrep -v '<msgst><msge>' | fgrep '<msgst>' | cut -b1-40 | git log --stdin --no-walk > "+admin_dest+"rev.txt",
			  "echo '<pre>' > "+admin_dest+"rev.html",
			  "cat "+admin_dest+"rev.txt >> "+admin_dest+"rev.html",
			  "echo '<pre>' >> "+admin_dest+"rev.html"
			 ].join('&&')
	    }
	},
        pkg: [grunt.file.readJSON('package.json')],
        copy: {
            admin: {
                files : [
                    { expand: true, cwd: 'img/', src: '**', dest: admin_dest+'img/' },
                    { expand: true, cwd: 'src/app/', src: 'index.html', dest: admin_dest },		    
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/',
                        src: '*',
                        dest: admin_dest+'bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/mobile-angular-ui/dist/fonts/',
                        src: '*',
                        dest: admin_dest+'fonts'
                    }		    
                ]
            },
            player: {
                files : [                    
                    { expand: true, cwd: 'img/', src: '**', dest: player_dest+'img/' },
                    { expand: true, cwd: admin_dest, src: '**', dest: player_dest },
                    { expand: true, cwd: 'src/app/', src: 'player.html', dest: player_dest },
                    { expand: true, cwd: 'src/app/', src: 'projector.html', dest: player_dest },
                    { expand: true, cwd: 'src/app/', src: 'projector_frame.html', dest: player_dest },                    
                    { expand: true, cwd: 'src/app/', src: 'projector_machines.html', dest: player_dest },                    
                    { expand: true, cwd: 'src/app/', src: 'projector_queue.html', dest: player_dest },                    
                    { expand: true, cwd: 'src/app/', src: 'projector_queue_static.html', dest: player_dest },
                    
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/',
                        src: '*',
                        dest: player_dest+'bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/mobile-angular-ui/dist/fonts/',
                        src: '*',
                        dest: player_dest+'fonts'
                    }		    
                ]
            },            
        },
        replace: {
            admin: {
                src: [admin_dest+'js/my_stuff_min.js', admin_dest+'**/*html'],
                overwrite: true,
                replacements: [
                    {
                        from: '[APIHOST]',
                        to: 'http://'+backend_ip+':8000'
                    },
                ],
            },
            player: {
                src: [player_dest+'js/my_stuff_min.js', player_dest+'**/*html'],
                overwrite: true,
                replacements: [
                    {
                        from: '[APIHOST]',
                        to: 'https://'+backend_ip+':8001'
                    },
                ],
            },            
        },
        watch: {
            main: {		
                files: ['src/**/*',  'styles/**/*'],
                tasks: ['default'],
                options: {
                    livereload: true,
                },
            },
        },
        compass: {
            admin: {
                options: {
                    sassDir: 'styles',
                    cssDir: admin_dest,
                    importPath: 'node_modules'
                },
            },
            player: {
                options: {
                    sassDir: 'styles',
                    cssDir: player_dest,
                    importPath: 'node_modules'
                },
            },            
        },
        browserify: {
            admin: {
                options: {
                    browserifyOptions: {
                        //debug: true,
                    },
                    transform: ['browserify-ngannotate'],
                },
                src: 'src/app/app.js',
                //src: admin_dest+'js/app.orig.min.js',
                dest: admin_dest+'js/app.js',
            },
            player: {
                options: {
                    browserifyOptions: {
                        //debug: true,
                    },
                    transform: ['browserify-ngannotate'],
                },
                src: 'src/app/app.js',
                dest: player_dest+'app.js',
            },
        },
      clean: {
	  options: {'force':true},
	  admin: [admin_dest],
          player: [player_dest]
      },
	ngtemplates: {
	    TOMApp: {
		cwd: 'src',
		src: '**/**.html',
		dest: admin_dest+'app_html_templates.js'
	    }
	},
      concat: {
          my_stuff: {
              src: 
                  [
                      admin_dest+'js/app.js'
                      //,admin_dest+'js_min/**/*.js'
                      ,'src/app/**/*.js'
                      ,'!'+admin_dest+'js_min/app/app.js'                      
                      ,'!src/app/app.js'
                      ,'src/services/**.js'
                      ,'src/directives/**.js'
                      ,'src/app/routes.js'
                      ,admin_dest+'app_html_templates.js'
                      ,admin_dest+'service_html_templates.js'                      

                  ]
              ,
              dest: admin_dest+'js/my_stuff.js'
          },
          my_min_stuff: {
              src: 
                  [
                      //admin_dest+'js/app.js',
                      admin_dest+'js/app.min.js',
                      //admin_dest+'js_min/**/*.js',
                      admin_dest+'js_min/app/**/*.js',                      
                      admin_dest+'js_min/services/**/*.js',
                      //admin_dest+'js_min/app/routes.js',                      
                      //admin_dest+'js_min/app/login/login.js',
                      admin_dest+'js_min/directives/**/*.js',
                      '!'+admin_dest+'js_min/app/app.js',                      
                      '!src/app/app.js',
                      admin_dest+'js/app_html_templates.min.js',                      
                      admin_dest+'js/_bower.min.js'
                  ]
              ,
              dest: admin_dest+'js/my_stuff_min.js'
          },
          my_controllers: {                     
              src: [ 'src/app/**/*.js'
                     ,'!src/app/app.js'],
              
              dest: admin_dest+'js/my_controllers.js'
          },
	  admin: {
	      src: [ //admin_dest+'js/my_stuff.js'
                  //admin_dest+'js/app.js'
                  //'src/services/**.js'
                  //'src/directives/**.js'
                  'src/app/routes.js'
                  //,admin_dest+'app_html_templates.js'
                  //,admin_dest+'service_html_templates.js'
                  //,'src/app/**/*.js'                  
                  //'!src/app/app.js'
                  //admin_dest+'js/_bower.js'
              ],
	      dest: admin_dest+'app.js' 
	  },
	  player: {
	      src: [ player_dest+'js/app.js','src/services/**.js','src/directives/**.js','src/app/routes.js',player_dest+'app_html_templates.js',player_dest+'service_html_templates.js','src/app/**/*.js','!src/app/app.js',player_dest+'js/_bower.js' ],
	      dest: player_dest+'app.js' 
	  }            
	},
        prettify: {
            main: {
                expand: true,
                src: ['html/**/*.html'],
                overwrite: true,
                options: {
                    indent: 1,
                    indent_char: '	',
                },
            },
        },
	bower_concat: {
	    admin: {
		dest: {
		    'js': admin_dest+'js/_bower.js',
		    'css': admin_dest+'css/_bower.css'
		},
		bowerOptions: {
		    relative: false
		}
	    },
	    player: {
		dest: {
		    'js': player_dest+'js/_bower.js',
		    'css': player_dest+'css/_bower.css'
		},
		bowerOptions: {
		    relative: false
		}
	    }            
	}
  });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');    
    grunt.registerTask('admin_build', [
	'clean:admin',
        'compass:admin',
	'bower_concat:admin',        
        'browserify:admin',
	'ngtemplates:TOMApp',
        'uglify:my_stuff',
        'concat:my_stuff',
        'concat:my_min_stuff',
        'concat:admin',
        //'replace:admin',                
        'copy:admin',        
	'shell:makeRevHistory'
    ]);
    grunt.registerTask('player_build', [
	'clean:player',
        //'compass:player',
	//'bower_concat:player',
        //'browserify:player',
        //	'ngtemplates:PlayerApp',
        'copy:player',        
	//'concat:player',
	//'shell:makeRevHistory'
    ]);    

    grunt.registerTask('default', [
        'admin_build',
        'player_build',
        'replace:admin',
        'replace:player'
    ]);
};
