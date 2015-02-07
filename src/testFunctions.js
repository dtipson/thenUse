var $body = $('body'),//let's have this $el cached to avoid retyping
    $header = $('header'),//let's have this $el cached to avoid retyping
    $ul = $('ul'),//let's have this $el cached to avoid retyping
    $table = $('table'),//let's have this $el cached to avoid retyping


    toggleHi = use('toggleClass','hi'),//returns a function that will runs toggleClass 'hi' on whatever it's applied to
    toggleBody = toggleHi.the($('body')),//returns a function that will toggle the class 'hi' on the body
    toggleBody2 = $('body').use(toggleHi),//returns a function using the jQuery plugin that runs toggleHi on the body, expressed differently
    andToggle = toggleHi.thenUse('toggle'),//create a new function to do something extra: toggle hiding or showing something
    addToggleBoolean = andToggle.take(1),//same function as before, but now it takes an argument (a boolean) that controls the toggle. That means addToggleBoolean(true) toggles it on, and addToggleBoolean(false) toggles it off
    toggleClass = use('toggleClass').take(2),//can accept two extra arguments
    red = toggleClass('red'),
    dim = use('css',{opacity:0.3}),//again, creating a set of methods that aren't even bound to anything...
    dimAndSlim = use('delay',1000).thenUse(dim).thenUse('slideUp',2000),
    dimtheHeader = dim.the($('header')),//that we can then apply to something TO create a function that does that to something
    fadeIn = use('fadeIn',4000),
    fadeOutfadeIn = use('fadeOut',4000,fadeIn.$run),
    dimHeaderthenFadeThenDimBody = dimtheHeader.thenUse('delay',5000).thenUse('fadeOut',3000,dim.the($('body'))),// and we can even chain a bunch of things logically, including using a USE as a callback inside the callback definition of another method


    toggleOn = use('toggleClass','on'),
    toggletheClosest = use('closest').take(1).thenUse(toggleOn);
