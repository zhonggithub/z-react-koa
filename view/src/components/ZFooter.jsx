import React from 'react';

import './style.less';
export default class ZFooter extends React.Component {
  render(){
    return (
      <div id="footer" className="footer-wrap">
        <div className="ant-layout-footer">
          HMS 版权所有 © 2016 由盛阳科技技术部支持
        </div>
      </div>
    );
  }
};
