var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var newLink = [];
var routes = [ { enUrl: 'https://developer.mozilla.org/en/docs/Web/JavaScript',
    esUrl: 'https://developer.mozilla.org/es/docs/Web/JavaScript' },
  { enUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode',
    esUrl: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Modo_estricto' } ];


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
    request(routesArr[j].esUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            var message = $('.translationInProgress');
            //console.log(message.children().first().text());
            routesArr[j].esMessage = message.children().first().text();
            console.log(routes);
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