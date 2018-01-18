import React from 'react'
import ReactDOM from 'react-dom'

var HomePage = React.createClass({
  render: function() {
    return (
      <h2>Hello, world!</h2>
    );
  }
});

module.exports = HomePage
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