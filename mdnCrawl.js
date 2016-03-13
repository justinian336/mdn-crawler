var jsonfile = require('jsonfile');
var request = require('request');
var cheerio = require('cheerio');

//Insert here the name of the output file, the start-point urls and the topic routes to scrape:
var fileName ='routes.json';
var routes = ['https://developer.mozilla.org/en/docs/Web/JavaScript'];
var topicRoutes = ['Web/JavaScript'];

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

var unleak = function(s){
    return (' '+s).substr(1);
};


var j1 = 0;
var j2 = 0;
var j3 = 0;

var stage3 = function(routesArr){
    request(routesArr[j3].esUrl, function(error, response, html){
    
        if(!error){
            
            // Get the html for the current route
            var $ = cheerio.load(html);
            
            // Obtain the languages available for the current route
            var message = $('.translationInProgress');
            routesArr[j3].esMessage = message.children().first().text();
            console.log(routesArr[j3].esMessage);
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
                stage3(routesArr);
            }
        }
        else{
            console.log("No Spanish Route");
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
                    console.log(routesArr[j2].esUrl);
                }
            });
            //console.log(langRoutes);
            j2++;
            
            if(j2==routes.length){
                console.log('Moving to stage 3');
                stage3(routesArr);
            }
            else{
                //console.log(j2);
                stage2(routesArr);
            }
        }
    });
};

var stage1 = function(routesArr){
    
    request(routesArr[j1], function(error, response, html){
        if(!error){
            // Get the html for the current route
            var $ = cheerio.load(html);

            var links = $('#wikiArticle a');
            links.each(function(i,link){
                if($(link).attr('href')!=undefined){
                    if($(link).attr('href').indexOf("/en-US/docs/"+topicRoutes)!=-1){
                        var newLink = editLink(unleak($(link).attr('href')));
                        if(routesArr.indexOf(newLink)==-1){
                            console.log(newLink);
                            routesArr.push(newLink);
                        }
                    }
                }
            });
            j1++;
            
            if(j1==routesArr.length-1){
                for(var i=0;i<routesArr.length;i++){
                    routes[i] = {enUrl:routes[i],esUrl:"",esMessage:""};
                }
                console.log('Moving to stage 2');
                stage2(routesArr);
            }
            else{
                stage1(routesArr);
            }
        }
    });
};

stage1(routes);