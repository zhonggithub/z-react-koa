/*
 * @Author: Zz
 * @Date: 2017-05-22 14:36:01
 * @Last Modified by:   Zz
 * @Last Modified time: 2017-05-22 14:36:01
 */
import React from 'react';

import './style.less';
export default class ZFooter extends React.Component {
  render(){
    return (
      <div id="footer" className="footer-wrap">
        <div className="ant-layout-footer">
          Copyright © Zz 2017
        </div>
        <div style={{ background: 'white', textAlign: 'center' }}><span><a href="http://103.50.253.187/zzblog/about/">By Zz</a></span></div>
      </div>
    );
  }
};
