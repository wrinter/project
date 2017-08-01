/**
 * Created by Administrator on 2016/12/30 0030.
 */
var Stroke = function () {
};
Stroke.prototype = {
    constructor: Stroke, //确定原型链
    //初始化
    init: function (imgId, convasid, brushid, gobackid, markList) {
        this.x = [];//记录鼠标移动是的X坐标
        this.y = [];//记录鼠标移动是的Y坐标
        this.clickDrag = [];//把点击、拖动的鼠标坐标添加到数组里
        this.lock = false;//鼠标移动前，判断鼠标是否按下
        this.fontWeight = 4;//画笔的粗细
        this.$ = function (id) {
            return typeof id == "string" ? document.getElementById(id) : id;
        };//获取id封装
        this.canvas = this.$(convasid);
        this.cPushArray = [];//用来存储canvas图片路径
        this.cStep = -1;//用来记录当前画了多少次，为返回上一步和前进上一步做准备
        if (this.canvas.getContext) {
        } else {
            alert("您的浏览器不支持 canvas 标签");
            return;
        } //判断是否支持canvas
        this.cxt = this.canvas.getContext('2d');
        this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
        this.cxt.lineWidth = 5;//线条的宽度
        //this.iptClear=this.$("clear");//清除画布
        this.brush = this.$(brushid);//画笔
        this.isbrush = false;//判断画笔是否点击了----
        this.goback = this.$(gobackid);//撤销
        this.touch = ("createTouch" in document);//判定是否为手持设备
        this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
        this.MoveEvent = this.touch ? "touchmove" : "mousemove";
        this.EndEvent = this.touch ? "touchend" : "mouseup";
        this.images = new Image();
        this.canvaswh = this.$("canvaswh");//用来调节canvas大小
        this.Canvascon = this.$('Canvascon');//canvas的父类包装
        this.canvas.width = this.canvaswh.width;//让canvas的宽高等于当前图片的大小
        this.canvas.height = this.canvaswh.height;//让canvas的宽高等于当前图片的大小
        this.w = this.canvas.width;//取画布的宽
        this.h = this.canvas.height;//取画布的高
        this.imgId = imgId;
        this.Bind(brushid, gobackid);
        this.DrawImage(markList);
    },
    Bind: function (brushid, gobackid) {
        var t = this;
        //this.iptClear.onclick=function() {t.clear();};//清除画布事件
        //鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件
        this.canvas['on' + t.StartEvent] = function (e) {
            t.lock = true;//鼠标按下解锁
        };
        //鼠标移动事件
        this.canvas['on' + t.MoveEvent] = function (e) {
            var touch = t.touch ? e.touches[0] : e;
            if (t.lock)//t.lock为true则执行
            {
                var touchX = touch.pageX - touch.target.offsetLeft - t.Canvascon.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点
                var touchY = touch.pageY - touch.target.offsetTop - t.Canvascon.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点
                if (t.isbrush) {
                    t.movePoint(touchX, touchY, true);//记录鼠标位置
                    t.drawPoint();//绘制路线
                }
            }
        };
        //鼠标结束事件，onmouseup当鼠标移开画布的时候重置一下数据
        this.canvas['on' + t.EndEvent] = function (e) {
            t.lock = false;
            t.x = [];
            t.y = [];
            t.clickDrag = [];
            clearInterval(t.Timer);
            t.Timer = null;
            t.cPush();//当描绘的事件结束时候，把当前描绘的canvas图片存放到数组里
        };
        //橡皮擦撤销上一步
        this.goback.onclick = function () {
            t.isbrush = false;
            $(this).addClass("change_eareser");
            $(this).parent().css("background-color","#faa249");
            $("#"+brushid).removeClass("change_pencel");
            $(this).parent().prev().prev().css("background-color","#ffffff");
            $(this).parent().parent().find("hr").addClass("addBorder");
            t.GoBack();
        };
        //画笔激活
        this.brush.onclick = function () {
            if (window.navigator.userAgent.indexOf("MSIE")>=1){
                $('#c_ErrorMsg').html('IE浏览器不支持').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            $(this).addClass("change_pencel");
            $(this).parent().css("background-color","#faa249");
            $("#"+gobackid).removeClass("change_eareser");
            $(this).parent().next().next().css("background-color","#ffffff");
            $(this).parent().parent().find("hr").addClass("addBorder");
            t.isbrush = true;
        };
    },
    movePoint: function (x, y, dragging) {
        /*将鼠标坐标添加到各自对应的数组里*/
        this.x.push(x);
        this.y.push(y);
        this.clickDrag.push(y);
    },
    drawPoint: function (x, y, radius) {
        for (var i = 0; i < this.x.length; i++)//循环数组
        {
            this.cxt.beginPath();//context.beginPath() , 准备绘制一条路径
            if (this.clickDrag[i] && i) {//当是拖动而且i!=0时，从上一个点开始画线。
                this.cxt.moveTo(this.x[i - 1], this.y[i - 1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
            } else {
                this.cxt.moveTo(this.x[i] - 1, this.y[i]);
            }
            this.cxt.strokeStyle = "red";
            this.cxt.lineWidth = 5;
            this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
            this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
            this.cxt.stroke();//context.stroke() , 绘制当前路径
            this.cxt.save();
        }
    },
    //清除画布
    clear: function () {
        var t = this;
        t.images.src = t.cPushArray[0];
        t.images.onload = function () {
            t.cxt.drawImage(t.images, 0, 0);
        };//清除画布，左上角为起点
    },
    //图片
    DrawImage: function (markList) {
        var t = this;
        t.images.src = "../../static/image/test/background.png";  //用户提交的作业图片路径
        t.images.onload = function () {
            t.cxt.drawImage(t.images, 0, 0,this.w,this.h);
        };
        if (markList != null) {
            t.images.src = markList;
            t.cxt.drawImage(t.images, 0, 0,this.w,this.h);
            this.cPushArray.push(markList);
        }
    },
    cPush: function () {
        var t = this, imgId = t.imgId;
        t.cPushArray.push(t.canvas.toDataURL());
        var pro = {};
        pro.answerPicId = imgId;
        pro.fileStr = t.cPushArray[t.cPushArray.length - 1];
        pro.flag = "2";
        if (imgArray.length > 0) {
            var b = true;
            for (var i in imgArray) {
                if (imgArray[i].answerPicId === pro.answerPicId) {
                    imgArray[i] = pro;
                    b = false;
                }
            }
            if (b) {
                imgArray.push(pro);
            }
        } else {
            imgArray.push(pro);
        }
    },
    GoBack: function () {
        var t = this;
        this.canvas.width = this.canvaswh.width;//让canvas的宽高等于当前图片的大小
        this.canvas.height = this.canvaswh.height;//让canvas的宽高等于当前图片的大小
        t.cPushArray.pop();
        if (imgArray.length > 0) {
            for (var i in imgArray) {
                if (imgArray[i].answerPicId === t.imgId) {
                    imgArray.splice(i, 1);
                }
            }
        }
        if (t.cPushArray.length-1 >= 0) {
            t.images.src = t.cPushArray[t.cPushArray.length - 1];
        }
        t.images.onload = function () {
            t.cxt.drawImage(t.images, 0, 0);
        };
        if(t.cPushArray.length>0){
            var pro = {};
            pro.answerPicId = t.imgId;
            pro.fileStr = t.cPushArray[t.cPushArray.length - 1];
            pro.flag = "2";
            if (imgArray.length > 0) {
                var b = true;
                for (var i in imgArray) {
                    if (imgArray[i].answerPicId === pro.answerPicId) {
                        imgArray[i] = pro;
                        b = false;
                    }
                }
                if (b) {
                    imgArray.push(pro);
                }
            } else {
                imgArray.push(pro);
            }
        }
    }
};