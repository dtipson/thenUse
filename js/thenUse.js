!function(n){function t(n){return n&&n.s&&n.s[0]?n:t.fn.init.apply({},[i(arguments)])}var i=Function.prototype.call.bind(Array.prototype.slice);t.fn=t.prototype={init:function(e,s){function c(i){return t.fn.init.call(i||n(this),void 0,a.s)}function r(){var e=i(arguments),s=0,c=n.extend(!0,[],a.s);return n.each(c,function(n){if(c[n][2]&&c[n][2]>0){var t=e.slice(s,c[n][2]);c[n][1]=c[n][1].concat(t),c[n][2]=c[n][2]-t.length,s+=c[n][2]}}),t.fn.init.apply(a.c,[void 0,c])}function u(){return!n.isEmptyObject(a.c)&&a.c[a.s[0][0]]||n.isFunction(a.c)?a:n.extend(r,{on:c,the:c,$:function(){var t=i(arguments);return t.length&&n.isFunction(t[0])?function(){var e=i(arguments),s=this;return n.each(t,function(t,i){return n.isFunction(i)&&i.apply(s,e)}),c.apply(this)()}:c.apply(this)()},thenUse:a.thenUse,take:a.take,s:a.s,c:a.c})}var a=function(){var t=a.c,e=(a.s.length,arguments);return n.isFunction(a.c)&&(t=a.c()),n.each(a.s,function(n,s){t=t[s[0]].apply(t,s[1].concat(i(e,0,s[2]||0)))}),t};return n.extend(a,{s:s||[[e[0],e.slice(1)]],c:this,thenUse:function(n){var e=i(arguments);return t.fn.init.call(a.c,void 0,a.s.concat(n&&n.s&&n.s[0]?n.s:[[n,e.slice(1)||[]]]))},take:function(n){return this.s.reverse()[0].push(n),u()}}),u()}},n.fn.use=function(n){return n&&n.s&&n.s[0]?t.fn.init.apply(this,[void 0,n.s]):t.fn.init.apply(this,[i(arguments)])},window.use=t}(jQuery);