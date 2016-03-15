module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files : [
                    { expand: true, cwd: 'html/', src: '**', dest: 'dist/' },
                    { expand: true, cwd: 'img/', src: '**', dest: 'dist/img/' },
                    { expand: true, cwd: 'node_modules/', src: '**/*.css', dest: 'dist/styles/' },
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
                        to: 'http://localhost:8000',
			//to: 'http://192.168.1.178:8000',
			//to: 'http://192.168.1.36:8000',
			//to: 'http://192.168.5.32:8000',
                        //to: 'http://72.77.58.216:8000',
                    },
                ],
            },
        },
        watch: {
            main: {
                files: ['html/**/*', 'js/**/*', 'styles/**/*'],
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
                src: 'js/app.js',
                dest: 'dist/app.js',
            },
        },
        clean: ['dist'],
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

    grunt.registerTask('build', [
        'copy',
        'compass',
        'browserify',
    ]);

    grunt.registerTask('default', [
        'build',
        'replace:dev',
    ]);
};
