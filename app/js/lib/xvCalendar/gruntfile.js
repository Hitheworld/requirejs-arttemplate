module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            rs: 'src',//----webapp/static/js/
            dist:'dist'
        },
       
        uglify: {//压缩comm公共文件
            distUg: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= dirs.rs %>/js/',
                        src: 'calendar.js',
                        ext:'.min.js',
                        dest: '<%= dirs.dist %>/js/'
                    }
                ]
            }
        },

        cssmin:{
            cssUg:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= dirs.rs %>/css/',
                        src: '*.css',
                        ext:'.min.css',
                        dest: '<%= dirs.dist %>/css/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', [
        'uglify',//js压缩
        'cssmin'//css压缩
    ]);
};
