import React from 'react'
import ReactDOM from 'react-dom'
/*import { Button, Tabs } from 'antd'*/
import './TabLeft.css'
import { Button } from 'react-bootstrap'


/*const wellStyles = {maxWidth: 400, margin: '0 auto 10px'}*/
var TabLeft = React.createClass({
  buttonPass: function() {

    document.getElementById("file").click();
    

  },
  morPast: function() {

  },
  addrChange: function() {
    //var position;
    //蒙眼法赋值组件传值
    //this.setState({position: this.refs.file.getDOMNode().value});
    //this.setState({position: document.getElementById("file").value})
    //var position = document.getElementById("file").value
    //console.log(position)
    //js单赋值 不做循环处理 只从监听处拿值（特殊情况）最快相应，但是是baseurl，需做处理
    document.getElementById("uptip").innerHTML = document.getElementById("file").value;
  },
  render: function() {
    return (
      <div className= "TabLeft-bz-03-13-bz" style={{'width': '100%','height': '497px','overflow': 'hidden'}}>
        {/*<div className="well" style={wellStyles}>
          <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
          <Button bsSize="large" block>Block level button</Button>
        </div>*/}
        <div className="form-group-first" style={{'overflow': 'hidden'}}>
            <label className="control-label" style={{'float': 'left'}}>
                标题  :
            </label>
            <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 store-title" style={{'float': 'left'}}>
                <input id="store-title" type="text"  className="form-control" placeholder="请输入您的标题" title="" />
            </div>
        </div>
        <div className="form-group col-sm-12 col-xs-12" style={{'overflow': 'hidden'}}>
            <label className="control-label" style={{'float': 'left'}}>
                简介  :
            </label>
            <div className="col-lg-10 col-xs-10 intro" style={{'float': 'left'}}>
                <textarea name="" className="form-control-textarea" id="intro" title=""></textarea>
            </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" style = {{'overflow': 'hidden'}}>
            <label className="control-label-type" style={{'float': 'left'}}>
                类型  :
            </label>
            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3" style = {{'float': 'left'}}>
                <form role="form">
                  <div className="form-group">
                      <select className="form-control-select" id="store-type"> 
                         <option value="1">战法</option><option value="2">报告</option>
                      </select>
                  </div>
                </form>
            </div>
            <label className="control-label-second" style={{'float': 'left'}}>
                价格:
            </label>
            <div className="col-md-6  col-sm-6 col-xs-6">
                <form role="form">
                <div className="form-group">
                    <input type="number" className="form-control-input" id="price" min="0" title="" />
                    <label className="control-label" style={{'float': 'left', 'margin': '-7px 0 0 10px'}}>
                        元
                    </label>
                </div>
                </form>
            </div>
        </div>
	    <div className="form-group" style={{}}>
            <div className="col-md-10 col-sm-10 col-xs-10" id="fileDiv">
                {/*<button className="btn-btn-default-load" type="button" id="btn-addfile" data-original-title="" title="">
                    +添加文件
                </button>*/}
                <Button className="test-react" style={{'background': '#fc8919','color': '#fff'}} onClick={this.buttonPass}>
                   +添加文件
                </Button>
                <span id="uptip" className="uptip"></span> 
                <p id="fileTypeTip" style={{'color': '#fc8919','marginLeft': '75px'}}>请上传PDF格式、RAR格式或ZIP格式文件</p>
                <div className="alert alert-warning" role="alert" style={{'display': 'none'}} id="maketip">
                    <a href="#" className="alert-link">文件上传成功</a>
                </div>
                <div className="modalbs-example-modal" style={{'display': 'none', 'paddingRight': '17px'}}>
                    <div className="modal-dialog modal-sm">
                        <div style={{'height': '30%'}}>
                        </div>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close">
                                    <span>×</span></button>
                                <h4 className="modal-title">
                                    错误提示
                                </h4>
                            </div>
                            <div className="modal-body">
                                您上传的文件类型错误，应该上传PDF或ZIP格式！
                            </div>
                        </div>
                        {/*<!-- /.modal-content -->*/}
                    </div>
                    {/*<!-- /.modal-dialog文件格式错误提示 -->*/}
                </div>
            </div>
            <form id="form1" action="" method="post">
                <input type="file" id="file" name="file" ref="file" className="file" style={{'display': 'none'}} onChange={this.addrChange} />
            </form>
        </div>
        <div className= "form-group submitBtn" style={{'textAlign': 'center'}}>
            <button className="test-react-submit" style={{'background': '#fc8919','color': '#fff'}} onClick={this.morPast}>
                提交
            </button>
        </div>
        <div className="alert-alert-warning" role="alert" style={{'display': 'none'}}>
            <a href="#" className="alert-link">提交成功</a>
        </div>
      </div>
    );
  }
})


module.exports = TabLeft

