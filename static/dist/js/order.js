var duration_info;
var duration_value;

function checkBad() {
  if ($("#car_id").val() == "") {
    msg_info('请选择车辆');
    return true;
  } else if (!$("#pick_date").val()) {
    msg_info('请选择取车时间');
    return true;
  }
}

function checkFile() {
  if ($(".custom-file-note").filter(function () {
      return $(this).val() == "";
    }).length > 0) {
    msg_info('请您填写所有准备上传文件的备注');
    return true;
  }
  if ($(".custom-file").filter(function () {
      return $(this).val() == "";
    }).length > 0) {
    msg_info('请您选择所有准备上传的文件');
    return true;
  }
}

function searchUser() {
  $("#user_name_not_found").hide();
  var user_name = $("#user_name").val();
  if (user_name == "") {
    $("#user_name_label").show();
  } else {
    $("#user_name_label").hide();
    $("#user_name_select").html("");
    $.ajax({
      url: ACCOUNT_HOST + '/api/account/users/userinfo/get-by-name/',
      type: "GET",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {"user_name": user_name},
      success: function (data) {
        if (data.code == 2) {
          msg_info(data.msg, 'warning');
        } else if (data.code == 0) {
          $("<option></option>").val("").text("---请选择---").appendTo($("#user_name_select"));
          $.each(data.user_info, function (i, user_info) {
            $("<option></option>").attr({
              "data-mobile": user_info["mobile"],
              "data-name": user_info["name"],
              "data-id_num": user_info["id_num"],
              "data-company": user_info["company_name"],
              "data-card_number": user_info["card_number"],
              "data-card_account": user_info["card_account"],
              "data-card_bank": user_info["card_bank"],
              "data-drive_license_date": user_info["drive_license_date"]
            }).val(user_info["id"]).text(user_info["name"] + "-" + user_info["mobile"]).appendTo($("#user_name_select"));
            //if (i == 0) {
            //  $("#mobile").val(user_info["mobile"]);
            //  $("#company").val(user_info["company_name"]);
            //  $("#id_num").val(user_info["id_num"]);
            //  $("#card_account").val(user_info["company_name"]);
            //  $("#card_bank").val(user_info["card_bank"]);
            //  $("#card_number").val(user_info["card_number"]);
            //  $("#user_name").val(user_info["name"]);
            //  $("#user_id").val(user_info["id"]);
            //}
          });
        } else if (data.code == 13){
          $("#user_name_not_found").show();
        }
      },
      error: function () {
        window.location.reload();
      }
    }); // end ajax
  }
}

function set_duration_type(selected_type) {
  $("#duration_type").html("");
  for (var i in duration_info) {
    if (selected_type == duration_info[i].type) {
      $("<option selected='selected'></option>").val(duration_info[i].type).text(duration_info[i].name).appendTo($("#duration_type"));
    } else {
      $("<option></option>").val(duration_info[i].type).text(duration_info[i].name).appendTo($("#duration_type"));
    }
  }
}

function set_duration_value(selected_value) {
  $("#duration_value").html("");
  var duration_type = $("#duration_type").val();
  for (var i in duration_info) {
    if (duration_type == duration_info[i].type) {
      duration_value = duration_info[i].info;
      break;
    }
  }
  for (var i in duration_value) {
    if (selected_value == duration_value[i].id) {
      $("<option selected='selected' rel='" + duration_value[i].buy_type + "'></option>").val(duration_value[i].id).text(duration_value[i].display).appendTo($("#duration_value"));
    } else {
      $("<option rel='" + duration_value[i].buy_type + "'></option>").val(duration_value[i].id).text(duration_value[i].display).appendTo($("#duration_value"));
    }
  }
}

function set_duration_price() {
  var selected_duration_value_id = $("#duration_value").val();
  var selected_duration_type = $("#duration_type option:selected").val();
  var selected_duration_value = $("#duration_value").find("option:selected").text();
  for (var i in duration_value) {
    if (selected_duration_value_id == duration_value[i].id) {
      var rent_price = 0;
      if (selected_duration_type != 3) {
        var value = parseInt(selected_duration_value.substr(0, selected_duration_value.length - 1));
        rent_price = duration_value[i].price * value;
      } else {
        var buy_type = $("#duration_value option:selected").attr('rel');
        if (buy_type == 1) {
          rent_price = duration_value[i].buy_total;
        } else {
          rent_price = duration_value[i].price;
        }
      }
      $("#rent_price").val(rent_price / 100);
      $("#damage_money").val(duration_value[i].other_cost[0].price / 100);
      $("#illegal_money").val(duration_value[i].other_cost[1].price / 100);
      //var total = (rent_price + duration_value[i].other_cost[0].price + duration_value[i].other_cost[1].price) / 100;
      $("#invoice_amount").val(rent_price / 100);
      total_money_format();
    }
  }
}

function set_return_date() {
  var selected_duration_value = $("#duration_value").find("option:selected").text();
  var selected_duration_type = $("#duration_type option:selected").val();
  var buy_type = $("#duration_value option:selected").attr('rel');
  var pick_date = $("#pick_date").val();
  if (pick_date == "") {
    var today = new Date();
    pick_date = moment(today).format('YYYY-MM-DD')
    $("#pick_date").val(pick_date);
  }
  var return_date = moment(pick_date);
  if (selected_duration_type == 3) {                            // 以租代购类型
    if (buy_type == 1) {
      return_date = "";                             // 以租代购全款不显示还车日期
    } else {
      return_date = moment(return_date).add(1, 'year').format('YYYY-MM-DD');  // 以租代购分期显示加一年还车日期
    }
  } else {                                              // 除以租代购之外的其他租赁类型
    var type = selected_duration_value.substr(selected_duration_value.length - 1, 1);
    var value = parseInt(selected_duration_value.substr(0, selected_duration_value.length - 1));
    if (type == "年") {
      return_date = moment(return_date).add(value, 'year').format('YYYY-MM-DD');
    } else if (type == "月") {
      return_date = moment(return_date).add(value, 'month').format('YYYY-MM-DD');
    } else if (type == "日") {
      return_date = moment(return_date).add(value, 'day').format('YYYY-MM-DD');
    }
  }
  if (return_date != "" && moment(return_date).format("D") == moment(pick_date).format("D") && (type == "年" || type == "月")){
    return_date = moment(return_date).subtract(1, 'day').format('YYYY-MM-DD');
  }

  $("#return_date").val(return_date);
}

function total_money_format() {
  var commercial_insurance = parseFloat($("#commercial_insurance").val() || 0);
  var earnest = parseFloat($("#earnest").val() || 0);
  var rent_price = parseFloat($("#rent_price").val() || 0);
  var damage_money = parseFloat($("#damage_money").val() || 0);
  var illegal_money = parseFloat($("#illegal_money").val() || 0);
  var balance_damage_money = parseFloat($("#balance_damage_money").val() || 0);
  var balance_illegal_money = parseFloat($("#balance_illegal_money").val() || 0);

  var total_money = commercial_insurance + rent_price + damage_money + illegal_money;
  var pay_money = total_money - earnest - balance_damage_money - balance_illegal_money;

  $("#total_money_show").val(('￥ ' + total_money.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));
  $("#pay_money_show").val(('￥ ' + pay_money.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));

  $("#total_money_tip").val(Nzh.cn.toMoney(total_money).replace("人民币", ""));
  $("#pay_money_tip").val(Nzh.cn.toMoney(pay_money).replace("人民币", ""));
}

function duration_info_init(model_id, color, selected_type, selected_value, flag) {
  $.ajax({
    url: CAR_HOST + "/api/car/model-duration-info/",
    type: "GET",
    data: {"model_id": model_id, "color": color},
    success: function (data) {
      if (data.code == ERROR_CODE.SUCCESS) {
        duration_info = data.duration_info;
        set_duration_type(selected_type);
        set_duration_value(selected_value);
        if (flag) {
          set_duration_price();
        }
      } else if (data.code == ERROR_CODE.NOT_FOUND) {
        msg_info('选择的颜色车型未配置对应的租期类型！');
      }
      else {
        msg_info('网络异常，请重新选择车辆编号！');
      }
    },
    error: function () {
      msg_info('获取车辆租赁信息失败！');
    }
  });
}

function genContractId(url){
  $.ajax({
    url: url,
    type: "GET",
    data: {"contract_type": "personal"},
    success: function (data) {
      if (data.code == 2) msg_info(data.msg, 'warning');
      else if (data.code == 0) $("#contract_id").val(data.contract_id);
    },
    error: function () {
      msg_info("网络异常请重试！", 'warning');
    }
  }); // end ajax
}

$(function () {
  window.location.href = "#message-top";
  $("#car_id").select2();
  $("#user_name_select").select2();

  $("#pick_date").datepicker({format: 'yyyy-mm-dd', language: 'zh-CN'}).on("changeDate", function (e) {
    var duration_value = $("#duration_value").find("option:selected").text();
    var duration_type = $("#duration_type option:selected").val();
    var return_date = moment(e.format(e.dates, "yyyy-mm-dd")).format('YYYY-MM-DD');
    if (return_date == "Invalid date"){
      $("#return_date").val("");
      return;
    }
    var pick_date = return_date;
    var buy_type = $("#duration_value option:selected").attr('rel');
    if (duration_type == 3) {                      // 以租代购类型
      if (buy_type == 1) {
        return_date = "";                        // 以租代购全款不显示还车日期
      } else {
        return_date = moment(return_date).add(1, 'year').format('YYYY-MM-DD');   // 以租代购分期显示加一年还车日期
      }
    } else {                                        // 除以租代购之外的其他租赁类型
      var type = duration_value.substr(duration_value.length - 1, 1);
      var value = parseInt(duration_value.substr(0, duration_value.length - 1));
      if (type == "年") {
        return_date = moment(e.format(e.dates, "yyyy-mm-dd")).add(value, 'year').format('YYYY-MM-DD');
      } else if (type == "月") {
        return_date = moment(e.format(e.dates, "yyyy-mm-dd")).add(value, 'month').format('YYYY-MM-DD');
      } else if (type == "日") {
        return_date = moment(e.format(e.dates, "yyyy-mm-dd")).add(value, 'day').format('YYYY-MM-DD');
      }
    }
    if (return_date != "" && moment(return_date).format("D") == moment(pick_date).format("D") && (type == "年" || type == "月")){
      return_date = moment(return_date).subtract(1, 'day').format('YYYY-MM-DD');
    }
    $("#return_date").val(return_date);
  });

  $("#duration_type").on("change", function () {
    set_duration_value($("#duration_type").val());
    set_return_date();
    set_duration_price();
  });

  $("#duration_value").on("change", function () {
    set_return_date();
    set_duration_price();
  });

  $("#user_name_select").on("change", function () {
    var option = $(this).find(":selected");
    $("#mobile").val(option.attr("data-mobile"));
    $("#company").val(option.attr("data-company"));
    $("#id_num").val(option.attr("data-id_num"));
    $("#card_account").val(option.attr("data-card_account"));
    $("#card_bank").val(option.attr("data-card_bank"));
    $("#drive_license_date").val(option.attr("data-drive_license_date"));
    $("#card_number").val(option.attr("data-card_number"));
    $("#user_name").val(option.attr("data-name"));
    $("#user_id").val($(this).val());
    $("#invoice_title").val(option.attr("data-name"));
  });

  $("#car_id").on("change", function () {
    var option = $(this).find(":selected");
    $("#car_num").val(option.attr("data-number"));
    $("#car_model_id").val(option.attr("data-model_id"));
    $("#car_model_name").val(option.attr("data-model_name"));
    $("#car_color_id").val(option.attr("data-color_id"));
    $("#car_color_display").val(option.attr("data-color"));
    $("#store").val(option.attr("data-store"));
    $("#distance").val(option.attr("data-distance"));
    $("#vin").val(option.attr("data-vin"));
    if ($(this).val()) {
      $.ajax({
        url: CAR_HOST + "/api/car/model-duration-info/",
        type: "GET",
        data: {"model_id": option.attr("data-model_id"), "color": option.attr("data-color_id")},
        success: function (data) {
          if (data.code == ERROR_CODE.SUCCESS) {
            duration_info = data.duration_info;
            set_duration_type($("#duration_type").val());
            set_duration_value($("#duration_value").val());
            set_return_date();
            set_duration_price();
          } else if (data.code == ERROR_CODE.NOT_FOUND) {
            msg_info('选择的颜色车型未配置对应的租期类型！');
          }
          else {
            msg_info('网络异常，请重新选择车辆编号！');
          }
        },
        error: function () {
          msg_info('获取车辆租赁信息失败！');
        }
      });
    }
  });

  $("#add-file").on("click", function () {
    var id = new Date().getTime() + Math.random() * 100;
    var html = '<div class="col-sm-4 file-block">' +
      '<p></p>' +
      '<div class="col-sm-12">' +
      '<input name="' + id + '" type="file" class="form-control custom-file">' +
      '<input name="note-' + id + '" type="text" class="form-control input-sm custom-file-note" placeholder="请为此文件备注">' +
      '</div>' +
      '<div class="col-sm-12">' +
      '<button type="button" class="btn btn-xs btn-block btn-danger drop-file-btn"><i class="fa fa-trash"></i>删除</button>' +
      '</div>' +
      '</div>';
    $("#file-div").append(html);
  });
  $("body").delegate(".drop-file-btn", "click", function () {
    $(this).closest('.file-block').remove();
  });
  $("#commercial_insurance").on('keyup', function () {
    total_money_format();
  });
  $("#commercial_insurance").trigger("keyup");

  $("#earnest").on('keyup', function () {
    total_money_format();
  });
  $("#earnest").trigger("keyup");

  $("#rent_price").on('keyup', function () {
    total_money_format();
  });
  $("#rent_price").trigger("keyup");

  $("#damage_money").on('keyup', function () {
    total_money_format();
  });
  $("#damage_money").trigger("keyup");

  $("#illegal_money").on('keyup', function () {
    total_money_format();
  });
  $("#illegal_money").trigger("keyup");

  $("input[type^='file']").change(function(event){
    var file = $(event.target)[0].files[0];
    if(file){
       var src = URL.createObjectURL(file);
      $(this).siblings('img').attr({src: src});
    }
  });

  $(".upload-img-box a.pull-left").click(function(){
    var rotate = $(this).parent().siblings('.rotate');
    var rotateValue = (parseInt(rotate.val()) + 90) % 360;
    rotate.val(rotateValue);
    $(this).parent().siblings('img').attr({"class": "rotate_" + rotateValue});
  });

  $(".upload-img-box a.pull-right").click(function(){
    $(this).parent().siblings('input').val("");
    $(this).parent().siblings('img').attr({src: "/static/img/img-add.png"});
    $(this).parent().siblings('img').attr({class: ""});
  });
});
