import React from 'react';
import { appStore } from '../stores';

export default class PageLoginIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const params = this.props.location.query;
    location.href = '';
    appStore.groupLogin(params).then(res => {
      appStore.token = res.token;
      appStore.payload = res.payload;
      location.href = '/group/dockingplatform/weixin/interface';//'/group/dockingplatform/overview/datacount';
    }).then(err => {
      console.log(`登入失败！${err.message}`);
    });
  }
  render() {
    return (<div></div>)
  }
}
