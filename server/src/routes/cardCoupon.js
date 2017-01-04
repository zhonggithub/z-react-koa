import moment from 'moment';
import nodeExcel from 'excel-export';
import util from '../common/util';

const exportCouponExcel = async(ctx, params) => {
  const retData = await ctx.invoke('wechat-card-service', 'wx.card.list', params);
  if (retData.code !== 0) {
    ctx.throw(retData, 500);
  }
  const rows = await Promise.all(retData.data.items.map(async (item) => {
    let status = '';
    switch (item.baseInfo.status) {
      case 'CARD_STATUS_NOT_VERIFY': status = '待审核'; break;
      case 'CARD_STATUS_VERIFY_FAIL': status = '审核失败'; break;
      case 'CARD_STATUS_VERIFY_OK': status = '通过审核'; break;
      case 'CARD_STATUS_DELETE': status = '卡券被商户删除'; break;
      case 'CARD_STATUS_DISPATCH': status = '在公众平台投放过的卡券'; break;
      default: status = ''; break;
    }
    let expire = '';
    switch (item.baseInfo.dateInfo.type) {
      case 'DATE_TYPE_FIX_TERM': {
        if (item.baseInfo.dateInfo.fixedBeginTerm === 0) {
          expire = `领取后当天生效,有效期${item.baseInfo.dateInfo.fixedTerm}天`;
        } else {
          expire = `领取${item.baseInfo.dateInfo.fixedBeginTerm}天后生效,有效期${item.baseInfo.dateInfo.fixedTerm}天`;
        }
      } break;
      case 'DATE_TYPE_FIX_TIME_RANGE': {
        if (item.baseInfo.dateInfo.beginTimestamp) {
          expire = `领取后当天生效,有效期${moment.unix(item.baseInfo.dateInfo.beginTimestamp).format('YYYY-MM-DD HH:mm:ss')}至${moment.unix(item.baseInfo.dateInfo.endTimestamp).format('YYYY-MM-DD HH:mm:ss')}`;
        } else {
          expire = `领取${item.baseInfo.dateInfo.fixedBeginTerm}天后生效,有效期${item.baseInfo.dateInfo.fixedTerm}天`;
        }
      } break;
      default: expire = ''; break;
    }

    const itArray = [
      item.baseInfo.title,
      expire,
      item.baseInfo.sku.quantity,
      status,
    ];
    return itArray;
  }));
  return Promise.resolve({
    rows,
    total: retData.data.total,
  });
};

const exportCouponUserExcel = async(ctx, params) => {
  const retData = await ctx.invoke('wechat-card-service', 'wx.card.code.list', params);
  if (retData.code !== 0) {
    ctx.throw(retData, 500);
  }
  const rows = await Promise.all(retData.data.items.map(async (item) => {
    const ret = await ctx.invoke('wechat-user-service', 'user.get.info', { openid: item.fromUserName });
    if (ret.code === 0) {
      item.user = {
        name: ret.data.nickname,
        tel: ret.data.tel || '',
      };
    } else {
      item.user = {
      };
    }
    let status = '';
    switch (item.status) {
      case 'NORMAL': status = '未核销'; break;
      case 'CONSUMED': status = '已核销'; break;
      case 'EXPIRE': status = '已过期'; break;
      case 'GIFTED': status = '已转赠'; break;
      case 'GIFTING': status = '转赠中'; break;
      case 'GIFT_TIMEOUT': status = '转赠超时'; break;
      case 'DELETE': status = '已删除'; break;
      case 'UNAVAILABLE': status = '已失效'; break;
      case 'INACTIVE': status = '未生效'; break;
      default: status = ''; break;
    }
    const getTime = moment.unix(item.getTime).format('YYYY-MM-DD HH:mm:ss');

    const itArray = [
      item.user.name || '',
      item.user.tel || '',
      getTime,
      status,
      item.status === 'CONSUMED' ? item.userCardCode : '',
    ];
    return itArray;
  }));
  return Promise.resolve({
    rows,
    total: retData.data.total,
  });
};

export default {
  async wxCardCodeList(ctx) {
    const { couponId } = ctx.params;
    const query = ctx.query;
    const params = {
      cardStoredId: couponId,
      ...query,
      page: util.returnPage(query.page),
      pageSize: util.returnPageSize(query.pageSize),
    };

    const retData = await ctx.invoke('wechat-card-service', 'wx.card.code.list', params);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    await Promise.all(retData.data.items.map(async (item) => {
      const ret = await ctx.invoke('wechat-user-service', 'user.get.info', { openid: item.fromUserName });
      if (ret.code === 0) {
        item.user = {
          name: ret.data.nickname,
          tel: ret.data.tel || '',
        };
      } else {
        item.user = {
        };
      }
    }));
    ctx.body = retData;
    ctx.status = 200;
  },

  async cardList(ctx) {
    const { groupId } = ctx.params;
    const query = ctx.query;
    const params = {
      groupId,
      ...query,
      page: util.returnPage(query.page),
      pageSize: util.returnPageSize(query.pageSize),
    };
    if (params.statusList) {
      params.statusList = params.statusList.split(',');
    }
    if (params.cardType) {
      params.cardType = params.cardType.split(',');
    }
    const retData = await ctx.invoke('wechat-card-service', 'wx.card.list', params);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async cardSync(ctx) {
    const { groupId } = ctx.params;
    const data = {
      groupId,
      ...ctx.request.body,
    };
    const retData = await ctx.invoke('wechat-card-service', 'wx.card.sync', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async cardRuleCreate(ctx) {
    const { groupId } = ctx.params;
    const data = {
      groupId,
      ...ctx.request.body,
    };
    const retData = await ctx.invoke('wechat-card-service', 'card.rule.create', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async cardRuleDelete(ctx) {
    const { ruleId } = ctx.params;
    const data = {
      ruleId,
    };
    const retData = await ctx.invoke('wechat-card-service', 'card.rule.delete', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.status = 204;
  },

  async cardRuleUpdate(ctx) {
    const { ruleId } = ctx.params;
    const data = {
      ruleId,
      ...ctx.request.body,
    };
    const retData = await ctx.invoke('wechat-card-service', 'card.rule.update', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async cardRuleRetrieve(ctx) {
    const { ruleId } = ctx.params;
    const data = {
      ruleId,
    };
    const retData = await ctx.invoke('wechat-card-service', 'card.rule.get', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async cardRuleList(ctx) {
    const { groupId } = ctx.params;
    const query = ctx.query;
    const params = {
      groupId,
      ...query,
      page: util.returnPage(query.page),
      pageSize: util.returnPageSize(query.pageSize),
    };
    const retData = await ctx.invoke('wechat-card-service', 'card.rule.list', params);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    await Promise.all(retData.data.items.map(async (item) => {
      const cardRet = await ctx.invoke('wechat-card-service', 'wx.card.detail', { cardStoredId: item.cardStoredId });
      if (cardRet.code === 0) {
        item.cardCouponTitle = !cardRet.data.baseInfo ? '' : cardRet.data.baseInfo.title;
      }
    }));
    ctx.body = retData;
    ctx.status = 200;
  },

  async batch(ctx) {
    const data = ctx.request.body;
    const opts = data.opts;
    const retInfo = [];
    await Promise.all(opts.map(async (item) => {
      const retData = await ctx.invoke('wechat-card-service', item.method, item.data);
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

  async exportCouponExcelFile(ctx) {
    const conf = {};
    conf.cols = [
       { caption: '卡券名称', type: 'string' },
       { caption: '卡券有效期', type: 'string' },
       { caption: '库存', type: 'number' },
       { caption: '审核状态', type: 'string' },
       // { caption: '状态', type: 'string' },
    ];
    const fileName = encodeURI(ctx.request.query.fileName || '卡券');
    conf.rows = await util.exportExcelFile(ctx, exportCouponExcel, 50);
    const result = nodeExcel.execute(conf);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    ctx.body = new Buffer(result, 'binary');
  },

  async exportCouponUserExcelFile(ctx) {
    const conf = {};
    conf.cols = [
       { caption: '用户', type: 'string' },
       { caption: '电话号码', type: 'string' },
       { caption: '领取时间', type: 'string' },
       { caption: '核销状态', type: 'string' },
       { caption: '核销码', type: 'string' },
    ];
    const fileName = encodeURI(ctx.request.query.fileName || '卡券领取列表');
    conf.rows = await util.exportExcelFile(ctx, exportCouponUserExcel, 50);
    const result = nodeExcel.execute(conf);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    ctx.body = new Buffer(result, 'binary');
  },
};
