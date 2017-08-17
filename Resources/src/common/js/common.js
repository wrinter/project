/**
 * Created by zxl on 2017/6/16.
 */
import $ from 'jquery';
export function stopBubble (evt) {
  var evet = evt || window.event;
  if (evet.stopPropagation) {
    evet.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }
};
// 提示信息自动隐藏
export function Disappear (a) {
  if ($(a).css('display') === 'block') {
    setTimeout(function () {
      $(a).fadeOut(1000, function () {
        $(a).css('width', '355px');
      });
    }, 2000);
  }
};
export function GoldAnimate (GoldNum) {
  if (GoldNum <= 0) {
    return false;
  }
  var $GoldHtml = '';
  $GoldHtml += '<div class="Com_Gold" id="Com_Gold">';
  $GoldHtml += '<img src="/static/images/common/goldimg.png" alt="" class="Com_GoldImg">';
  $GoldHtml += '<p class="Com_GoldNum" id="Com_GoldNum"></p>';
  $GoldHtml += '<audio src="/static/images/common/gold.wav" autoplay id="GoldAudio"></audio>';
  $GoldHtml += '</div>';
  $('body,html').append($GoldHtml);
  $('#Com_Gold').animate({bottom: '40%'}, 1000, function () {
    $('#Com_Gold').animate({bottom: '50%', opacity: '0'}, 2500, function () {
      $('#Com_Gold').css({'bottom': '-150px', 'opacity': '1'});
    });
  });
  $('#Com_GoldNum').html('金币+' + GoldNum);
};
export function logout (context) {
  return context.$http.get('/web/user/logout?' + Math.random());
};
// 点击a淡rub封装
export function FadeIn (a, b) {
  $(a).on('click', function () {
    $(b).fadeIn(200);
  });
};
// 点击a淡出b封装
export function FadeOut (a, b) {
  $(a).on('click', function () {
    $(b).fadeOut(200);
  });
};
// 判断数组是否含有某个元素
export function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}
