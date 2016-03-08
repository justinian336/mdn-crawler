var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var languages = [];
var spanish = [];
var newLink = [];
var routes = [{enUrl:'https://developer.mozilla.org/en/docs/Web/JavaScript'}];

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
var scrape = function(routesArr){
    // Reset the languages array.
    languages = [];
    request(routesArr[j].enUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            $('#translations').filter(function(){
                var data = $(this);
            // Populate the languages array for the current route
                for(var i=0;i<data.children().length-1;i++){
                    languages.push(data.children().eq(i).text());
                }
                
                //Populate the routes array with the <a> tags found in the article.
                $(this).filter(function(){
                    var links = $('#wikiArticle a');
                    links.each(function(i,link){
                        if($(link).attr('href')!=undefined){
                            if($(link).attr('href').indexOf("/en-US/docs")!=-1){
                                
                                newLink = editLink($(link).attr('href'));
                                
                                if(routes.indexOf({enUrl:newLink})==-1){
                                    //console.log(newLink);
                                    routes.push({enUrl:newLink});
                                }
                            }
                        }
                    });
                });
                console.log(routes);
                j++;
                
                if(j==routes.length-1){
                    console.log(j,routes.length);
                    return;
                }
                else{
                    console.log(routes[j].enUrl);
                    scrape(routes);
                }
            });
        }
    });
};

scrape(routes);