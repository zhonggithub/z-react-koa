/*
 * @Author: Zz
 * @Date: 2017-04-12 20:57:15
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-12 20:57:47
 */
exports.package200 = res => {
  if (res.status !== 200) {
    return res.json().then(rst => {
      throw new Error(`[${rst.code}] ${rst.message}`);
    });
  }
  return res.json();
};

exports.package201 = res => {
  if (res.status !== 201) {
    return res.json().then(rst => {
      throw new Error(`[${rst.code}] ${rst.message}`);
    });
  }
  return res.json();
};