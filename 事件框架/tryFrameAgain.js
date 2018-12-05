/**
 * Created by Administrator on 2018/10/28.
 */

var $$$ = function () {
    alert(1)
};
//$$$的原型属性(是一种特殊的对象)
$$$.prototype = {
    isString:function (val) {
        return typeof val === "string";
    },
    extend:function (tar, source) {
        for(var i in source){
            // 给实例化的对象自定义属性i其实就是给构造函数$$$自定义属性
            tar[i] = source[i];
        }
        console.log(tar)
        // 输出为构造函数的而非实例化对象
        return tar;
    }
};

var $$ = new $$$();

//需要注意的是，这里extend里面的第一个参数应该是一个实例化的对象$$，而非构造函数$$$。
$$.extend($$,{
    //绑定事件
    on:function (type,id,fn) {
        //需要判断这里的id是对象还是字符串
        id = $$.isString(id)? document.getElementById(id):id;
        //兼容性考虑
        if(id.addEventListener){
            //主流浏览器
            id.addEventListener(type,fn,false);
        }
        else if(id.attachEvent){
            //IE浏览器
            id.attachEvent("on"+type,fn);
        }
        //dom0
        else{
            id["on"+type] = fn;
        }
    },
    //解绑事件
    off:function (type,id,fn) {
        //兼容性考虑
        if(id.removeEventListener){
            //主流浏览器
            id.removeEventListener(type,fn,false);
        }
        else if(id.detachEvent){
            //IE浏览器
            id.detachEvent("on"+type,fn);
        }
        //dom0
        else{
            id["on"+type] = null;
        }
    },
    //点击事件
    click:function (id,fn) {
        this.on("click",id,fn);
    },
    //鼠标经过事件
    mouseover:function (id, fn) {
        this.on("mouseover",id,fn)
    },
    //鼠标离开
    mouseout:function (id, fn) {
        this.on("mouseout",id,fn)
    },
    //hover事件
    hover:function (id, fnIn, fnOut) {
        if(fnIn){
            this.on("mouseover",id,fnIn)
        }
        if(fnOut){
            this.on("mouseout",id,fnOut)
        }
    }
});