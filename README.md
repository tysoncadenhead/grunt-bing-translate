# grunt-bing-translate

#### Automatically translate i18n files from english to any other language with Bing.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bing-translate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bing-translate');
```

Since this plugin is using the Bing API to translate with, you will need to [Create a Bing API ID](http://www.microsoft.com/web/post/using-the-free-bing-translation-apis).

## The "bing_translate" task

### Overview
In your project's Gruntfile, add a section named `bing_translate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bing_translate: {
    options: {
      // Task-specific options go here.
    }
  },
})
```

### Options

##### clientId {String}
This is your Bing Client ID that you got when you created a Bing API account.

ie: `myawesomename`

##### clientSecret {String}
This is the secret password that Bing gave you when you created a Bing API account.

ie: `1a7EFzlm25z1nD0DRJ/91tweZn6cQH1m5IJXiInANzM`

##### languages {Array}
An array of languages to translate to. Any language that bing can translate can be used here.

ie: `['fr', 'es', 'en']`

##### files {Object}
An object containing all of the files to translate. The name of each item in the object is the root directory where we will throw all of our translated files.

For example:

```js
{
  "languages": ["fr"],
  "files": {
    "js/lang": {
      "template": "console.log('<%- language %>', <%- values %>);",
      "values": {
          "hello": "Hello",
          "world": "World"
      }
    }
  }
}
```

Will spit out an fr.js file inside of the js/lang directory with these contents:

```js
console.log('fr', {"hello":"Salut","world":"Monde"});
```
There are a few additional options you can specify inside each of the files. They are:

###### template {String}
This is an (EJS)[http://embeddedjs.com/] template to wrap render the files with. The template get two parameters: `language` which is the current language being translated and `values` which is an object with all of the the values translated.

ie: `"<%- values %>"`

###### values {Object}
This is an object with all of the words that you want Bing to translate for you. The key will be consistent in all of your i18n files, but the values with be different depending on the language.

ie:

```js
{
  test: "Test",
  your_mom: "Your Mom"
}
```

###### fileNameEnding
By default, we will end your filenames with `.js`, but if you want to put your files in a folder underneath the language name, or if you want to write to a different file extension, this parameter may be useful.

ie: `"fileNameEnding": "/translation.json"`

## Full Example

```js
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    "bing_translate": {
      "options": {
        "clientId": require("./config.json").clientId, // Replace this with your Bing Translate Client ID
        "clientSecret": require("./config.json").clientSecret, // Replace this with your Bing Translate Client Secret
        "defaultLanguage": "en",
        "languages": ["es", "fr"],
        "files": {
            "test/lang": {
                "template": "console.log('<%- language %>', <%- values %>);",
                "values": {
                    "hello": "Hello",
                    "world": "World"
                }
            }
        }
      }
    }

  });

};
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Road Map
- Unit Tests
- ~~Translate from any language~~
