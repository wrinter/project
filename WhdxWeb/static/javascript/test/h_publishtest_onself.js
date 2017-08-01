//reEdit by subo on 2017-2-13
//ajax------------------------------------------------------------------------------------------------------------------
//当前作业(分有和没有题2种情况) /嵌套：知识点
currentJobData();
SystemRedMsg();
function currentJobData () {
    $.ajax({
        type: "post",
        url: postUrl,
        data: postData,
        dataType: "json",
        success:function(data){
            if (data.retCode == "0000") {
                currentJobA(data);
                jobName();//更新试卷名称
            }else{//没题
                currentJobB();
                jobName();
            }
        },
        error:function(){//请求错误,继续加载页面
            currentJobB();
            jobName();//更新试卷名称
        }
    });
};
//ajax依次加载执行：当前作业→知识点→题型→题库⇆分页；⇆：互有依赖,公共方法需要放置在尾端(尾端事件),如尾端有依赖请根据情况放置尾端事件位置
