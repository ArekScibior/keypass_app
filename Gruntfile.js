module.exports = function (grunt) {
	var moment = require('moment');
	var fs = require('fs');
	var _ = require('lodash');
	var archiver = require('archiver');
	_.contains = _.includes;

	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-strip-code');
	grunt.loadNpmTasks('grunt-link-html');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-prettify');

	grunt.initConfig({

		usemin: {
			html: ['dist/index.html']
		},

		// task prettify dla index html bo taski do zastępowania resources na zminifiowane
		// nie radzą sobie z index.html bez formatowania
		prettify: {
			options: {
				indent: 1,
				indent_char: '	',
				brace_style: 'end-expand',
				unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'span']
			},
			build: {
				src: 'app/index.html',
				dest: 'dist/index.html'
			}
		},

		// skopiowanie pliku index.html do katalogu dist
		copy: {
			index: {
				files: [{
					expand: true,
					cwd: 'app',
					src: 'init.js',
					dest: 'dist/'
				}, {
					expand: true,
					cwd: 'app',
					src: '.htaccess',
					dest: 'dist/'
				}, {
					expand: true,
					cwd: 'app',
					src: 'robots.txt',
					dest: 'dist/'
				}, {
					expand: true,
					cwd: 'app',
					src: 'scripts/init.js',
					dest: 'dist/'
				}, {
					expand: true,
					cwd: 'app',
					src: 'scripts/helper.jquery.js',
					dest: 'dist/'
				}]
			},
			js: {
				files: [
					{src: '.tmp/scripts/scripts.js', dest: 'dist/scripts/scripts.min.js'},
					{src: '.tmp/scripts/vendor.js', dest: 'dist/scripts/vendor.min.js'}
				]
			},
			fonts: {
				files: [
					{expand: true, cwd: 'app', src: 'fonts/*', dest: 'dist/'},
					{cwd: 'app/bower_components/bootstrap/dist/fonts', src: '**', dest: 'dist/fonts/', expand: true},
					{cwd: 'app/bower_components/mdi/fonts', src: '**', dest: 'dist/fonts/', expand: true},
					{cwd: 'app/bower_components/font-awesome/fonts', src: '**', dest: 'dist/fonts/', expand: true}
				]
			},
			images: {
				files: [{
						expand: true,
						cwd: 'app/styles/smoothness',
						src: 'images/*',
						dest: 'dist/styles'
					}, {
            expand: true,
            cwd: 'app/styles',
            src: 'images/*',
            dest: 'dist/styles'
          },{
						expand: true,
						cwd: 'app',
						src: 'images/*',
						dest: 'dist/'
					}, {
						expand: true,
						cwd: 'app',
						src: 'images/*',
						dest: 'dist/'
					}]
			},
			resources: {
				files: [{
					expand: true,
					cwd: 'app',
					src: 'resources/*',
					dest: 'dist/'
				}]
			}
		},

// zmiana nazw by pliki nie były cacheowane przez przeglądarkę
		hashres: {
			options: {
				encoding: 'utf8',
				fileNameFormat: '${name}.${hash}.${ext}',
				renameFiles: true
			},
			appScripts: {
				src: ['dist/scripts/scripts.min.js'],
				dest: ['dist/index.html']
			},
			appCss: {
				src: ['dist/styles/main.min.css'],
				dest: ['dist/index.html']
			},
			appVendor: {
				src: ['dist/scripts/vendor.min.js'],
				dest: ['dist/index.html']
			},
			appInit: {
				src: ['dist/init.min.js'],
				dest: ['dist/index.html']
			},
		},

// czyszczenie katalogów
		clean: {
			prebuild: ['.tmp', 'dist']
		},

// wstawianie zależności do index.html z bowera
		wiredep: {
			app: {
				src: [
					'app/index.html'
				],
				options: {
					overrides: {
						bootstrap: {
							main: ['dist/css/bootstrap.css', 'dist/js/bootstrap.js']
						},
						moment: {
							main: ['moment.js', 'locale/pl.js']
						},
						'angular-i18n': {
							main: ['angular-locale_pl-pl.js']
						},
						mdi: {
							main: ['css/materialdesignicons.css']
						},
						'font-awesome': {
							main: ['css/font-awesome.css']
						},
						'jquery-ui': {
							main: ['jquery-ui.js', 'themes/base/jquery-ui.css']
						}
					}
				}
			}
		},

		// minifikacja plików
		uglify: {
			scripts: {
				files: {
					'dist/scripts/scripts.min.js': ['.tmp/scripts/scripts.js'],
					'dist/init.min.js': ['app/init.js']
				}
			},
			vendor: {
				files: {
					'dist/scripts/vendor.min.js': ['.tmp/scripts/vendor.js']
				}
			}
		},

		// połączenie plików i użycie tablicowej notacji zależności w kontrolerach, factory i dyrektywach
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			app: {
				files: {
					'.tmp/scripts/scripts.js': ['app/scripts/app.js', 'app/scripts/spinner-controller.js', 'app/components/**/*.js', '.tmp/angular-templates.js']
				}
			}
		},

		// łączenie plików z bower_components w odpowiedniej kolejności
		bower_concat: {
			all: {
				dependencies: {
					'angular': ['jquery']
				},
				mainFiles: {
					bootstrap: ['dist/css/bootstrap.css', 'dist/js/bootstrap.js'],
					moment: ['moment.js', 'locale/pl.js'],
					'angular-i18n': ['angular-locale_pl-pl.js'],
					mdi: ['css/materialdesignicons.css'],
					'jquery-ui': ['jquery-ui.js', 'themes/base/jquery-ui.css'],
					'font-awesome': ['css/font-awesome.css']
				},
				dest: {
					js: '.tmp/scripts/vendor.js',
					css: '.tmp/styles/vendor.css'
				}
			}
		},

		// połączenie template'ów angularowych do $templateCache
		ngtemplates: {
			'app': {
				cwd: 'app/',
				src: 'components/**/*.html',
				dest: '.tmp/angular-templates.js',
				options: {
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						removeAttributeQuotes: true,
						removeComments: false,
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true
					}
				}
			}
		},

// minifikacja plików css
		cssmin: {
			options: {
				sourceMap: false,
				keepSpecialComments: 0
			},
			app: {
				files: {
					'dist/styles/main.min.css': ['.tmp/styles/**/*.css', 'app/styles/**/*.css', 'app/components/**/*.css']
				}
			}
		},

		// minifikacja plików html
		htmlmin: {
			index: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
						src: 'dist/index.html',
						dest: 'dist/index.html'
					}]
			}
		},

		// łączenie plików bez minifikacji
		concat: {
			css: {
				src: ['.tmp/styles/**/*.css', 'app/styles/**/*.css'],
				dest: 'dist/styles/main.min.css'
			}
		},

		// usuwanie kodu z pomiędzy zdefiniowanych tagów
		strip_code: {
			app: {
				options: {
					blocks: [{
							start_block: '/* strip-code-start */',
							end_block: '/* strip-code-end */'
						}, {
							start_block: '<!-- strip-code-start -->',
							end_block: '<!-- strip-code-end -->'
						}]
				},
				src: ['.tmp/scripts/scripts.js']
			}
		},

		watch: {
			options: {
				livereload: true
			},
			css: {
				files: ['app/styles/**/*.css']
			},
			js: {
				files: ['app/components/**/*.js', 'app/components/**/*.json']
			},
			addedDeletedJs: {
				options: {
					event: ['added', 'deleted'],
				},
				tasks: ['link_html'],
				files: ['app/scripts/**/*.js', 'app/components/**/*.js']
			},
			addedDeletedCss: {
				options: {
					event: ['added', 'deleted'],
				},
				tasks: ['link_html'],
				files: ['app/styles/**/*.css', 'app/components/**/*.css']
			},
			html: {
				files: ['app/index.html', 'app/logoff.html', 'app/components/**/*.html']
			},
			bower: {
				tasks: ['wiredep'],
				files: ['bower.json', 'app/bower_components/**', 'app/bower_components/angular-fullscreen/src/**']
			}
		},

		'http-server': {
			'dev': {
				root: 'app',
				port: 9099,
				host: "0.0.0.0",
				cache: -1,
				showDir: true,
				autoIndex: true,
				ext: "html",
				runInBackground: false,
				openBrowser: false,
				proxy: 'http://127.0.0.1:8081/'
			}
		},

		// automatyczne dodawanie plików ze skryptami i css do index.html z katalogu components i styles
		link_html: {
			app: {
				jsFiles: ['scripts/**/*.js', 'components/**/*.js'],
				cssFiles: ['styles/**/*.css', 'components/**/*.css'],
				targetHtml: ['index.html'],
				options: {
					cwd: 'app',
					expand: true
				}
			}
		}

	});

	grunt.registerTask('createAppVersion', function () {
		fs.writeFileSync('dist/version', moment().format('YYYY-MM-DD-HH-mm-ss'), 'utf8');
	});

	grunt.registerTask('serve', [
		'wiredep', // dodanie zależności bowera do index.html
		'link_html', // dodanie do index.html plików z components (js) i ze styles (css)
		'http-server:dev'       // serwer
	]);
	
	grunt.registerTask('serve-dist', [
		'build',
		'http-server:dist'
	]);

	grunt.registerTask('build-no-min', [
		'clean:prebuild', // czyszczenie katalogu .tmp i dist
		'copy:index', // skopiowanie pliku index.html do dist
		'bower_concat:all', // połączenie zależności z bower'a w jeden plik w odpowiedniej kolejności
		'ngtemplates', // połączenie template'ów angularowych w jeden plik i użycie serwisu $templateCache
		'ngAnnotate:app', // połączenie plików angularowych i podmiana kontrolerów, dyrektyw, serwisów w notacji funkcyjnej na tablicową
		'strip_code:app', // usunięcie oznaczonego kodu
		'copy:js', // skopiowanie plików js z .tmp do dist
		'concat:css', // połaczenie plików css bez minifikacji
		'hashres', // generowanie hash'a do nazw plików i ich zamiana
		'usemin', // użycie w index.html zmienionych nazw plików
		'copy:fonts', // skopiowanie czcionek bootstrapa
		'copy:images', // skopiowanie tła
		'copy:resources', // skopiowanie pozostałych plików
		'createAppVersion'

	]);

	grunt.registerTask('build', [
		'clean:prebuild', // czyszczenie katalogu .tmp i dist
		'copy:index', // skopiowanie pliku index.html do dist
		'prettify', // skopiowanie pliku index.html do dist
		'bower_concat:all', // połączenie zależności z bower'a w jeden plik w odpowiedniej kolejności
		'ngtemplates', // połączenie template'ów angularowych w jeden plik i użycie serwisu $templateCache
		'ngAnnotate:app', // połączenie plików angularowych i podmiana kontrolerów, dyrektyw, serwisów w notacji funkcyjnej na tablicową
		'strip_code:app', // usunięcie oznaczonego kodu
		'uglify', // minifikacja plików js z aplikacją i bibliotekami
		'cssmin', // minifikacja plików css i ich połączenie w jeden
		'hashres', // generowanie hash'a do nazw plików i ich zamiana
		'usemin', // użycie w index.html zmienionych nazw plików
		'htmlmin:index', // minifikacja pliku index.html
		'copy:fonts', // skopiowanie czcionek bootstrapa
		'copy:images', // skopiowanie tła
		'copy:resources', // skopiowanie pozostałych plików
		'createAppVersion'
	]);

	grunt.registerTask('createEAR', function () {
		var warStream = fs.createWriteStream('.tmp/SimpleWeb.war');
		var warArchive = archiver('zip', {
			zlib: { level: 9 }
		});
		
		warArchive.on('finish', function (err) {
			console.log(err);
		});
		
		warArchive.pipe(warStream);
		warArchive.directory('EAR_BUILD/WAR_WEB-INF/', 'WEB-INF');
		warArchive.directory('dist/', false);
		warArchive.finalize();
		
	});

};
