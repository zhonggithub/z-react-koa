import test from 'ava';
import jwt from 'jsonwebtoken';
import request from '../helpers/request';
import fetchMock from 'fetch-mock';

test.afterEach.always(t => {
  fetchMock.restore();
});

const token = jwt.sign({ u: 'demo' }, process.env.JWT_KEY);

test.serial('GET /group/api/orders ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-order-service', (url, opt) => {
    const body = JSON.parse(opt.body);
    switch(body.method) {
      case 'order.list':
        return {
          "code": 0,
          "message": "success",
          "data": {
            "items": [{ id: '581beb50dcb89b95c4ffb454',
               code: '1478224720676683141',
               hotel: { orderNum: 2,
                   roomRice:  [ { date: '2016-11-05', reservationCount: 2, price: 664 },
                               { date: '2016-11-06', reservationCount: 2, price: 664 } ],
                   rateCode: 'WALK',
                   roomTypeName: '行政双床房',
                   roomType: 'ETR',
                   groupId: '0256',
                   id: 'a101' },
               user:{ avatar: 'http://asdfasfsf.jpg',
                 userType: 1,
                   platform: 1,
                   nickName: 'hel',
                   sex: 1,
                   tel: '13760471842',
                   name: 'zz',
                   id: 'zz101' },
               paymentStatus: 1,
               night: 2,
               coupon: {},
               totalPrice: 2656,
               actualPrice: 2656,
               paymentMethod: 1,
               checkInStatus: 0,
               createdAt: '2016-11-04T01:58:40.820Z',
               updatedAt: '2016-11-04T01:58:40.820Z',
               checkInBeginDate: 1478224718850,
               checkInEndDate: 1478397518850,
               arriveDate: '9:50',
               orderDate: 1478224718851,
               statusTimestamps: [],
               evaluate: { comment: { images: [] }, reply: {}, agree: [] },
               privilege: { rice: 10, id: '0.12182544862148115' } }
             ],
             total: 1
         }
       }
    }
  });

  fetchMock.mock('^http://service.local/hms-group-service', (url, opt) => {
    const body = JSON.parse(opt.body);
    switch(body.method) {
      case 'hotel.get':
        return {
          code: 0,
          message: 'success',
          data: {
            hotelId: '57d24e7483ca1f1aa0ed8000',
             groupId: '57d24e7483ca1f1aa0ed808b',
             brandId: '57d134a45e8cc618a031d008',
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
          }
        }
      case 'brand.get':
        return {
          code: 0,
          message: 'success',
          data:
          {
             id: '57d134a45e8cc618a031d008',
             name: 'hello brand',
             memo: 'for test',
             source: 1,
             status: 1,
             logo: 'logo'
           }
        };
    }
  })

  const res = await request.get('/group/api/orders?status=1').set('token', token);
  if (res.status >= 400) console.log(res.text);
  //console.log(res.body.data.items);
  t.is(res.status, 200);
  t.is(res.body.data.items[0].id, '581beb50dcb89b95c4ffb454');
  t.is(res.body.data.items[0].brandName, 'hello brand');
  t.is(res.body.data.items[0].hotelName, 'A酒店');
});

test.serial('GET /group/api/orders/:orderId ok', async(t) => {
  fetchMock.mock('^http://service.local/hms-order-service', (url, opt) => {
    const body = JSON.parse(opt.body);
    switch(body.method) {
      case 'order.retrieve':
        return {
          "code": 0,
          "message": "success",
          "data": {
             id: '581beb50dcb89b95c4ffb454',
               code: '1478224720676683141',
               hotel: { orderNum: 2,
                   roomRice:  [ { date: '2016-11-05', reservationCount: 2, price: 664 },
                               { date: '2016-11-06', reservationCount: 2, price: 664 } ],
                   rateCode: 'WALK',
                   roomTypeName: '行政双床房',
                   roomType: 'ETR',
                   groupId: '0256',
                   id: 'a101' },
               user:{ avatar: 'http://asdfasfsf.jpg',
                 userType: 1,
                   platform: 1,
                   nickName: 'hel',
                   sex: 1,
                   tel: '13760471842',
                   name: 'zz',
                   id: 'zz101' },
               paymentStatus: 1,
               night: 2,
               coupon: {},
               totalPrice: 2656,
               actualPrice: 2656,
               paymentMethod: 1,
               checkInStatus: 0,
               createdAt: '2016-11-04T01:58:40.820Z',
               updatedAt: '2016-11-04T01:58:40.820Z',
               checkInBeginDate: 1478224718850,
               checkInEndDate: 1478397518850,
               arriveDate: '9:50',
               orderDate: 1478224718851,
               statusTimestamps: [],
               evaluate: { comment: { images: [] }, reply: {}, agree: [] },
               privilege: { rice: 10, id: '0.12182544862148115' } }

         }

       case 'order.count.user.checkIn':
         return {
           code: 0,
           message: 'success',
           data:
           {
              total: 14,
            }
         };
      }
  });

  fetchMock.mock('^http://service.local/hms-group-service', (url, opt) => {
    const body = JSON.parse(opt.body);
    switch(body.method) {
      case 'hotel.get':
        return {
          code: 0,
          message: 'success',
          data: {
            hotelId: '57d24e7483ca1f1aa0ed8000',
             groupId: '57d24e7483ca1f1aa0ed808b',
             brandId: '57d134a45e8cc618a031d008',
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
          }
        }
      case 'brand.get':
        return {
          code: 0,
          message: 'success',
          data:
          {
             id: '57d134a45e8cc618a031d008',
             name: 'hello brand',
             memo: 'for test',
             source: 1,
             status: 1,
             logo: 'logo'
           }
        };
    }
  });

  fetchMock.mock('^http://service.local/wechat-user-service', (url, opt) => {
    const body = JSON.parse(opt.body);
    switch(body.method) {
      case 'user.get.info':
        return {
          code: 0,
          message: 'success',
          data: {
            "openid": "OPENID",
            "nickname": "NICKNAME",
            "sex": "1",
            "province": "PROVINCE",
            "city": "CITY",
            "country": "COUNTRY",
            "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
            "privilege": ["PRIVILEGE1", "PRIVILEGE2"],
            "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
          }
        };
    }
  });

  const res = await request.get('/group/api/orders/00000').set('token', token);
  if (res.status >= 400) console.log(res.text);

  t.is(res.status, 200);
  t.is(res.body.data.id, '581beb50dcb89b95c4ffb454');
  t.is(res.body.data.brandName, 'hello brand');
  t.is(res.body.data.hotelName, 'A酒店');
  t.is(res.body.data.checkInCount, 14);
  t.is(res.body.data.headImgUrl, "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46")
});
