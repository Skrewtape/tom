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
                    { expand: true, cwd: 'src/app/', src: 'player.html', dest: player_dest },
                    { expand: true, cwd: 'img/', src: '**', dest: player_dest+'img/' },
                    { expand: true, cwd: admin_dest, src: 'app_html_templates.js', dest: player_dest },
                    
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
                src: [admin_dest+'app.js', admin_dest+'**/*html'],
                overwrite: true,
                replacements: [
                    {
                        from: '[APIHOST]',
                        to: 'http://'+backend_ip+':8000'
                    },
                ],
            },
            player: {
                src: [player_dest+'app.js', player_dest+'**/*html'],
                overwrite: true,
                replacements: [
                    {
                        from: '[APIHOST]',
                        to: 'http://'+backend_ip+':8001'
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
                        debug: true,
                    },
                    transform: ['browserify-ngannotate'],
                },
                src: 'src/app/app.js',
                dest: admin_dest+'app.js',
            },
            player: {
                options: {
                    browserifyOptions: {
                        debug: true,
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
	    admin: {
		src: [ admin_dest+'app.js','src/services/**.js','src/directives/**.js','src/app/routes.js',admin_dest+'app_html_templates.js',admin_dest+'service_html_templates.js','src/app/**/*.js','!src/app/app.js',admin_dest+'js/_bower.js' ],
		dest: admin_dest+'app.js' 
	    },
	    player: {
		src: [ player_dest+'app.js','src/services/**.js','src/directives/**.js','src/app/routes.js',player_dest+'app_html_templates.js',player_dest+'service_html_templates.js','src/app/**/*.js','!src/app/app.js',player_dest+'js/_bower.js' ],
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
	'concat:admin',
        'copy:admin',        
	'shell:makeRevHistory'
    ]);
    grunt.registerTask('player_build', [
	'clean:player',
        'compass:player',
	'bower_concat:player',
        'browserify:player',
        //	'ngtemplates:PlayerApp',
        'copy:player',        
	'concat:player',
	'shell:makeRevHistory'
    ]);    

    grunt.registerTask('default', [
        'admin_build',
        'replace:admin',
        'player_build',
        'replace:player'
    ]);
};
