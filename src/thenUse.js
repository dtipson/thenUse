(function($){

    var arslice = Function.prototype.call.bind( Array.prototype.slice );
    /*define the function */
    function use(method /*args*/){
        return use.fn.init.apply({},[arslice(arguments)]);
    }

    /*define the underlying prototype*/
    use.fn = use.prototype = {
        init: function(inits,olds){
            var user = function(){
                var context = user.ctx,
                    sln = user.s.length,
                    args = arguments;
                    //we need a way to specify that we can take an arg

                if($.isFunction(user.ctx)){
                    context = user.ctx();
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

            function setContext(ctx){
                return use.fn.init.call(ctx||$(this),undefined,user.s);
            }

            /*this is awful, probably a better way to do all this, but what we need to do is go through the s, see if any methods accept additional args, add those args, and reduce the number we're still waiting on*/
            function takeArgs(){
                var args = arslice(arguments),//args as an array
                    pointer = 0,
                    news = user.s.slice(0);
                $.each(news,function(i){//have to use each because jQuery.map flattens arrays, arg!
                    if(news[i][2] && news[i][2]>0){
                        var newargs = args.slice(pointer,news[i][2]);
                        news[i][1] = news[i][1].concat(newargs); //plus any additional arguments we said this could take, if any
                        news[i][2] = news[i][2] - newargs.length;
                        pointer = pointer+news[i][2];
                    }
                });
                return use.fn.init.apply(user.ctx,[undefined,news]);//this is not creating a new context correctly
            }

            $.extend(user,{
                s : olds||[[inits[0],inits.slice(1)]],
                ctx : this,
                thenUse: function(method){
                    var args = arslice(arguments);//args as an array
                    return use.fn.init.call(user.ctx,undefined,
                        user.s.concat([[method,args.slice(1)||[]]])
                    );
                },
                take: function(num){
                    this.s.reverse()[0].push(num);//explain how many arguments the most recently defined method should take
                    return returnUse();
                }
            });

            function returnUse(){
                return (!$.isEmptyObject(user.ctx) && user.ctx[user.s[0][0]]) || $.isFunction(user.ctx)?
                        user://if we have a context, the function is ready to go
                        $.extend(takeArgs,{//if no context yet, let's return a function that takes just args and returns this user thingy
                            on: setContext,
                            the: setContext,//same as on just works better in some sentences
                            $: function(){
                                return setContext.apply(this)();//when called take our context from the context, guarding against additional arguments, and run the function with that context
                            },
                            thenUse: user.thenUse,
                            take: user.take,
                            s: user.s,
                            ctx: user.ctx
                        });
            }
            return returnUse();
        }
    };

    /*define as a jQuery plugin bound to */
    $.fn.use = function(method /*args*/){
        if(method && method.s && method.s[0]){
            return use.fn.init.apply(this,[undefined,method.s]);//steal the s from some other method & apply it to a new context!
        }else{
            return use.fn.init.apply(this,[arslice(arguments)]);
        }
    };

    window.use = use;
}(jQuery));