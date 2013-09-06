/*jslint node: true, plusplus: true */

module.exports = function (grunt) {

    'use strict';

    grunt.registerTask('bing_translate', 'Translates language files with Bing', function () {

      var done = this.async(),
          gruntTranslate = require('./lib/translate')(grunt, done);

      // Kick it off
      gruntTranslate.init();

    });

};