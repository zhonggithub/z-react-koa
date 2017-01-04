import crypto from 'crypto';

export default {
  async retrieveSignature(ctx) {
    const expire = Date.now() + (1000 * 60 * 60 * 2);
    const expiration = new Date(expire); // 两小时有效期
    const userDir = 'console_group';
    const policyText = {
      expiration,
      conditions: [
        { bucket: process.env.OSS_BUCKET },
        ['starts-with', '$key', process.env.OSS_USER_DIR || userDir],
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
      ],
    };
    const hmac = crypto.createHmac('sha1', process.env.OSS_ACCESS_KEY);
    const policyBase64 = new Buffer(JSON.stringify(policyText)).toString('base64');
    const message = policyBase64;
    hmac.update(message);
    const signature = hmac.digest('base64');

    ctx.body = {
      accessId: process.env.OSS_ACCESS_ID,
      policy: policyBase64,
      signature,
      expire,
      host: process.env.OSS_HOST, // 指的是用户要往哪个域名上传请求
      dir: process.env.OSS_USER_DIR || userDir, // 指定用户上传的文件以dir开头
    };
    ctx.status = 200;
  },
};
