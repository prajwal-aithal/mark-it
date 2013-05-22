Mark-It
=======
Mark articles for later reading...

---
This chrome extension helps you to keep track of articles that you may want to read later but find them not that important to 
be bookmarked. 

Usage
-----
1. To save a particular article, click the extension button when the tab having the article is selected, and click "Add 
Articles" button. In the dialog box that appears, the current title is loaded into the input box. Modify the title as needed
and click on "Save Articles" button.
2. To delete all the articles, click on "Clear" button.
3. To delete a particular article, click on the "x" button corresponding to that article (i.e present beside that article).
4. To export the current list of articles, click on "More Options" and click on the "Export/Import" button there. In the
dialog box that appears, click on "Export" button. The list of articles (if there are any) are exported to a folder named
"Extension: Mark-It" in the "Other Bookmarks" folder. If there already exists such a folder, then the folder is overwritten
with the new articles.
5. To import articles from the bookmarks folder ("Extension: Mark-It" folder), click on "More Options" and click on the 
"Export/Import" button there. In the dialog box that appears, click on "Import" button. If there exists a folder named 
"Extension: Mark-It" in the "Other Bookmarks" folder, then the current list of articles is overwritten with that list of 
articles. Otherwise nothing is done.

Requirements
------------
This extension uses the chrome.storage api and the tab api. It does not save your history or does not access anything other 
than the data that you have stored while using this extension (more precisely the articles that you have marked).

Installation
------------
To use this extension follow the steps given below.

1. Download the source code.
2. Extract the folder.
3. Go to chrome://chrome/extensions/
4. Select the "Developer mode" option if it has not yet been selected.
5. Then click on "Load unpacked extension...".
6. Go to the extracted directory in the dialog box that appears and click open.
7. Select "Allow in incognito mode" if you want the extension in incognito mode as well (see Requirements section above).
