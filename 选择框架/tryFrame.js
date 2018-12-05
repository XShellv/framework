/**
 * Created by Administrator on 2018/10/27.
 */
var $$ = function () {};

$$.prototype = {
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
//属性选择器的封装
$$.extend($$,{
    $attr: function (selector, key, value) {
        //sel 可能是一个对象，也可能是一个数组
        var sel = $$.isString(selector) ? $$.$all(selector) : selector;
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
    }
});
