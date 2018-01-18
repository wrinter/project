import React from 'react'
import ReactDOM from 'react-dom'
import {Pagination} from 'react-bootstrap'
import Page from '../Pagination/Pagination.jsx'


var Treasure = React.createClass({
  
  getInitailState: function(){
    return {

    }
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }, 
  componentDidMount: function(){
              
  },
  render: function(){ 
    //const data = this.props
    var renderData = [];
    var pageTotal = this.props.pageNum;
    //console.log(pageTotal)
    //console.log(data)
    var taskData = this.props.data.map((item,index) => {
      //console.log(item.title+':'+index)
      
      renderData.push(
      	<div key={index} style={{'width': '618px','height': '98px','marginLeft': '50px'}}>
      	  <div style={{'width': '103px','height': '116px','float': 'left','textAlign': 'center','color': '#000','fontSize': '14px','paddingTop': '30px','overflow': 'hidden'}}>
      		  {item.addTime}
      	  </div>
          <div style={{'width': '513px','height': '116px','float': 'left','listStyle': 'none','overflow': 'hidden'}}>
            <p style={{'color': '#ea5a3d','marginLeft': '70px','marginTop': '5px'}}>
              {item.addTime}	
            </p>
            <p style={{'marginLeft': '70px','marginTop': '5px'}}>
              <span style={{'color': '#ff8400'}}>【{item.typeName}】</span>
              <a style={{'color': '#337ab7'}}>《{item.title}》</a>
            </p>
            <p style={{'marginLeft': '300px','marginTop': '-10px','color': '#ff8400'}}>
              购买数<span>0</span>
              评论<span>0</span>
              评分<span>0</span>
            </p>
          </div>
        </div> 
      )
    })
    //console.log(renderData)
    //var totalPage = 20
    
    return  (
      
      <div className="Treasure-render">
        {renderData}
        {/*<div style={{'width':'100%','height': '40px'}}>
          <Page total = {pageTotal}/>
        </div>*/}
        
        <input onChange={this.props.setIndex} />

        {/*<div style = {{}}>
          	<Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={20}
              maxButtons={5}
              activePage={activePage}
              onSelect={this.handleSelect} />
          </div>*/}
      </div>
    )
   },  
   onChangeData: function(data){
     
   }

})

module.exports = Treasure