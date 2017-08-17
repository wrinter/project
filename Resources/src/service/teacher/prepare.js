/**
 * Created by zxl on 2017/7/20.
 */
export function getCategory (context, param) {
  return context.$http.post('/web/teacher/prepare/category', param, {'emulateJSON': true});
};
