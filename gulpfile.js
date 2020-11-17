const { src, dest, series, parallel, watch } = require("gulp");
const handlebars = require("handlebars");
const layouts = require("handlebars-layouts");
const compile = require("gulp-compile-handlebars");
const browserify = require("browserify");
const del = require("del");
const rename = require("gulp-rename");
const minify = require("gulp-minify");
const eslint = require("gulp-eslint");
const image = require("gulp-image");
const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const webserver = require("gulp-webserver");
const data = require("./src/data/global");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

/**
 * Tasks for cleaning dist folder
 */
const allClean = () => del(['dist']);
const htmlClean = () => del(['dist/*.html']);
const sassClean = () => del(['dist/css']);
const jsClean = () => del(['dist/js']);

/**
 * Compiles handlebars pages, layouts and partials to html
 */
const hbsTask = () => {
	// Register handlebars
	handlebars.registerHelper(layouts(handlebars));

	// Feeds json data into hbs templates
  templateData = data;
	
	options = {
		ignorePartials: true,
		batch : ['./src/html/components/', './src/html/layouts/'],
	}

	return src('src/html/pages/*.hbs')
		.pipe(compile(templateData, options))
		.pipe(rename((path) => {
      path.basename;
      path.extname = '.html';
    }))
		.pipe(dest('dist'));
};

const lintTask = () => {
	return src('src/js/main.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
};

/**
 * Compiles js files
 */
const jsTask = () => {
	return browserify('src/js/main.js')
	.transform("babelify", {presets: ["@babel/preset-env"]} )
	.bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
	.pipe(minify())
	.pipe(dest("dist/js"))
};

/**
 * Compiles scss files
 */
const sassTask = () => {
	return src("src/scss/main.scss")
	.pipe(sassGlob())
	.pipe(sass().on("error", sass.logError))
	.pipe(dest("dist/css"));
};

/**
 * Compiles and compresses images
 */
const imgTask = () => {
	return src("src/img/**/*")
	.pipe(image())
	.pipe(dest("dist/img"));
};

/**
 * Watches files for changes and recompiles necessary files
 */
const watchTask = () => {
	watch('src/html/**/*.hbs', series(htmlClean, hbsTask));
	watch('src/scss/**/*.scss', series(sassClean, sassTask));
	watch('src/js/**/*.js', series(jsClean, lintTask, jsTask));
};

/**
 * Starts development server from dist
 */
const serverTask = () => {
	src('dist')
	.pipe(webserver({
		port: "8000",
		livereload: true,
		open: true
	}))
};

exports.default = series(allClean, hbsTask, lintTask, jsTask, sassTask, imgTask, parallel(watchTask, serverTask));
