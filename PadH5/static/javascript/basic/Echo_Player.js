/**
 * Created by Echonessy on 2017/7/26.
 */
/*****************************congfig参数说明****************************/
//'ele ':绑定的DOM  例如 .app  #app
//'ClassPrefix ':自定义播放器的标识类名 例如 .EchoPlayer-Play 自定义播放器的标识类名注意同时启用多个播放器的时候类名不要重复
//ClassPrefixPosition:'fixed'//自定义播放器的布局方式fixed 特殊 默认auto
//注意：Chrome浏览器针对audio 设置currentTime始终为0，是因为服务器导致的，建议测试采用线上音频链接或者配置nginx、Apache等服务代理
window.EchoPlayer = (function () {
    var InitPlayer = function () {};
    InitPlayer.prototype = {
        config: function (param) {
            this.CreatHtml(param)
        },
        //兼容IE获取类名
        CompatGetClass:function (parent,classStr,tagName) {
            function hasClass(tagStr,classStr){
                var arr=tagStr.className.split(/\s+/ ); //这个正则表达式是因为class可以有多个,判断是否包含
                for (var i=0;i<arr.length;i++){
                    if (arr[i]==classStr){
                        return true ;
                    }
                }
                return false ;
            }
            if (parent.getElementsByClassName) {
                return parent.getElementsByClassName(classStr)
            }else {
                var nodes = parent.getElementsByTagName(tagName),ret = [];
                for(var i = 0; i < nodes.length; i++) {
                    if(hasClass(nodes[i],classStr)){
                        ret.push(nodes[i])
                    }
                }
                return ret;
            }
        },
        //检测音频文件是否支持
        FileSupport:function (params) {
            //判断对象是否为空
            function isEmptyObject(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            }
            this.ele=document.querySelector(params.ele)
            this.Flag = this.ele.getAttribute('src').split('.').length-1
            this.fileType=this.ele.getAttribute('src').split('.')[this.Flag].toLowerCase();
            if(this.fileType.indexOf('?')>0) {
                this.fileType = this.fileType.split('?')[0].toLowerCase()
            }
            this.Support=false;
            //检测项目
            this.Detection='audio/'+this.fileType+';';
            console.log(this.ele.canPlayType(this.Detection))
            if(!isEmptyObject(this.ele.canPlayType(this.Detection))){
                this.Support=true;
            }
            return this.Support;
        },
        //检测音频文件是否有
        CheckAudioFile:function (params) {
            this.Defult=false;//判断链接是否含有
            //判断对象是否为空
            function isEmptyObject(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            }
            this.ele=document.querySelector(params.ele)
            this.file=this.ele.getAttribute('src');
            if(!isEmptyObject(this.file)){
                if(this.FileSupport(params)){
                    this.Defult=true;
                }
            }
            return this.Defult;
        },
        //时间格式重置
        TimeReset:function (value) {
            var theTime = parseInt(value);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            var Result;//最终时间
            //判断对象是否为空
            function isEmptyObject(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            }
            if(!isEmptyObject(value)){
                Result='00:00';
            }else {
                if(theTime > 60) {
                    theTime1 = parseInt(theTime/60);
                    theTime = parseInt(theTime%60);
                    if(theTime1 > 60) {
                        theTime2 = parseInt(theTime1/60);
                        theTime1 = parseInt(theTime1%60);
                    }
                }
                if(parseInt(theTime)<=9){
                    var Sec = "0"+parseInt(theTime);
                }else {
                    var Sec =parseInt(theTime);
                }
                if(parseInt(theTime1)<=9){
                    var Min = "0"+parseInt(theTime1);
                }else {
                    var Min =parseInt(theTime1);
                }
                if(parseInt(theTime2)<=9){
                    var Hour = "0"+parseInt(theTime2);
                }else {
                    var Hour =parseInt(theTime2);
                }
                if(Hour=='00'||Hour==0){
                    Result=Min+':'+Sec;
                }else {
                    Result=Hour+':'+Min+':'+Sec;
                }
            }
            return Result;
        },
        // 创造类
        ClassNameReset:function (params) {
            //固定类名
            this.ClassPrefix=params.ClassPrefix;
            //存放最终的类名
            var cssClass= {};
            //存放单个模块
            var cssClassSub = {
                Pause:'Pause',
                Play:'Play',
                PlayBtn:'PlayBtn',
                PlayTxt:'PlayTxt',
                PlayConBox:'PlayConBox',
                BarBox:'BarBox',
                LoadBar:'LoadBar',
                LoadBtn:'LoadBtn',
                TimeBox:'TimeBox',
                DurationTime:'DurationTime',
                TotalTime:'TotalTime'
            };
            for( var ClassName in cssClassSub ){
                cssClass[ ClassName ]=this.ClassPrefix+'-'+ cssClassSub[ ClassName ];
            }
            return cssClass;
        },
        //创建html
        CreatHtml :function(params) {
            var Class = this.ClassNameReset(params)
            this.ClassPrefix=params.ClassPrefix;
            this.ele=document.querySelector(params.ele)
            this.file=this.ele.getAttribute('src');
            if(this.CheckAudioFile(params)){
                //截取ele类名字符串
                this.IdName=params.ele;
                if(this.IdName.indexOf('.')!=-1){
                    this.IdName=this.IdName.split('.')[1];
                }else if(this.IdName.indexOf('#')!=-1){
                    this.IdName=this.IdName.split('#')[1];
                }
                var $Html='';
                $Html+='<audio src="'+this.file+'" id="'+this.IdName+'"  style="display: none;"></audio>';
                $Html+='<div class="'+Class.PlayBtn+' '+Class.Pause+'" data-status="pause"></div>';
                $Html+='<div class="'+Class.PlayConBox+'">'
                $Html+='<p class="'+Class.PlayTxt+'">点击播放音频</p>'
                $Html+='<div class="'+Class.BarBox+'"><p class="'+Class.LoadBar+'"></p><p class="'+Class.LoadBtn+'"></p></div>';
                $Html+='<div class="'+Class.TimeBox+'">';
                $Html+='<span class="'+Class.DurationTime+'">00:00</span>';
                $Html+='<span class="'+Class.TotalTime+'"> ... </span>';
                $Html+='</div>'
                $Html+='</div>'
                //音乐播放器主题架构
                this.CreatPreFixDiv=document.createElement('div');
                this.CreatPreFixDiv.className=this.ClassPrefix;
                this.CreatPreFixDiv.innerHTML=$Html;
                //替换当前DOM节点html
                this.ele.parentNode.replaceChild(this.CreatPreFixDiv,this.ele);
                this.DefultConfig(params);//初始化设置
            };
        },
        //初始设置
        DefultConfig:function (params) {
            var that=this;
            var Class=this.ClassNameReset(params);//获取类名对象
            this.ele=document.querySelector(params.ele);//播放器
            this.OutParent=this.ele.parentNode;//播放器父元素
            this.Pause=this.CompatGetClass(this.OutParent,Class.Pause,'div')[0];//暂停
            this.Play=this.CompatGetClass(this.OutParent,Class.Play,'div')[0];//播放
            this.PlayBtn=this.CompatGetClass(this.OutParent,Class.PlayBtn,'div')[0];//播放暂停按钮
            this.BarBox=this.CompatGetClass(this.OutParent,Class.BarBox,'div')[0];//时间进度条父元素
            this.LoadBar=this.CompatGetClass(this.OutParent,Class.LoadBar,'p')[0];//时间进度条
            this.LoadBtn=this.CompatGetClass(this.OutParent,Class.LoadBtn,'p')[0];//时间进度条
            this.TimeBox=this.CompatGetClass(this.OutParent,Class.TimeBox,'div')[0];//时间父元素
            this.DurationTime=this.CompatGetClass(this.OutParent,Class.DurationTime,'span')[0];//当前播放时间
            this.TotalTime=this.CompatGetClass(this.OutParent,Class.TotalTime,'span')[0];//音频总时间
            this.PalyReset(params)
            this.Loaded(params);

        },
        // 播放器重置
        PalyReset: function (params) {
            var Class=this.ClassNameReset(params);
            this.DurationTime.innerHTML='00:00'
            //当前时间进度条改变
            this.LoadBar.style.width=0;
            this.PlayBtn.className=Class.Pause+' '+Class.PlayBtn;
            this.PlayBtn.setAttribute('data-status','pause');
            this.ele.pause();
        },
        //初始化播放器
        Loaded:function (params) {
            var that=this;
            this.ele.addEventListener('error',function () {
                console.log('音频无效')
                javascript:bc.showNotice("抱歉，文件走丢了，请稍后再试");
            });
            //数据已加载
            this.ele.addEventListener('loadeddata',function () {
                //首先初始化音频的总时间
                that.TotalTime.innerHTML=that.TimeReset(this.duration);
                //点击事件
                that.PlayEvent(params)
            });
            //监听播放
            this.ele.addEventListener( 'timeupdate', function()
            {
                //当前播放时间
                that.DurationTime.innerHTML=(that.TimeReset(this.currentTime))
                //当前时间进度条改变
                that.LoadBar.style.width=(this.currentTime/this.duration)*100+'%';
                //当前时间进度按钮改变
                that.LoadBtn.style.left=(this.currentTime/this.duration)*100+'%';
            });
        },
        //播放事件
        PlayEvent:function (params){
            var that = this
            var Class=this.ClassNameReset(params);
            //播放事件
            this.PlayBtn.addEventListener('click',function () {
                var Status=this.getAttribute('data-status');
                if(Status=='playing'){
                    this.className=Class.Pause+' '+Class.PlayBtn;
                    this.setAttribute('data-status','pause');
                    that.ele.pause();
                }else {
                    this.className=Class.Play+' '+Class.PlayBtn;
                    this.setAttribute('data-status','playing');
                    that.ele.play();
                }
            });
            //进度调节事件
            this.BarBox.addEventListener('click',function (e) {
                that.UpDataTime(e,params,false);
            });
            //进度调节事件
            this.BarBox.addEventListener('touchstart',function (e) {
                that.UpDataTime(e,params,true);
            });
            //进度调节事件
            this.BarBox.addEventListener('touchmove',function (e) {
                that.UpDataTime(e,params,true);
            });
            this.ele.addEventListener('ended',function () {
                that.DurationTime.innerHTML='00:00'
                //当前时间进度条改变
                that.LoadBar.style.width=0;
                that.PlayBtn.className=Class.Pause+' '+Class.PlayBtn;
                that.PlayBtn.setAttribute('data-status','pause');
            });
        },
        //调节进度
        UpDataTime:function (e,params,support) {
            this.theRealEvent = support ? e.targetTouches[0] : e //鼠标信息
            this.duration=this.ele.duration;//总时间
            this.ClassPosition=params.ClassPrefixPosition//不同布局方式计算方式不同
            if(this.ClassPosition=='fixed'){
                //计算当前鼠标点击的位置是相对于音频是什么播放时间
                this.clickTime=Math.round( (this.duration * ( this.theRealEvent.pageX - (this.BarBox.offsetLeft+this.OutParent.offsetLeft) ) )/(this.BarBox.clientWidth));
            }else {
                //计算当前鼠标点击的位置是相对于音频是什么播放时间
                this.clickTime=Math.round( (this.duration * ( this.theRealEvent.pageX - (this.BarBox.offsetLeft) ) )/(this.BarBox.clientWidth));
            }
            if(this.clickTime < 0 ) {
                this.clickTime = 0
            }
            if(this.clickTime >= this.duration) {
                this.clickTime = this.duration
            }
            //改变当前播放位置
            this.ele.currentTime =this.clickTime;
            //改变进度时间
            this.DurationTime.innerHTML=this.TimeReset(this.clickTime);
            //改变进度条长度
            this.LoadBar.style.width=(this.clickTime/this.duration)*100+'%';
            this.LoadBtn.style.left=(this.clickTime/this.duration)*100+'%';
        }
    }
    return InitPlayer
})()