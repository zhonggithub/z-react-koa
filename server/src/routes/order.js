/**
* @Author: Zz
* @Date:   2016-10-06T14:10:10+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T10:47:31+08:00
*/
import nodeExcel from 'excel-export';
import { OrderConvert } from '../common/dataConvert';
import util from '../common/util';

const exportExcel = async(ctx, params) => {
  const retData = await ctx.invoke('hms-order-service', 'order.list', params);
  if (retData.code !== 0) {
    ctx.throw(retData, 500);
  }
  const rows = await Promise.all(retData.data.items.map(async (item) => {
    const tmp = OrderConvert.toExcelInfo(item);
    const hotelInfo = await ctx.invoke('hms-group-service', 'hotel.get', { groupId: item.hotel.groupId, hotelId: item.hotel.id });
    if (hotelInfo.code === 0) {
      tmp.hotelName = hotelInfo.data.name;
      const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId: item.hotel.groupId, brandId: hotelInfo.data.brandId });
      if (brandInfo.code === 0) {
        tmp.brandName = brandInfo.data.name;
      }
    }
    return [
      tmp.code, tmp.hotelName, tmp.brandName, tmp.status,
      tmp.customerType, tmp.payMethod, tmp.name, tmp.tel,
      tmp.roomTypeName, tmp.orderRoomNum, tmp.checkInDate, tmp.orderDate,
      tmp.totalPrice, tmp.actualPrice,
    ];
  }));
  return Promise.resolve({
    rows,
    total: retData.data.total,
  });
};

export default {
  async list(ctx) {
    const query = ctx.request.query;
    const params = {
      ...query,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-order-service', 'order.list', params);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    retData.data.items = await Promise.all(retData.data.items.map(async (item) => {
      const tmp = OrderConvert.toClientInfo(item);
      const hotelInfo = await ctx.invoke('hms-group-service', 'hotel.get', { groupId: item.hotel.groupId, hotelId: item.hotel.id });
      if (hotelInfo.code === 0) {
        tmp.hotelName = hotelInfo.data.name;
        const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId: item.hotel.groupId, brandId: hotelInfo.data.brandId });
        if (brandInfo.code === 0) {
          tmp.brandName = brandInfo.data.name;
        }
      }
      return tmp;
    }));
    ctx.body = retData;
  },

  async retrieve(ctx) {
    const id = ctx.params.orderId;
    const retData = await ctx.invoke('hms-order-service', 'order.retrieve', { id });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }

    const tmpData = OrderConvert.toClientInfo(retData.data);
    // 获取hotelName
    const hotelInfo = await ctx.invoke('hms-group-service', 'hotel.get', { groupId: retData.data.hotel.groupId, hotelId: retData.data.hotel.id });
    if (hotelInfo.code === 0) {
      tmpData.hotelName = hotelInfo.data.name;
    }
    // 获取品牌
    const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId: retData.data.hotel.groupId, brandId: hotelInfo.data.brandId });
    if (brandInfo.code === 0) {
      tmpData.brandName = brandInfo.data.name;
    }

    // 计算入住次数
    const checkInCountData = await ctx.invoke('hms-order-service', 'order.count.user.checkIn', { userId: tmpData.userId, hotelId: retData.data.hotel.id });
    if (retData.code === 0) {
      tmpData.checkInCount = checkInCountData.data.total;
    }

    // 获取微信头像
    const wxInfo = await ctx.invoke('wechat-user-service', 'user.get.info', { openid: tmpData.userId });
    if (wxInfo.code === 0) {
      tmpData.headImgUrl = wxInfo.data.headimgurl;
    }

    // TODO: 获取会员等级
    ctx.body = {
      code: 0,
      message: 'success',
      data: tmpData,
    };
  },

  async retrieveOrderNotify(ctx) {
    const params = ctx.request.query;
    const retData = await ctx.invoke('hms-order-service', 'template.setting.retrieve', { ...params, groupId: ctx.params.groupId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async updateOrderNotify(ctx) {
    const info = ctx.request.body;
    const retData = await ctx.invoke('hms-order-service', 'template.setting.update', { ...info, groupId: ctx.params.groupId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async notificationList(ctx) {
    const params = ctx.request.query;
    const retData = await ctx.invoke('hms-order-service', 'notification.list', { ...params });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async notificationUpdateStatusByOrderId(ctx) {
    const info = ctx.request.body;
    const { orderId } = ctx.params;
    const retData = await ctx.invoke('hms-order-service', 'notification.update.status.by.orderId', { ...info, orderId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async batch(ctx) {
    const data = ctx.request.body;
    const opts = data.opts;
    const retInfo = [];
    await Promise.all(opts.map(async (item) => {
      const retData = await ctx.invoke('hms-order-service', item.method, item.data);
      if (retData.code !== 0) {
        retInfo.push({
          opt: item,
          error: retData,
        });
      }
    }));
    ctx.body = {
      code: retInfo.length === 0 ? 0 : 'error',
      message: retInfo.length === 0 ? 'success' : 'error',
      data: retInfo,
    };
    ctx.status = 200;
  },

  async exportExcelFile(ctx) {
    const conf = {};
    conf.cols = [
       { caption: '订单号', type: 'string' },
       { caption: '酒店名称', type: 'string' },
       { caption: '所属品牌', type: 'string' },
       { caption: '订单状态', type: 'string' },
       { caption: '客户类型', type: 'string' },
       { caption: '支付方式', type: 'string' },
       { caption: '联系人', type: 'string' },
       { caption: '联系电话', type: 'string' },
       { caption: '预订房型', type: 'string' },
       { caption: '预订间数', type: 'number' },
       { caption: '住离时间', type: 'string' },
       { caption: '下单时间', type: 'string' },
       { caption: '订单总金额', type: 'number' },
       { caption: '支付总金额', type: 'number' },
    ];
    const fileName = encodeURI(ctx.request.query.fileName || '订单列表');
    conf.rows = await util.exportExcelFile(ctx, exportExcel);
    const result = nodeExcel.execute(conf);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    ctx.body = new Buffer(result, 'binary');
  },
};
