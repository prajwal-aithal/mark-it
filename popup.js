var storagearea = chrome.storage.local;

var addButton = document.querySelector('#abutton');
addButton.addEventListener('click', loadcurrenttitle);
var saveartButton = document.querySelector('#saveartbutton');
saveartButton.addEventListener('click', addArticlesCustomTitle);
var delButton = document.querySelector('#confirmbutton');
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
var bookfoldname = "Extension: Mark-It";
var parid;

function clickerfunc() {
  message.removeChild(document.querySelector("#artid_"+this.getAttribute("artid")));
  deletestoragearticle(this.getAttribute("artid"));
};

function clickartfunc(){
  chrome.tabs.create({url: this.getAttribute("href")});
};

function loadarticles(){
  storagearea.get('articles', function(items){
    if(items.articles){
      length = items.articles.length;
      maxlength = length;
    }
    else{
      length = 0;
      maxlength = 0;
    }
    if(length > 0){
      curr_articles = items.articles;
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
        inmaindiv.lastChild.onclick=clickartfunc;
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
      inmaindiv.appendChild(document.createTextNode(String(noartmsg)));
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
    curr_articles = [];
    length = 0;
    maxlength = 0;
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


function addArticles(ttitle,turl){
  var addurl = '<a href="'+turl+'">'+ttitle+'</a>';
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
    message.removeChild(message.lastChild);
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
  inmaindiv.lastChild.href=turl;
  inmaindiv.lastChild.onclick=clickartfunc;
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
}


function loadcurrenttitle(){
  chrome.tabs.getSelected(null,function(tab){
    document.querySelector('#customtitle').value = tab.title;
  });
}


function addArticlesCustomTitle(){
  if(document.querySelector('#customtitle').value){
    chrome.tabs.getSelected(null,function(tab){
      addArticles(document.querySelector('#customtitle').value,tab.url);
    });
  }
  else{
    chrome.tabs.getSelected(null,function(tab){
      addArticles(tab.title,tab.url);
    });
  }
}


function purgeArticles(){
  if(length != 0){
    storagearea.remove('articles', function(){
      curr_articles = [];
      for (i=0;i<length;i++){
        message.removeChild(message.lastChild);
      }
      length = 0;
      maxlength = 0;
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
  if(length > 0){
    var bookmarkNodes = chrome.bookmarks.getTree(
      function(bookmarkNodes){
        var markid;
        var j=0;
        bookmarkNodes = bookmarkNodes[0].children[1];
        parid = bookmarkNodes.id;
        for (i = 0; i < bookmarkNodes.children.length; i++) {
          if(bookmarkNodes.children[i].title == bookfoldname){
            markid=bookmarkNodes.children[i].id;
            j=1;
            break;
          }
        }
        if(j == 1){
          chrome.bookmarks.removeTree(String(markid),createBookMarkNode);
        }
        else{
          createBookMarkNode();
        }
    });
  }
  else{
    alert("No articles present to export");
  }
}


function importArticles(){
  var bookmarkNodes = chrome.bookmarks.getTree(
    function(bookmarkNodes){
      var markchild;
      var j=0;
      bookmarkNodes = bookmarkNodes[0].children[1];
      parid = bookmarkNodes.id;
      for (i = 0; i < bookmarkNodes.children.length; i++) {
        //alert(bookmarkNodes.children[i].title);
        if(bookmarkNodes.children[i].title == bookfoldname){
          //alert("In... "+bookmarkNodes.children[i].title);
          markchild=bookmarkNodes.children[i].children;
          j=1;
          break;
        }
      }
      if(j == 1){
         //alert(markchild.length);
         if(markchild.length > 0){
            storagearea.remove('articles', function(){
              curr_articles = [];
              for (i=0;i<length;i++){
                message.removeChild(message.lastChild);
              }
              if(length == 0){
                message.removeChild(message.lastChild);
              }
              length = 0;
              maxlength = 0;
            });
            for(l=0;l<markchild.length;l++){
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
              var arttext = markchild[l];
              var artlink=arttext.url;
              var arttitle=arttext.title;
              inmaindiv.lastChild.href=artlink;
              inmaindiv.lastChild.onclick=clickartfunc;
              inmaindiv.lastChild.appendChild(document.createTextNode(arttitle));
              inclosediv.appendChild(document.createElement('a'));
              topdiv.setAttribute("id", "artid_"+l.toString());
              inclosediv.lastChild.setAttribute("artid",l.toString());
              inclosediv.lastChild.href='#';
              inclosediv.lastChild.onclick=clickerfunc;
              inclosediv.lastChild.appendChild(document.createTextNode('x'));
              topdiv.appendChild(inmaindiv);
              topdiv.appendChild(inclosediv);
              message.appendChild(topdiv);
              //alert(arttitle);
              curr_articles[l] = '<a href="'+artlink+'">'+arttitle+'</a>';
            }
            storagearea.set({'articles': curr_articles});
            length = curr_articles.length;
         }
         else{
          alert("No articles to import...");
         }
      }
      else{
        alert("No Folder to import from...");
      }
  });
}


function createBookMarkNode(){
  chrome.bookmarks.create({parentId: parid,title: bookfoldname},function(result){
    for(i=0;i<length;i++){
      var bnode;
      var arttext = curr_articles[i];
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
      chrome.bookmarks.create({parentId: result.id,title: arttitle, url: artlink});
    }
  });
}


loadarticles();