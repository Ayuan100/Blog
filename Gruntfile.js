module.exports = function(grunt){

    //configure all plugins
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        
        uglify: {
            options: {
                
            },
            build: {
                src: 'dir/xxx.js',
                dest: 'dir/xxx.min.js'
            }
        }
    });
    
    //load plugins
    grunt.loadNpmTask('grunt-contrib-uglify');
    
    //specify tasks
    grunt.registerTask('default', ['uglify']);
}