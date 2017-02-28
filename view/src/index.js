/**
* @Author: Zz
* @Date:   2016-09-10T10:35:08+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-12T21:40:21+08:00
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import { Login, PageLoginIndex } from './login';
import { ZLayout } from './components';
import stores from './stores';

let mountNode = document.getElementById('appContent');

function auth(nextState, replace) {
  if(!stores.appStore.isLogin){
    replace('/group/login');
  }
}

// ReactDOM.render((
//   <Provider {...stores}>
//     <Router history={ browserHistory }>
//       <Route path="/" >
//         <IndexRedirect to="/group" />
//         <Route path="group" onEnter={ auth } component={ ZLayout }>
//           {/* <IndexRedirect to="/group/dockingplatform/overview/datacount" /> */}
//           <IndexRedirect to="/group/dockingplatform/weixin/interface" />
//           <Route path="dockingplatform" component={ DockingPlatformSideNav }>
//             {/* <IndexRedirect to="/group/dockingplatform/overview/datacount" /> */}
//             <IndexRedirect to="/group/dockingplatform/weixin/interface" />
//             <Route path="overview">
//               <Route path="datacount" component={ PageDataCount }/>
//               <Route path="couponcount" component={ PageCouponCount }/>
//             </Route>
//             <Route path="weixin">
//               <IndexRedirect to="/group/dockingplatform/weixin/overview" />
//               <Route path="overview" component={ PageWXOverview } />
//               <Route path="interface" component={ PageWXInterfaceEdit } />
//               <Route path="customizemenu" component={ PageOrderUncheckList } />
//               <Route path="materialmgr" component={ PageMaterialMgr } />
//               <Route path="materialmgr/newmaterial" component={ PageMaterialEdit } />
//               <Route path="autoreplymgr" component={ PageAutoReplyMgr } />
//               <Route path='autoreplymgr/autoreplyedit' component={PageAutoReplyEdit} />
//               <Route path="coupon" component={ PageCouponList }/>
//               <Route path='coupon/edit' component={ PageCouponNew }/>
//               <Route path='coupon/wxcash' component={ PageWXCashList } />
//               <Route path='coupon/user' component={ PageCouponUserList } />
//             </Route>
//             <Route path="crs">
//               <IndexRedirect to="/group/dockingplatform/crs/interface" />
//               <Route path="interface" component={ PageCRSInterface }/>
//               <Route path="pricecodemgr" component={ PagePriceCodeMgr }/>
//               <Route path="hotelmanager" component={ PageHotelMgr }/>
//               <Route path="brandmanager" component={ PageBrandMgr }/>
//               <Route path='pricecodemgr/newpricecode' component={PagePriceCodeNew}/>
//               <Route path='pricecodemgr/listpricecode' component={PagePriceCodeList}/>
//               <Route path='pricecodemgr/editpricecode' component={PagePriceCodeEdit}/>
//               <Route path='hotelmanager/edithotelinfo' component={PageHotelInfo}/>
//               <Route path='hotelmanager/listroompricecodeinfo' component={PageRoomPriceCodeList}/>
//               <Route path='hotelmanager/listroompricecodeinfo/pricedetails' component={PagePriceDetails}/>>
//               <Route path='hotelmanager/listroom' component={PageRoomList}/>
//               <Route path='hotelmanager/listroomtype' component={PageRoomTypeList}/>
//               <Route path='hotelmanager/editroomtype' component={PageRoomTypeEdit}/>
//               <Route path='hotelmanager/listavailablehouses' component={PageAvailableHousesList} />
//               <Route path='hotelmanager/editpaymentconfig' component={PagePaymentConfigEdit} />
//               <Route path='brandmanager/editbindhotel' component={PageBindHotelEdit}/>
//               <Route path='brandmanager/editbrand' component={PageBrandEdit}/>
//             </Route>
//             <Route path="sms">
//             </Route>
//             <Route path="system">
//             </Route>
//           </Route>

//           <Route path="groupmgr" component={ GroupSideNavigation }>
//             <IndexRedirect to="/group/groupmgr/info/base" />
//             <Route path="info">
//               <Route path="base" component={ PageBaseInfoEdit }/>
//               <Route path="style" component={ PageStyleSetEdit }/>
//               <Route path="templatemsg" component={ PageTemplateMessage }/>
//             </Route>
//             <Route path="order">
//               <Route path="count" component={ PageOrderSummary }/>
//               <Route path="unchecked" component={ PageOrderUncheckList }/>
//               <Route path="pending" component={ PageOrderPendingList }/>
//               <Route path="invalid" component={ PageOrderInvalidList }/>
//               <Route path='info' component={ PageOrderInfo } />
//               <Route path='notification' component={ PageOrderNotification } />
//             </Route>
//             <Route path="evaluate">
//               <Route path="count" component={ PageBaseInfoEdit }/>
//               <Route path="hotel" component={ PageBaseInfoEdit }/>
//             </Route>
//           </Route>

//         </Route>
//         <Route path="/group/login" component={ Login } />
//         <Route path="/group/login/index" component={ PageLoginIndex } />
//       </Route>
//     </Router>
//   </Provider>
// ), mountNode);
