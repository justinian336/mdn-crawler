var jsonfile = require('jsonfile');
var request = require('request');
var cheerio = require('cheerio');

var fileName ='routes.json';
var routes = [{enUrl:'https://developer.mozilla.org/en/docs/Web/JavaScript'}];
var newLink = [];

var editLink = function(link){
    var newLink;
    if(link.indexOf("https://developer.mozilla.org")!=-1){
        newLink=link;
    }
    else {
        newLink = "https://developer.mozilla.org"+link;
    }
    return newLink;
};

var j1 = 0;
var j2 = 0;
var j3 = 0;

var stage3 = function(routesArr){
    // Reset the languages array.
    request(routesArr[j3].esUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            var message = $('.translationInProgress');
            //console.log(message.children().first().text());
            routesArr[j3].esMessage = message.children().first().text();
            j3++;
                
            if(j3==routes.length){
                jsonfile.writeFile(fileName, routesArr, function(err){
                    if(!err){
                        console.log('Done! See '+fileName);
                    }
                });
                return;
            }
            else{
                console.log(j3);
                stage3(routesArr);
            }
        }
    });
};

var stage2 = function(routesArr){
    // Reset the languages array.
    request(routesArr[j2].enUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            var langs = $('#translations a');
            langs.each(function(i,lang){
                
                //console.log($(lang).attr('href'));
                if($(lang).text()=="Español"){
                    routesArr[j2].esUrl=editLink($(lang).attr('href'));
                }
            });
            //console.log(langRoutes);
            j2++;
            
            if(j2==routes.length){
                console.log('Moving to stage 3');
                stage3(routesArr);
            }
            else{
                console.log(j2);
                stage2(routesArr);
            }
        }
    });
};

var stage1 = function(routesArr){
    // Reset the languages array.
    request(routesArr[j1].enUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Enumerate the languages available for the current route
            $('#translations').filter(function(){
                
                //Populate the routes array with the <a> tags found in the article.
                $(this).filter(function(){
                    var links = $('#wikiArticle a');
                    links.each(function(i,link){
                        if($(link).attr('href')!=undefined){
                            if($(link).attr('href').indexOf("/en-US/docs")!=-1){
                                newLink = editLink($(link).attr('href'));
                                if(routesArr.indexOf({enUrl:newLink})==-1){
                                    //console.log(newLink);
                                    routesArr.push({enUrl:(" "+newLink).substr(1)});
                                }
                            }
                        }
                    });
                });
                //console.log(routes);
                j1++;
                
                if(j1==routesArr.length-1){
                    console.log('Moving to stage 2');
                    stage2(routesArr);
                }
                else{
                    console.log(j1);
                    stage1(routesArr);
                }
            });
        }
    });
};

stage1(routes);