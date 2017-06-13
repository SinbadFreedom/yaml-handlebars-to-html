var Handlebars = require("handlebars");
var yaml = require('js-yaml');
var fs = require('fs');

var showdown = require('showdown'),
    converter = new showdown.Converter();

/** Check for arguments*/
if (process.argv.length < 4) {
    console.log("Usage: node yaml2html.js mustache_file_name yaml_file_name out_html_name");
    process.exit(1);
}

var mustacheFile = process.argv[2];
var yamlFile = process.argv[3];
var outHtmlFile = process.argv[4];

fs.readFile(mustacheFile, 'utf8', function (error, mustache_data) {
    if (error) {
        throw error;
    }

    var compiled = Handlebars.compile(mustache_data);
    /** Get document, or throw exception on error */
    try {
        var yaml_data = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
        /** markdown convert helper*/
        Handlebars.registerHelper('markdown', function (fileName) {
            var md_data = fs.readFileSync(fileName, 'utf8');
            var html = converter.makeHtml(md_data);
            return html;
        });

        var htmlContent = compiled(yaml_data);
        /** output html*/
        fs.writeFile(outHtmlFile, htmlContent, function () {
            console.log("OK.");
        });
    } catch (e) {
        console.log(e);
    }
});







