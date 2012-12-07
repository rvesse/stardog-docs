var TITLE="Stardog";
var TITLE_SEPARATOR="&mdash;";
var LICENSE='<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Some rights reserved.</a>';
var COPYRIGHT="&copy;2010&ndash;" + new Date().getFullYear() + " Clark &amp; Parsia LLC.&nbsp;&nbsp;";

//build a table of contents
jQuery(function(){
  if (nodeName == "head")
    {return 1;}
  else {
  var tocBlock = $("#tocblock");
  var theTOC = $("<ol id='toc'></ol>");
  $("section").each(function(ndx, elem) {
    //grab its ID and store it in a var
    var theTarget = $(this).attr("id");
    //alert(theTarget);
    //then section header > h1 grab its text
      var theTitle = $(elem).find("h1");
      var theNavItem = $("<a></a>");
      var theHref = "#" + theTarget;
      theNavItem.attr({"href": theHref});
      theNavItem.html($(theTitle).html());
      var tocItem = $("<li></li>");
      tocItem.html(theNavItem);
      theTOC.append(tocItem);
    });
   tocBlock.append($("<h1 id='toc-title'>Contents</h1>"));
   tocBlock.append(theTOC);
   tocBlock.prependTo("#left-gutter");
  }
});

/* adding some basic 'go home' nav dynamically */
jQuery(function(){
  if (nodeName != "head") {
          $("#title").append('&nbsp;<span style="font-size: 48px"><a title="Back to Stardog Docs Home" href="..docs/">&#8962;</a></span>');
    }
      });

//add a license statement to the footer
jQuery(function(){
  var content = COPYRIGHT + LICENSE;
  $("#thefooter").html(content);
  });

//add title of book to title element as a prefix to what's already there (the
//chapter title
jQuery(function() {
    var theChapter = $("head > title").html();
    var theTitle = TITLE + TITLE_SEPARATOR + theChapter;
    $("head > title").html(theTitle);
  });

//handle notes with the <n>foo</n> markup
jQuery(function() {
    //find all the <n>, make links for each, put that link inside a <sup>
    //insert all of that crap before the <n>s
    $('section#fn').hide();
    //if there aren't any notes, we don't need a Notes section to display
    if ($('n').size() > 0) {
      $('section#fn').show();
    };
    $('n').each(function(index){
        var theNumber = index + 1;
        var theLink = $("<a></a>").attr({"id": "r" + theNumber, "href": "#note-" + theNumber});
        var theSup = $("<sup></sup>");
        var theNum = $("<b></b>").text(theNumber);
        theSup.append(theNum);
        theLink.append(theSup);
        //var theLink = $("<a></a>").attr({"id": "r" + theNumber, "href": "#note-" + theNumber}).text("[" + theNumber + "]");
        $('<span class=fnote></span>').append(theLink).insertBefore(this);
      });
    //tear the <n>s off the DOM since we don't need them for positioning any
    //more
    var rawNotes = $('n').detach();
    //stick the DOM elements onto #notes -- we can't do anything else to
    //detached DOM nodes for some reason, even though that's suppose to work
    //in jquery > 1.4
    $(rawNotes).appendTo("#notes").each(function(index){
        //replace <n> with <li> suitably styled & linked and declare victory!
        var theNumber = index + 1;
        $(this).replaceWith('<li id="note-'+theNumber+'"><p>'+this.innerHTML+"<a href=" + "#r" + theNumber + ">&nbsp;&#8617;</a></p></li>");
      });
  });

//handle quotes
jQuery(function() {
    //get the markup for the quote & the src
    var theQuote = $("blockquote#chapter-bq > q").html();
    var theSrc = $("blockquote#chapter-bq > s").html();
    //style the src bits appropriately
    //note: font-size medium is an ugly hack because of the .q span style that
    //we might be able to remove; if so, remove font-size medium, too
    theSrc = $("<span>&nbsp;&mdash;&nbsp;" + theSrc + "</span>");
    theSrc = $(theSrc).css({"font-size": "medium"});
    //fancy quotes, can't believe this works...yay for VIM
    var openSpan = $("<span>").addClass("u"); //.html("❝ ");
    var endSpan = $("<span>").addClass("u"); //.html(" ❞");
    var theP = $("<p>");
    //build the package
    var theBQ = $(theP).append(openSpan).append(theQuote).append(endSpan).append("<span></span>").append(theSrc);
    //stick it into the doc
    $(theBQ).appendTo("blockquote#chapter-bq");
    //get rid of the original markup
    $("blockquote#chapter-bq > q").detach();
    $("blockquote#chapter-bq > s").detach();
 });

// //handle figure, figcaption blocks for browsers that don't know about them yet
// jQuery(function() {
//     //first we turn figcaption into a span with figcaption class (which gets
//     //autonumbering for chapters); we do autonumber for figures here, since
//     //that value is index+1
//     $('figure > figcaption').each(function(index){
//       var theIndex = index + 1
//       var theSpan = $("<span>").addClass("figcaption").html(theIndex + "&nbsp;" + this.innerHTML);
//       $(this).replaceWith(theSpan);
//       });
//     //now we make a line break so the caption follows the img (which we don't
//     //touch at all)
//     $('figure > img').each(function(index){
//       $("<br>").insertAfter(this);
//       });
//     //last, replace <figure> with a <div>
//     $('figure').each(function(index){
//       var theDiv = $("<div>").addClass("capfig").html(this.innerHTML);
//       $(this).replaceWith(theDiv);
//       });

//   });
