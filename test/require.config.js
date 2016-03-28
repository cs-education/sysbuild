require.config({
  // Resolve all AMD modules relative to the 'src' directory, to produce the
  // same behavior that occurs at runtime
  baseUrl: '../src/',

  // It's not obvious, but this is a way of making Jasmine load and run in an AMD environment
  // Credit: http://stackoverflow.com/a/20851265
  paths: {
    'jasmine': '../test/bower_modules/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': '../test/bower_modules/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-boot': '../test/bower_modules/jasmine/lib/jasmine-core/boot'
  },
  shim: {
    'jasmine': { exports: 'window.jasmineRequire' },
    'jasmine-html':  { deps: ['jasmine'], exports: 'window.jasmineRequire' },
    'jasmine-boot': { deps: ['jasmine', 'jasmine-html'], exports: 'window.jasmineRequire' }
  }
});
