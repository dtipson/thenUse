# thenUse

Define (jQuery) methods, or chains of (jQuery) methods, partially apply some of their arguments, apply a context later on, get back a function that will do what you wanted later rather than doing it now.  Perfect for one-lining simple callbacks or composing complex chains of behavior without getting overly specific too soon.

---

**use(method /* args...*/)** -> stores the method/arguments, exposes several ways to either turn them into functions, add arguments, or chain on more methods

```
var dim = use('css',{opacity:0.3});

//"dim" now represents the method/arguments and exposes the following methods:
```


**.on(context)/.the(context)** -> specify a context (say, a jQuery collection) and return a _function_ that, when run, will use all the stored methods on it

```
var dim = use('css',{opacity:0.3});

var dimTheBody = use('css',{opacity:0.3}).on($('body'));// returns a function
var dimTheBody = dim.the($('body'));// alternate syntax, same result

var dimTheBody = $('body').use('css',{opacity:0.3});// alternate syntax, same result
var dimTheBody = $('body').use(dim);// alternate syntax, same result
```

**.thenUse(method /* args...*/)** -> chain on another method (same arguments as use, returns the same result, but now has multiple method/arg pairs in the stack). You can also pass in an already created "use" and thenUse will simply copy over and append its entire method stack

```
var dim = use('css',{opacity:0.3}),
    dimAndSlim = use('delay',1000).thenUse(dim).thenUse('slideUp',2000);

dimAndSlim.the($('header'))();// define that function & invoke it right away
//or
$('header').use(dimAndSlim)();// same

```

**.$** -> ingest the context of "this" at runtime, and wrap it in $(), and run it through the method chain.

```
$('ul').on('click','li', dim.$ );
```

Normally, .$ is used without invoking it directly, but if you do call it with functions as arguments, then it will return a function that will, in addition to executing usual method stack, also execute those functions (with the usual context and arguments, such as the jQuery event object).  This allows you to attach multiple named or anonymous functions to an event handler instead of just one.

```
function stopevent(e){
    return e && e.preventDefault && e.preventDefault(); // stop an event
}
function log(){
    console.log.apply(console, Array.prototype.slice.call(arguments, 0));
}

$('ul').on('click','li', dim.$(stopevent,log) );
```

**.take(integer)** -> after each use, .take specifies how many extra arguments the final function can accept, applying them in order

```
var toggleClass = use('toggleClass').take(2);

$('ul').on('click','li', toggleClass('clicked',true).$ );
```

You can also do things the other way around:

**$().use(method /*args...*/)** -> a jQuery plugin that binds the "used" methods to the jQuery collection and then returns the resulting function

```
$('body').use('css',{opacity:0.3}); //returns a function that does this
$('body').use(dim);// also accepts an already defined stack of methods
```


Once we have something that has both some methods and a context that matches those methods (i.e. the method "remove" is defined on the context $('.thing')), use() starts returning a function.

That function, however, _also_ has the above methods, meaning that you can either call it _or_ continue to define further functions by chaining on additional behavior.


-----

##Why Did You Do This?

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

toggle what class? On what? Well, we can just decide all that later:

```
$('ul').on('click','li', toggleClass('foo').$ );
$('ol').on('click','li', toggleClass('bar').$ );
$('td').on('click','li', toggleClass('baz').$ );

toggleClass('zim').on($('body'));
```

Or say we have a $.Deferred/Promise chain that we know returns a string: now instead of creating an anonymous function with an argument "string" or something, we can just use that argument-ingesting toggleClass function to decide what to apply it to:

```
var $thing = $('.thing');

someApi('that-returns-a-string').done( toggleClass.on($thing) );
someApi('that-returns-a-string').done( $thing.use(toggleClass) );//same
```

Right?  We already have some api that returns a string as the first argument, we already have a function that takes a string as its first argument, so why do we need to re-say all that function(string){ doStuffWithString(string); } string stuff?  Just glue the already defined and matching functions together.  The only new information anything here really needed defined for it was what to do what to.

Now, what if we want to define the usage of a bunch of chained jQuery methods and maybe even define which arguments all get passed into them later on? Ok.

```
var toggleClosest = use('closest').take(1).thenUse('toggleClass').take(1);

$('td').on('click','li', toggleClosest('table','baz').$ );
```

Or you can even do lots of stuff, all mashed up and give it a stupid-long name that's also very descriptive and will minifiy down to single character anyhow:

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
```

"redthenFadeThenUnred" is now a thing that will return a function whenever you tell it what you want to do all that to. e.g.

```
var redtheHeaderthenFadeitThenUnred = $('header').use(redthenFadeThenUnred);
redtheHeaderthenFadeitThenUnred();

//or

$('header').use(redthenFadeThenUnred)();// define and run all at once
```

I mean, you could just define named functions for all of this stuff too. They won't be as "composable" necessarily, but they could still be the right way to do things.  It's just nice sometimes to just quickly define some behavior that you want TO have happen, rather than having it happen right away, and the syntax is decently readable as long as it's relatively short.

IDK, you do what you want.  It's 1.1KB, though it could probably be made smaller by a competent golfer.

