/**
* @Author: Zz
* @Date:   2016-09-28T20:05:36+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T10:55:24+08:00
*/
import moment from 'moment';

class AccountConvert {
  static login2ServerInfo(info) {
    return {
      UserName: info.account,
      UserPwd: info.password,
      LastLoginIP: info.ip,
    };
  }

  static create2ServerInfo(info) {
    return {
      UserName: info.account,
      UserPwd: info.password,
      TrueName: info.trueName,
    };
  }

  static toClientInfo(serverInfo) {
    return {
      code: serverInfo.code,
      message: serverInfo.message,
      data: {
        account: serverInfo.data.UserName,
        password: serverInfo.data.UserPwd,
        trueName: serverInfo.data.TrueName,
        roles: serverInfo.data.Roles,
        lastLoginTime: serverInfo.data.LastLoginTime,
        lastLoginIP: serverInfo.data.LastLoginIP,
        id: serverInfo.data.id,
        createAt: serverInfo.data.CreateAt,
        updateAt: serverInfo.data.UpdatedAt,
        tid: serverInfo.data.TID,
      },
      token: serverInfo.token,
      payload: serverInfo.payload,
    };
  }
}

class OrderConvert {
  static toClientInfo(serverInfo) {
    return {
      id: serverInfo.id,
      code: serverInfo.code,
      hotelName: serverInfo.hotel.name,
      // brandName: serverInfo.hotel.brand,
      status: serverInfo.status,
      payStatus: serverInfo.paymentStatus,
      checkInStatus: serverInfo.checkInStatus,
      customerType: serverInfo.user.userType,
      payMethod: serverInfo.paymentMethod,
      userId: serverInfo.user.id,
      nickName: serverInfo.user.nickName,
      name: serverInfo.user.name,
      tel: serverInfo.user.tel,
      checkInBeginDate: serverInfo.checkInBeginDate,
      checkInEndDate: serverInfo.checkInEndDate,
      orderDate: serverInfo.orderDate,
      roomType: serverInfo.hotel.roomType,
      roomTypeName: serverInfo.hotel.roomTypeName,
      orderRoomNum: serverInfo.hotel.orderNum,
      arriveDate: serverInfo.arriveDate,
      coupon: serverInfo.coupon,
      privilege: serverInfo.privilege,
      totalPrice: serverInfo.totalPrice,
      actualPrice: serverInfo.actualPrice,
      remark: serverInfo.remark,
      merchantRemark: serverInfo.merchantRemark,
      roomRice: serverInfo.hotel.roomRice,
      statusTimestamps: serverInfo.statusTimestamps,
      extInfo: serverInfo.extInfo,
      payExtInfo: serverInfo.payExtInfo,
      night: serverInfo.night,
      packageName: serverInfo.packageName,
      refundStatus: serverInfo.refundStatus,
      paymentDiscount: serverInfo.paymentDiscount,
    };
  }

  static renderStatusText(order) {
    let refundStatusStr = '';
    switch (order.refundStatus) {
      // case 0: refundStatusStr = '不用退款'; break;
      case 1: refundStatusStr = '待退款'; break;
      case 2: refundStatusStr = '已退款'; break;
      default: refundStatusStr = '';
    }
    let payStatusStr = '';
    switch (order.paymentStatus) {
      case 0: payStatusStr = '待付款'; break;
      case 1: payStatusStr = '付款中'; break;
      case 2: payStatusStr = '已付款'; break;
      default: payStatusStr = '';
    }
    let statusStr = '';
    switch (order.status) {
      case 0: statusStr = '未确定'; break;
      case 1: statusStr = '已下单'; break;
      case 2: statusStr = '商家已确认'; break;
      case 3: return refundStatusStr ? `用户已取消,${refundStatusStr}` : '用户已取消';
      case 4: return refundStatusStr ? `商家已拒绝,${refundStatusStr}` : '商家已拒绝';
      case 5: return refundStatusStr ? `系统取消,${refundStatusStr}` : `${payStatusStr},系统取消`;
      case 6: return refundStatusStr ? `商家已取消,${refundStatusStr}` : '商家已取消';
      case 8: return '已完成';
      case 9: return 'no show';
      default: statusStr = '';
    }

    let checkInStatusStr = '';
    switch (order.checkInStatus) {
      case 0: checkInStatusStr = '未入住'; break;
      case 1: checkInStatusStr = '已入住'; break;
      case 2: checkInStatusStr = '已退房'; break;
      default: checkInStatusStr = '';
    }
    if (order.status === 2) {
      return `${payStatusStr},${statusStr},${checkInStatusStr}`;
    }
    return `${payStatusStr},${checkInStatusStr}`;
  }

  static toExcelInfo(serverInfo) {
    const status = this.renderStatusText(serverInfo);
    let customerType = '';
    switch (serverInfo.user.userType) {
      case 1: customerType = '微信散客'; break;
      case 2: customerType = '协议客'; break;
      case 3: customerType = '会员'; break;
      default: customerType = '';
    }

    let payMethod = '';
    switch (serverInfo.paymentMethod) {
      case 1: payMethod = '支付宝'; break;
      case 2: payMethod = '微信'; break;
      case 4: payMethod = '到店支付'; break;
      case 99: payMethod = '会员卡'; break;
      case 100: payMethod = '月结'; break;
      default: payMethod = ''; break;
    }
    const orderDate = moment(serverInfo.orderDate).format('YYYY-MM-DD HH:mm:ss');
    const checkInDate = `${moment(serverInfo.checkInBeginDate).format('YYYY-MM-DD')} 至 ${moment(serverInfo.checkInEndDate).format('YYYY-MM-DD')}`;
    return {
      code: serverInfo.code,
      hotelName: serverInfo.hotel.name,
      status,
      customerType,
      payMethod,
      name: serverInfo.user.name,
      tel: serverInfo.user.tel,
      checkInDate, // 入住离店时间
      orderDate,
      roomTypeName: serverInfo.hotel.roomTypeName,
      orderRoomNum: serverInfo.hotel.orderNum,
      arriveDate: serverInfo.arriveDate,
      totalPrice: serverInfo.totalPrice,
      actualPrice: serverInfo.actualPrice,
    };
  }
}

module.exports = { AccountConvert, OrderConvert };
