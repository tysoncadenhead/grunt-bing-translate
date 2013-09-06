/*jslint node: true, plusplus: true */

module.exports = function (grunt, done) {

    'use strict';

    var MsTranslator = require('mstranslator'),
        ejs = require('ejs'),
        fs = require('fs'),
        _ = require('underscore'),
        config = grunt.config.data.bing_translate.options,
        client = new MsTranslator({client_id: config.clientId, client_secret: config.clientSecret });

    /**
    * @class gruntTranslate
    */
    return {

      done: done,
      config: config,
      number: 0,
      lang: {},
      words: {},
      wordsArr: [],

      /*
      * This function is called back when a file is done. When all of the files are done, we'll close out the grunt process
      * @method fileDone
      */
      fileDone: function () {
        this.number++;
        if (this.number === this.config.languages.length) {
          this.done();
        }
      },

      /**
      * Merges all of the words to be translated into a flat array
      * @method prepareAllWords
      */
      prepareAllWords: function () {
        _.each(this.config.files, function (file, fileName) {
          _.each(file.values, function (word, label) {
            this.words[word] = word;
          }, this);
        }, this);
        _.each(this.words, function (val) {
          this.wordsArr.push(val);
        }, this);
      },

      /**
      * Write the language file
      * @method writeFile
      * @param {String} language
      * @param {String} fileName
      */
      writeFile: function (language, fileName) {

        var file = this.config.files[fileName],
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

        var directory = String(__dirname).replace('/node_modules/grunt-bing-translate', '').replace('tasks/lib', '') + fileName + '/';

        // Creates the directory if it does not exist
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }

        // Write the file
        fs.writeFileSync(
          directory + language + (file.fileNameEnding || '.js'), 
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

          _.each(this.config.files, function (fileData, fileName) {
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
          from: this.config.defaultLanguage || 'en',
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
          _.each(this.config.languages, function (language) {
            self.translate(language);
          });
        }.bind(this));

      }

    };

};