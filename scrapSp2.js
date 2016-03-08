var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var languages = [];
var currentEsRoute;
var langRoutes = [];
var spanish = [];
var newLink = [];
var routes = [{enUrl:'https://developer.mozilla.org/en/docs/Web/JavaScript'},{enUrl:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode'}];


var editLink = function(link){
    if(link.indexOf("https://developer.mozilla.org")!=-1){
        newLink=link;
    }
    else {
        newLink = "https://developer.mozilla.org"+link;
    }
    return newLink;
};


var j = 0;
var scrapeSp = function(routesArr){
    // Reset the languages array.
    request(routesArr[j].enUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            var langs = $('#translations a');
            langs.each(function(i,lang){
                
                //console.log($(lang).attr('href'));
                if($(lang).text()=="Español"){
                    routesArr[j].esUrl=editLink($(lang).attr('href'));
                    console.log(routesArr);
                }
            });
            //console.log(langRoutes);
                j++;
                
                if(j==routes.length){
                    //console.log(j,routes.length);
                    return;
                }
                else{
                    //console.log(langRoutes);
                    scrapeSp(routes);
                }
            }
        });
    };

scrapeSp(routes);