/**
 * Created by Administrator on 2018/10/27.
 */
var $$ = function () {
    this.init();
};

$$.prototype = {
    init:function () {
        this.fnExtend();
        this.strExtend();
        this.arrayExtend();
        this.DateExtend();
        this.numExtend();
    },
    //函数扩展
    fnExtend:function (){
        //给函数扩展方法
        Function.prototype.before = function( func ) {
            var __self = this;
            return function() {
                if ( func.apply( this, arguments ) === false ) {
                    return false;
                }
                return __self.apply( this, arguments );
            }
        };
        Function.prototype.after = function( func ) {
            var __self = this;
            return function() {
                var ret = __self.apply( this, arguments );
                if( ret === false) {
                    return false;
                }
                func.apply( this, arguments );
                return ret;
            }
        }
    },
    //函数扩展
    strExtend:function(){},
    //函数扩展
    arrayExtend:function(){},
    //函数扩展
    DateExtend:function(){},
    //函数扩展
    numExtend:function(){},
    //去除左边空格
    ltrim:function (str) {
        return str.replace(/(^\s*)/g,"");
    },
    //去除右边空格
    rtrim:function (str) {
        return str.replace(/(\s*$)/g,"")
    },
    //去除空格
    trim:function (str) {
        return str.replace(/(^\s*)|(\s*$)/g,"")
    },
    //封装ajax
    myAjax:function (url,fn) {
        var xhr = createXHR();
        // 请求数据
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                if(xhr.status >=200 && xhr.status<300 || xhr.status == 304){
                    fn(xhr.responseText);
                }
                else{
                    alert("Request was unsuccessful"+xhr.status);
                }
            }
        };
        xhr.open("get",url,true);
        xhr.send(null);
        //创建XHR
        function createXHR() {
            if(typeof(XMLHttpRequest) !=undefined){
                return new XMLHttpRequest()
            }
            else if(typeof(ActiveXObject)!= undefined){
                if(typeof(arguments.callee.activeXString!="string")){
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                        "MSXML2.XMLHttp"
                    ],i,len;
                    for(i = 0;i<versions.length;i++){
                        try{
                            var xhr = new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            return xhr;
                        }catch(ex){
                            // 跳过
                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }
            else{
                throw new Error("No XHR object available")
            }
        }
    },
    //自定义数据绑定
    formateString:function (str,data) {
        return str.replace(/@\((\w+)\)/g,function (match,key) {
            return typeof data[key] === "undefined" ? "" : data[key];
        })
    },
    //给一个对象扩充功能
    extendMany:function() {
        var key,i = 0,len = arguments.length,target = null,copy;
        console.log(len)
        if(len === 0){
            return;
        }else if(len === 1){
            target = this;
        }else{
            i++;
            target = arguments[0];
        }
        for(; i < len; i++){
            for(key in arguments[i]){
                copy = arguments[i][key];
                target[key] = copy;
            }
        }
        return target;
    },
    //扩展事件
    extend:function (tar,source) {
        for(var i in source){
            //tar自定义属性i
            tar[i] = source[i];
        }
        return tar;//这里讲所有的事件都扩展到tar对象当中
    },
    //随机数
    random:function (begin,end) {
        return Math.floor(Math.random()*(end - begin))+begin;
    },
    isString : function (val) {
        return typeof val === "string";
    },
    isNumber : function (val) {
        return typeof val === "number" && isFinite(val);
    },
    isBoolean:function (val) {
        return typeof val ==="boolean";
    },
    isNull:function (val){
        return  val === null;
    },
    isUndefined:function (val) {
        return typeof val === "undefined";
    },

    isObj:function (obj) {
        if (obj === null || typeof obj === 'undefined') {
            return false;
        }
        return typeof obj === "object";
    },
    // 数组都是既是Object类型，也是Array
    isArray:function (arr) {
        if(arr === null || typeof arr === 'undefined'){
            return false;
        }
        return arr.constructor === Array;
    }

};

$$ = new $$();


//给函数添加一个prototype属性，这个属性是个对象用来包含所有实例共享的属性和方法
$$.extend($$,{
    //绑定事件
    on: function (type,id,fn) {
        var dom = $$.isString(id) ? document.getElementById(id) : id;
        try{
            if(dom.addEventListener){
                dom.addEventListener(type,fn,false);
            }
            else if(dom.attachEvent){
                dom.attachEvent("on"+type,fn);
            }
            else{
                dom["on"+type] = fn;
            }
        }
        catch(e){
            console.log(e)
        }

    },
    // 解绑事件
    off:function (type,dom,fn) {
        if(dom.removeEventListener){
            dom.removeEventListener(type,fn,false);
        }
        else if(dom.detachEvent){
            dom.detachEvent("on"+type,fn);
        }
        else{
            dom["on"+type] = null;
        }
    },
    //鼠标点击
    click:function (id,fn) {
        this.on("click",id,fn);
    },
    //鼠标经过
    mouseover:function (id,fn) {
        this.on("mouseover",id,fn);
    },
    //鼠标离开
    mouseout:function (id,fn) {
        this.on("mouseout",id,fn);
    },
    //hover封装
    hover:function (id,fn1,fn2) {
        if(fn1){
            this.on("mouseover",id,fn1)
        }
        if(fn2){
            this.on("mouseout",id,fn2)
        }
    },

    //封装事件基础
    getEvent:function (event) {
        return event || window.event;
    },
    //获得目标
    getTarget:function (event) {
        var e = $$.getEvent(event);
        return e.target || e.srcElement;
    },
    //阻止默认行为
    preventDefault:function (event) {
        var event = $$.getEvent(event);
        if(event.preventDefault){
            event.preventDefault();
        }
        else{
            event.returnValue = true;
        }
    },
    //阻止冒泡
    stopPropagation:function(event){
        var event = $$.getEvent(event);
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    },
    
    //delegate事件委托
    delegate:function (parentId, type, selector, fn) {
        var parent= $$.$id(parentId);
        function handle(e) {
            //关键就是获取事件目标对象
            var target = $$.getTarget(e);
            if(target.nodeName.toLowerCase() == selector || target.className.indexOf(selector)!= -1 || target.id == selector){
                fn.call(target);
            }
        }
        $$.on(type,parentId,handle);
    }
});

//给$$扩展简单dom操作
$$.extend($$,{
    css:function (id,key,value) {
        $$.$id(id).style[key] = value;
    },
    attr:function (id,key,value) {
        $$.$id(id)[key] = value;
    },
    html:function (id,html) {
        $$.$id(id).innerHTML = html;
    }
});

$$.extend($$,{
    //获取id
    $id:function(id){
        return document.getElementById(id);
    },
    //获取tag
    $tag:function (tag,context) {
        if(typeof context === "string"){
            context = $$.$id(context);
        }
        if(context){
            return context.getElementsByTagName(tag);
        }
        return document.getElementsByTagName(tag);
    },
    //获取class
    $class:function (classname,id) {
        var elements = new Array();
        var dom = $$.isString(id) ? document.getElementById(id) : document;
        if(dom.getElementsByClassName){
            return dom.getElementsByClassName(classname);
        }
        else{
            var all = dom.getElementsByTagName("*");
            for(var i = 0; i< all.length;i++){
                if(all[i].className && all[i].className == classname){
                    elements.push(all[i]);
                }
            }
            return elements;
        }
    },
    //组合选择器
    $group:function (str){
        var Arr = [];
        var arr = str.split(",");
        for(var i = 0;i<arr.length;i++){
            var arr_trim = $$.trim(arr[i]);
            var first = arr_trim.charAt(0);
            //class属性
            if(first === "."){
                var index = arr_trim.indexOf(".");
                //返回的是符合条件对象的数组,需要将其遍历
                var classObj = $$.$class(arr_trim.slice(index+1));
                pushArray(classObj);
            }
            //id属性
            else if(first === "#"){
                var index = arr_trim.indexOf("#");
                //返回的是一个对象,可以直接将他包装成数组
                var idObj= [$$.$id(arr_trim.slice(index+1))];
                pushArray(idObj);
            }
            //剩余的就是tag了
            else{
                var tagObj = $$.$tag(arr_trim);
                pushArray(tagObj);
            }
        }
        return Arr;
        //公众部分封装
        function pushArray(obj) {
            for(var j = 0;j<obj.length;j++){
                Arr.push(obj[j])
            }
        }
    },
    //层次选择器
    $cengci:function (str){
        var result = [];
        var context = [];
        var arr = $$.trim(str).split(" ");
        for(var i = 0;i<arr.length;i++){
            //每次循环清空result，当每次循环找到目标对象后，将返回值传递给context
            //context便用来下一次循环查找。依次更新迭代。
            var result = [];
            var arr_trim = $$.trim(arr[i]);
            var first = arr_trim.charAt(0);
            //class属性
            if(first === "."){
                var index = arr_trim.indexOf(".");
                //符合条件的类name
                var name = arr_trim.slice(index+1);
                getClassName(name,context);
                context = result;
            }
            //id属性
            else if(first === "#"){
                var index = arr_trim.indexOf("#");
                var name = arr_trim.slice(index+1);
                getIdName(name);
                context = result;
            }
            //剩余的就是tag了
            else{
                // console.log(arr_trim)
                var name = arr_trim;
                getTagName(name,context);
                context = result;
            }
        }
        return context;
        //获取符合条件的类对象
        function getClassName(name,context) {
            if(context.length){
                for(var i = 0;i<context.length;i++){
                    var classObj = $$.$class(name,context[i]);
                    pushArray(classObj);
                }
            }
            else{
                pushArray($$.$class(name));
            }
        }
        //获取符合条件的id对象
        function getIdName(name) {
            pushArray([$$.$id(name)]);
        }
        //获取符合条件的标签对象
        function getTagName(name,context) {
            if(context.length){
                for(var i = 0;i<context.length;i++){
                    var classObj = $$.$tag(name,context[i]);
                    pushArray(classObj);
                }
            }
            else{
                pushArray($$.$tag(name));
            }
        }

        //公众部分封装
        function pushArray(obj) {
            for(var j = 0;j<obj.length;j++){
                result.push(obj[j])
            }
        }
    },
    //组合加层次选择器
    $select:function (str) {
        var Arr = [];
        var arr = str.split(",");
        for(var i = 0;i<arr.length;i++){
            var result = $$.$cengci(arr[i]);
            pushArray(result);
        }
        return Arr;
        function pushArray(result) {
            for(var i = 0;i<result.length;i++){
                Arr.push(result[i]);
            }
        }
    },
    //html5实现的选择器
    $all:function(selector,context){
        context = context || document;
        return  context.querySelectorAll(selector);
    }
});
//CSS框架封装
$$.extend($$,{
    css: function (selector, key, value) {
        //sel 可能是一个对象，也可能是一个数组
        var sel = $$.isString(selector) ? $$.$cengci(selector) : selector;
        if(sel.length){
            if(value){
                for(var i = 0;i<sel.length;i++){
                    setStyle(sel[i],key,value)
                }
            }
            else{ //这么多对象，我只要第一个的
                return getStyle(sel[0],key);
            }
        }
        else{
            if(value){
                setStyle(sel,key,value)
            }
            else{
                return getStyle(sel,key);
            }
        }
        //设置属性
        function setStyle(sel,key,value) {
            sel.style[key] = value;
        }
        //获取属性
        function getStyle(sel,key) {
            if(sel.currentStyle){
                return sel.currentStyle[key];
            }
            else{
                return getComputedStyle(sel,null)[key]
            }
        }
    },
    show:function (sel) {
        var sels = $$.$all(sel);
        for(var i = 0; i<sels.length;i++){
            $$.css(sels[i],"display","block");
        }
    },
    hide:function(sel) {
        var sels = $$.$all(sel);
        for(var i = 0; i<sels.length;i++){
            $$.css(sels[i],"display","none");
        }
    },
    //元素高度宽度概述
    //计算方式：clientHeight clientWidth innerWidth innerHeight
    //元素的实际高度+border，也不包含滚动条
    Width:function (id){
        return $$.$id(id).clientWidth
    },
    Height:function (id){
        return $$.$id(id).clientHeight
    },
    
    //元素的滚动高度和宽度
    //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
    //计算方式 scrollwidth
    scrollWidth:function (id){
        return $$.$id(id).scrollWidth
    },
    scrollHeight:function (id){
        return $$.$id(id).scrollHeight
    },
    //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
    //计算方式 scrollTop scrollLeft
    scrollTop:function (id){
        return $$.$id(id).scrollTop
    },
    scrollLeft:function (id){
        return $$.$id(id).scrollLeft
    },
    //获取屏幕的高度和宽度
    screenHeight:function (){
        return  window.screen.height
    },
    screenWidth:function (){
        return  window.screen.width
    },
    //文档视口的高度和宽度
    wWidth:function (){
        return document.documentElement.clientWidth
    },
    wHeight:function (){
        return document.documentElement.clientHeight
    },
    //文档滚动区域的整体的高和宽
    wScrollHeight:function () {
        return document.body.scrollHeight
    },
    wScrollWidth:function () {
        return document.body.scrollWidth
    },
    //获取滚动条相对于其顶部的偏移
    wScrollTop:function () {
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop
    },
    //获取滚动条相对于其左边的偏移
    wScrollLeft:function () {
        var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
        return scrollLeft
    },
    //获取坐标值
    offset:function (id){
        //获取元素的坐标值
        function offsetLeft(dom){
            return dom.offsetLeft
        }
        function offsetTop(dom){
            return dom.offsetTop
        }

        var dom = $$.$id(id);
        return {top:offsetTop(dom),left:offsetLeft(dom)}
    },
    //获取absolute
    absolute:function (id) {
        var dom = $$.$id(id);
        var left = offset(id).left;
        var top = offset(id).top;
        var parent = dom.offsetParent;
        while(parent != null){
            left+=parent.offsetLeft;
            top+=parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {left:left,top:top}
    },
});
//属性选择器的封装
$$.extend($$,{
    $attr:function (selector, key, value) {
        //sel 可能是一个对象，也可能是一个数组
        var sel = $$.isString(selector) ? $$.$cengci(selector) : selector;
        if(sel.length){
            if(value){
                for(var i = 0;i<sel.length;i++){
                    setAttr(sel[i],key,value)
                }
            }
            else{ //这么多对象，我只要第一个的
                return getAttr(sel[0],key);
            }
        }
        else{
            if(value){
                setAttr(sel,key,value)
            }
            else{
                return getAttr(sel,key);
            }
        }
        //设置属性
        function setAttr(sel,key,value) {
            sel.setAttribute(key,value);
        }
        //获取属性
        function getAttr(sel,key) {
            return sel.getAttribute(key);
        }
    },
    //动态添加和移除class
    addClass:function (context, name){
        var doms = $$.$all(context);
        //如果获取的是集合
        if(doms.length){
            for(var i= 0,len=doms.length;i<len;i++){
                addName(doms[i]);
            }
            //如果获取的不是集合
        }else{
            addName(doms);
        }
        function addName(dom){
            dom.className = dom.className + ' ' + name;
        }
    },
    removeClass:function (context, name){
        var doms = $$.$all(context);
        if(doms.length){
            for(var i= 0,len=doms.length;i<len;i++){
                removeName(doms[i]);
            }
        }else{
            removeName(doms);
        }
        function removeName(dom){
            dom.className = dom.className.replace(name, '');
        }
    },
    //判断是否有
    hasClass:function(context,name){
        var doms = $$.$all(context)
        var flag = true;
        for(var i= 0,len=doms.length;i<len;i++){
            flag = flag && check(doms[i],name)
        }

        return flag;
        //判定单个元素
        function check(element,name){
            return -1<(" "+element.className+" ").indexOf(" "+name+" ")
        }
    },
    //获取
    getClass:function (id){
        var doms = $$.$all(id)
        return $$.trim(doms[0].className).split(" ")
    }
});
//内容框架
$$.extend($$,{
    html:function (context, value) {
        var doms = $$.$all(context);
        if(value){
            for(var i = 0; i<doms.length;i++){
                doms[i].innerHTML = value;
            }
        }
        else{
            return doms[0].innerHTML;
        }
    }
});

//缓存框架 - 内存篇
$$.cache = {
    data:[],
    get:function(key){
        console.log('111')
        var value = null;
        console.log(this.data)
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (key == item.key) {
                value = item.value;
            }
        }
        console.log('get'+value)
        return value;
    },
    add:function(key,value){
        var json= { key: key, value: value};
        this.data.push(json);
    },
    delete:function(key){
        var status = false;
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            // 循环数组元素
            if (item.key.trim() == key) {
                this.data.splice(i, 1);//开始位置,删除个数
                status = true;
                break;
            }
        }
        return status;
    },
    update:function(key,value){
        var status = false;
        // 循环数组元素
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (item.key.trim() === key.trim()) {
                item.value = value.trim();
                status = true;
                break;
            }
        }
        return status;
    },
    isExist:function(key){
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i];
            if (key === item.key) {
                return true;
            }
        }
        return false;
    }
};
//cookie框架
$$.cookie = {
    //设置coolie
    setCookie: function (name,value,days,path){
        var name = escape(name);
        var value = escape(value);
        var expires = new Date();
        expires.setTime(expires.getTime() + days*24*60*60*1000);
        path = path == "" ? "" : ";path=" + path;
        _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
        document.cookie = name + "=" + value + _expires + path;
    },
    //获取cookie值
    getCookie:function (name){
        var name = escape(name);
        //读cookie属性，这将返回文档的所有cookie
        var allcookies = document.cookie;

        //查找名为name的cookie的开始位置
        name += "=";
        var pos = allcookies.indexOf(name);
        //如果找到了具有该名字的cookie，那么提取并使用它的值
        if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
            var start = pos + name.length;                  //cookie值开始的位置
            var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
            if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
            var value = allcookies.substring(start,end);  //提取cookie的值
            return unescape(value);                           //对它解码
        }
        else return "";                                             //搜索失败，返回空字符串
    },
    //删除cookie
    deleteCookie:function (name,path){
        var name = escape(name);
        var expires = new Date(0);
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
    }
};
//本地存储框架
$$.store = (function () {
    var api               = {},
        win               = window,
        doc               = win.document,
        localStorageName  = 'localStorage',
        globalStorageName = 'globalStorage',
        storage;

    api.set    = function (key, value) {};
    api.get    = function (key)        {};
    api.remove = function (key)        {};
    api.clear  = function ()           {};

    if (localStorageName in win && win[localStorageName]) {
        storage    = win[localStorageName];
        api.set    = function (key, val) { storage.setItem(key, val) };
        api.get    = function (key)      { return storage.getItem(key) };
        api.remove = function (key)      { storage.removeItem(key) };
        api.clear  = function ()         { storage.clear() };

    } else if (globalStorageName in win && win[globalStorageName]) {
        storage    = win[globalStorageName][win.location.hostname];
        api.set    = function (key, val) { storage[key] = val };
        api.get    = function (key)      { return storage[key] && storage[key].value };
        api.remove = function (key)      { delete storage[key] };
        api.clear  = function ()         { for (var key in storage ) { delete storage[key] } };

    } else if (doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) { return storage }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }
        api.set = function (key, val) {
            var storage = getStorage();
            storage.setAttribute(key, val);
            storage.save(localStorageName);
        };
        api.get = function (key) {
            var storage = getStorage();
            return storage.getAttribute(key);
        };
        api.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        }
        api.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;;
            storage.load(localStorageName);
            for (var i=0, attr; attr = attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        }
    }
    return api;
})();
