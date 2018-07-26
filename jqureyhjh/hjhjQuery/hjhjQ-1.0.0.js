(function (window,undefined) {
    var hjh = function (selector) {
        //jQuery.fn就是jQuery.prototype
        return new hjh.prototype.init(selector);
    };
    hjh.prototype = {
        constructor : hjh,
        init : function (selector) {
            /*
             1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
             2.字符串:
             代码片段:会将创建好的DOM元素存储到jQuery对象中返回
             选择器: 会将找到的所有元素存储到jQuery对象中返回
             3.数组:
             会将数组中存储的元素依次存储到jQuery对象中返回
             4.除上述类型以外的:
             会将传入的数据存储到jQuery对象中返回
            */
            //0.去除空格
            selector = hjh.trimSpace(selector);
            //1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
            if (!selector){
                return this;
            }
            // 2.函数
            else if (hjh.isFunction(selector)){
                hjh.ready(selector)
            }
            //2.字符串:
            else if(hjh.isString(selector)){
                // 2.1 代码片段:会将创建好的DOM元素存储到jQuery对象中返回
                    if(hjh.isHTML(selector)){
                        // 1. 根据代码片段创建出所有代码
                        var temp = document.createElement("div");
                        temp.innerHTML = selector;
                        // // 2. 把创建好的一级元素保存到对象中
                        // let len = temp.children.length;
                        // for (let i = 0;i < len;i++) {
                        //     this[i] = temp.children[i];
                        // }
                        // // 3. 给对象添加length属性
                        // this.length = len;
                        // 通过apply借调方法调用数组的push方法可以替换掉第二和第三步
                        [].push.apply(this,temp.children);
                        // 4. 返回加工好的对象（this)
                        // return this;
                    }
                // 2.2 选择器: 会将找到的所有元素存储到jQuery对象中返回
                    else{
                        var res = document.querySelectorAll(selector);
                        // 1.根据传入的选择器找到所有的dom元素,并将找到的所有dom元素都放到对象里
                        // let len = res.length;
                        // for (let i = 0;i < len;i++) {
                        //     this[i] = res[i];
                        // }
                        // 2. 给对象添加length属性
                        // this.length = len;
                        [].push.apply(this,res);
                        // 3.返回处理好的对象（this)
                        // return this;
                    }
            }
            // 3.数组:
            else if (hjh.isArray(selector)) {
                // // 3.1 真数组
                // if (hjh.isArray(selector,true)){
                //     // 真数组转伪数组
                //     [].push.apply(this,selector);
                //     return this;
                // }else{
                //     // 自定义伪数组转换前都要先转成真数组，再进行转换
                //     var array = [].slice.call(selector);
                //     // 再进行转换
                //     [].push.apply(this,array);
                //     return this;
                // }
                //     会将数组中存储的元素依次存储到jQuery对象中返回
                // 优化后，无论真假数组，全部先转为真数组，再转为伪数组
                var array = [].slice.call(selector);
                [].push.apply(this,array);
                // return this;
            }
            // 4.其他类型
            else {
                this[0] = selector;
                this.length = 1;
                // return this;
            }
            return this;
        },
        // 版本号
        HJH : "1.0.0",
        // 默认选择器，初始值为空
        selector : "",
        // 实例默认的长度，初始值0
        length : 0,
        // 相当于找到数组的方法，将this修改为hjh
        // 相当于 [].push.apply(this)
        push : [].push,
        sort : [].sort,
        splice : [].splice,
        // toArray 将伪数组转为真数组
        toArray : function () {
            return [].slice.call(this)
        },
        // get 调用toArray，不传参数就返回整个真数组，传参就取出下标对应的返回
        get : function (num) {
            //判断没有传参
            if(arguments.length === 0){
                return this.toArray();
            }else if (num >= 0){
                //不是负数，正常取下标
                return this[num];
            } else {
                //是负数，就倒着取
                return this[this.length + num];
            }
        },
        // eq 不传参数就返回空对象，传参数就取出下标对应的返回
        eq : function (num) {
            //判断没有传参
            if(arguments.length === 0){
                return new hjh();
            }else {
                //不是负数，正常取下标
                return hjh(this.get(num));
            }
        },
        // first 相当于调用了eq(0),last 相当于调用eq(-1）
        first : function () {
            return this.eq(0);
        },
        last : function () {
            return this.eq(-1);
        },
        // each 遍历数组和对象，直接调用静态方法
        each : function (callBack) {
            return hjh.each(this,callBack);
        }
    };

    /**
     * 静态方法太多，不利于后期维护
     * 仿照jQuery进行分类整理
     * 用extend :延伸、扩展的意思
     *
     */
    //定义extend静态方法
    hjh.extend = hjh.prototype.extend = function (obj) {
        // 类调用this指向类
        //外部传入对象后通过遍历就可以将对象的键取出来绑定给类上,则键对应的函数方法也就成为了类的静态方法，
        // 对象调用this指向对象
        //外部传入对象后通过遍历就可以将对象的键取出来绑定给对象上,则键对应的函数方法也就成为了对象的实例方法，
        for (var key in obj){
            this[key] = obj[key]
        }
    };
    // 调用extend静态方法
    hjh.extend({
        /**
         * 入口函数，等待页面加载完毕后执行回调函数
         * @param callBack
         */
        ready : function(callBack){
            if (document.readyState === "complete") {
                callBack();
            }else if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded",function () {
                    callBack();
                })
            }else{
                document.attachEvent("onreadystatechange",function () {
                    if (document.readyState === "complete"){
                        callBack();
                    }
                })
            }
        },
        /**
         * 判断是不是函数方法
         * @param val
         * @returns {boolean}
         */
        isFunction : function(val){
        return typeof val === 'function';
    },
        /**
         * 去除字符串两端的空格
         * @param val
         * @returns {*}
         */
        trimSpace : function(val){
            // 不是字符串就原样返回
            if (!hjh.isString(val)) return val;
            // trim去除字符串两端的空格，但是不支持ie低版本
            if (val.trim){
                return val.trim();
            } else{//正则匹配
                return val.replace(/^\s+|\s+$/g,"");
            }
        },
        /**
         * 判断是不是字符串
         * @param val
         * @returns {boolean}
         */
        isString : function(val){
            return typeof val === "string";
        },
        /**
         * 判断是不是对象
         * @param val
         * @returns {boolean}
         */
        isObject : function(val){
            return typeof val === "object";
        },
        /**
         * 判断传入的是不是window
         * @param val
         * @returns {boolean}
         */
        isWindow : function(val){
            return val === window;
        },
        /**
         * 判断是不是字符串是不是HTML代码片段
         * @param val
         * @returns {boolean}
         */
        isHTML : function(val){
            val = hjh.trimSpace(val);
            return val.charAt(0) ==="<" && val.charAt(val.length - 1) === ">" && val.length >= 3;
        },
        /**
         * 判断是不是数组
         * @param val 判断对象
         * @param boole 是否进行真伪数组判断，true会进一步判断真伪数组，false或不传则只判断是不是数组
         * @returns {boolean} 返回布尔值
         */
        isArray : function(val,boole){
            if (boole === true) {
                if (typeof val === "object" && "length" in val && val !== window){
                    return ({}).toString.apply(val) === "[object Array]" && val instanceof Array;
                }else{
                    return false;
                }
            }else{
                return typeof val === "object" && "length" in val && val !== window;
            }
        },
        /**
         * 遍历数组和对象，遍历谁返回谁
         * @param val
         * @param callBack 第一个值是遍历到的index 第二个是遍历到的值
         */
        each : function (val,callBack) {
            //判断是不是数组，无论真假全部用最简单的for进行遍历
            if (hjh.isArray(val)){
                for (var i = 0;i < val.length;i++) {
                    // 将this从window改为遍历到的值，方便操作
                    var temp = callBack.call(val[i],i,val[i]);
                    if (temp == true) {
                        continue;
                    }else if(temp === false){
                        break;
                    }
                }
            }
            // 判断是不是对象，对象用for in 遍历
            else if (hjh.isObject(val)) {
                for (var key in val) {
                    var temp = callBack.call(val[key],key,val[key]);
                    if (temp == true) {
                        continue;
                    }else if(temp === false){
                        break;
                    }
                }
            }
            return val;
        },
        /**
         * 将一个数组中的元素转换到另一个数组中。作为参数的转换函数会为每个数组元素调用
         * @param val 原数组或对象
         * @param callBack 回调函数,可以通过return 向新数组中添加对遍历到的值操作后的值
         * @returns {Array} 返回的新数组
         */
        map : function (val,callBack) {
            var res = [];
            //判断是不是数组，无论真假全部用最简单的for进行遍历
            if (hjh.isArray(val)){
                for (var i = 0;i < val.length;i++) {
                    var temp = callBack(val[i],i);
                    temp && res.push(temp);
                }
            }
            // 判断是不是对象，对象用for in 遍历
            else if (hjh.isObject(val)) {
                for (var key in val) {
                    var temp = callBack(val[key],key);
                    temp && res.push(temp);
                }
            }
            // 默认返回空数组
            return res;
        }
    });
    // 动态添加对象方法，调用hjh.prototype.extend（），传入对象
    hjh.prototype.extend({
        /**
         * empty ==> 清空指定元素中的所有内容
         * @returns {empty}
         */
        empty : function () {
            // 遍历所有找到的元素
            this.each(function () {
                // this指向已经被修改为遍历到的元素
                this.innerHTML = "";
            });
            // 谁调用返回谁,方便进行链式编程
            return this;
        },
        /**
         * remove 方法，删除指定元素和指定元素下的所有内容和子元素
         * @param sele 选择器，在指定元素中找到符合选择器的删掉
         * @returns {remove} 返回被删除的元素
         */
        remove : function (sele) {
            //判断是否传入指定元素的参数
            if (arguments.length === 0){
                // 没有指定元素的参数
                // 遍历所有找到的元素
                this.each(function (key,value) {
                    // js 中只能通过父元素删除子元素，是不能自杀的
                    // 先找到子元素对应的父元素
                    var parent = value.parentNode;
                    // 调用父元素的removeChild方法
                    parent.removeChild(value);
                });
            } else {
                var $this = this;
                // 根据传入的指定元素的参数，找到所有指定元素
                hjh(sele).each(function (key,value) {
                    // 遍历找到的指定元素获取其类型，通过tagName属性
                    var typeOne = value.tagName;
                    // 遍历调用的对象里的元素
                    $this.each(function (k,v) {
                        // 获得其类型
                        var typeTwo = v.tagName;
                        // 判断两种类型是否相等，相等就删掉
                        if (typeOne === typeTwo){
                            var parent = value.parentNode;
                            parent && parent.removeChild(value);
                        }
                    })
                })
            }
            // 返回被删除的元素
            return this;
        },
        /**
         * html 替换找到的所有指定元素的html内容，识别标签
         * @param content 替换内容
         * @returns {*} 所有被替换的元素
         */
        html : function (content) {
            if (arguments.length === 0){
                //不传参就返回第一个元素的innerHTML
                return this[0].innerHTML;
            }else{
                // 遍历所有将元素内容替换为传入的参数
                this.each(function () {
                    this.innerHTML = content;
                });
                // 返回修改的所有元素
                return this;
            }
        },
        /**
         * text 替换找到的所有指定元素的text内容，不识别标签
         * @param content 替换内容
         * @returns {*} 所有被替换的元素
         */
        text : function (content) {
            if (arguments.length === 0){
                //不传参就返回所有元素的innerText
                var str = "";
                this.each(function () {
                    str += this.innerText;
                });
                return str;
            }else{
                // 遍历所有将元素内容替换为传入的参数
                this.each(function () {
                    this.innerText = content;
                });
                // 返回修改的所有元素
                return this;
            }
        },
        /**
         * 将元素添加到指定元素内部的后面
         * @param sele 指定元素
         * @returns {*} 返回所有添加的元素
         */
        appendTo : function (sele) {
            // 将传入的数据转为hjh对象
            var hjhTarget = hjh(sele);
            var hjhThis = this;
            var res = [];
            // 遍历所有指定元素
            hjh.each(hjhTarget,function (key,value) {
                // 遍历要传入的元素
                hjh.each(hjhThis,function (k,v) {
                    // 判断是不是第0个要被传入的元素
                    if (key === 0){
                        // 直接传到最后面
                        value.appendChild(v);
                        res.push(v);
                    } else{
                        // 先克隆再添加
                        var temp = v.cloneNode(true);
                        value.appendChild(temp);
                        res.push(temp);
                    }
                })
            });
            return hjh(res);
        },
        /**
         * 将元素添加到指定元素内部的最前面
         * @param sele 指定元素
         * @returns {*} 返回所有添加的元素
         */
        prependTo : function (sele) {
            // 将传入的数据转为hjh对象
            var hjhTarget = hjh(sele);
            var hjhThis = this;
            var res = [];
            // 遍历所有指定元素
            hjh.each(hjhTarget,function (key,value) {
                // 遍历要传入的元素
                hjh.each(hjhThis,function (k,v) {
                    // 判断是不是第0个要被传入的元素
                    if (key === 0){
                        // 直接传到最后面
                        value.insertBefore(v,value.firstChild);
                        res.push(v);
                    } else{
                        // 先克隆再添加
                        var temp = v.cloneNode(true);
                        value.insertBefore(temp,value.firstChild);;
                        res.push(temp);
                    }
                })
            });
            return hjh(res);
        },
        /**
         * append 给元素内部后面添加
         * @param sele 要添加的内容
         * @returns {append} 返回调用的元素
         */
        append :function (sele) {
            // 如果是字符串，直接添加到元素内部的后面
            if (hjh.isString(sele)){
                this.each(function () {
                    this.innerHTML += sele;
                })
            }
            else{
                hjh(sele).appendTo(this);
            }
            return this;
        },
        /**
         * prepend 给元素内部前面添加
         * @param sele 要添加的内容
         * @returns {append} 返回调用的元素
         */
        prepend :function (sele) {
            // 如果是字符串，直接添加到元素内部的后面
            if (hjh.isString(sele)){
                this.each(function () {
                    // 放在最前面
                    this.innerHTML = sele + this.innerHTML;
                })
            }
            else{
                hjh(sele).prependTo(this);
            }
            return this;
        },
        /**
         * prepend 元素.insertBefore.指定元素  ==>将元素添加到指定元素外部的前面
         * @param sele 要添加的内容
         * @returns {append} 返回调用的元素
         */
        insertBefore : function (sele) {
            // 获取父元素
            var parent = sele.get(0).parentNode;
            var hjhThis = this;
            var res = [];
            // 遍历所有指定元素
            hjh.each(sele,function (key,value) {
                // 遍历要传入的元素
                hjh.each(hjhThis,function (k,v) {
                    // 判断是不是第0个要被传入的元素
                    if (key === 0){
                        // 直接传到最后面
                        parent.insertBefore(v,value);
                        res.push(v);
                    } else{
                        // 先克隆再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp,value);;
                        res.push(temp);
                    }
                })
            });
            return hjh(res);
        },
        /**
         *  指定元素.before.元素  ==>将元素添加到指定元素外部的前面
         * @param sele 元素
         * @returns {before} 返回所有指定元素
         */
        before : function (sele) {
            sele.insertBefore(this);
            return this;
        }
    });

    hjh.prototype.init.prototype = hjh.prototype;
    window.hjh = window.HJH = window.hjH = window.hJh = window.Hjh = window.h = hjh;
})(window);