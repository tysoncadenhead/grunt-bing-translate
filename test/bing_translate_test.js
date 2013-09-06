'use strict';

// NodeUnit Tests
exports.bing_translate = {

  setUp: function (done) {
    this.translate = require('../tasks/lib/translate')({
      config: {
        data: {
          bing_translate: {
            options: {
              "clientId": require("../config.json").clientId,
              "clientSecret": require("../config.json").clientSecret
            }
          }
        }
      }
    });
    // setup here if necessary
    done();
  },

  fileDone: function (test) {
    this.translate.config.languages = ['fr'];
    this.translate.done = function () {
      test.ok(1, 'The done event is fired');
      test.done();
    };
    this.translate.fileDone();
  },

  prepareAllWords: function (test) {
    this.translate.config.files = {
      'file1': {
        'values': {
          'bar': 'Bar',
          'baz': 'Baz'
        }
      },
      'file2': {
        'values': {
          'foo': 'Foo',
          'bar': 'Bar',
          'baz': 'Baz'
        }
      }
    };
    this.translate.prepareAllWords();
    test.deepEqual(this.translate.wordsArr, ['Bar', 'Baz', 'Foo'], 'The words are merged into a single array');
    test.done();
  },

  translatedToSpanish: function (test) {
    var es = require('../temp/es');
    test.equal(es.lang, 'es', 'The correct language was set');
    test.equal(es.words.hello, 'Hola', 'Hello was translated');
    test.done();
  },

  translatedToFrench: function (test) {
    var fr = require('../temp/fr');
    test.equal(fr.lang, 'fr', 'The correct language was set');
    test.equal(fr.words.hello, 'Salut', 'Hello was translated');
    test.done();
  }

};
