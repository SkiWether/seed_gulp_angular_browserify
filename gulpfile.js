//gulpfile.js -- task automation
/*======================= 
-- DEFAULT TASK ... 
The default task, gulp, is a compound task that runs both the lint and connect tasks. This just serves the files in the “app” folder on http://localhost:8080/.
Run this --> gulp

-- BUILD TASK ...
The build task creates a new directory called “dist”, runs the linter, minifies the CSS and JS files, and copies all the HTML files and Bower Components. You can then see what the final build looks like on http://localhost:9999/ before deployment. You should also run the clean task before you generate a build.
Before generating a build, run this --> gulp clean build
===========================================================*/

// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
//var less = require('gulp-less');

// tasks

// Checks for code quality in JavaScript
gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// Removes the entire build folder so that we start fresh every time we generate a new build.
gulp.task('clean', function() {
    gulp.src('./dist/*')
        .pipe(clean({force: true}));
    gulp.src('./app/js/bundled.js')
        .pipe(clean({force: true}));
});

// Minify CSS and JavaScript
gulp.task('minify-css', function() {
    var opts = {comments:true,spare:true};
    gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('./dist/'));
});
gulp.task('minify-js', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(uglify({
          // inSourceMap:
          // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-bower-components', function () {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

//connect to dev webserver
gulp.task('dev-webserver', function () {
    connect.server({
        root: 'app/' //default host and port is localhost:8080
        /*
        You can use a custom hostname with port 80. To get this working, you need to have anyhostname.dev in our hosts file and run the command sudo gulp. Admin rights are needed in order to use port 80.
        */
        //port: 80,
        //host: 'anyhostname.dev'
    });
});

//connect to build webserver
gulp.task('connectDist', function () {
    connect.server({
        root: 'dist/',
        port: 9999
    });
});

gulp.task('browserify', function() {
    gulp.src(['app/js/main.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true //set debug to false if running in production
        }))
    .pipe(concat('bundled.js'))
    .pipe(gulp.dest('./app/js'));
});

//Updates where the bundled.js is stored after creation
gulp.task('browserifyDist', function() {
    gulp.src(['app/js/main.js'])
        .pipe(browserify({
        insertGlobals: true,
        debug: true  //set debug to false if running in production
    }))
    .pipe(concat('bundled.js'))
    .pipe(gulp.dest('./dist/js'));
});


// default task
gulp.task('default',
    ['lint', 'browserify', 'dev-webserver']
);

// build task
gulp.task('build',
    ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
);
