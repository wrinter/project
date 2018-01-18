import React from 'react'
import ReactDOM from 'react-dom'
import Treasure from './Treasure.jsx'

var TableRight = React.createClass({
    getInitialState: function(){  
      return {
        data: [],
        pageIndex: 1,
        pageSize: 10
      }
    }, 

    getData: function(page) {

      var host = 'http://api.zhryf.com/v2/';
      var urls = host+'Commodities?lectureId & restrictions & sorts &page='+localPageIndex+'&pageSize='+this.state.pageSize;
      //var _this = this;
      
       console.log(localPageIndex + ': 我是父组件')

      $.ajax({
          url: urls,
          type: 'get',
          /*dataType: 'json',*/
          beforeSend: function(xhr) {
            var urlV2 = urls.indexOf("/v2/");
            if(urlV2 > 0) {
              xhr.setRequestHeader('X-User-Agent', 'fafa-web');
            }
          },  
          success: (data,status,xhr) => { 
            
            /*for(var i = 0; i < data.length; i++){
              console.log(data[i].title)
            }*/
              
            var pageNum = xhr.getResponseHeader('X-Total-Count')



            // //console.log(pageNum)正常
            // this.setState ({
            //   data: data
            // })
            // this.setState ({
            //   pageNum: Math.ceil(pageNum/this.state.pageSize)
            // })
             //var pageNum=Math.ceil(xhr.getResponseHeader('X-Total-Count')/this.state.pageSize)
           
            //console.log(xhr.getResponseHeader('X-Total-Count'))
            //console.log(data.length)
            //console.log(data)正常
            //ajax请求成功之后重新渲染state，让页面获取render
            
          },
          error: () => {
            return []
          } 

      })   
    },

    setIndex: function(eve){
      
      console.log(eve.target.value)

      var localPageIndex = eve.target.value;
      getData(localPageIndex);

      this.setState({
        pageIndex: eve.target.value
      })
    },
    componentDidMount: function(){  
      //console.log(this.state.pageText)
      //debugger;
      var host = 'http://api.zhryf.com/v2/';
      var urls = host+'Commodities?lectureId & restrictions & sorts &page='+this.state.pageIndex+'&pageSize='+this.state.pageSize;
      //var _this = this;
      
       console.log(this.state.pageIndex + ': 我是父组件')

      $.ajax({
          url: urls,
          type: 'get',
          /*dataType: 'json',*/
          beforeSend: function(xhr) {
            var urlV2 = urls.indexOf("/v2/");
            if(urlV2 > 0) {
              xhr.setRequestHeader('X-User-Agent', 'fafa-web');
            }
          },  
          success: (data,status,xhr) => { 
            
            /*for(var i = 0; i < data.length; i++){
              console.log(data[i].title)
            }*/
              
            var pageNum = xhr.getResponseHeader('X-Total-Count')

            //console.log(pageNum)正常
            this.setState ({
              data: data
            })
            this.setState ({
              pageNum: Math.ceil(pageNum/this.state.pageSize)
            })
             //var pageNum=Math.ceil(xhr.getResponseHeader('X-Total-Count')/this.state.pageSize)
           
            //console.log(xhr.getResponseHeader('X-Total-Count'))
            //console.log(data.length)
            //console.log(data)正常
            //ajax请求成功之后重新渲染state，让页面获取render
            
          },
          error: () => {
            return []
          } 

      })      

/* $.get("http://api.zhryf.com/v2/Commodities?type=5&page=1&pageSize=10", function(data){
          //console.log(data)

          var data =  JSON.stringify(data)
          
          console.log(data)
          //ajax请求成功之后重新渲染state，让页面获取render
          this.setState({
            data: data
          })
        }.bind(this),"json")*/

        /*beforeSend: function(xhr) {
            if (loginHead && loginAuthorization) {
                xhr.setRequestHeader('Authorization', loginHead + loginAuthorization);
            }
            if(urlV2 > 0) {
                xhr.setRequestHeader('X-User-Agent', 'fafa-web');
            }
        },*/

       /*var xhr = new XMLHttpRequest()
        xhr.open("GET", "http://api.zhryf.com/Commodities?type=5&page=1&pageSize=10", true)
        //根据情况选择
        xhr.withCredentials = true
        xhr.send()

        xhr.onreadystatechange = () => {
            if(xhr.readyState == XMLHttpRequest.DONE){
                if(xhr.status == 200){
                    var gotServices = JSON.parse(xhr.responseText)
                    this.setState({
                        services : gotServices
                    })
                }
            }else{
                alert("ajax请求失败")
            }
        }*/
      /*if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
          document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
        }
      }
      xmlhttp.open("GET","url",true);
      xmlhttp.send(); */
    },
    render: function(){  
    	return  (
        <div id = "myDiv" style = {{'height': '100%','width': '100%','overflow': 'hidden'}}>
          <Treasure pageNum={this.state.pageNum} setIndex={this.setIndex} data={this.state.data} getData={this.getData}/>
  	    </div>
    	)
    }  
})
  
module.exports = TableRight





