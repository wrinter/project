/**
 * Created by zxl on 2017/8/8.
 */
var work = new Vue({
    el: '#work',
    data: {
        className:'',
        workName:'',
        unSubmitList:[]
    },
    mounted:function(){
        this.getWorkDetails();
    },
    methods: {
        getWorkDetails: function() {
            var SubData = {};
            var that = this
            //SubData.paperAssignId = Request.paperAssignId;
            SubData.paperAssignId = '08fff5a27cfb4df380d7812a10a69bfe'
            $.ajax({
                type : "post",
                url : "/pad/teacher/class/report/work/details",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.className = data.retData.className
                        that.workName = data.retData.paperName
                        var pieData = []
                        that.unSubmitList = data.retData.unSubmitList
                        var unSubmittedSize = data.retData.unSubmitList.length
                        pieData.push({value:data.retData.submittedSize, name:'已交'},{value:unSubmittedSize,name:"未交"})
                        that.showPie(pieData)
                        //that.workInfo = data.retData
                    }
                }
            })
        },
        showPie: function(data){
            var myChart = echarts.init(document.getElementById('c_echart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    x: 'right',
                    y: 'bottom',
                    data:['未交','已交']
                },
                color:[
                    '#30C3A6', '#F8F8F8'
                ],
                series: [
                    {
                        name:'作业提交情况',
                        type:'pie',
                        radius: ['50%', '80%'],
                        center: ['35%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '24',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:data
                    }
                ]
            };
            myChart.setOption(option);
        },
        checkList: function(){
            //javascript:bc.selectPics();
        }
    }
});