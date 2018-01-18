import React from 'react'
import ReactDOM from 'react-dom'
import './HeaderTop.css'
/*var Styles = require('./HeaderTop.css')*/

var HeaderTop = React.createClass({
  render: function() {
    return (
      <div className="container-top" style={{'overflow': 'hidden'}}>
        <div className="container-one" id="container-one">
          <ul className="cnavbar" style={{'listStyle':'none','float':'left'}}>
              <li style={{'float':'left'}}><img src="" /></li>
             
              <li style={{'float':'left'}}><a href="" target="_blank" style={{'listStyle':'none','textDecoration':'none','color':'#fff'}}>手机客户端</a></li>
          </ul>
          <ul className="navbar-ul" style={{'listStyle':'none','float':'right','color':'#fff'}}>
              <li className="toplogin" style={{'float':'left'}}>欢迎回来，
                  <a className="topLeclogin" style= {{'cursor': 'pointer','textDecoration': 'none'}}>小fhy&nbsp;&nbsp;</a>
              </li>
              <li onClick="" className="toplogin" style={{'float': 'left','cursor': 'pointer'}}><a style={{'textDecoration': 'none'}}>注销</a></li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = HeaderTop



/*var src = require("../../Images/index/phone.png")*/
 /* height="21" width="13" alt="" */
/*ReactDOM.render(
  <CommentBox />,
  document.getElementById('example')
);*/


/*export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  render(){
    <ul className="header">
       <li>手机客户端</li>  
       <li>欢迎回来,小fhy</li>  
       <li>注销</li>  
    </ul> 
  } 
}

module.exports = HomePage*/