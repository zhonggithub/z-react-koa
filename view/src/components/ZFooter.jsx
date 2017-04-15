import React from 'react';

import './style.less';
export default class ZFooter extends React.Component {
  render(){
    return (
      <div id="footer" className="footer-wrap">
        <div className="ant-layout-footer">
          版权所有 © 2016 
        </div>
      </div>
    );
  }
};
