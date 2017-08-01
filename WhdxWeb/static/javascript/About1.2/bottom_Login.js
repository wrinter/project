/**
 * Created by lc on 2017/6/22.
 */
//底部列表
navList();
function navList(){
    var FooterNav = $(".FooterNav");
    FooterNav.html("");
    $.ajax({
        type : "post",
        url : "/web/common/bottom/menu",
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                for(var i = 0 ; i < data.retData.length;i++){
                    var Dtrue = data.retData[i];
                    var label = Dtrue.label;
                    var value = Dtrue.value;
	                if(value == "about_us_keys"){
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/about.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
	                if(value == "02"){//公司
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/company.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
	                if(value == "03"){//学校
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/school.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
	                if(value == "recruitment_keys"){//人才招聘
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/join.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
	                if(value == "05"){//帮助中心
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/helpcenter.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
	                if(value == "06"){//意见反馈
		                var li = $("<li><a data-value='"+value+"' href='model/About1.2/idea.html' >"+label+"</a></li>").appendTo(FooterNav);
	                }
                }
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
