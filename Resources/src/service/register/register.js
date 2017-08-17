/**
 * Created by zxl on 2017/6/16.
 */
export function checkMobile (context, params) {
  return context.$http.post('/web/user/check/mobile/not', params, {'emulateJSON': true});
};
export function getCaptcha (context) {
  return context.$http.post('/web/common/captcha');
};
export function postMessage (context, params) {
  return context.$http.post('/web/common/sms', params, {'emulateJSON': true});
};
export function checkMessage (context, params) {
  return context.$http.post('/web/common/sms/check', params, {'emulateJSON': true});
};
export function getSubject (context) {
  return context.$http.post('/web/common/subject');
};
export function getMaterial (context, params) {
  return context.$http.post('/web/common/material', params, {'emulateJSON': true});
};
export function getPress (context) {
  return context.$http.post('/web/common/press');
};
export function saveTeacher (context, params) {
  return context.$http.post('/web/user/register/teacher', params, {'emulateJSON': true});
};
export function quit (context) {
  return context.$http.get('/web/user/logout', Math.random());
};
export function getGrade (context) {
  return context.$http.post('/web/common/grade');
};
export function saveStudent (context, params) {
  return context.$http.post('/web/user/register/student', params, {'emulateJSON': true});
};

