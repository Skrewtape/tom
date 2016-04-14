module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files : [
                    { expand: true, cwd: 'img/', src: '**', dest: 'dist/img/' },
                    { expand: true, cwd: 'src/app/', src: 'index.html', dest: 'dist/' },		    
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/',
                        src: '*',
                        dest: 'dist/bootstrap/'
                    },
                ]
            },
        },
        replace: {
            dev: {
                src: ['dist/app.js', 'dist/**/*html'],
                overwrite: true,
                replacements: [
                    {
                        from: '[APIHOST]',
                        //to: 'http://localhost:8000'
			//to: 'http://127.0.0.1:8000'
			to: 'http://192.168.1.178:8000',
			//to: 'http://192.168.1.36:8000',
			//to: 'http://192.168.5.32:8000',
                        //to: 'http://72.77.58.216:8000',
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
            main: {
                options: {
                    sassDir: 'styles',
                    cssDir: 'dist',
                    importPath: 'node_modules'
                },
            },
        },
        browserify: {
            js: {
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                    transform: ['browserify-ngannotate'],
                },
                src: 'src/app/app.js',
                dest: 'dist/app.js',
            },
        },
        clean: ['dist'],
	ngtemplates: {
	    TOMApp: {
		cwd: 'src/app',
		src: '**/**.html',
		dest: 'dist/templates.js'
	    }
	},
	concat: {
	    main: {
		src: [ 'dist/app.js','src/app/login.js','dist/templates.js' ],
		dest: 'dist/app.js' 
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
    
    grunt.registerTask('build', [
	'clean',
        'copy',
        'compass',
        'browserify',
	'ngtemplates:TOMApp',
	'concat'
    ]);

    grunt.registerTask('default', [
        'build',
        'replace:dev',
    ]);
};
