# thenUse

Define methods, or chains of methods, partially apply some of their arguments, apply a context later on, get back a function that will do what you wanted later rather than doing it now.  Perfect one-line simple callbacks or compose complex chains.


So, I create a lot of callback functions. A lot of them are just anonymous wrappers around other functions, which seems really busy and really silly sometimes.

```
someApi().done(function(){
    $thing.remove();
}).fail(function(){
    $otherThing.addClass('failed');
});
```

And you know, .remove() is just a function, it doesn't even take any arguments.  And .done() is a thing that fires functions you put into it. So why can't I just do something like:

```
someApi().done( $('thing').remove );
```

Well, lots of reasons, lots of really interesting reasons. So I made a little jQuery plugin/library that gets as close as I could get to that:

```
someApi().done(
    $thing.use('remove')
).fail(
    $otherThing.use('addClass','failed')
);
```

Or you know, maybe like this, depending on what context makes sense:

```
var remove = use('remove');

someApi().done(
    remove.the($thing)
).fail(
    remove.the($otherThing)
);
```

So, that can be nice sometimes. A bit easier to read, minifies a tiny bit better, whatever.  Same thing with this:

```
$('ul').on('click','li', function(){ $(this).remove(); });
```

Another anonymous function. And why am I explicitly specifying $(this) for something so simple? What's with all the () () ()? It looks like a really lousy emjoi. So, now I can do this instead:

```
$('ul').on('click','li', use('remove').$ );
```

or

```
var removeSelf = use('remove').$;

$('ul').on('click','li', removeSelf );
```

Mildly interesting.  Instead of doing something, use is returning a function, or at least something that can become a function once it has a calling context.

When used with jQuery, it's basically like, backwards.  You can define the methods before you decide what apply it to. use('fadeOut').on($('body')) Well, sometimes. You can also do $('body').use('remove').  The real difference is just that in these cases, instead of doing something, it's returning a function that _WILL_ do it when it's called.

But what if we could partially apply some method arguments, but decide to take others at runtime?

```
var toggleClass = use('toggleClass').take(1);
```

toggleClass... what? Well can decide that later:

```
$('ul').on('click','li', toggleClass('foo').$ );
$('ol').on('click','li', toggleClass('bar').$ );
$('td').on('click','li', toggleClass('baz').$ );

toggleClass('zim').on($('body'));

```

Or say we have a dfd chain that returns a string, now we can use that function to decide what to apply it to:

```
var $thing = $('.thing');

someApi('that-returns-a-string').done( toggleClass.on($thing) );
someApi('that-returns-a-string').done( $thing.use(toggleClass) );//same
```

Right?  We already have some api that returns a string argument, we already have a function that takes a string argument, so why do we need to re-say all that stuff?  Just hook them together.  Tell it what to do to what.

Also, what if we want to define the usage of a bunch of chained jQuery methods and maybe even define which arguments get passed into them later on? Ok.

```
var toggleClosest = use('closest').take(1).thenUse('toggleClass').take(1);

$('td').on('click','li', toggleClosest('table','baz').$ );
```

Or even do lots of stuff all mashed up:

```
var red = use('toggleClass','red'),
    redtheHeaderthenFadeitThenUnred = $('header')
        .use(red)
        .thenUse('delay',2000)
        .thenUse('fadeTo',3000, 0.4, red.$ );

//now redtheHeaderthenFadeitThenUnred is a function that does all that to the header

redtheHeaderthenFadeitThenUnred();
```

Or expressed/used in a slightly different way...

```
var red = use('toggleClass','red'),
    redthenFadeThenUnred = red.thenUse('delay',2000)
        .thenUse('fadeTo',3000, 0.4, red.$ );

$('header').use(redthenFadeThenUnred)();//extra parentheses = actually run the function now

```

I mean, you could just define functions for all of this stuff too, though they won't be as "composable."  It's nice sometimes to just define some behavior that you want TO have happen, rather than having it happen right away.

IDK, you do what you want.

