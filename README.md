# thenUse

Define methods, compose chains of methods and partially apply their arguments, and apply a context later on, giving you a function that's perfect and succinct for use as a callback.

var addClass = use('toggleClass').take(1);

addClass to what? Decide later:

$('ul').on('click','li', addClass('toggleClass').$ );

$('ul').on('click','li', function(){ $(this).addClass('toggleClass'); });






