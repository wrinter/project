/**
 * Created by zxl on 2017/6/27.
 */

export function getClassList (context) {
  return context.$http.post('/web/teacher/class/list');
};
export function classSearch (context, params) {
  return context.$http.post('/web/teacher/class/search', params, {'emulateJSON': true});
};
export function classJoin (context, params) {
  return context.$http.post('/web/teacher/class/join', params, {'emulateJSON': true});
};
export function checkSchool (context) {
  return context.$http.post('/web/teacher/class/check/school');
};
export function getArea (context, params) {
  return context.$http.post('/web/common/area', params, {'emulateJSON': true});
};
export function getSchool (context, params) {
  return context.$http.post('/web/common/school', params, {'emulateJSON': true});
};
export function getMessageSize (context) {
  return context.$http.post('/web/user/pcUserApplyMessageSize');
};
export function setSchool (context, params) {
  return context.$http.post('/web/teacher/class/school', params, {'emulateJSON': true});
};
export function createEnsure (context, params) {
  return context.$http.post('/web/teacher/class/create', params);
};
export function getClassCreated (context) {
  return context.$http.post('/web/teacher/class/exist');
};
export function getCurrentGrade (context) {
  return context.$http.post('/web/teacher/class/current/grade');
};
export function getClassCode (context, params) {
  return context.$http.post('/web/teacher/class/info', params, {'emulateJSON': true});
};
export function getJionedClass (context) {
  return context.$http.post('/web/teacher/class/list');
};
export function getTeachers (context, params) {
  return context.$http.post('/web/teacher/class/teacher', params, {'emulateJSON': true});
};
export function teacherSet (context, params) {
  return context.$http.post('/web/teacher/class/teacher/set', params, {'emulateJSON': true});
};
export function teacherDelete (context, params) {
  return context.$http.post('/web/teacher/class/teacher/delete', params, {'emulateJSON': true});
};
export function getStudents (context, params) {
  return context.$http.post('/web/teacher/class/student', params, {'emulateJSON': true});
};
export function removeStudent (context, params) {
  return context.$http.post('/web/teacher/class/student/remove', params, {'emulateJSON': true});
};
export function getGroup (context, params) {
  return context.$http.post('/web/teacher/class/group', params, {'emulateJSON': true});
};
export function checkHeader (context, params) {
  return context.$http.post('/web/teacher/class/group/checkHeader', params, {'emulateJSON': true});
};
export function getNogroup (context, params) {
  return context.$http.post('/web/teacher/class/nogroup', params, {'emulateJSON': true});
};
export function getReport (context, params) {
  return context.$http.post('/web/teacher/class/report/work', params, {'emulateJSON': true});
};
export function getUnsubmit (context, params) {
  return context.$http.post('/web/teacher/class/report/unsubmit', params, {'emulateJSON': true});
};
export function getWorkDetail (context, params) {
  return context.$http.post('/web/teacher/class/report/work/details', params, {'emulateJSON': true});
};
export function getTest (context, params) {
  return context.$http.post('/web/teacher/class/report/test', params, {'emulateJSON': true});
};
export function getTestDetails (context, params) {
  return context.$http.post('/web/teacher/class/report/test/details', params, {'emulateJSON': true});
};
export function groupDelete (context, params) {
  return context.$http.post('/web/teacher/class/group/delete', params, {'emulateJSON': true});
};
export function groupCreate (context, params) {
  return context.$http.post('/web/teacher/class/group/create', params);
};
export function groupUpdate (context, params) {
  return context.$http.post('/web/teacher/class/group/update', params);
};
export function teacherExit (context, params) {
  return context.$http.post('/web/teacher/class/teacher/exit', params, {'emulateJSON': true});
};
export function teacherDissolve (context, params) {
  return context.$http.post('/web/teacher/class/teacher/dissolve', params, {'emulateJSON': true});
};
