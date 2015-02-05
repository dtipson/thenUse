(function($){

    /*define the function */
    function use(method /*args*/){
        return use.fn.init.apply({},[Array.prototype.slice.call(arguments)]);
    }

    /*define the underlying prototype*/
    use.fn = use.prototype = {
        init: function(initStack,oldstack){
            var user = function(){
                var context = user.ctx,
                    stackln = user.stack.length,
                    args = arguments;
                    //we need a way to specify that we can take an arg

                if($.isFunction(user.ctx)){
                    context = user.ctx();
                }
                $.each(user.stack,function(i,op){
                    context = context[op[0]].apply(//using the method
                        context,//with our context
                        op[1].concat(//apply the arguments
                            Array.prototype.slice.call(
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
                return use.fn.init.call(ctx||$(this),undefined,user.stack);
            }

            /*this is awful, probably a better way to do all this, but what we need to do is go through the stack, see if any methods accept additional args, add those args, and reduce the number we're still waiting on*/
            function takeArgs(){
                var args = Array.prototype.slice.call(arguments),//args as an array
                    pointer = 0,
                    newstack = user.stack.slice(0);
                $.each(newstack,function(i){//have to use each because jQuery.map flattens arrays, arg!
                    if(newstack[i][2] && newstack[i][2]>0){
                        var newargs = args.slice(pointer,newstack[i][2]);
                        newstack[i][1] = newstack[i][1].concat(newargs); //plus any additional arguments we said this could take, if any
                        newstack[i][2] = newstack[i][2] - newargs.length;
                        pointer = pointer+newstack[i][2];
                    }
                });
                console.log('new stack end',newstack);
                return use.fn.init.apply(user.ctx,[undefined,newstack]);//this is not creating a new context correctly
            }

            $.extend(user,{
                stack : oldstack||[[initStack[0],initStack.slice(1)]],
                ctx : this,
                thenUse: function(method){
                    var args = Array.prototype.slice.call(arguments);//args as an array
                    return use.fn.init.call(user.ctx,undefined,
                        user.stack.concat([[method,args.slice(1)||[]]])
                    );
                },
                take: function(num){
                    this.stack.reverse()[0].push(num);//explain how many arguments the most recently defined method should take
                    return returnUse();
                }
            });

            function returnUse(){
                return (!$.isEmptyObject(user.ctx) && user.ctx[user.stack[0][0]]) || $.isFunction(user.ctx)?
                        user://if we have a context, the function is ready to go
                        $.extend(takeArgs,{//if no context yet, let's return a function that takes just args and returns this user thingy
                            on: setContext,
                            the: setContext,//same as on just works better in some sentences
                            $: function(){
                                return setContext.apply(this)();//when called take our context from the context, guarding against additional arguments, and run the function with that context
                            },
                            thenUse: user.thenUse,
                            take: user.take,
                            stack: user.stack,
                            ctx: user.ctx
                        });
            }
            return returnUse();
        }
    };

    /*define as a jQuery plugin bound to */
    $.fn.use = function(method /*args*/){
        if(method && method.stack && method.stack[0]){
            return use.fn.init.apply(this,[undefined,method.stack]);//steal the stack from some other method & apply it to a new context!
        }else{
            return use.fn.init.apply(this,[Array.prototype.slice.call(arguments)]);
        }
    };

    window.use = use;
}(jQuery));