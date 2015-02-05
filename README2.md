

```
someApi().done(function(){
    $thing.remove();
}).fail(function(){
    $otherThing.addClass('failed');
});
```














```
someApi().done( $('thing').remove );
```







```
someApi().done( $('thing').remove() );//so dumb
```








```
someApi().done(
    $thing.use('remove')
).fail(
    $otherThing.use('addClass','failed')
);
```
















```
var remove = use('remove');

someApi().done(
    remove.the($thing)
).fail(
    remove.the($otherThing)
);
```













```
$('ul').on('click','li', function(){ $(this).remove(); });
```










```
$('ul').on('click','li', use('remove').$ );
```











```
var removeSelf = use('remove').$;

$('ul').on('click','li', removeSelf );
```











```
var toggleClass = use('toggleClass').take(1);
```














```
$('ul').on('click','li', toggleClass('foo').$ );
$('ol').on('click','li', toggleClass('bar').$ );
$('td').on('click','li', toggleClass('baz').$ );

toggleClass('zim').on($('body'));

```












```
var $thing = $('.thing');

someApi('that-returns-a-string').done( toggleClass.on($thing) );
someApi('that-returns-a-string').done( $thing.use(toggleClass) );//same
```












```
var toggleClosest = use('closest').take(1).thenUse('toggleClass').take(1);

$('td').on('click','li', toggleClosest('table','baz').$ );
```











```
var red = use('toggleClass','red'),
    redthenFadeThen = $('header')
        .use(red)
        .thenUse('delay',2000)
        .thenUse('fadeTo',3000, 0.4, red.$ );

//and now redthenFadeThen is a function that does all that

```



