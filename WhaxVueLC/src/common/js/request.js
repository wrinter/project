/**
 * Created by Echonessy on 2017/6/19.
 */
export function UrlSearch (name) {
  let str = window.location.href // 取得整个地址栏参数
  let num = str.indexOf('?')
  str = str.substr(num + 1)// 取得所有参数   stringvar.substr(start [, length ]
  let arr = str.split('&') // 各个参数放到数组里
  let ResultArr = []
  for (let i = 0; i < arr.length; i++) {
    let ArrName = arr[i].split('=')[0]
    ResultArr[ArrName] = arr[i].split('=')[1]
  }
  return ResultArr[name]
}
