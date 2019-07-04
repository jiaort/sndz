// 全局变量
var MADA_HOST = "http://mada.hikop.com";

var ERROR_CODE = {
  SUCCESS: 0,
  UNKNOWN: 1,
  FAILED: 2,
  IN_BLACKLIST: 6,
  PARAM_ERROR: 12,
  NOT_FOUND: 13,
  NOT_LOGIN: 14
};

function msg_info(msg, type, timeout) {
  if (!type) type = 'info';
  if (!timeout) timeout = 3000;
  var id = (new Date).getTime() + '' + parseInt(Math.random() * 100);
  var msg_html = '<div class="pad margin no-print" id="' + id + '">' +
    '<div class="alert alert-' + type + '" style="padding-bottom: 0!important;">' +
    '<h4><i class="fa fa-info"></i>&nbsp;&nbsp;' + msg + '</h4>' +
    '</div>' +
    '</div>';
  $('.content-header').after(msg_html);
  setTimeout(function () {
    $("#" + id).fadeOut();
  }, timeout);
  window.location.href = '#message-top';
}

var count=0;
function submitOnce (){
  if (count == 0){
     count++;
     return true;
  } else{
    msg_info("正在操作，请勿重复提交");
    return false;
  }
}

$.extend( true, $.fn.dataTable.defaults, {
  // 自定义datatable翻页样子
  oLanguage : {
    "oPaginate": {
      "sFirst": "",
      "sLast": "",
      "sNext": "",
      "sPrevious": ""
    },
    sSearch: '搜索:',
    sInfo: "_START_ ~ _END_, 总计: _TOTAL_",
    sLengthMenu: "显示 _MENU_ 条记录"
  }
});

$(function(){
  // 短时间显示错误提示 3s
  setTimeout(function () {
    $(".dmsg").fadeOut();
  }, 3000);
  // 长时间显示错误提示 10s
  setTimeout(function () {
    $(".dmsg-long").fadeOut();
  }, 10000);
});


$.fn.serializefiles = function() {
  var obj = $(this);
  /* ADD FILE TO PARAM AJAX */
  var formData = new FormData();
  $.each($(obj).find("input[type='file']"), function(i, tag) {
      $.each($(tag)[0].files, function(i, file) {
          formData.append(tag.name, file);
      });
  });
  var params = $(obj).serializeArray();
  $.each(params, function (i, val) {
      formData.append(val.name, val.value);
  });
  return formData;
};

//获取url中的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}
