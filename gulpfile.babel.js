import babelify from 'babelify'
import brfs from 'brfs-babel'
import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import gulp from 'gulp'
import source from 'vinyl-source-stream'
import watchify from 'watchify'
import { merge } from 'event-stream'

gulp.task('watch', watch)
gulp.task('build', build)

function watch () {
  const b = browserify('src/index.js')
    .plugin(watchify)
    .ignore('phaser')
    .transform(brfs)
    .transform(babelify)

  b.on('update', () => {
    build_(b)
  })

  gulp.watch(['src/index.html'], () => {
    build_(b)
  })

  return build_(b)
}

function build () {
  const b = browserify('src/index.js')
    .ignore('phaser')
    .transform(babelify)

  return build_(b)
}

function build_ (b) {
  process.stdout.write('Building... ')

  const bundleStream = b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest('build'))

  const assetsStream = gulp.src(['src/index.html', 'node_modules/phaser/dist/phaser.min.js'])
    .pipe(gulp.dest('build'))

  return merge(bundleStream, assetsStream)
    .on('end', () => {
      process.stdout.write('Done\n')
    })
}
