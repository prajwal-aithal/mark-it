var storagearea = chrome.storage.local;

var loadtitleButton = document.querySelector('#loadtitlebutton');
loadtitleButton.addEventListener('click', loadcurrenttitle);
var titleButton = document.querySelector('#titlebutton');
titleButton.addEventListener('click', addArticlesTitle);
var customtitleButton = document.querySelector('#customtitlebutton');
customtitleButton.addEventListener('click', addArticlesCustomTitle);
var delButton = document.querySelector('#dbutton');
delButton.addEventListener('click', purgeArticles);
var exportButton = document.querySelector('#exportbutton');
exportButton.addEventListener('click', exportArticles);
var importButton = document.querySelector('#importbutton');
importButton.addEventListener('click', importArticles);

var message = document.querySelector('#articlespace');
var length=0;
var curr_articles;
var imagestr = '<img src="./img/bullet.png" class="image"></img> ';
var purgemsg = 'All articles successfully purged!!';
var noartmsg = 'No articles marked yet!!';
var donemsg = "Article added!!";
var alertclose = '<button type="button" class="close" data-dismiss="alert">×</button>';

function loadarticles(){
  storagearea.get('articles', function(items){
    //alert(items.articles);
    if(items.articles){
      curr_articles = items.articles;
      length = items.articles.length;
      for(i=0;i<length;++i){
        message.innerHTML += imagestr+items.articles[i]+'<br>';
      }
    } 
    else{
      var optionsUrl = chrome.extension.getURL('options.html');
      message.innerHTML += noartmsg;
    }
  });
}


function addArticles(ttitle){
  chrome.tabs.getSelected(null,function(tab){
    var addurl = '<a href="'+tab.url+'">'+ttitle+'</a>';
    if(length > 0){
      curr_articles[length] = addurl;
      length++;
    }
    else{
      curr_articles = [];
      curr_articles[0] = addurl;
    } 
    storagearea.set({'articles': curr_articles},function(){
      //document.querySelector('#alertmessages').innerHTML = donemsg+alertclose;
      message.innerHTML += ' ';
    });
    if(length == 1){
      message.innerHTML = imagestr+addurl+"<br>";
    }
    else{
      if(message.innerHTML == noartmsg || message.innerHTML == purgemsg)
        message.innerHTML = imagestr+addurl+"<br>";
      else
        message.innerHTML += imagestr+addurl+"<br>";
    }
    //window.console.log('<a href="'+tab.url+'">'+tab.title+'</a>');
  });
}


function addArticlesTitle(){
  chrome.tabs.getSelected(null,function(tab){
    addArticles(tab.title);
  });
}


function loadcurrenttitle(){
  chrome.tabs.getSelected(null,function(tab){
    document.querySelector('#customtitle').value = tab.title;
  });
}


function addArticlesCustomTitle(){
  if(document.querySelector('#customtitle').value){
    addArticles(document.querySelector('#customtitle').value);
  }
  else{
    chrome.tabs.getSelected(null,function(tab){
      addArticles(tab.title);
    });
  }
}


function purgeArticles(){
  storagearea.remove('articles', function(items) {
    message.innerHTML = noartmsg;
    //document.querySelector('#alertmessages').innerHTML = noartmsg+alertclose;
  });
}


function exportArticles(){
  
}


function importArticles(){
  
}

loadarticles();