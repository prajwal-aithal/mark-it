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
var maxlength=0;
var curr_articles;
var imagestr = '<img src="./img/bullet.png" class="image"></img> ';
var purgemsg = 'All articles successfully purged!!';
var noartmsg = 'No articles marked yet!!';
var donemsg = "Article added!!";
var alertclose = '<button type="button" class="close" data-dismiss="alert">×</button>';

function clickerfunc() {
  alert(this.getAttribute("artid"));
  message.removeChild(document.querySelector("#artid_"+this.getAttribute("artid")));
  deletestoragearticle(this.getAttribute("artid"));
};


function loadarticles(){
  storagearea.get('articles', function(items){
    //alert(items.articles);
    //alert(items.articles.length);
    if(items.articles){
      curr_articles = items.articles;
      length = items.articles.length;
      maxlength=length;
      for(i=0;i<length;++i){
        var topdiv= document.createElement('div');
        topdiv.setAttribute("class", "topdivarticle");
        var inmaindiv= document.createElement('div');
        inmaindiv.setAttribute("class", "insidearticle");
        var inclosediv= document.createElement('div');
        inclosediv.setAttribute("class", "closearticle");
        inmaindiv.appendChild(document.createElement('img'));
        inmaindiv.lastChild.src="./img/bullet.png";
        inmaindiv.lastChild.setAttribute("class","image");
        inmaindiv.appendChild(document.createElement('a'));
        var arttext = items.articles[i];
        var artlink='';
        var arttitle='';
        var j=9;
        for(j=9;;j++){
          if(arttext[j] == '"')
            break;
          artlink+=arttext[j];
        }
        j+=2;
        for(;j<arttext.length-4;j++){
          arttitle += arttext[j];
        }
        inmaindiv.lastChild.href=artlink;
        inmaindiv.lastChild.appendChild(document.createTextNode(arttitle));
        inclosediv.appendChild(document.createElement('a'));
        topdiv.setAttribute("id", "artid_"+i.toString());
        inclosediv.lastChild.setAttribute("artid",i.toString());
        inclosediv.lastChild.href='#';
        inclosediv.lastChild.onclick=clickerfunc;
        inclosediv.lastChild.appendChild(document.createTextNode('x'));
        topdiv.appendChild(inmaindiv);
        topdiv.appendChild(inclosediv);
        message.appendChild(topdiv);
      }
    } 
    else{
      var topdiv= document.createElement('div');
      topdiv.setAttribute("class", "topdivarticle");
      var inmaindiv= document.createElement('div');
      inmaindiv.setAttribute("class", "insidearticle");
      var inclosediv= document.createElement('div');
      inclosediv.setAttribute("class", "closearticle");
      inmaindiv.appendChild(document.createTextNode(noartmsg));
      topdiv.appendChild(inmaindiv);
      topdiv.appendChild(inclosediv);
      message.appendChild(topdiv);
    }
  });
}


function deletestoragearticle(artiid){
  var intid = parseInt(artiid);
  var delarticles=[];
  var j=0;
  for(i=0;i<length;i++){
    if(i != intid){
      delarticles[j] = curr_articles[i];
      j++;
    }
  }
  length--;
  curr_articles = [];
  for(i=0;i<length;i++){
    curr_articles[i] = delarticles[i];
  }
  storagearea.remove('articles');
  storagearea.set({'articles': curr_articles},function(){
    message.innerHTML += ' ';
  });
  if(length == 0){
    var topdiv= document.createElement('div');
    topdiv.setAttribute("class", "topdivarticle");
    var inmaindiv= document.createElement('div');
    inmaindiv.setAttribute("class", "insidearticle");
    var inclosediv= document.createElement('div');
    inclosediv.setAttribute("class", "closearticle");
    inmaindiv.appendChild(document.createTextNode(noartmsg));
    topdiv.appendChild(inmaindiv);
    topdiv.appendChild(inclosediv);
    message.appendChild(topdiv);
  }
}


function addArticles(ttitle){
  chrome.tabs.getSelected(null,function(tab){
    var addurl = '<a href="'+tab.url+'">'+ttitle+'</a>';
    if(length > 0){
      curr_articles[length] = addurl;
    }
    else{
      curr_articles = [];
      curr_articles[0] = addurl;
    } 
    storagearea.remove('articles');
    storagearea.set({'articles': curr_articles},function(){
      message.innerHTML += ' ';
    });
    if(length == 0){
      message.removeChild(message.firstChild);
    }
    var topdiv= document.createElement('div');
    topdiv.setAttribute("class", "topdivarticle");
    var inmaindiv= document.createElement('div');
    inmaindiv.setAttribute("class", "insidearticle");
    var inclosediv= document.createElement('div');
    inclosediv.setAttribute("class", "closearticle");
    inmaindiv.appendChild(document.createElement('img'));
    inmaindiv.lastChild.src="./img/bullet.png";
    inmaindiv.lastChild.setAttribute("class","image");
    inmaindiv.appendChild(document.createElement('a'));
    inmaindiv.lastChild.href=tab.url;
    inmaindiv.lastChild.appendChild(document.createTextNode(ttitle));
    inclosediv.appendChild(document.createElement('a'));
    inclosediv.lastChild.setAttribute("artid",maxlength.toString());
    topdiv.setAttribute("id", "artid_"+maxlength.toString());
    inclosediv.lastChild.href='#';
    inclosediv.lastChild.onclick=clickerfunc;
    inclosediv.lastChild.appendChild(document.createTextNode('x'));
    topdiv.appendChild(inmaindiv);
    topdiv.appendChild(inclosediv);
    message.appendChild(topdiv);
    length++;
    maxlength++;
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
  if(length != 0){
    storagearea.remove('articles', function(items) {
    for (i=0;i<length;i++){
      message.removeChild(message.lastChild);
    }
    var topdiv= document.createElement('div');
    topdiv.setAttribute("class", "topdivarticle");
    var inmaindiv= document.createElement('div');
    inmaindiv.setAttribute("class", "insidearticle");
    var inclosediv= document.createElement('div');
    inclosediv.setAttribute("class", "closearticle");
    inmaindiv.appendChild(document.createTextNode(purgemsg));
    topdiv.appendChild(inmaindiv);
    topdiv.appendChild(inclosediv);
    message.appendChild(topdiv);
    });
  }
}


function exportArticles(){
  
}


function importArticles(){
  
}

loadarticles();