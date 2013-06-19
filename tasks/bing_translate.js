/*jslint node: true, plusplus: true */

module.exports = function (grunt) {

    'use strict';

    grunt.registerTask('bing_translate', 'Translates language files with Bing', function () {

      var done = this.async(), 
          config = grunt.config.data.bing_translate,
          MsTranslator = require('mstranslator'),
          ejs = require('ejs'),
          fs = require('fs'),
          _ = require('underscore'),
          client = new MsTranslator({client_id: config.clientId, client_secret: config.clientSecret }), 
          number = 0, 
          gruntTranslate;

      /**
      * @class gruntTranslate
      */
      gruntTranslate = {

        lang: {},
        words: {},
        wordsArr: [],

        /*
        * This function is called back when a file is done. When all of the files are done, we'll close out the grunt process
        * @method fileDone
        */
        fileDone: function () {
          number++;
          if (number === config.languages.length) {
            done();
          }
        },

        /**
        * Merges all of the words to be translated into a flat array
        * @method prepareAllWords
        */
        prepareAllWords: function () {
          var self = this;
          _.each(config.files, function (file, fileName) {
            _.each(file.values, function (word, label) {
              self.words[word] = word;
            });
          });
          _.each(self.words, function (val) {
            self.wordsArr.push(val);
          });
        },

        /**
        * Write the language file
        * @method writeFile
        * @param {String} language
        * @param {String} fileName
        */
        writeFile: function (language, fileName) {

          var file = config.files[fileName],
              self = this,
              template,
              values = {};

          _.each(file.values, function (value, name) {
            values[name] = self.lang[language][value];
          });

          // Parse the template with EJS
          template = ejs.render(file.template, {
            values: JSON.stringify(values),
            language: language
          });

          // Write the file
          fs.writeFileSync(
            String(__dirname).replace('tasks', '') + fileName + '/' + language + (file.fileNameEnding || '.js'), 
            template
          );

        },

        /**
        * This callback is fired after a language has been translated to.
        * @method translateCallback
        * @param {Object} err The error if any
        * @param {Array} data The translated words
        * @param {String} language
        */
        translateCallback: function (err, data, language) {

          var self = this, i;

          if (err) {
            grunt.log.write(err);
          } else {

            // Turn the array back into an object
            for (i = 0; i < data.length; i++) {
              self.lang[language][self.wordsArr[i]] = data[i].TranslatedText;
            }

            _.each(config.files, function (fileData, fileName) {
              self.writeFile(language, fileName);
            });

          }

          this.fileDone();

        },

        /**
        * Translates all of the words in the wordsArr from english to the language to the language that is passed in
        * @method translate
        * @param {String} language
        */
        translate: function (language) {

          var self = this;

          this.lang[language] = {};    

          client.translateArray({
              from: 'en',
              to: language,
              texts: this.wordsArr
            }, function (err, data) {
              self.translateCallback(err, data, language);
            });      

        },

        /**
        * Initializes the translation
        * @method init
        */
        init: function () {

          var self = this;

          this.prepareAllWords();

          client.initialize_token(function () {
            _.each(config.languages, function (language) {
              self.translate(language);
            });
          });

        }

      };

      // Kick it off
      gruntTranslate.init();

    });

};