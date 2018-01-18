import React from 'react'
import ReactDOM from 'react-dom'
import TabLeft from './TabLeft.jsx'
import TabLeRight from './TabLeRight.jsx'
import { Tabs,Tab } from 'react-bootstrap'
import TableControl from './TableControl.jsx'
// import Button from 'antd/lib/button'
// import Tabs from 'antd/lib/tabs'
// import 'antd/lib/button/style'
// import 'antd/lib/tabs/style'
/*import { Button, Tabs } from 'antd'*/

/*const TabPane = Tabs.TabPane;
const operations = <Button>金币：5800</Button>*/

var ContainerLeftRight = React.createClass({

  render: function() {
    
    return (
      <div className= "info-test-tittle" style={{'width': '100%','height': '100%','overflow': 'hidden','backgroundColor': '#fff'}}>
        <TableControl>
          <div name = "发布">
            <TabLeft />
          </div>
          <div name = "已发布">
            <TabLeRight />
          </div>
        </TableControl>
        {/*<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="发布">
            <TabLeft />
          </Tab>
          <Tab eventKey={2} title="已发布">
            Tab 2 content
            <TabLeRight />
          </Tab>
        </Tabs>*/}
      </div>
    );
  }
});


module.exports = ContainerLeftRight

