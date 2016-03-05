var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var languages = [];
var spanish = [];
var newLink = [];
var routes = ['https://developer.mozilla.org/en/docs/Web/JavaScript'];

var j = 0;
var scrape = function(routesArr){
    // Reset the languages array.
    languages = [];
    request(routesArr[j], function(error, response, html){
    
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
                
                //UNDER CONSTRUCTION: Verify if there is a Spanish translation. If there is, scrape the route in Spanish 
                //and find out if there is a message indicating that the translation is incomplete. 
                //This needs to be done in the ES route. Obtain route for ES ver first.
                $(this).filter(function(){
                     var statusMessage =$('.translationInProgress').children().first().text();
                     if(statusMessage.indexOf("incompleta")!=-1){
                         spanish.push({route:routesArr[i],spanish:languages.indexOf('Español')!=-1});
                     }
                     
                 });
                
                //Populate the routes array with the <a> tags found in the article.
                $(this).filter(function(){
                    var links = $('#wikiArticle a');
                    links.each(function(i,link){
                        if($(link).attr('href')!=undefined){
                            if($(link).attr('href').indexOf("/en-US/docs")!=-1){
                                if($(link).attr('href').indexOf("https://developer.mozilla.org")!=-1){
                                    newLink=$(link).attr('href');
                                }
                                else {
                                    newLink = "https://developer.mozilla.org"+$(link).attr('href');
                                }
                                if(routes.indexOf(newLink)==-1){
                                    //console.log(newLink);
                                    routes.push(newLink);
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
                    console.log(routes[j]);
                    scrape(routes);
                }
            });
        }
    });
};

scrape(routes);