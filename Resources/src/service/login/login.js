/**
 * Created by zxl on 2017/5/24.
 */
export function login (context, params) {
  return context.$http.post('/web/user/login', params);
};
export function getCaptcha (context) {
  return context.$http.post('/web/common/captcha');
};
export function isTimeout (context) {
  return context.$http.post('/web/user/check/timeout');
};
export function isExist (context, params) {
  return context.$http.post('/web/user/check/mobile/exist', params);
};
export function forgetPwd (context, params) {
  return context.$http.post('/web/user/check/forget/pwd', params);
};
export function getMesg (context, params) {
  return context.$http.post('/web/user/check/forget/pwd/mobile', params);
};
export function checkMesg (context, params) {
  return context.$http.post('/web/user/check/forget/pwd/check', params);
};
export function updatePass (context, params) {
  return context.$http.post('/web/user/check/forget/pwd/update', params);
};
