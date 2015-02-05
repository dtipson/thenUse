# thenUse

Define methods, compose chains of methods and partially apply their arguments, and apply a context later on, giving you a function that's perfect and succinct for use as a callback.


So, I create a lot of callbacks. And I'm sort of sick of anonymous functions.


    someApi().done(function(){
        $thing.remove();
    }).fail(function(){
        $otherThing.addClass('failed');
    });

So I made a thing that turns it into this:

    someApi().done(
        $thing.use('remove')
    ).fail(
        $otherThing.use('addClass','failed')
    );

So, that can be nice. a bit easier to read, minifies a tiny bit better, whatever.  Same thing with this:

$('ul').on('click','li', function(){ $(this).remove(); });

Another anonymous function. And why am I explicitly specifying $(this) for something this simple? What's with all the () () ()? I'm only trying to do one simple thing here.  So, now I can do this instead:

$('ul').on('click','li', use('remove').$ );

Mildly interesting.

But what if we could partially apply method arguments, but decide to take others at runtime.



var toggleClass = use('toggleClass').take(1);

toggleClass... what? Well can decide that later

$('ul').on('click','li', toggleClass('foo').$ );
$('ol').on('click','li', toggleClass('bar').$ );
$('td').on('click','li', toggleClass('baz').$ );

Or say we have a dfd chain that returns a string, now we can use that function to decide what to apply it to:

someApi('that returns a string class').done( toggleClass.on($thing) );





