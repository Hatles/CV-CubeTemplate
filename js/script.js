$(document).ready(function(){
    addRowElem();
    showContainer($('.container-start'));
    $(".link-target").click(function(){clickLink($(this));});
});

function addRowElem() {
	$("[class*='row']").each(function() 
    {
        var classes = $(this).attr("class").split(" "); 

        var cl1 = "coddy";
        var cl2 = "";

        for (var i = 0; i < classes.length; i++) 
        {
            if(classes[i].indexOf("row-") == 0)
            {
                cl1 += " " + classes[i];
            }
            else
            {
                cl2 += " " + classes[i];
            }
        }

        $(this).wrapInner( "<div class='element'></div>");

        $( this ).prepend("<div class='" + cl1 + "''></div>");

        $( this ).attr('class', cl2);
    });
}

function clickLink(el)
{
    var target = el.attr("target");
    slideContainer($('.'+target));
}

function slideContainer(container)
{
    hideContainer($('.container-selected'));
    setTimeout(function() 
        { 
            $('.container-selected').removeClass('container-selected');
            showContainer(container); 
        }, 2000);
}

function hideContainer(container)
{
    if(container.hasClass('container-left'))
    {
        slideAllLeft(container);
    }
    else if(container.hasClass('container-right'))
    {
        slideAllRight(container);
    }
}

function slideAllLeft(container)
{
    $("[class*='col']", container).each(function() 
    {
        var pos = $(this).position();
        var width = $( document ).width();
        var height = $( document ).height();
        var delay = pos.left/width + pos.top/height;
        slideLeft($(this), width, delay);
    });
}

function slideLeft(el, width, delay)
{
    el.css("transition", "left 0.8s ease-in");
    setTimeout(function() { el.animate({left: '-120%'}); }, 500*delay);
}

function showContainer(container)
{
    container.addClass('container-selected');

    $("[class*='col']", container).each(function() 
    {
        var pos = $(this).position();
        var width = $( document ).width();
        var delay = 0;
        if(container.hasClass('container-left'))
        {
            delay = (width-pos.left)/width        }
        else if(container.hasClass('container-right'))
        {
            delay = 1-(width-pos.left)/width
        }
        slideReset($(this), delay + pos.top/$( document ).height());
    });
}

function slideReset(el, delay)
{
    el.css("transition", "left 0.8s ease-out");
    setTimeout(function() { el.animate({left: '0%'}); }, 500*delay);
}

function slideAllRight(container)
{
    $("[class*='col']", container).each(function() 
    {
        var pos = $(this).position();
        var width = $( document ).width();
        var height = $( document ).height();
        var delay = (width-pos.left)/width + pos.top/height;
        slideRight($(this), width, delay);
    });
}

function slideRight(el, width, delay)
{
    el.css("transition", "left 0.8s ease-in");
    setTimeout(function() { el.animate({left: '150%'}); }, 500*delay);
}