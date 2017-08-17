/**
 * Created by zxl on 2017/7/13.
 */
export function getAd (context) {
  return context.$http.post('/web/teacher/homepage/index/getTeacherSiteIndexAd');
};
export function getSiteIndex (context) {
  return context.$http.post('/web/teacher/homepage/index/getSiteIndex');
};
