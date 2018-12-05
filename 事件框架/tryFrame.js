/**
 * Created by Administrator on 2018/10/27.
 */
var $$ = function () {};

$$.prototype = {
    //获取id
    $id:function(id){
        return document.getElementById(id);
    },
    //获取tag
    $tag:function(tag){
        return document.getElementsByTagName(tag);
    },
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