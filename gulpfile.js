'use strict';

const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
const gutil = require('gulp-util');
const rename = require('gulp-rename');

gulp.task('site', cb => {
	let config = {
		tags: {
			allowUnknownTags: true
		},
		opts: {
			destination: './docs'
		},
		plugins: [
			'plugins/markdown'
		],
		templates: {
			cleverLinks: false,
			monospaceLinks: false,
			default: {
				outputSourceFiles: true
			},
			path: 'ink-docstrap',
			theme: 'cerulean',
			navType: 'vertical',
			linenums: true,
			dateFormat: 'MMMM Do YYYY, h:mm:ss a'
		}
	};

	gulp.src(['README.md', './index.js'], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('markdown', (cb) => {
	return gulp.src(['index.js'])
		.pipe(gulpJsdoc2md(cb))
		.on('error', err => {
			gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
		})
		.pipe(rename(path => {
			path.extname = '.md';
		}))
		.pipe(gulp.dest('docs'));
});

gulp.task('docs', ['site', 'markdown']);
gulp.task('default', ['docs']);
