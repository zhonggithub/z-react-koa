import test from 'ava';
import jwt from 'jsonwebtoken';
import request from '../helpers/request';
import fetchMock from 'fetch-mock';

test.afterEach.always(t => {
  fetchMock.restore();
});

const token = jwt.sign({ u: 'demo' }, process.env.JWT_KEY);

let mockAccount = {
  account: '13760471842',
  password: '123456',
  trueName: 'zz'
};

test.serial('POST group/api/group/wx ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service',
   {
     code: 0,
     message: 'success',
     data:{
      id: '57d0dba289f4fb1358c07c0c',
      name: '0.6975912219018641',
      address:{
        province: '广东省',
        city: '深圳',
        street: '西乡街道',
      },
      wx: {
        wxid: '111',
        name: 'wx',
      },
      contact: {
        name: 'test',
        phone: '13410002222',
        email: 'abc@qq.com',
      },
      domain: 'www.fk.com',
      brands: [],
      cloudPlatform: 1,
      status: 1,
      labels: [ '标签' ],
      memo: '备注',
      }
    });
  const res = await request.post('/group/api/group/wx').send(mockAccount).set('token', token);;
  //console.log(res.body);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
});

test.serial('GET group/api/group/wxinfo ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service',
   {
     code: 0,
     message: 'success',
     data:{
      id: '57d0dba289f4fb1358c07c0c',
      name: '0.6975912219018641',
      address:{
        province: '广东省',
        city: '深圳',
        street: '西乡街道',
      },
      wx: {
        wxid: '111',
        name: 'wx',
      },
      contact: {
        name: 'test',
        phone: '13410002222',
        email: 'abc@qq.com',
      },
      domain: 'www.fk.com',
      brands: [],
      cloudPlatform: 1,
      status: 1,
      labels: [ '标签' ],
      memo: '备注',
      wxPay: {}
    }
  });

    fetchMock.mock('^http://service.local/wechat-access-token-service', (url, opts) => {
      const body = JSON.parse(opts.body);

      t.is(body.bizContent.appid, '111');
      t.is(body.method, 'authorizer.info.get');
      return {
        code: 0,
        message: 'success',
        data: {
          appid: "wxf8b4f85f3a794e77",
          nickName: '微信SDK Demo Special',
          headImg: 'http://wx.qlogo.cn/mmopen/GPyw0pGicibl5Eda4GmSSbTguhjg9LZjumHmVjybjiaQXnE9XrXEts6ny9Uv4Fk6hOScWRDibq1fI0WOkSaAjaecNTict3n6EjJaC/0',
          userName: 'gh_eb5e3a772040',
          serviceTypeInfo: 2,
          verifyTypeInfo: 0,
          alias: 'paytest01',
          businessInfo: {"openStore": 0, "openScan": 0, "openPay": 0, "openCard": 0, "openShake": 0},
          funcInfo: [1, 2, 3],
          qrcodeUrl: 'URL',
        }
       }
    });

  const res = await request.get('/group/api/group/wxinfo?groupId=1256').set('token', token);;
  //console.log(res.body);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  const data = res.body;
  t.is(data.code, 0);
  const info = data.data;
  t.is(info.appid, "wxf8b4f85f3a794e77");
  t.is(info.nickName, '微信SDK Demo Special');
  t.is(info.headImg, 'http://wx.qlogo.cn/mmopen/GPyw0pGicibl5Eda4GmSSbTguhjg9LZjumHmVjybjiaQXnE9XrXEts6ny9Uv4Fk6hOScWRDibq1fI0WOkSaAjaecNTict3n6EjJaC/0');
  t.is(info.userName, 'gh_eb5e3a772040');
  t.is(info.serviceTypeInfo, 2);
  t.is(info.verifyTypeInfo, 0);
  t.is(info.alias, 'paytest01');
});

test.serial('POST group/api/group/wxpay ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
      return {
        code: 0,
        message: 'success',
        data: {
          id: '57d0dba289f4fb1358c07c0c',
          wxPay: {}
        }
       }
    });
  const data = {
    id: '57d0dba289f4fb1358c07c0c',
    merchantId: 'ZZ集团',
    appSecret: 'zz密钥',
    key: '商户密钥',
    wxMerchantCertificate: 'zz微信商户证书文件',
    wxMerchantSecret: 'zz微信商户密钥文件',
    mpVerify: 'zz网页授权域名文件',
    paymentAuthDir: 'zz支付授权目录',
    paymentCallbackURL: 'zz支付回调URL'
  };
  const res = await request.post('/group/api/group/wxpay')
  .send(data)
  .set('token', token);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  const retData = res.body;
  t.is(retData.code, 0);
  const info = retData.data;
  t.is(info.id, "57d0dba289f4fb1358c07c0c");
});

test.serial('GET group/api/group/:groupId ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service',
   {
     code: 0,
     message: 'success',
     data:{
      id: '57d0dba289f4fb1358c07c0c',
      name: 'zz集团',
      address:{
        province: '广东省',
        city: '深圳',
        street: '西乡街道',
      },
      wx: {
        wxid: '111',
        name: 'wx',
      },
      contact: {
        name: 'test',
        phone: '13410002222',
        email: 'abc@qq.com',
      },
      domain: 'www.fk.com',
      brands: [],
      cloudPlatform: 1,
      status: 1,
      labels: [ '标签' ],
      memo: '备注',
      wxPay: {}
      }
    });

  const res = await request.get('/group/api/groups/1256').set('token', token);;
  //console.log(res.body);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  const data = res.body;
  t.is(data.code, 0);
  const info = data.data;
  t.is(info.id, "57d0dba289f4fb1358c07c0c");
  t.is(info.name, 'zz集团');
  t.is(info.memo, '备注');
});

test.serial('POST group/api/group/:groupId/baseInfo ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'group.update.baseinfo':
        return {
          code: 0,
          message: 'success',
          data:{
           id: '57d0dba289f4fb1358c07c0c',
           name: body.bizContent.name,
           address:{
             province: '广东省',
             city: '深圳',
             street: '西乡街道',
           },
           wx: {
             wxid: '111',
             name: 'wx',
           },
           contact: {
             name: 'test',
             phone: '13410002222',
             email: 'abc@qq.com',
           },
           domain: 'www.fk.com',
           brands: [],
           cloudPlatform: 1,
           status: 1,
           labels: [ '标签' ],
           memo: body.bizContent.memo,
           logo: body.bizContent.logo,
           wxPay: {}
         }
      }
    }
  });

  const res = await request.post('/group/api/groups/1256/baseinfo')
    .send({
      name: 'zzhello',
      logo: ['http://www.baidu.com/jj.png'],
      memo: 'zz备注'
    })
    .set('token', token);
  //console.log(res.body);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  const data = res.body;
  t.is(data.code, 0);
  const info = data.data;
  t.is(info.name, 'zzhello');
  t.is(info.memo, 'zz备注');
  t.is(info.logo[0], 'http://www.baidu.com/jj.png')
});

test.serial('POST group/api/group/:groupId/pagestyle ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'group.update.page':
        return {
          code: 0,
          message: 'success',
          data:{
           id: '57d0dba289f4fb1358c07c0c',
           name: '啦啦啦',
           address:{
             province: '广东省',
             city: '深圳',
             street: '西乡街道',
           },
           wx: {
             wxid: '111',
             name: 'wx',
           },
           contact: {
             name: 'test',
             phone: '13410002222',
             email: 'abc@qq.com',
           },
           domain: 'www.fk.com',
           brands: [],
           cloudPlatform: 1,
           status: 1,
           labels: [ '标签' ],
           memo: 'cool',
           logo: 'http://www.baidu.com',
           pageStyle: body.bizContent
         }
      }
    }
  });

  const res = await request.post('/group/api/groups/1256/pagestyle')
    .send({
      style: 0,
      banners: [{
          link:"https://www.apple.com/cn/home/images/og.jpg",
          linkType: 1,
          src:['https://www.apple.com/cn/home/images/og.jpg']
      }],
      brandId: '57d134a45e8cc618a031d008',
      status: 1,
      specialRecommend: [{
        hotelId: '57d24e7483ca1f1aa0ed800h',
        logo: "https://www.apple.com/cn/home/images/og.jpg"
      }]
    })
    .set('token', token);
  //console.log(res.body);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  const data = res.body;
  t.is(data.code, 0);
  const info = data.data.pageStyle;
  t.is(info.style, 0);
  t.is(info.brandId, '57d134a45e8cc618a031d008');
  t.is(info.status, 1);
  t.is(info.banners[0].link, "https://www.apple.com/cn/home/images/og.jpg");
  t.is(info.banners[0].linkType, 1);
  t.is(info.banners[0].src[0], 'https://www.apple.com/cn/home/images/og.jpg');
});

test.serial('GET /group/api/groups/1256/hotels ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'hotel.list':
        return {
          code: 0,
          message: 'success',
          data:{
               total: 2,
               items: [{
                 hotelId: '57d24e7483ca1f1aa0ed800h',
                 groupId: '57d0dba289f4fb1358c07c0c',
                 code: '0.05354125078873362',
                 name: 'A酒店',
                 type: 1,
                 phone: '0755',
                 ad: 'ad',
                 source: 1,
                 labels: [ 'xxx' ],
                 memo: 'memo',
                 status: 1,
                 address: { province: 'gd', city: 'sz', street: 'aaaa' },
                 wx: { wxid: '222', name: 'hotel' }
               },{
                 hotelId: '57d24e7483ca1f1aa0ed801h',
                 groupId: '57d0dba289f4fb1358c07c0c',
                 code: '0.05354125078873362',
                 name: 'B酒店',
                 type: 1,
                 phone: '0755',
                 ad: 'ad',
                 source: 1,
                 labels: [ 'xxx' ],
                 memo: 'memo',
                 status: 1,
                 address: { province: 'gd', city: 'sz', street: 'aaaa' },
                 wx: { wxid: '222', name: 'hotel' }
               }]
          }
        }
      case 'brand.get':
        return {
          code: 0,
          message: 'success',
          data:{
            id: '57d134a45e8cc618a031d008',
            name: 'hello brand',
            memo: 'for test',
            source: 1,
            status: 1,
            logo: 'logo'
           }
        }
      case 'pms.rate.list':
        return {
          code: 0,
          message: 'success',
          data:{
            total: 2,
             items: [{
                rateCode: '801', // 房价代码
                rateName: '', // 房价名称
                roomTypeName: '', // 房型名称
                status: 0, // 状态 0: 禁用 1：正常
                remarks: '', // 备注
                source: 1, // 来源 1: 平台导入 2: CRS导入
             }]
           }
        }
    }
  });

  const res = await request.get('/group/api/groups/1256/hotels')
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  //console.log(res.body.data.items);
});

test.serial('GET /group/api/groups/1256/roomtypes ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'hotel.roomType.source':
        return {
          code: 0,
          message: 'success',
          data:{
             total: 1,
             items: [{
               roomTypeCode: '111',
               roomTypeName: 'xxx',
              }],
           }
        }
      }
  });

  const res = await request.get('/group/api/groups/1256/roomtypes')
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  //console.log(res.body);
  t.is(res.body.data.items[0].roomTypeCode, '111');
  t.is(res.body.data.items[0].roomTypeName, 'xxx');
});

test.serial('GET /group/api/groups/:groupId/ordernotify ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-order-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'template.setting.retrieve':
        return {
          code: 0,
          message: 'success',
          data:{
               commitSuccess: {
                   id: '0',
               },
               hotelReserve: {
                   id: '1',
                   headInfo: '',
                   tailInfo: '',
               },
               electionRoomSuccess: {
                   id: '2',
               },
               fullRoom: {
                   id: '3',
                   headInfo: '',
                   tailInfo: '',
               },
               cancel: {
                   id: '4',
                   headInfo: '',
                   tailInfo: '',
               },
               comment: {
                   id: '5',
                   tailInfo: '',
               },
          }
        }
      }
  });

  const res = await request.get('/group/api/groups/1235/ordernotify?appId=1293')
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  //console.log(res.body);
  t.is(res.body.data.commitSuccess.id, '0');
  t.is(res.body.data.hotelReserve.id, '1');
})

test.serial('POST /group/api/groups/:groupId/ordernotify ok', async(t) => {
  const orderNotify = {
    appId: '025',
     commitSuccess: {
         id: '0',
     },
     hotelReserve: {
         id: '1',
         headInfo: '000',
         tailInfo: '',
     },
     electionRoomSuccess: {
         id: '2',
     },
     fullRoom: {
         id: '3',
         headInfo: '',
         tailInfo: '',
     },
     cancel: {
         id: '4',
         headInfo: '',
         tailInfo: '',
     },
     comment: {
         id: '5',
         tailInfo: '',
     },
   };

  fetchMock.mock('^http://service.local/hms-order-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'template.setting.update':
        return {
          code: 0,
          message: 'success',
          data:{
            ...orderNotify,
          }
        }
      }
  });

  const res = await request.post('/group/api/groups/1235/ordernotify')
    .send(orderNotify)
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  //console.log(res.body);
  t.is(res.body.data.commitSuccess.id, '0');
  t.is(res.body.data.hotelReserve.id, '1');
  t.is(res.body.data.hotelReserve.headInfo, '000');
})

test.serial('POST /group/api/hotels/:hotelId/bind ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'hotel.update.bind':
        return {
          code: 0,
          message: 'success',
          data:{
            bind: 1
          }
        }
      }
  });

  const res = await request.post('/group/api/hotels/1235/bind')
    .send({bind: 0})
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 201);
  //console.log(res.body);
  t.is(res.body.data.bind, 1);
})

test.serial('get /group/api/groups/:groupId/hotels/:hotelId/rooms ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-group-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method) {
      case 'hotel.room.list':
        return {
          code: 0,
          message: 'success',
          data:{
            total: 2,
            items: [{
              roomNo: '801', // 编号
              roomTypeCode: '0023', // 房型代码
              roomName: '大床房', // 房型名称
              building: 'A栋', // 楼宇
              floor: '8层', // 楼层
              remarks: '四星标准', // 备注
              source: 2, // 来源 1: 平台导入 2: CRS导入
            },{
                roomNo: '809', // 编号
                roomTypeCode: '0013', // 房型代码
                roomName: '标准双人床', // 房型名称
                building: 'B栋', // 楼宇
                floor: '9层', // 楼层
                remarks: '三星标准', // 备注
                source: 1, // 来源 1: 平台导入 2: CRS导入
            }]
          }
      }
    }
  });

  const res = await request.get('/group/api/groups/1235/hotels/12564/rooms')
    .set('token', token);
  //
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
  //console.log(res.body);
  t.is(res.body.data.total, 2);
})
