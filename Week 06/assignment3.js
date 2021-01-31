/*
 * @Author: songyzh
 * @Date: 2021-01-31 21:53:11
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-31 21:53:12
 */
function UTF8_Encoding(string) {
  let encoder = new TextEncoder();
  return encoder.encode(string);
}
