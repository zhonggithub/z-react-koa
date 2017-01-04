import React from 'react';

//import 'antd/dist/antd.less';
import './style.less';
const Footer = React.createClass({
  render(){
    return (
      <div id="footer" className="footer-wrap">
        <div className="ant-layout-footer">
          HMS 版权所有 © 2016 由盛阳科技技术部支持
        </div>
      </div>
    );
  }
});
module.exports = Footer;
