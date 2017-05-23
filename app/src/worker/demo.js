/*
 * @Author: Zz
 * @Date: 2017-05-23 16:47:12
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 16:56:57
 */
exports.demo = async (msg) => {
  if (!msg.url || msg.url !== '/api/v1/demo') {
    return false;
  }
  // add your process
  //
  //
  return true;
};
