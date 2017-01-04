/**
* @Author: Zz
* @Date:   2016-09-27T20:03:49+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-06T23:57:14+08:00
*/
import Router from 'koa-router';
import rawBody from 'raw-body';
import jwt from 'jsonwebtoken';
import multer from 'koa-multer';
import qr from 'qr-image';
import fs from 'fs';
import account from './account';
import order from './order';
import weChatAuth from './weChatAuth';
import group from './group';
import material from './material';
import config from '../config';
import cardCoupon from './cardCoupon';

const getBody = async (ctx, next) => {
  try {
    const body = await rawBody(ctx.req);
    ctx.request.body = JSON.parse(body);
  } catch (err) {
    ctx.throw(err, 400);
  }
  await next();
};

const auth = async (ctx, next) => {
  const { token } = ctx.header;
  try {
    const tokenData = jwt.verify(token, config.JWT_KEY);
    ctx.request.token = tokenData;
    ctx.req.token = tokenData;
  } catch (err) {
    ctx.throw(err, 401);
  }
  await next();
};

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.env.UPLOAD_DIR}/${req.token.u}`);
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    const fileExt = originalname.substr(originalname.lastIndexOf('.'));
    cb(null, `${file.fieldname}-${Date.now()}${fileExt}`);
  },
});
const upload = multer({ storage });
router.post('/group/api/upload', auth, upload.single('file'), async (ctx) => {
  // originalname 文件名称，path上传后文件的临时路径，mimetype文件类型
  const { filename } = ctx.req.file;
  if (!filename) {
    ctx.status = 500;
    ctx.body = 'error';
  }
  ctx.status = 200;
  ctx.body = `http:${process.env.CDN_HOST}${process.env.UPLOAD_ROOT}/${ctx.request.token.u}/${filename}`;
});

//  微信支付相关文件上传
const wxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.env.MP_VERIFY_DIR}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.token.u}-${file.originalname}`);
  },
});
const uploadWX = multer({ storage: wxStorage });
router.post('/group/api/wx/upload', auth, uploadWX.single('file'), async (ctx) => {
  const { filename } = ctx.req.file;
  if (!filename) {
    ctx.status = 500;
    ctx.body = 'error';
  }
  ctx.status = 200;
  ctx.body = `http:${process.env.CDN_HOST}${process.env.MP_VERIFY_DIR}/${filename}`;
});

// 微信pem文件上传
const uploadWXPem = multer();
router.post('/group/api/wx/pemupload', auth, uploadWXPem.single('file'), async (ctx) => {
  const { buffer } = ctx.req.file;
  if (!buffer) {
    ctx.status = 500;
    ctx.body = 'error';
  }
  const resData = await ctx.invoke('hms-group-service', 'upload', { buffer: JSON.stringify(buffer) });
  if (resData.code !== 0) {
    ctx.status = 500;
    ctx.body = resData;
  }

  ctx.status = 200;
  ctx.body = resData.data.id;
});

router.get('/group/api/createqrcode', async (ctx) => {
  const text = ctx.query.text;
  try {
    const img = qr.image(text, { size: 10 });
    ctx.body = img;
    ctx.status = 200;
  } catch (e) {
    ctx.status = 414;
    ctx.body = 'Request-URI Too Large';
  }
});

router.post('/group/api/login', getBody, account.signIn);
router.post('/group/api/access/token', getBody, account.retrieveAccessToken);
router.post('/group/api/login/group', getBody, account.groupLogin);
router.post('/group/api/logout', auth, getBody, account.signOut);
router.post('/group/api/accounts', auth, getBody, account.create);
router.get('/group/api/orders', auth, order.list);
router.get('/group/api/orders/:orderId', auth, order.retrieve);
router.get('/group/api/wx/retrieveauth', auth, weChatAuth.retrievePreAutCode);
router.post('/group/api/wx/mpauth', auth, getBody, weChatAuth.mpAuth);
router.post('/group/api/group/wx', auth, getBody, group.groupUpdateWX);
router.get('/group/api/group/wxinfo', auth, group.groupGetWXInfo);
router.post('/group/api/group/wxpay', auth, getBody, group.groupUpdateWXPay);
router.get('/group/api/groups/:groupId', auth, group.groupRetrieve);
router.post('/group/api/groups/:groupId/baseinfo', auth, getBody, group.updateBaseInfo);
router.post('/group/api/groups/:groupId/pagestyle', auth, getBody, group.updatePageStyle);
router.get('/group/api/groups/:groupId/brands', auth, group.listBrands);
router.get('/group/api/groups/:groupId/brands/:brandId', auth, group.brandRetrieve);
router.post('/group/api/groups/:groupId/brands/:brandId', auth, getBody, group.brandUpdate);
router.post('/group/api/groups/:groupId/brands/:brandId/status', auth, getBody, group.brandUpdateStatus);
router.post('/group/api/groups/:groupId/brands/:brandId/bind', auth, getBody, group.brandUpdateBind);
router.get('/group/api/groups/:groupId/brandsdetail', auth, group.listBrandsDetail);
router.post('/group/api/groups/:groupId/brands/:brandId/hotels', auth, getBody, group.hotelUpdateBrand);
router.get('/group/api/groups/:groupId/roomtypes', auth, group.listRoomTypes);
router.get('/group/api/groups/:groupId/hotelroomtypes', auth, group.groupRoomTypeList);
router.get('/group/api/groups/:groupId/hotels', auth, group.listHotels);
router.post('/group/api/groups/:groupId/hotels/:hotelId', auth, getBody, group.updateHotel);
router.get('/group/api/groups/:groupId/hotels/:hotelId', auth, group.retrieveHotel);
router.post('/group/api/hotels/:hotelId/bind', auth, getBody, group.updateHotelBind);
router.get('/group/api/groups/:groupId/ordernotify', auth, order.retrieveOrderNotify);
router.post('/group/api/groups/:groupId/ordernotify', auth, getBody, order.updateOrderNotify);
router.get('/group/api/groups/:groupId/hotels/:hotelId/rooms', auth, group.listRoom);
router.get('/group/api/groups/:groupId/hotels/:hotelId/building', auth, group.listBuilding);
router.get('/group/api/groups/:groupId/hotels/:hotelId/roomtypes', auth, group.pmsListRoomTypes);
router.get('/group/api/groups/:groupId/hotels/:hotelId/roomamount', auth, group.pmsRoomamountGet);
router.get('/group/api/groups/:groupId/hotels/:hotelId/rate', auth, group.pmsRateList);
router.get('/group/api/groups/:groupId/hotels/:hotelId/ratedetail', auth, group.pmsRateDetailGet);
router.post('/group/api/groups/:groupId/accountsetting', auth, getBody, group.updateAccountSetting);
router.post('/group/api/groups/:groupId/ratecodes', auth, getBody, group.ratecodeCreate);
router.get('/group/api/groups/:groupId/ratecodes', auth, group.ratecodeList);
router.post('/group/api/groups/:groupId/ratecodes/:rateCodeId', auth, getBody, group.ratecodeUpdate);
router.post('/group/api/groups/:groupId/ratecodes/:rateCodeId/status', auth, getBody, group.ratecodeUpdateStatus);
router.post('/group/api/groups/:groupId/ratecodes/:rateCodeId/defaultset', auth, getBody, group.rateCodeUpdateDefaultSet);
router.delete('/group/api/groups/:groupId/ratecodes/:rateCodeId', auth, group.ratecodeDelete);
router.get('/group/api/groups/:groupId/ratecodes/:rateCodeId', auth, group.ratecodeRetrieve);
router.get('/group/api/groups/:groupId/hotels/ratecodes/:rateCodeId/ratemaps', auth, group.hotelListByRateCodeId);
router.post('/group/api/groups/:groupId/groupservice/batch', auth, getBody, group.groupServiceBatch);
router.get('/group/api/groups/:groupId/ratemaps', auth, group.rateMapList);
router.post('/group/api/groups/:groupId/ratemaps/:rateMapId', auth, getBody, group.rateMapUpdate);
router.post('/group/api/groups/:groupId/hotels/:hotelId/payconfig', auth, getBody, group.hotelUpdatePay);
router.get('/group/api/groups/:groupId/hotelsync', auth, group.hotelSync);
router.get('/group/api/groups/:groupId/hotels/:hotelId/hotelroomsync', auth, group.hotelRoomSync);
router.get('/group/api/groups/:groupId/hotels/:hotelId/hotelroomtypesync', auth, group.hotelRoomTypeSync);
router.get('/group/api/groups/:groupId/hotels/:hotelId/roomtypes/:roomTypeId', auth, group.hotelRoomTypeGet);
router.post('/group/api/groups/:groupId/materials', auth, getBody, material.create);
router.get('/group/api/groups/:groupId/materials', auth, material.list);
router.post('/group/api/groups/:groupId/materials/:materialId', auth, getBody, material.update);
router.delete('/group/api/groups/:groupId/materials/:materialId', auth, material.delete);
router.post('/group/api/groups/:groupId/materials/:materialId/status', auth, getBody, material.updateStatus);
router.get('/group/api/groups/:groupId/materials/:materialId', auth, material.retrieve);
router.post('/group/api/groups/:groupId/batch/material', auth, getBody, material.batch);
router.get('/group/api/groups/:groupId/materialtags', auth, material.tagGet);
router.post('/group/api/groups/:groupId/materialtags', auth, getBody, material.tagUpdate);
router.get('/group/api/groups/:groupId/replys', auth, material.replyList);
router.get('/group/api/groups/:groupId/replys/:replyId', auth, material.replyGet);
router.post('/group/api/groups/:groupId/replys', auth, getBody, material.replySet);
router.post('/group/api/groups/:groupId/replys/:replyId', auth, getBody, material.replyUpdate);
router.delete('/group/api/groups/:groupId/replys/:replyId', auth, getBody, material.replyDelete);
router.post('/group/api/groups/:groupId/replys/:replyId/status', auth, getBody, material.replyUpdateStatus);
router.get('/group/api/groups/:groupId/materialcontent', auth, material.contentGet);
router.post('/group/api/groups/:groupId/materialcontent', auth, material.contentUpdate);

// 导航条订单通知
router.get('/group/api/ordernotifications', auth, order.notificationList);
router.post('/group/api/orders/:orderId/ordernotifications', auth, getBody, order.notificationUpdateStatusByOrderId);
router.post('/group/api/group/:groupId/batch/ordernotifications', auth, getBody, order.batch);

// 卡券
router.post('/group/api/groups/:groupId/sync/coupons', auth, getBody, cardCoupon.cardSync);
router.get('/group/api/groups/:groupId/coupons', auth, cardCoupon.cardList);
router.get('/group/api/groups/:groupId/coupons/:couponId/user', auth, cardCoupon.wxCardCodeList);
router.post('/group/api/groups/:groupId/couponrules', auth, getBody, cardCoupon.cardRuleCreate);
router.post('/group/api/groups/:groupId/couponrules/:ruleId', auth, getBody, cardCoupon.cardRuleUpdate);
router.delete('/group/api/groups/:groupId/couponrules/:ruleId', auth, cardCoupon.cardRuleDelete);
router.get('/group/api/groups/:groupId/couponrules/:ruleId', auth, cardCoupon.cardRuleRetrieve);
router.get('/group/api/groups/:groupId/couponrules', auth, cardCoupon.cardRuleList);
router.post('/group/api/groups/:groupId/batch/couponrules', auth, cardCoupon.batch);

const exportAuth = async (ctx, next) => {
  const { token } = ctx.request.query;
  try {
    const tokenData = jwt.verify(token, config.JWT_KEY);
    ctx.request.token = tokenData;
    ctx.req.token = tokenData;
    delete ctx.request.query.token;
  } catch (err) {
    ctx.throw(err, 401);
  }
  await next();
};
// 导出excel表
router.get('/group/api/groups/:groupId/exportexcel/orders', exportAuth, order.exportExcelFile);
router.get('/group/api/groups/:groupId/exportexcel/coupons', exportAuth, cardCoupon.exportCouponExcelFile);
router.get('/group/api/groups/:groupId/exportexcel/coupons/:couponId/users', exportAuth, cardCoupon.exportCouponUserExcelFile);

router.get('*', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(`${__dirname}/../public/index.html`);
});

export default (app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
};
