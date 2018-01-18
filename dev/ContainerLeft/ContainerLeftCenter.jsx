import React from 'react'
import ReactDOM from 'react-dom'
import './ContainerLeftCenter.css'
import ContainerLeftRight from '../ContainerLeftRight/ContainerLeftRight.jsx'
import MicroscopicPagination from '../MicroscopicPoint/MicroscopicPagination.jsx'
import TabsControl from './TabsControl.jsx'


var ContainerLeftCenter = React.createClass({
  getInitialState: function(){
    return {
      bgcolor: "",
      fbgcolor: "#fff",
      bgborder: "1px solid #dedede",
      changecolor: "",
      flag: false
    }
  },
  secondClick: function(){
    /*console.log()*/
    //alert("跳转成功")
    
    this.setState({
      fbgcolor: "",
      firstcolor: "#fff",
      flag: true
    })
  },

  render: function() {
    var textcolor = this.state.bgcolor;
    var textfcolor = this.state.fbgcolor;
    var textborder = this.state.bgborder;
    
    var style = {
      backgroundColor: textcolor,
      borderBottom: textborder
    };
    var initstyle = {
        backgroundColor: textfcolor,
        borderBottom: textborder 
    };
    
    return (
      <div>
        <div className= "acount-info" style={{'width': '240px','height': '240px','marginTop': '20px','padding': '0','border': '1px solid #dedede','borderBottom': 'none','overflow': 'hidden'}}>
          <img />  
          <p className= "acount-nick" style={{'marginTop': '120px'}}>
            <span className= "cursor" style={{'marginLeft': '90px','fontSize': '16px'}}>小fhy</span>
          </p> 
          <p className= "acount-other" style={{'marginLeft': '20px','fontSize': '16px'}}> 
            <span>发贝：8913380</span> &nbsp;&nbsp;&nbsp;&nbsp; 
            <span className= "fans">粉丝：14</span> 
          </p>
        </div>
        <div style={{'float': 'right','border': '1px solid #fff','width': '772.5px','marginTop': '-240px','backgroundColor': '#fff'}}>
          
          {/*<ContainerLeftRight />*/}
          {/*<MicroscopicPagination />*/}
        </div>
        <div className="ContainerLeftCenter-stv" style={{'width': '240px','height': '594px','margin': '0','padding': '0','  border': '1px solid #f00','border': '1px solid #dedede'}}>
                <div style={{'width': '240px','height': '40px','borderBottom': '1px solid #dedede'}}>
                </div>

                <TabsControl>
                    <div name = "微观点">
                        微观点
                    </div>
                    <div name = "研报">
                        研报
                    </div>
                    <div name = "问答">
                        问答
                    </div>
                    <div name = "话题">
                        话题
                    </div>
                    <div name = "百宝箱">
                        <ContainerLeftRight />
                    </div>
                    <div name = "活动申请">
                        活动申请
                    </div>
                    <div name = "个人信息">
                        个人信息
                    </div>
                    <div name = "交易记录">
                        交易记录
                    </div>
                </TabsControl>
                <div style={{'width': '197px','height': '61px','lineHeight': '61px','position': 'relative','left': '0','top': '479px','fontSize': '17px','textAlign': 'center'}}>使用协议</div>
        </div>
       {/* <div className="ContainerLeftCenter-stv" style={{'width': '240px','height': '590px','margin': '0','padding': '0','  border': '1px solid #f00','border': '1px solid #dedede','overflow': 'hidden'}}>
          
          <ul style={{'listStyle': 'none'}}>
            <li className="li-first" style={{'height': '40px','borderBottom': '1px solid #dedede'}}>
              <a></a>
            </li>
            <li id="tweetSide" className="active-li" style={style}>
              <a href="#tweet" className="MeTweet" onClick = {this.firstClick}>微观点</a>
            </li>
            <li id="articleSide" style={style}>
              <a href="#article" className="MeArticle" onClick = {this.secondClick}>研报</a>
            </li>
            <li id="questionSide" style={style}>
              <a href="#question" className="myAsk" onClick = {this.threeClick}>问答</a>
            </li>
            <li id="topicSide" style={style}>
              <a href="#topic" className="MeTopic" onClick = {this.fourthClick}>话题</a>
            </li>
            <li id="storeSide" style={initstyle}>
              <a href="#store" className="MeStore" onClick = {this.fifthClick}>百宝箱</a>
            </li>
            <li id="activitySide" style={style}>
              <a href="#activity" className="MeActivity" onClick = {this.sixthClick}>活动申请</a>
            </li>
            <li id="infoSide" style={style}> 
              <a href="#info" className="PersonalSetting" onClick = {this.seventhClick}>个人信息</a>
            </li>
            <li id="dealSide" style={style}>
              <a href="#deal" className="TradingRecord" onClick = {this.eighthClick}>交易记录</a>
            </li>
            <li id="agreement">
              <a href="#agreement" className="agreement">使用协议</a>
            </li>
          </ul>
        </div>*/}
      </div>
    );
  }

});


module.exports = ContainerLeftCenter
