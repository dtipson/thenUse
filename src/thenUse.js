(function($){

    var arslice = Function.prototype.call.bind( Array.prototype.slice );
    /*define the function */
    function use(method /*args*/){
        return method && method.s && method.s[0]?
            method://guard against weird thing of passing a use into a use
            use.fn.init.apply({},[arslice(arguments)]);
    }

    /*define the underlying prototype*/
    use.fn = use.prototype = {
        init: function(inits,olds){
            var user = function(){
                var context = user.c,
                    sln = user.s.length,
                    args = arguments;
                    //we need a way to specify that we can take an arg

                if($.isFunction(user.c)){
                    context = user.c();
                }
                $.each(user.s,function(i,op){
                    context = context[op[0]].apply(//using the method
                        context,//with our context
                        op[1].concat(//apply the arguments
                            arslice(
                                args,
                                0,
                                op[2]||0//plus any additional arguments we said this could take, if any
                            )
                        )
                    );
                });
                return context;
            };

            function setContext(c){
                return use.fn.init.call(c||$(this),undefined,user.s);
            }

            /*this is awful, probably a better way to do all this, but what we need to do is go through the stack, see if any methods still accept any additional args, add those args, and reduce the number we're still waiting on and return a _new_ function*/
            function takeArgs(){
                var args = arslice(arguments),//args as an array
                    pointer = 0,
                    news = $.extend(true,[],user.s);//true copy
                $.each(news,function(i){//have to use each because jQuery's.map flattens arrays, arg!
                    if(news[i][2] && news[i][2]>0){
                        var newargs = args.slice(pointer,news[i][2]);
                        news[i][1] = news[i][1].concat(newargs); //plus any additional arguments we said this could take, if any
                        news[i][2] = news[i][2] - newargs.length;
                        pointer = pointer+news[i][2];
                    }
                });
                return use.fn.init.apply(user.c,[undefined,news]);//still overwriting things somehow
            }

            $.extend(user,{
                s : olds||[[inits[0],inits.slice(1)]],
                c : this,
                thenUse: function(method){
                    var args = arslice(arguments);//args as an array
                    return use.fn.init.call(
                        user.c,//retain old context if any
                        undefined,//adding not initing
                        user.s.concat(
                            method && method.s && method.s[0]?
                                method.s://add a stack from existing "use"
                                [[method,args.slice(1)||[]]]//or add new methods
                        )
                    );
                },
                take: function(num){
                    this.s.reverse()[0].push(num);//explain how many arguments the most recently defined method should take
                    return returnUse();
                }
            });

            function returnUse(){
                return (!$.isEmptyObject(user.c) && user.c[user.s[0][0]]) || $.isFunction(user.c)?
                        user://if we have a context, the function is ready to go
                        $.extend(takeArgs,{//if no context yet, let's return a function that takes just args and returns this user thingy
                            on: setContext,
                            the: setContext,//same as on just works better in some sentences
                            $: function(/**/){
                                var funcs = arslice(arguments);
                                return !funcs.length || !$.isFunction(funcs[0])?//e or any context vs. funclist
                                    setContext.apply(this)()://when called take our context from the calling context, guarding against additional arguments, and run the function with that context
                                    function(/*e*/){
                                        var args2 = arslice(arguments),
                                            self = this;
                                        $.each(funcs,function(i,func){
                                            //call any functions passed to .$ with the event arguments
                                            return $.isFunction(func) && func.apply(self,args2);
                                        });
                                        return setContext.apply(this)();
                                    };
                            },
                            thenUse: user.thenUse,
                            take: user.take,
                            s: user.s,
                            c: user.c
                        });
            }
            return returnUse();
        }
    };

    /*define as a jQuery plugin bound to */
    $.fn.use = function(method /*args*/){
        if(method && method.s && method.s[0]){
            return use.fn.init.apply(this,[undefined,method.s]);//steal the stack from some other method & apply it to a new context!
        }else{
            return use.fn.init.apply(this,[arslice(arguments)]);
        }
    };

    window.use = use;
}(jQuery));