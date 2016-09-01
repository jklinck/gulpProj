/*
After creating a project:

npm init
npm install gulp --save-dev
npm install gulp-sass --save-dev
npm install browser-sync --save-dev
npm install gulp-useref --save-dev
npm install gulp-uglify --save-dev
npm install gulp-if --save-dev
npm install gulp-cssnano --save-dev
npm install gulp-imagemin --save-dev
npm install gulp-cache --save-dev
npm install del --save-dev
npm install run-sequence --save-dev

*/

var gulp=require("gulp");
var sass=require("gulp-sass");
var browserSync=require("browser-sync").create();
var useref=require("gulp-useref");
var uglify=require("gulp-uglify");
var gulpIf=require("gulp-if");
var cssnano=require("gulp-cssnano");
var imagemin=require("gulp-imagemin"); 
var cache=require("gulp-cache");
var del=require("del");
var runSequence=require("run-sequence");

// npm install gulp-sass --save-dev
//compile scss to css
gulp.task("sass",function(){
    return gulp.src("app/scss/**/*.scss")
      .pipe(sass())
      // .pipe(sass({
      // 	outputStyle: "compressed"
      // }))
      // this ^^^ will compress the compiled css files
	  
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.reload({
      	stream: true
      }))
});

//  npm install browser-sync --save-dev
gulp.task("browserSync",function(){
	browserSync.init({
		server: {
			baseDir: "app"
		}
	})
});

// watches sass,html and js files for changes and reolads browser
gulp.task("watch",['browserSync'],function(){
	gulp.watch("app/scss/**/*.scss",["sass"]);
	gulp.watch("app/*.html",browserSync.reload);
	gulp.watch("app/js/**/*.js",browserSync.reload);
});

//  npm install gulp-useref --save-dev
//  npm install gulp-uglify --save-dev
//  npm install gulp-if --save-dev
//  npm install gulp-cssnano --save-dev
// concatenantes and minifies files
gulp.task("useref",function(){
	return gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpIf("*.js",uglify()))
		.pipe(gulpIf("*.css",cssnano()))
		.pipe(gulp.dest("dist"))
});

//  npm install gulp-imagemin --save-dev
//  npm install gulp-cache --save-dev
// optimizes images
gulp.task("images",function(){
	return gulp.src("app/images/**/*.+(png|jpg|gif|svg)")
		.pipe(cache(imagemin()))
		.pipe(gulp.dest("dist/images"))
});

// transfer font files to dist
gulp.task("fonts",function(){
	return gulp.src("app/fonts/**/*")
	   .pipe(gulp.dest("dist/fonts"))
});

//  npm install del --save-dev
// cleans up files that are no longer being used
gulp.task("clean:dist",function(){
	return del.sync("dist");
});
// when running "gulp dist" the "dist" folder will be deleted

// clear the cache
gulp.task("cach:clear",function(callback){
	return cache.clearAll(callback);
});

//  npm install run-sequence --save-dev
// runs the tasks above in sequence, it's like calling "gulp sass" then "gulp useref" then "gulp images" and then "gulp fonts"
gulp.task("build",function(callback){
	runSequence("clean:dist",
		["sass","useref","images","fonts"],
		callback
		)
});

// by nameing this task "default" you only need to run "gulp" and not "gulp default"
gulp.task("default",function(callback){
	runSequence(["sass","browserSync","watch"],callback)
});

























