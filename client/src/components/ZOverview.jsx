/**
* @Author: Zz
* @Date:   2016-10-07T21:31:53+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T23:22:23+08:00
*/
import React from 'react';
import { Link } from 'react-router';
import { Card, Col, Row, Icon } from 'antd';

export default class ZOverview extends React.Component {
  static propTypes ={
    data: React.PropTypes.array,
    title: React.PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      styleArray: [
        {"background": '#3598dc', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#e7505a', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#32c5d2', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#8e44ad', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#578ebe', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#44b6ae', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'},
        {"background": '#8775a7', "color": '#fff', "fontSize": '24px', "textAlign": 'right', "height": '120px'}
      ]
    };
  }

  cardOpertions(dataArray){
    let styleTmp = {minWidth: '300px'};
    let spanTmp = "6";
    if(dataArray.length === 1){
      spanTmp = "24";
    }else if(dataArray.length === 2) {
      spanTmp = "12";
    } else if(dataArray.length === 3){
      spanTmp = "8";
    }
    let i = -1;
    return dataArray.map((item) => {
      ++i;
      if(i >= this.state.styleArray.length)
        i = 0;
      return (
        <Col span={spanTmp} key={item.title} style={styleTmp}>
          <Card bodyStyle={this.state.styleArray[i]}>
            <div style={{"float": 'left'}}>
              <Icon type={item.icon || "area-chart"} style={{"fontSize": '80px'}} />
            </div>
            <p>{item.content}</p>
            <div style={{"fontSize": "16px", "margin": "20px 0"}}>
              <Link to={item.href} style={{"color": '#fff'}}>{item.title}<Icon type="right-circle-o" style={{marginLeft: '10px'}}/></Link>
            </div>
          </Card>
        </Col>
      );
    });
  }

  renderTitle() {
    if(this.props.title)
      return <h3 style={{fontSize: "18px", paddingLeft: '20px' }}>{this.props.title}</h3>
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        <Row gutter={16} style={{paddingTop: '20px'}}>
          {this.cardOpertions(this.props.data)}
        </Row>
        {/* <Row gutter={16} style={{padding: '0px 20px 0px 20px'}}>
          {this.cardOpertions(this.props.data)}
        </Row> */}
      </div>
    );
  }
}
