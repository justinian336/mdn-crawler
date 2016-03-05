var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var languages = [];
var langRoutes = [];
var spanish = [];
var newLink = [];
var routes = ['https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript'];


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
    langRoutes = [];
    request(routesArr[0], function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            $('#translations a').filter(function(){
                var langs = $(this);
                langs.each(function(i,lang){
                    languages.push($(lang).text());
                    langRoutes.push($(lang).attr('href'));
                    if($(lang).text()=='Español'){
                        console.log($(lang).attr('href'));
                    }
                    
                if(languages.indexOf("Español")!=-1){
                     
                     request(editLink($(lang).attr('href')),function(err,resp,esHtml){
                         if(!err){
                             var $$ = cheerio.load(esHtml);
                             $$('.translationInProgress').filter(function(){
                             var statusTrans = $$(this).children().first().text();
                             if(statusTrans.indexOf('incompleta')!=-1){
                                 spanish.push({enUrl:routesArr[j],translated:1});
                             }
                             else{
                                 spanish.push({enUrl:routesArr[j],translated:2});
                             }
                             });
                         }
                     });
                    
                }
                else{
                    spanish.push({enUrl:routesArr[j],translated:0});
                }
                });
               
            });

                /*
                //Populate the routes array with the <a> tags found in the article.
                $(this).filter(function(){
                    var links = $('#wikiArticle a');
                    console.log(links);
                    links.each(function(i,link){
                        if($(link).attr('href')!=undefined){
                            if($(link).attr('href').indexOf("/en-US/docs")!=-1){
                                
                                newLink = editLink($(link).attr('href'))
                                
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
                */
        }
    });
};

scrape(routes);