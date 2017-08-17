/**
 * Created by zxl on 2017/7/14.
 */
export function selectCorrect (context, params) {
  return context.$http.post('web/teacher/correct/selectCorrect', params, {'emulateJSON': true});
};
export function selectDetails (context, params) {
  return context.$http.post('/web/teacher/correct/selectDetails', params, {'emulateJSON': true});
};
export function selectPaper (context, params) {
  return context.$http.post('/web/teacher/correct/selectPaper', params, {'emulateJSON': true});
};
export function selectAnswerPicture (context, params) {
  return context.$http.post('/web/teacher/correct/selectAnswerPicture', params, {'emulateJSON': true});
};
export function selectQueLabelByMongo (context, params) {
  return context.$http.post('/web/teacher/correct/selectQueLabelByMongo', params, {'emulateJSON': true});
};
export function nextStudent (context, params) {
  return context.$http.post('/web/teacher/correct/nextStudent', params, {'emulateJSON': true});
};
export function addExperience (context, params) {
  return context.$http.post('/web/teacher/correct/correctAndAddExperience', params, {'emulateJSON': true});
};
