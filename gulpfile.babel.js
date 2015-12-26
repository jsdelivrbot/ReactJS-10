import gulp from "gulp";
import connect from "gulp-connect";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";

gulp.task("server", () => {
  connect.server({
    livereload: true
  });
});

gulp.task("styles", () => {
  return gulp.src("app/styles/**/*")
    .pipe(connect.reload())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["last 4 versions"]
    }))
    .pipe(gulp.dest("dist/app/styles/"));
});

gulp.task("scripts", () => {
  return gulp.src("app/scripts/**/*")
    .pipe(connect.reload())
    .pipe(gulp.dest("dist/app/scripts/"));
});

gulp.task("main", () => {
  return gulp.src("app/main.js")
    .pipe(connect.reload())
    .pipe(gulp.dest("dist/"));
});

gulp.task("default", ["server", "styles", "scripts", "main"], () => {
  gulp.watch("app/styles/**/*.scss", ["styles"]);
  gulp.watch("app/scripts/**/*.js", ["scripts"]);
  gulp.watch("app/main.js", ["main"]);
});
