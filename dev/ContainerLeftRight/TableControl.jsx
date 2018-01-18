import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'

class TableControl extends React.Component{
    constructor(  ){
        super(  )
        this.state = { 
            currentIndex : 0
        }
    }

    check_title_index( num ){
        return num === this.state.currentIndex ? "tab_title_two active_two" : "tab_title_two"
    }

    check_item_index( num ){
        return num === this.state.currentIndex ? "tab_item_two show" : "tab_item_two"
    }

    render(  ){
        let _this = this
        return(
            <div style={{'width': '772px','height': '100%'}}>
                { /* 动态生成Tab导航 */ }
                <div className="tab_title_wrap_two">
                    { 
                        React.Children.map( this.props.children , ( ele,num ) => {
                            return(
                                <div onClick={ (  ) => { this.setState({ currentIndex : num }) } } className={ this.check_title_index( num ) } >{ ele.props.name }</div>
                            )
                        }) 
                    }
                </div>
                { /* Tab内容区域 */ }
                <div className="tab_item_wrap_two">
                    {
                        React.Children.map(this.props.children,( ele,num )=>{
                            return(
                                <div className={ this.check_item_index( num ) }>{ ele }</div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default TableControl