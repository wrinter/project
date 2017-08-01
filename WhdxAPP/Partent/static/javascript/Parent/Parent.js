/**
 * Created by lc on 2017/7/6.
 */
getData();
function getData(){
	var Parent_tipic = $(".Parent_tipic");
	var Parent_tu = $(".Parent_tu");
	var Partent_time = $(".Partent_time");
	var Partent_word = $(".Partent_word");
	var Partent_loveword = $(".Partent_loveword");
	var Parent_Article = $(".Parent_Article");
	var parmas = {};
	parmas.id = Request.id;
	$.ajax({
		type : "post",
		url : "/genearch/information/content",
		data : parmas,
		dataType : "json",
		success : function(data){
			console.log(data)
			if(data.retCode == '0000'){
				var Dtrue = data.retData;
				var faBuTime = Dtrue.faBuTime;
				var readNum = Dtrue.readNum;
				var title = Dtrue.title;
				var content = Dtrue.content;
				var favoriteNum = Dtrue.favoriteNum;
				var url = Dtrue.url;
				Partent_loveword.text(favoriteNum);
				Partent_word.text(readNum);
				Partent_time.text(faBuTime);
				Parent_tipic.text(title);
				Parent_tu.attr("src",url)
				content=content.replace(/\&lt;/g,'<');
				content=content.replace(/\&amp;#39;/g,'´');
				content=content.replace(/\&gt;/g,'>');
				content=content.replace(/\&quot;/g,'"');
				content=content.replace(/\&amp;quot;/g,'"');
				content=content.replace(/\&amp;nbsp;/g, "");
				Parent_Article.html(content);
			}
		},
		error : function(e){
			console.log(e)
		}
	})
}
