/**
* @Author: Zz
* @Date:   2016-09-14T19:25:42+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:33:17+08:00
* @Description: 统计组件
*/
import React from 'react';
import ReactHighcharts from 'react-highcharts';
import {Icon, Select } from 'antd';
import DefDatePicker from '../components/DefDatePicker';

const Option = Select.Option;

export default class Statistics extends React.Component {
    static PropTypes = {
        config: React.PropTypes.object,
        title: React.PropTypes.string,
        onChange: React.PropTypes.func, //时间选择器回调函数,接受两个参数: dates, dateStrings
        datePicker: React.PropTypes.bool, //是否显示时间选择器
        lineSelect: React.PropTypes.bool, //是否显示图形选择器
    }

    constructor(props){
        super(props);
        this.state = {
            config: {
                  title: {
                    text: '统计'
               },
            },
            selected: '',
            select: ['全部']
        };
    }

    handleChange = (value) => {
        this.setState({ selected: value });
    }

    renderOption() {
        const config = this.props.config;
        if(!config || !config.series || config.series.length === 0)
            return null;
        const tmpOptions = config.series.map( item => {
            return <Option value={item.name} key={item.name}>{item.name}</Option>
        });
        let options = [] ;
        options.push(<Option value="全部" key="全部">全部</Option>);
        options.push(tmpOptions);
        return options;
    }

    renderSelect() {
        let tmpStyle = { width: 150, marginRight: '10px' };
        if(this.props.datePicker === false)
            tmpStyle = { width: 150 };

        return <Select size="large" defaultValue="全部" style={tmpStyle} onChange={this.handleChange}>
                    {this.renderOption()}
               </Select>
    }

    render() {
        let config = Object.assign({}, this.props.config || this.state.config);

        let tmp = config.series;
        if(this.state.selected !== '全部'){
            for( let i = 0; i < tmp.length; ++i){
            const item = tmp[i];
            if(item.name === this.state.selected){
                config.series = [item];
                break;
            }
          }
        }

        return (
          <div className="hms-group-layout-border" >
            <div className="hms-statistics-title">
              <span style={{fontSize: '16px', margin: '8px 0 -17px 10px'}}><Icon type="area-chart" style={{marginLeft: "10px", marginRight: '5px'}}/>{this.props.title}</span>
              <div className="hms-statistics-title-right">
                { this.props.lineSelect === false ? null : this.renderSelect() }
                { this.props.datePicker === false ? null :  <DefDatePicker onChange={this.props.onChange}/>}
              </div>
            </div>
            <div className="hms-statistics-title-header"></div>
            <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
          </div>
        );
    }
}
