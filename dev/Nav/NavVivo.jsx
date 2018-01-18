
import React from 'react'
import ReactDOM from 'react-dom'
import './NavVivo.css'
/*var Styles = require('./HeaderTop.css')*/

var NavVivo = React.createClass({
  render: function() {
    return (
      <div className="container-public-padding" style={{'border': '1px solid #e7e7e7','boxShadow': '#666 0px 1px 5px','overflow': 'hidden'}}>
        <div className="navbar-container">
          <div className="navbar-one" style={{'float': 'left','marginTop': '20px'}}>
              <a href="" className="navbar-one-img" style={{'float': 'left'}}>
                  <img />
              </a>
              <div className="navbar-one-text" style={{'float': 'left'}}>
                  <h2 style={{'margin':'0','padding': '0'}}>Fafa</h2>
                  <p style={{'margin':'0','padding': '0'}}>发现一个平台 发掘更多财富</p>
              </div>
          </div>
          <div className="navbar-two" style={{'float': 'right'}}>
              <ul className="Nav-classify">
                  <li><a href="" target="_blank">首页</a></li>
                  <li><a href="" target="_blank">微观点</a></li>
                  <li><a href="" target="_blank">研报</a></li>
                  <li><a href="" target="_blank">问答广场</a></li>
                  <li><a href="" target="_blank">百宝箱</a></li>
                  <li style={{'marginRight': '0'}}><a href="javascript:void(0)" id="">我的</a></li>
              </ul>
          </div>
        </div>  
      </div>
    );
  }
});

module.exports = NavVivo



/*src="../../Images/index/icon.png" height="34" width="34"*/