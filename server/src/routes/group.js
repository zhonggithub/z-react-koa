import moment from 'moment';

function convertWXPay2Client(serverInfo) {
  return {
    appSecret: serverInfo.appSecret,
    merchantId: serverInfo.merchantId,
    key: serverInfo.key,
    wxMerchantCertificate: serverInfo.certFile,
    wxMerchantSecret: serverInfo.keyFile,
    mpVerify: serverInfo.mpVerifyFile,
    paymentAuthDir: serverInfo.authDirectory,
    paymentCallbackURL: serverInfo.callback,
  };
}

export default {
  async groupUpdateWX(ctx) {
    const info = ctx.request.body;
    const retData = await ctx.invoke('hms-group-service', 'group.update.wx', info);
    ctx.body = retData;
    ctx.status = 201;
  },

  async groupGetWXInfo(ctx) {
    // 通过groupId 获取 wxid（appid）
    const groupId = ctx.query.groupId;
    const retData = await ctx.invoke('hms-group-service', 'group.get', { id: groupId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    const appId = retData.data.wx.wxid;
    const authInfo = await ctx.invoke('wechat-access-token-service', 'authorizer.info.get', { appid: appId });
    ctx.body = authInfo;
  },

  async groupUpdateWXPay(ctx) {
    const info = ctx.request.body;
    const tmpInfo = {
      id: info.id,
      wxPay: {
        merchantId: info.merchantId,
        key: info.key,
        appSecret: info.appSecret,
        certFile: info.wxMerchantCertificate,
        keyFile: info.wxMerchantSecret,
        mpVerifyFile: info.mpVerify,
        authDirectory: info.paymentAuthDir,
        callback: info.paymentCallbackURL,
      },
    };
    const retData = await ctx.invoke('hms-group-service', 'group.update.wxPay', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    retData.data.wxPay = convertWXPay2Client(retData.data.wxPay);
    ctx.body = retData;
    ctx.status = 201;
  },

  async groupRetrieve(ctx) {
    const id = ctx.params.groupId;
    const tmpInfo = { id };
    const retData = await ctx.invoke('hms-group-service', 'group.get', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    retData.data.wxPay = convertWXPay2Client(retData.data.wxPay);
    retData.data.url = `${process.env.HOST_NAME}/group?groupId=${id}`;
    ctx.body = retData;
  },

  async updateBaseInfo(ctx) {
    const id = ctx.params.groupId;
    const body = ctx.request.body;
    const tmpInfo = {
      ...body,
      id,
    };
    const retData = await ctx.invoke('hms-group-service', 'group.update.baseinfo', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    retData.wxPay = convertWXPay2Client(retData.data.wxPay);
    ctx.body = retData;
    ctx.status = 201;
  },

  async updatePageStyle(ctx) {
    const id = ctx.params.groupId;
    const body = ctx.request.body;
    const tmpInfo = {
      ...body,
      id,
    };
    const retData = await ctx.invoke('hms-group-service', 'group.update.page', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async listBrands(ctx) {
    const groupId = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async listBrandsDetail(ctx) {
    const groupId = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    const brands = retData.data.items;
    // 查品牌下面的酒店
    retData.data.items = await Promise.all(brands.map(async (item) => {
      const hotelRetData = await ctx.invoke('hms-group-service', 'hotel.list', { groupId, brands: item.id });
      if (hotelRetData.code === 0) {
        item.hotels = hotelRetData.data.items;
        item.hotelTotal = hotelRetData.data.total;
        // 生成预览URL
        // http://dev.wx.utuapp.cn/group?groupId=57e499e5b393d8001042c96f#!/hotel_list/:city/:address/2016-11-28/2016-11-29/1/:location/57e4ddead9c5020010077de7
        const today = moment().format('YYYY-MM-DD');
        const tomorrow = moment().add(1, 'd').format('YYYY-MM-DD');
        item.url = `${process.env.HOST_NAME}/group?groupId=${groupId}#!/hotel_list/:city/:address/${today}/${tomorrow}/1/:location/${item.id}/:residentHotel/:userSave/:longitude/:latitude`;
      }
      return item;
    }));

    ctx.body = retData;
    ctx.status = 200;
  },

  async listHotels(ctx) {
    const id = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId: id,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    if ({}.hasOwnProperty.call(tmpInfo, 'brands')) {
      const brands = tmpInfo.brands.replace(/(\[)|(])|(\()|(\))|(\{)|(\})/g, '');
      tmpInfo.brands = brands.split(',');
    }
    const retData = await ctx.invoke('hms-group-service', 'hotel.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    await Promise.all(retData.data.items.map(async (item) => {
      const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId: item.groupId, brandId: item.brandId });
      if (brandInfo.code === 0) {
        item.brandName = brandInfo.data.name;
      }
    }));

    // 获取酒店价格码
    await Promise.all(retData.data.items.map(async (item) => {
      const rateRet = await ctx.invoke('hms-group-service', 'pms.rate.list', { groupId: item.groupId, hotelId: item.hotelId });
      if (rateRet.code === 0) {
        item.rateCodes = rateRet.data.items;
      }
    }));

    ctx.body = retData;
    ctx.status = 200;
  },

  async listRoomTypes(ctx) {
    const groupId = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.roomType.source', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async pmsListRoomTypes(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.roomType.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async updateAccountSetting(ctx) {
    const info = ctx.request.body;
    const retData = await ctx.invoke('hms-group-service', 'group.update.account.setting', { id: ctx.params.groupId, accountSetting: info });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async retrieveHotel(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const retData = await ctx.invoke('hms-group-service', 'hotel.get', { hotelId, groupId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async updateHotel(ctx) {
    const info = ctx.request.body;
    const retData = await ctx.invoke('hms-group-service', 'hotel.update', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async updateHotelBind(ctx) {
    const info = ctx.request.body;
    const retData = await ctx.invoke('hms-group-service', 'hotel.update.bind', { ...info, hotelId: ctx.params.hotelId });
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async listRoom(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.room.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async listBuilding(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
    };
    const retData = await ctx.invoke('hms-group-service', 'pms.building.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async pmsRoomamountGet(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
    };
    const retData = await ctx.invoke('hms-group-service', 'pms.roomamount.get', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async pmsRateList(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'pms.rate.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async pmsRateDetailGet(ctx) {
    const groupId = ctx.params.groupId;
    const hotelId = ctx.params.hotelId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      hotelId,
    };
    const retData = await ctx.invoke('hms-group-service', 'pms.ratedetail.get', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async hotelUpdateBrand(ctx) {
    const groupId = ctx.params.groupId;
    const brandId = ctx.params.brandId;
    const info = ctx.request.body;
    const tmpInfo = {
      ...info,
      groupId,
      brandId,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.update.brand', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async brandRetrieve(ctx) {
    const groupId = ctx.params.groupId;
    const brandId = ctx.params.brandId;
    const tmpInfo = {
      groupId,
      brandId,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.get', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 200;
  },

  async brandUpdate(ctx) {
    const groupId = ctx.params.groupId;
    const brandId = ctx.params.brandId;
    const info = ctx.request.body;
    const tmpInfo = {
      ...info,
      groupId,
      brandId,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.update', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async brandUpdateStatus(ctx) {
    const groupId = ctx.params.groupId;
    const brandId = ctx.params.brandId;
    const info = ctx.request.body;
    const tmpInfo = {
      ...info,
      groupId,
      brandId,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.update.status', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async brandUpdateBind(ctx) {
    const groupId = ctx.params.groupId;
    const brandId = ctx.params.brandId;
    const info = ctx.request.body;
    const tmpInfo = {
      ...info,
      groupId,
      brandId,
    };
    const retData = await ctx.invoke('hms-group-service', 'brand.update.bind', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async ratecodeCreate(ctx) {
    const groupId = ctx.params.groupId;
    const info = ctx.request.body;
    const rateCodeInfo = {
      groupId,
      name: info.name,
      code: info.code,
      memo: info.memo,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.create', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    const rateCodeId = retData.data.rateCodeId;
    const ratemapInfo = {
      groupId,
      hotel: info.hotel,
      groupRateCodeId: rateCodeId,
    };
    const ret = await ctx.invoke('hms-group-service', 'ratemap.create', ratemapInfo);
    if (ret.code !== 0) {
      ctx.throw(ret, 500);
      return;
    }

    ctx.body = ret;
    ctx.status = 201;
  },

  async ratecodeList(ctx) {
    const groupId = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    // 获取绑定的酒店数量
    await Promise.all(retData.data.items.map(async (item) => {
      const params = { groupId, groupRateCodeId: item.rateCodeId };
      const rateMapRet = await ctx.invoke('hms-group-service', 'ratemap.list', params);
      if (rateMapRet.code === 0 && rateMapRet.data.total === 1) {
        item.bindHotelNum = rateMapRet.data.items[0].hotel.length;
      } else {
        ctx.log.info(rateMapRet);
      }
    }));
    ctx.body = retData;
    ctx.status = 200;
  },

  async ratecodeUpdateStatus(ctx) {
    const groupId = ctx.params.groupId;
    const rateCodeId = ctx.params.rateCodeId;
    const info = ctx.request.body;
    const rateCodeInfo = {
      groupId,
      rateCodeId,
      ...info,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.update.status', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async rateCodeUpdateDefaultSet(ctx) {
    const groupId = ctx.params.groupId;
    const rateCodeId = ctx.params.rateCodeId;
    const info = ctx.request.body;
    const rateCodeInfo = {
      groupId,
      rateCodeId,
      ...info,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.update.defaultSet', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async ratecodeUpdate(ctx) {
    const groupId = ctx.params.groupId;
    const rateCodeId = ctx.params.rateCodeId;
    const info = ctx.request.body;
    const rateCodeInfo = {
      groupId,
      rateCodeId,
      ...info,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.update', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }

    ctx.body = retData;
    ctx.status = 201;
  },

  async ratecodeDelete(ctx) {
    const groupId = ctx.params.groupId;
    const rateCodeId = ctx.params.rateCodeId;

    const rateCodeInfo = {
      groupId,
      rateCodeId,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.delete', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.status = 204;
  },

  async ratecodeRetrieve(ctx) {
    const groupId = ctx.params.groupId;
    const rateCodeId = ctx.params.rateCodeId;

    const rateCodeInfo = {
      groupId,
      rateCodeId,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratecode.get', rateCodeInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async hotelListByRateCodeId(ctx) {
    const { groupId } = ctx.params;
    const groupRateCodeId = ctx.params.rateCodeId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };

    const retHotelData = await ctx.invoke('hms-group-service', 'hotel.list', tmpInfo);
    if (retHotelData.code !== 0) {
      ctx.throw(retHotelData, 500);
      return;
    }

    await Promise.all(retHotelData.data.items.map(async (item) => {
      // 获取酒店品牌
      const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId, brandId: item.brandId });
      if (brandInfo.code === 0) {
        item.brandName = brandInfo.data.name;
      }

      // 获取酒店价格码
      const rateRet = await ctx.invoke('hms-group-service', 'pms.rate.list', { groupId, hotelId: item.hotelId });
      if (rateRet.code === 0) {
        item.rateCodes = rateRet.data.items;
      }

      // 获取酒店价格码和价格代码的对应关系
      const retData = await ctx.invoke('hms-group-service', 'ratemap.list', { groupRateCodeId, groupId, hotelId: item.hotelId });
      if (retData.code !== 0 || retData.data.total > 1) {
        ctx.log.info('-------------', { groupRateCodeId, groupId, hotelId: item.hotelId }, retData);
        ctx.throw(retData, 500);
        return;
      }
      if (retData.data.total === 0) {
        return;
      }

      const data = retData.data.items[0];
      if (!data.hotel) {
        return;
      }
      for (const it of data.hotel) {
        if (it.id === item.hotelId) {
          item.hotelSelectRateCode = it.rateCode;
          break;
        }
      }
    }));

    ctx.body = retHotelData;
    ctx.status = 200;
  },

  async rateMapList(ctx) {
    const groupId = ctx.params.groupId;
    const query = ctx.query;
    const tmpInfo = {
      ...query,
      groupId,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratemap.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async rateMapUpdate(ctx) {
    const info = ctx.request.body;
    const params = ctx.params;
    const tmpInfo = {
      ...params,
      ...info,
    };
    const retData = await ctx.invoke('hms-group-service', 'ratemap.update', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async groupServiceBatch(ctx) {
    const data = ctx.request.body;
    const opts = data.opts;
    const retInfo = [];
    await Promise.all(opts.map(async (item) => {
      const retData = await ctx.invoke('hms-group-service', item.method, item.data);
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

  async hotelUpdatePay(ctx) {
    const info = ctx.request.body;
    const params = ctx.params;
    const tmpInfo = {
      ...params,
      ...info,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.update.pay', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 201;
  },

  async hotelSync(ctx) {
    const params = ctx.params;
    const tmpInfo = {
      ...params,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.sync', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async hotelRoomSync(ctx) {
    const params = ctx.params;
    const tmpInfo = {
      ...params,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.room.sync', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async hotelRoomTypeSync(ctx) {
    const params = ctx.params;
    const tmpInfo = {
      ...params,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.roomType.sync', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async hotelRoomTypeGet(ctx) {
    const params = ctx.params;
    const tmpInfo = {
      id: params.roomTypeId,
    };
    const retData = await ctx.invoke('hms-group-service', 'hotel.roomType.get', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async groupRoomTypeList(ctx) {
    const groupId = ctx.params.groupId;
    const hotelIds = ctx.query.hotelIds ? ctx.query.hotelIds.split(',') : null;
    const tmpInfo = {
      groupId,
    };
    if (hotelIds) {
      tmpInfo.hotelIds = hotelIds;
    }
    const retData = await ctx.invoke('hms-group-service', 'group.roomType.list', tmpInfo);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    // 获取酒店,品牌
    await Promise.all(retData.data.items.map(async (item) => {
      const hotelRet = await ctx.invoke('hms-group-service', 'hotel.get', { groupId, hotelId: item.hotelId });
      if (hotelRet.code === 0) {
        item.hotelName = hotelRet.data.name;
        item.hotelCode = hotelRet.data.code;
        const brandId = hotelRet.data.brandId;
        const brandInfo = await ctx.invoke('hms-group-service', 'brand.get', { groupId, brandId });
        if (brandInfo.code === 0) {
          item.brandName = brandInfo.data.name;
        }
      }
    }));
    const items = retData.data.items;
    const length = items.length;
    retData.data.hotelCount = {};
    retData.data.hotelCount[items[0].hotelId] = 1;
    let count = 0;
    for (let i = 1; i < length; i += 1) {
      const current = items[i];
      const pre = items[i - 1];
      if (pre && current.hotelId === pre.hotelId) {
        retData.data.hotelCount[current.hotelId] += 1;
      } else {
        retData.data.hotelCount[current.hotelId] = 1;
        count += 1;
      }
    }
    retData.data.total = count;
    ctx.body = retData;
    ctx.status = 200;
  },
};
