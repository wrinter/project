/*类库*/
/*事件绑定*/
function addEventHandler(obj,eventName,handler) {
    if (document.attachEvent) {
        obj.attachEvent('on'+eventName,handler);
    }else if (document.addEventListener) {
        obj.addEventListener(eventName,handler,false);
    }
}
/*事件移除*/
function removeEventHandler(obj,eventName,handler) {
    if (document.detachEvent) {
        obj.detachEvent('on'+eventName,handler);
    }else if (document.removeEventListener) {
        obj.removeEventListener(eventName,handler,false);
    }
}
/*获取事件对象*/
function eventTarget(evt) {
    var evt = evt||window.event;
    var targetElement = evt.target||evt.srcElement;
    return targetElement;
}
/*阻止冒泡*/
function stopBubble(evt) {
    var evt = evt||window.event;
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
    else {
        window.event.cancelBubble = true;
    }
}
/*阻止默认*/
function preDefault(event){
    var evt=event||window.event;
    if (evt&&evt.preventDefault) {
        evt.preventDefault();
    }
    else {
        window.event.returnValue = false;
    }
}