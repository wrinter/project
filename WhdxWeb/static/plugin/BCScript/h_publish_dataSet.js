//Created by subo on 2017/3/16.
//布置作业、测试相关的试卷逻辑公共类组
//试卷数据预处理类,转换为无关系数据，依靠标记start、end来解释块、行、组合题等复杂组合
function Pretreatment(data){
    var idata = [],iNum = 1,iCode = 1;//简化的数据，新的lnOrder排序（原始数据中排序会改变为新的），组别统一码gpOrder排码
    if(data){
        //题库
        if("list" in data){
            var List = data.list;
            for(var a=0;a<List.length;a++){
                if(List[a].groupCode == null || List[a].groupCode == "null"){//单题
                    if("questions" in List[a] && List[a].questions.length > 0){
                        List[a].questions[0].type = "source";
                        List[a].questions[0].lnOrder = iNum;
                        idata.push(List[a].questions[0]);
                        iNum++;//题号++
                    }
                }else{//组合题
                    var groupStartA = {
                            type: "source",
                            group:"start",
                            lnOrder: iNum,
                            gpOrder: iCode,
                            content: List[a].content,
                            isSplite: List[a].isSplite,
                            groupCode: List[a].groupCode,
                            questionId: List[a].questionId,
                            selectable: List[a].selectable,
                            knowledgeId: List[a].knowledgeId,
                            knowledgeName: List[a].knowledgeName,
                            difficultName: List[a].difficultName,
                            questionTypeId: List[a].questionTypeId,
                            questionTypeName: List[a].questionTypeName
                        },
                        groupEndA = {
                            type: "source",
                            group:"end",
                            labels: List[a].labels,
                            isSplite: List[a].isSplite,
                            groupCode: List[a].groupCode,
                            questionId: List[a].questionId,
                            questionTypeId: List[a].questionTypeId,
                            questionTypeName: List[a].questionTypeName
                        };
                    idata.push(groupStartA);
                    if("questions" in List[a] && List[a].questions.length > 0){
                        var Questionses = List[a].questions;
                        for(var b=0;b<Questionses.length;b++){
                            Questionses[b].type = "source";
                            Questionses[b].lnOrder = iNum;
                            Questionses[b].gpOrder = iCode;
                            idata.push(Questionses[b]);
                            if(Questionses[b].isSplite == "0"){//不可拆分
                                if(b == Questionses.length - 1){//此group的最后1题
                                    iNum++;//题号++
                                }
                            }else if(Questionses[b].isSplite == "1"){//可拆分
                                iNum++;//题号++
                            }
                            if(b == Questionses.length - 1){
                                iCode++;//组别统一码++
                            }
                        }
                    }
                    idata.push(groupEndA);
                }
            }
        }
        //试卷or练习
        else if("questionLines" in data){
            var QuestionLines = data.questionLines;
            for(var i=0;i<QuestionLines.length;i++){
                var lineStart = {
                        type: "paper",
                        line: "start",
                        lnOrder: iNum,
                        isShow: QuestionLines[i].isShow,
                        lineId: QuestionLines[i].lineId,
                        scoreDef: QuestionLines[i].scoreDef,
                        lineName: QuestionLines[i].lineName,
                        questionType: QuestionLines[i].questionType,
                        lineNumber: QuestionLines[i].scoreDef ? true : false
                    },
                    lineEnd = {
                        type: "paper",
                        line: "end"
                    };
                idata.push(lineStart);
                if("questionGroup" in QuestionLines[i] && QuestionLines[i].questionGroup.length > 0){
                    var QuestionGroup = QuestionLines[i].questionGroup;
                    for(var j=0;j<QuestionGroup.length;j++){
                        if(QuestionGroup[j].groupCode == null || QuestionGroup[j].groupCode == "null"){//单题
                            if("questions" in QuestionGroup[j] && QuestionGroup[j].questions.length > 0){
                                QuestionGroup[j].questions[0].type = "paper";
                                QuestionGroup[j].questions[0].lnOrder = iNum;
                                idata.push(QuestionGroup[j].questions[0]);
                                iNum++;//题号++
                            }
                        }else{//组合题
                            var groupStart = {
                                    type: "paper",
                                    group:"start",
                                    lnOrder: iNum,
                                    gpOrder: iCode,
                                    content: QuestionGroup[j].content,
                                    isSplite: QuestionGroup[j].isSplite,
                                    groupCode: QuestionGroup[j].groupCode,
                                    questionId: QuestionGroup[j].questionId,
                                    selectable: QuestionGroup[j].selectable,
                                    knowledgeId: QuestionGroup[j].knowledgeId,
                                    knowledgeName: QuestionGroup[j].knowledgeName,
                                    difficultName: QuestionGroup[j].difficultName,
                                    questionTypeId: QuestionGroup[j].questionTypeId,
                                    questionTypeName: QuestionGroup[j].questionTypeName
                                },
                                groupEnd = {
                                    type: "paper",
                                    group:"end",
                                    labels: QuestionGroup[j].labels,
                                    isSplite: QuestionGroup[j].isSplite,
                                    groupCode: QuestionGroup[j].groupCode,
                                    questionId: QuestionGroup[j].questionId,
                                    questionTypeId: QuestionGroup[j].questionTypeId,
                                    questionTypeName: QuestionGroup[j].questionTypeName
                                };
                            idata.push(groupStart);
                            if("questions" in QuestionGroup[j] && QuestionGroup[j].questions.length > 0){
                                var Questions = QuestionGroup[j].questions;
                                for(var k=0;k<Questions.length;k++){
                                    Questions[k].type = "paper";
                                    Questions[k].lnOrder = iNum;
                                    Questions[k].gpOrder = iCode;
                                    idata.push(Questions[k]);
                                    if(Questions[k].isSplite == "0"){//不可拆分
                                        if(k == Questions.length - 1){//此group的最后1题
                                            iNum++;//题号++
                                        }
                                    }else if(Questions[k].isSplite == "1"){//可拆分
                                        iNum++;//题号++
                                    }
                                    if(k == Questions.length - 1){
                                        iCode++;//组别统一码++
                                    }
                                }
                            }
                            idata.push(groupEnd);
                        }
                    }
                }
                idata.push(lineEnd);
            }
        }
    }
    return idata;
}
