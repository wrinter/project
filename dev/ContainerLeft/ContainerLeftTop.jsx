import React from 'react'
import ReactDOM from 'react-dom'
import ContainerLeftCenter from './ContainerLeftCenter.jsx'
/*import ContainerLeftRight from '../ContainerLeftRight/ContainerLeftRight.jsx'*/



var ContainerLeftTop = React.createClass({
  render: function() {
    return (
      <div style={{'width': '1030px','height': '100%','margin': '0 auto','padding': '0'}}>
	    {/*通过布局减少数据传递，统一到组件中处理*/}
	    <ContainerLeftCenter />
	  </div> 
    );
  }
});


module.exports = ContainerLeftTop

