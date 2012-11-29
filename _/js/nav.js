function insertNav() {
    
    var nav = $("<div></div>").attr("id", "nav-header").addClass("nav");
    
    $("body").prepend(nav);
    
    var ul = $("<ul></ul>").attr("id", "list-nav");
    

    $("<li></li>").append("<a id='prev' href='#'>Prev</a></li>").appendTo(ul);
    $("<li></li>").append("<a id='home' href='#'>Home</a></li>").appendTo(ul);
    $("<li></li>").append("<a id='next' href='#'>Next</a></li>").appendTo(ul);
        
    $("<span></span>").addClass("title").attr("id", "title").appendTo(nav);

    nav.append(ul);
}

jQuery(function() {
    insertNav();
    
    var title = $("section > h1").get(0).innerHTML;
    
    $("#title").text(title);
        
    $("#home").attr('href', $("head > link[rel='start']").attr('href'));
    $("#prev").attr('href', $("head > link[rel='prev']").attr('href'));
    $("#next").attr('href', $("head > link[rel='next']").attr('href'));
});