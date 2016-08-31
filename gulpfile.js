/*
I am at the end of "useref" right before the "gulp-uglify" install, after running "gulp useref" it created main.min.js, but there isn't anything in it, maybe it's because I ran it before putting anything in those files (need to investigate this)
*/


var gulp=require("gulp");
var sass=require("gulp-sass");
var browserSync=require("browser-sync").create();
var useref=require("gulp-useref");

gulp.task("hello",function(){
    console.log("hello Joe");
});

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

gulp.task("useref",function(){
	return gulp.src("app/js/**/*.js")
		.pipe(useref())
		.pipe(gulp.dest("dist"))
});








