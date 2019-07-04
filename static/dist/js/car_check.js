var max_img_count = 5;

$(".caption a").click(function(){
  remove_img($(this));
});

function remove_img($a){
  var input_name = $a.parents(".col-sm-2").find("input").attr("name").substr(12); // 从第12位开始截取，如upload_file_before_nick,截取到before_nick
  var upload_name = "upload_file_" + input_name;
  var origin_name = "origin_upload_" + input_name;
  $a.parents(".col-sm-2").remove();
  if($("input[name*='"+upload_name+"']").length < max_img_count){
    $("input[name*='"+origin_name+"']").parents(".col-sm-2").removeClass("hidden");
  }
}

function uploadImage(file, callback) {
  var formData = new FormData();
  formData.append('file', file);
  $.ajax({
    url : "/manager/car/upload_file/",
    type : 'POST',
    data : formData,
    processData: false,
    contentType: false,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success : function(data) {
      callback(data);
    },
    error: function (data) {
      msg_info("上传失败，请重新上传!", "warning");
    }
  });
}

$(function () {
  window.location.href = "#message-top";
  var car_check_id = $("#car_check_id").val();
  if (!car_check_id){
    $("input:radio[value='1']").attr('checked', 'checked');
  }
  $("#out_check_time").datepicker({format: 'yyyy-mm-dd', language: 'zh-CN'});
  $("#storage_check_time").datepicker({format: 'yyyy-mm-dd', language: 'zh-CN'});

  $("input[name^='origin_upload']").change(function(){
    var file = $(event.target)[0].files[0];
    if(file){
      var src = URL.createObjectURL(file);
      var $cur_col = $(this).parents(".col-sm-2");
      var origin_name = $cur_col.find("input").attr("name").substr(14); // 从第14位开始截取，如origin_upload_before_nick,截取到before_nick
      var upload_input_name = "upload_file_" + origin_name;
      var $clone = $cur_col.clone(true);
      if ($("input[name*='"+upload_input_name+"']").length >= (max_img_count - 1)){
        $clone.addClass("hidden");  // 当图片到达max_img_count 把上传的按钮隐藏起来
      }
      $cur_col.after($clone);
      $cur_col.find("input").attr({"name": upload_input_name, "disabled": "disabled"});
      $cur_col.find("img").attr({src: src});
      $cur_col.find(".hidden").removeClass("hidden");
      $cur_col.find("a").click(function(){
        remove_img($(this));
      });
      uploadImage(file, function(data){
        switch (data.code) {
          case ERROR_CODE.SUCCESS:
            var img_path = data.file_path;
            var html = '<input type="hidden" name= "'+origin_name+'[]'+'" value="'+img_path+'" />';
            $cur_col.append(html);
            break;
        }
      });
    }
  });
});

