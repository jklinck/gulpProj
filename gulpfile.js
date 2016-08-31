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

// watches sass,html and js files for changes and reolads browser
gulp.task("watch",['browserSync'],function(){
	gulp.watch("app/scss/**/*.scss",["sass"]);
	gulp.watch("app/*.html",browserSync.reload);
	gulp.watch("app/js/**/*.js",browserSync.reload);
});

gulp.task("browserSync",function(){
	browserSync.init({
		server: {
			baseDir: "app"
		}
	})
});

// concatenantes and minifies files
gulp.task("useref",function(){
	return gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpIf("*.js",uglify()))
		.pipe(gulpIf("*.css",cssnano()))
		.pipe(gulp.dest("dist"))
});

// optimizes images
gulp.task("images",function(){
	return gulp.src("app/images/**/*.+(png|jpg|gif|svg)")
		.pipe(cache(imagmin()))
		.pipe(gulp.dest("dist/images"))
});

// transfer font files to dist
gulp.task("fonts",function(){
	return gulp.src("app/fonts/**/*")
	   .pipe(gulp.dest("dist/fonts"))
});

// cleans up files that are no longer being used
gulp.task("clean:dist",function(){
	return del.sync("dist");
});
// when running "gulp dist" the "dist" folder will be deleted

// clear the cache
gulp.task("cach:clear",function(callback){
	return cache.clearAll(callback);
});

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

// I'm getting a snytax error when running "gulp bulid" and "gulp" that is generated from node_modules/imagemin/index.js























