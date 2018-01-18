import React from 'react'
import ReactDOM from 'react-dom'
import HeaderTop from './Header/HeaderTop.jsx'
import NavVivo from './Nav/NavVivo.jsx'
import ContainerLeftTop from './ContainerLeft/ContainerLeftTop.jsx'


var CommentBox = React.createClass({
  render: function() {
    return (
      <div>
        <HeaderTop />
        <NavVivo />
        <ContainerLeftTop />
        <div style={{'width': '100%','height': '100px'}} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('example')
);
