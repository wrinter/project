/**
 * Created by zxl on 2017/6/12.
 */
/********************分数设置*************************/
function setScore(){
    $('.exercise_btn').on("click",".exercise_btn_score",function(){
        var paperData = $H.storage.getLocal(thisType,"paperdata");
        var html = "",groupNum= 0,groupIds='',questionType='';
        var pData = $.parseJSON( paperData );
        var subjectId = $H.storage.getLocal(thisType,"subject");
        var len = subjectId.split(',').length;
        var qnum = 0,numcon=[];//小题数目
        var sum = 0, sccon=[];//总分
        var BatchFlag = '';
        var gCode = '';//记录不可拆分groupCode
        if(detectLines(pData)){
            for(var i=0;i<pData.length;i++){
                var question = pData[i];
                var line = question.line;
                var group= question.group;
                if(line!=undefined){
                    if(line=='start'){
                        qnum = 0,sum=0;
                        BatchFlag = question.isScoreBtn;
                        var scoreArray = [];
                        //批量赋分
                        if(BatchFlag){
                            if(question.isScoreBatch){
                                html += "<div class='h_line' lineId='"+question.lineId+"'><p><span>"+ question.lineNumber+ question.lineName+"</span><span class='h_qnum'></span><span class='h_qsc'></span>&nbsp</p>"
                                html +=  "<input type='button' class='h_custombtn h_setbtn' value='自定义赋分'>" + "</div>";
                            }else{
                                html += "<div class='h_line' lineId='"+question.lineId+"'><p><span>"+ question.lineNumber+ question.lineName+"</span><span class='h_qnum'></span><span class='h_qsc'></span>&nbsp</p>"
                                html +=  "<input type='button' class='h_batchbtn h_setbtn' value='批量赋分'>" + "</div>";
                            }
                        }else{
                            html += "<div class='h_line' lineId='"+question.lineId+"'><p><span>"+ question.lineNumber+question.lineName+"</span><span class='h_qnum'></span><span class='h_qsc'></span></p></div>";
                        }
                    }else if(line=='end'){
                        numcon.push(qnum);
                        sccon.push(sum);
                        html += "</ul>";
                        if(BatchFlag){
                            if (checkScore(scoreArray)) {
                                html += "<ul class='h_questions h_one'><li>" + '每小题' + "<input class='h_escore' value='" + scoreArray[0] + "'>" + "分</li></ul>";
                            }else{
                                html += "<ul class='h_questions h_one'><li>" + '每小题' + "<input class='h_escore' value='_'>" + "分</li></ul>";
                            }
                        }
                    }
                }else{
                    var qscore = question.score;
                    if(pData[i-1].line=='start'){
                        html += "<ul class='h_questions h_all'>";
                        if(group!=undefined){
                            if(group=='start'){
                                groupNum = 0;
                                groupIds = "";
                                if(question.groupCode&&question.isSplite=='0'){
                                    qnum++;
                                    gCode = question.groupCode;
                                }
                            }else if(group=='end'&&question.isSplite=="0"){
                                groupIds = groupIds.substr(0,groupIds.length-1);
                                html += "<li id='"+groupIds+"' class='h_groupli' qunum='"+groupNum+"'>第"+pData[i-1].lnOrder+"题<input class='h_escore' value='"+pData[i-1].score+"'>"+"分";
                                html += "&times"+groupNum+"</li>";
                            }
                        }else{
                            if(gCode!=question.groupCode){
                                qnum++;
                            }
                            if(qscore==null){
                                qscore = "_";
                            }else{
                                sum+=question.score;
                            }
                            if(question.groupCode!=""&&question.groupCode!=null&&question.isSplite=='0'){
                                groupNum++;
                                groupIds+=question.questionId+',';
                            }else{
                                html += "<li id='"+question.questionId+"'>第"+question.lnOrder+"题<input class='h_escore' value='"+qscore+"'>"+"分</li>";
                                scoreArray.push(qscore);
                            }
                        }
                    }else{
                        if(group!=undefined){
                            if(group=='start'){
                                groupNum = 0;
                                groupIds = '';
                                if(question.groupCode&&question.isSplite=='0'){
                                    qnum++;
                                    gCode = question.groupCode;
                                }
                            }else if(group=='end'&&question.isSplite=="0"){
                                groupIds = groupIds.substr(0,groupIds.length-1);
                                html += "<li id='"+groupIds+"' class='h_groupli' qunum='"+groupNum+"'>第"+pData[i-1].lnOrder+"题<input class='h_escore' value='"+pData[i-1].score+"'>"+"分";
                                html += "&times"+groupNum+"</li>";
                            }
                        }else{
                            if(gCode!=question.groupCode){
                                qnum++;
                            }
                            if(qscore==null){
                                qscore = "_";
                            }else{
                                sum+=question.score;
                            }
                            if(question.groupCode!=""&&question.groupCode!=null&&question.isSplite=='0'){
                                groupNum++;
                                groupIds+=question.questionId+',';
                            }else{
                                html += "<li id='"+question.questionId+"'>第"+question.lnOrder+"题<input class='h_escore' value='"+qscore+"'>"+"分";
                                scoreArray.push(qscore);
                            }
                        }
                    }
                }
            }
            $('.h_scorecontent').html(html);
            clickScore();
            $('.h_setbtn').each(function(){
                if($(this).hasClass('h_custombtn')){
                    $(this).parent().next().hide();
                }else if($(this).hasClass('h_batchbtn')){
                    $(this).parent().next().next().hide();
                }
            });
            var k=0;
            $('.h_qnum').each(function(){
                var v1='(共'+numcon[k]+"小题,";
                var v2='共'+sccon[k]+"分)";
                $(this).html(v1);
                $(this).next('span').html(v2);
                k++;
            });
            var allscore=0;
            for(var i=0;i<sccon.length;i++){
                allscore+=parseInt(sccon[i]);
            }
            $('.h_allscore').html('总分数'+allscore+'分');
            $('#h_score').fadeIn(150);
        }else{
            $('#c_ErrorMsg').html('还有大题中未设置题目哦').fadeIn(200);
            Disappear("#c_ErrorMsg");
        }
    });
    $('.h_closeImg').click(function(){
        $('#h_score').fadeOut();
    });
    $('.h_cancel').click(function(){
        $('#h_score').fadeOut();
    });
    $('.h_finish').click(function(){
        var scoreSets = {},lineFlag={};
        $('.h_escore').each(function(){
            var h_ul = $(this).closest(".h_questions");
            var id = $(this).parent()[0].id;
            if(h_ul.css('display')=='block'){
                var val = $(this)[0].value;
                if(id!=undefined&&id!=''){
                    var arrId = id.split(',');
                    if(arrId.length>1){
                        for(var i=0;i<arrId.length;i++){
                            var quid = arrId[i];
                            scoreSets[quid]=val;
                        }
                    }else{
                        scoreSets[id]=val;
                    }
                }
            }else{
                if(id!=undefined&&id!=''){
                    var qval = h_ul.next().find("input")[0].value;
                    var arr = id.split(',');
                    for(var k=0;k<arr.length;k++){
                        var qid = arr[k];
                        scoreSets[qid]=qval;
                    }
                }
            }
        });
        $('.h_line').each(function(){
            var lineId = $(this).attr('lineId');
            var scoreDef = $(this).find('.h_qnum').html()+$(this).find('.h_qsc').html();
            scoreSets[lineId]=scoreDef;
        });
        $('.h_setbtn').each(function(){
            var lineId = $(this).parent().attr('lineId');
            if($(this).hasClass('h_custombtn')){
                lineFlag[lineId] = true;
            }else{
                lineFlag[lineId] = false;
            }
        });
        setPdata(scoreSets,lineFlag);
    });
}
function setPdata(scoreSets,lineFlag){
    var paperData = $H.storage.getLocal(thisType,"paperdata");
    var pData = $.parseJSON( paperData );
    var allscore = 0;
    for(var i=0;i<pData.length;i++){
        var question = pData[i];
        var line = question.line;
        var group= question.group;
        var questionId = '';
        if(line==undefined){
            if(group==undefined){
                questionId = question.questionId;
                pData[i].score = parseInt(scoreSets[questionId]);
                allscore += parseInt(scoreSets[questionId]);
            }
        }else{
            if(line=='start'){
                var lineId = question.lineId;
                pData[i].scoreDef = scoreSets[lineId];
                pData[i].isScoreBatch = lineFlag[lineId];
            }
        }
    }
    $('#h_score').fadeOut();
    var saveData = JSON.stringify(pData);
    $H.storage.setLocal(thisType,"paperdata",saveData);
    $('.test_score').html(allscore);
    $H.event.resetPaperHtml({orderLineNumber:true,type:thisType,subject:thisSubject});
}
function detectLines(pData){
    var flag = true;
    for(var i=0;i<pData.length;i++){
        var question = pData[i];
        var line = question.line;
        if(line=="start"){
            if(pData[i+1].line=='end'){
                flag = false;
                break;
            }
        }
    }
    return flag;
}
function clickScore(){
    $('.h_setbtn').click(function(){
        if($(this).hasClass('h_custombtn')){
            $(this).removeClass('h_custombtn').addClass('h_batchbtn');
            $(this)[0].value = '批量赋分';
            //全部展开
            var sul = $(this).parent().next('.h_all');
            sul.show();
            sul.next('ul').hide();
        }else{
            $(this).removeClass('h_batchbtn').addClass('h_custombtn');
            $(this)[0].value = '自定义赋分';
            var sul = $(this).parent().next('ul');
            sul.hide();
            sul.next('ul').show();
        }
    });
    $('.h_escore').blur(function(){
        var scores=0;
        var tempScore=0;
        if($(this)[0].value!=''&&$(this)[0].value!='_'){
            tempScore = parseInt($(this)[0].value);
        }
        var h_questions = $(this).closest(".h_questions");
        var h_li = $(this).parent();
        //是否含有不可拆分的组合题
        if(h_li.hasClass('h_groupli')){
            scores = tempScore*h_li.attr('qunum');
            $(this).parent().siblings().each(function(){
                if($(this).hasClass('h_groupli')){
                    scores += parseInt($(this).children()[0].value)*$(this).attr('qunum');
                }else{
                    scores+=parseInt($(this).children()[0].value);
                }
            });
            h_questions.prev(".h_line").find(".h_qsc").html('共'+scores+'分)');
        }else{
            if(h_questions.hasClass('h_all')){
                scores += tempScore;
                $(this).parent().siblings().each(function(){
                    var value = $(this).children()[0].value;
                    if(value!=''&&value!='_') {
                        if ($(this).hasClass('h_groupli')) {
                            scores += parseInt(value) * $(this).attr('qunum');
                        } else {
                            scores += parseInt(value);
                        }
                    }
                });
                h_questions.prev(".h_line").find(".h_qsc").html('共'+scores+'分)');
            }else{
                var l = h_questions.prev('.h_all').children().length;
                scores = tempScore*l;
                h_questions.prev('.h_all').closest(".h_questions").prev(".h_line").find(".h_qsc").html('共'+scores+'分)');
            }
        }
        $('.h_allscore').html('总分数'+computeScore()+'分');
    });
    //输入检查
    $(".h_escore").keyup(function(){
        $(this).val($(this).val().replace(/\D/g,''));
    }).bind("paste",function(){  //CTR+V事件处理
        $(this).val($(this).val().replace(/\D|/g,''));
    }).css("ime-mode", "disabled");  //CSS设置输入法不可用
}
function checkScore(arr){
    for(var k=0;k<arr.length-1;k++){
        if(arr[k]!=arr[k+1]){
            return false;
        }
    }
    return true;
}
function computeScore(){
    var score = 0;
    $('.h_qsc').each(function(){
        var str = $(this).html();
        var sc = parseInt(str.substr(1,str.length-2));
        score += sc;
    });
    return score;
}
function forIE(){
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),

                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }
}
