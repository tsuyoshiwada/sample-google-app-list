gulp = require "gulp"
$ = do require "gulp-load-plugins"
browserSync = require "browser-sync"


# start sync
gulp.task "bs", ->
  browserSync {
    notify: false
    server: {
      baseDir: "./"
    }
  }

# reload
gulp.task "bs-reload", ->
  browserSync.reload()

# sass / autoprefixer
gulp.task "sass", ->
  $.rubySass "./sass", {
    style: "nested"
    # style: "compressed"
    stopOnError: true
  }
  .pipe $.plumber()
  .pipe $.autoprefixer()
  .pipe gulp.dest "./css"
  .pipe browserSync.reload({stream: true})

# default / watch
gulp.task "default", ["sass", "bs"], ->
  gulp.watch "./*.html", ["bs-reload"]
  gulp.watch "./js/*.js", ["bs-reload"]
  gulp.watch "./sass/*.scss", ["sass"]


