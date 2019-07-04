var duration_info;
var duration_value;

function checkBad() {
  if($("#car_id").val() == ""){
    msg_info('请选择车辆');
    return true;
  }else if (!$("#pick_date").val()) {
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

function car_count(){
  return $(".car_id").size();
}

function set_duration_type(selected_type) {
  $("#duration_type").html("");
  if(car_count() == -1){
    $("<option></option>").val("").text("---请选择---").appendTo($("#duration_type"));
  }else {
    for (var i in duration_info) {
      if (selected_type == duration_info[i].type) {
        $("<option selected='selected'></option>").val(duration_info[i].type).text(duration_info[i].name).appendTo($("#duration_type"));
      } else {
        $("<option></option>").val(duration_info[i].type).text(duration_info[i].name).appendTo($("#duration_type"));
      }
    }
  }
}

function set_duration_value(selected_value) {
  $("#duration_value").html("");
  if(car_count() == -1){
    $("<option></option>").val("").text("---请选择---").appendTo($("#duration_value"));
  }else{
    var duration_type = $("#duration_type").val();
    for (var i in duration_info) {
      if (duration_type == duration_info[i].type) {
        duration_value = duration_info[i].info;
        break;
      }
    }
    for (var i in duration_value) {
      if (selected_value == duration_value[i].id) {
        $("<option selected='selected' rel='"+duration_value[i].buy_type+"'></option>").val(duration_value[i].id).text(duration_value[i].display).appendTo($("#duration_value"));
      } else {
        $("<option rel='"+duration_value[i].buy_type+"'></option>").val(duration_value[i].id).text(duration_value[i].display).appendTo($("#duration_value"));
      }
    }
  }
}

function set_duration_price() {
  if(car_count() == -1){
    $("#rent_price").val("");
    $("#damage_money").val("");
    $("#illegal_money").val("");
  }else{
    var selected_duration_value_id = $("#duration_value").val();
    var selected_duration_type = $("#duration_type option:selected").val();
    var selected_duration_value = $("#duration_value").find("option:selected").text();
    for (var i in duration_value) {
      if (selected_duration_value_id == duration_value[i].id) {
        var rent_price = 0;
        if (selected_duration_type != 3){
          var value = parseInt(selected_duration_value.substr(0, selected_duration_value.length - 1));
          rent_price = duration_value[i].price * value;
        }else{
          var buy_type = $("#duration_value option:selected").attr('rel');
          if(buy_type == 1){
            rent_price = duration_value[i].buy_total;
          }else{
            rent_price = duration_value[i].price;
          }
        }
        $("#rent_price").val(rent_price / 100);
        $("#damage_money").val(duration_value[i].other_cost[0].price / 100);
        $("#illegal_money").val(duration_value[i].other_cost[1].price / 100);
        //var total = (rent_price + duration_value[i].other_cost[0].price + duration_value[i].other_cost[1].price) / 100;
        total_money_format();
      }
    }
  }
}

function set_return_date() {
  if(car_count() == -1){
    $("#return_date").val("");
  }else{
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
    if (selected_duration_type == 3){                            // 以租代购类型
      if(buy_type == 1){
        return_date = "";                             // 以租代购全款不显示还车日期
      }else{
        return_date = moment(return_date).add(1, 'year').format('YYYY-MM-DD');  // 以租代购分期显示加一年还车日期
      }
    }else{                                              // 除以租代购之外的其他租赁类型
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
    $("#return_date").val(return_date);
  }
}

function total_money_format() {
  var collection_insurance = parseFloat($("#collection_insurance").val() || 0);
  var rent_price = parseFloat($("#rent_price").val() || 0);
  var damage_money = parseFloat($("#damage_money").val() || 0);
  var illegal_money = parseFloat($("#illegal_money").val() || 0);

  var count = car_count();

  $(".pay-table-car-count").html("x&nbsp;" + count);

  var rent_price_total = rent_price * count;
  var illegal_money_total = illegal_money * count;
  var damage_money_total = damage_money * count;
  var collection_insurance_total = collection_insurance * count;

  $("#rent_price_total").text(rent_price_total.toFixed(2));
  $("#illegal_money_total").text(illegal_money_total.toFixed(2));
  $("#damage_money_total").text(damage_money_total.toFixed(2));
  $("#collection_insurance_total").text(collection_insurance_total.toFixed(2));

  var total_money = collection_insurance_total + rent_price_total + damage_money_total + illegal_money_total;

  $("#total_money_show").val(('￥ ' + total_money.toFixed(2)).replace(/\B(?=(?:\d{3})+\b)/g, ','));

  $("#total_money_tip").val(Nzh.cn.toMoney(total_money).replace("人民币", ""));

  $("#invoice_amount").val(rent_price_total.toFixed(2));
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

function searchDriver() {
  $("#user_name_not_found").hide();
  var search_user = $("#search_user").val();
  if (search_user == "") {
    $("#user_name_label").show();
  } else {
    $("#user_name_label").hide();
    $("#user_name_dialog").html("");
    $.ajax({
      url: ACCOUNT_HOST + '/api/account/users/userinfo/get-by-name/',
      type: "GET",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data:{"user_name": search_user},
      success: function (data) {
        if (data.code == 2){
          msg_info(data.msg, 'warning');
        }else if (data.code == 0){
          $("#user_name_dialog").select2();
          $("<option></option>").val("").text("---请选择---").appendTo($("#user_name_dialog"));
          $.each(data.user_info, function(i, user_info){
            $("<option></option>").attr("data-id_num", user_info["id_num"]).val(user_info["id"]).text(user_info["name"] + "-[手机号:" + user_info["mobile"] + "]").appendTo($("#user_name_dialog"));
          });
        }else if (data.code == 13){
          $("#user_name_not_found").show();
        }
      },
      error: function () {
        window.location.reload();
      }
    }); // end ajax
  }
}

function searchCustomer() {
  $("#customer_name_not_found").hide();
  var customer_name = $("#customer_name").val();
  if (customer_name == "") {
    $("#customer_name_label").show();
  } else {
    $("#customer_name_label").hide();
    $("#customer_select").html("");
    $.ajax({
      url: ACCOUNT_HOST + '/api/account/users/userinfo/get-customer-info/',
      type: "GET",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {"customer_name": customer_name},
      success: function (data) {
        if (data.code == 2) {
          msg_info(data.msg, 'warning');
        } else if (data.code == 0) {
          $("<option></option>").val("").text("---请选择---").appendTo($("#customer_select"));
          $.each(data.customer_info, function (i, customer_info) {
            $("<option></option>").attr({
              "data-mobile": customer_info["mobile"],
              "data-customer_name": customer_info["name"],
              "data-customer_type": customer_info["type"],
              "data-customer_address": customer_info["address"],
              "data-id_num": customer_info["id_num"],
              "data-card_number": customer_info["card_number"],
              "data-card_account": customer_info["card_account"],
              "data-card_bank": customer_info["card_bank"]
            }).val(customer_info["id"]).html(customer_info["name"] + "-" + customer_info["mobile"]).appendTo($("#customer_select"));
          });
        } else if (data.code == 13){
          $("#customer_name_not_found").show();
        }
      },
      error: function () {
        window.location.reload();
      }
    }); // end ajax
  }
}

function insertTable() {
  var car_option = $("#car_id_dialog").find(":selected");
  var car_id = $("#car_id_dialog").val();
  if (car_id == ""){
    $("#car_label").show();
    return;
  }
  var car_num = car_option.attr("data-number");
  var car_model_id = car_option.attr("data-model_id");
  var car_model_name = car_option.attr("data-model_name");
  var car_color = car_option.attr("data-color_id");
  var car_color_display = car_option.attr("data-color");
  var car_rent_status_display = car_option.attr("data-status");
  var store = car_option.attr("data-store");
  var distance = car_option.attr("data-distance");
  var vin = car_option.attr("data-vin");

  var car_selected = false;
  $(".car_id").each(function(){
    if($(this).val() == car_id){
      car_selected = true;
      return;
    }
  });
  if (car_selected){
    $("#car_select_label").show();
    return;
  }

  var car_model_selected = false;
  $(".car_model_id").each(function(){
    if($(this).val() != car_model_id){
      car_model_selected = true;
      return;
    }
  });
  if (car_model_selected){
    $("#car_model_label").show();
    return;
  }

  var user_option = $("#user_name_dialog").find(":selected");
  if (user_option.val()) {
    var user_id = user_option.val();
    var id_num = user_option.attr("data-id_num");
    var user_name = user_option.text().split("-")[0];
  }else{
    var user_id = "";
    var id_num = "";
    var user_name = "";
  }


  var html = "<tr><td></td><td>" + car_id + "</td><td>" + car_num + "</td><td>" + car_model_name;
  html += "</td><td>" + car_color_display + "</td><td>" + user_name + "</td><td>" + car_rent_status_display + "</td><td>";
  html += '<a id="get_del_tr" style="cursor: pointer" data-toggle="modal" data-target="#delModel">删除</a>';

  html += '<input hidden="hidden" class="car_id" name="car_id" value="' + car_id + '"/>';
  html += '<input hidden="hidden" name="number" value="' + car_num + '"/>';
  html += '<input hidden="hidden" class="car_model_id" name="car_model_id" value="' + car_model_id + '"/>';
  html += '<input hidden="hidden" name="car_model_name" value="' + car_model_name + '"/>';
  html += '<input hidden="hidden" name="car_color" value="' + car_color + '"/>';
  html += '<input hidden="hidden" name="car_color_display" value="' + car_color_display + '"/>';
  html += '<input hidden="hidden" name="user_id" value="' + user_id + '"/>';
  html += '<input hidden="hidden" name="user_name" value="' + user_name + '"/>';
  html += '<input hidden="hidden" name="id_num_car" value="' + id_num + '"/>';
  html += '<input hidden="hidden" name="distance" value="' + distance + '"/>';
  html += '<input hidden="hidden" name="vin" value="' + vin + '"/></tr>';
  $(".car_tbody").append(html);
  set_index();
  total_money_format();
  $("#car_label").hide();
  $("#car_select_label").hide();
  $("#car_model_label").hide();
  $("#carModal").modal('hide');
}

function do_del_tr(){
  var index = $("#del_tr").val();
  $("#car-info-table tr")[index].remove();
  $("#delModel").modal('hide');
  set_index();
}

function set_index(){
  $("#car-info-table tr").each(function(){
    $(this).find("td").first().html($(this).index() + 1);
  });
}

function genContractId(url){
  $.ajax({
    url: url,
    type: "GET",
    data: {"contract_type": "group"},
    success: function (data) {
      if (data.code == 2) msg_info(data.msg, 'warning');
      else if (data.code == 0) $("#contract_id").val(data.contract_id);
    },
    error: function () {
      msg_info("网络异常请重试！", 'warning');
    }
  }); // end ajax
}

$("#personal").change(function(){
  if($("#invoice_type").find("option:selected").val() == 2){
    $("#invoice_type").find("option").attr("selected",false);
    $("#select_default").attr("selected",true);
  }
  $("#invoice_customer_type").val(1);
  $(".company-info").hide();
  $(".special").hide();
});

$("#company").change(function(){
  $(".special").show();
  $("#invoice_customer_type").val(2);
  if($("#invoice_type").find("option:selected").val() == 2){
    $(".company-info").show();
  }else{
    $(".company-info").hide();
  }
});

$(function () {
  window.location.href = "#message-top";
  $("#car_id_dialog").select2();
  $("#customer_select").select2();

  $("#pick_date").datepicker({format: 'yyyy-mm-dd', language: 'zh-CN'}).on("changeDate", function (e) {
    var duration_value = $("#duration_value").find("option:selected").text();
    var duration_type = $("#duration_type option:selected").val();
    var return_date = moment(e.format(e.dates, "yyyy-mm-dd")).format('YYYY-MM-DD');
    var buy_type = $("#duration_value option:selected").attr('rel');
    if (duration_type == 3){                      // 以租代购类型
      if(buy_type == 1){
        return_date = "";                        // 以租代购全款不显示还车日期
      }else{
        return_date = moment(return_date).add(1, 'year').format('YYYY-MM-DD');   // 以租代购分期显示加一年还车日期
      }
    }else{                                        // 除以租代购之外的其他租赁类型
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

  $("#car_id_dialog").on("change", function () {
    $("#car_select_label").hide();
    $("#car_model_label").hide();
    var option = $(this).find(":selected");
    $("#car_num_dialog").val(option.attr("data-number"));
    $("#car_model_id_dialog").val(option.attr("data-model_id"));
    $("#car_model_name_dialog").val(option.attr("data-model_name"));
    $("#car_color_id_dialog").val(option.attr("data-color_id"));
    $("#car_color_display_dialog").val(option.attr("data-color"));
    $("#car_rent_status_display_dialog").val(option.attr("data-status"));
    $("#store_dialog").val(option.attr("data-store"));
    $("#distance_dialog").val(option.attr("data-distance"));
    $("#vin_dialog").val(option.attr("data-vin"));
    if($(this).val()){
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
    }else{
      set_duration_type($("#duration_type").val());
      set_duration_value($("#duration_value").val());
      set_return_date();
      set_duration_price();
      total_money_format();
    }
  });

  $("#invoice_type").on("change", function () {
    if($("#invoice_type").find("option:selected").val() == 2){
      $(".company-info").show();
    }else{
      $(".company-info").hide();
    }
  });

  $("#customer_select").on("change", function () {
    var option = $(this).find(":selected");
    $("#customer_name").val(option.attr("data-customer_name"));
    $("#customer_type").val(option.attr("data-customer_type"));
    $("#mobile").val(option.attr("data-mobile"));
    $("#id_num").val(option.attr("data-id_num"));
    $("#card_account").val(option.attr("data-card_account"));
    $("#card_bank").val(option.attr("data-card_bank"));
    $("#card_number").val(option.attr("data-card_number"));
    $("#customer_id").val($(this).val());

    $("#invoice_title").val(option.attr("data-customer_name"));
    $("#invoice_mobile").val(option.attr("data-mobile"));
    $("#invoice_address").val(option.attr("data-customer_address"));
    $("#invoice_card_bank").val(option.attr("data-card_bank"));
    $("#invoice_card_number").val(option.attr("data-card_number"));
    if(option.attr("data-customer_type") == 1){
      $("#personal").attr("checked", "checked");
      if($("#invoice_type").find("option:selected").val() == 2){
        $("#invoice_type").find("option").attr("selected",false);
      }
      $(".company-info").hide();
      $(".special").hide();
    }
    if(option.attr("data-customer_type") == 2){
      $("#company").attr("checked", "checked");
      $(".special").show();
      if($("#invoice_type").find("option:selected").val() == 2){
        $(".company-info").show();
      }else{
        $(".company-info").hide();
      }
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

  $("body").delegate("#get_del_tr", "click", function () {
    var trSeq = $(this).parent().parent().parent().find("tr").index($(this).parent().parent()[0]);
    $("#del_tr").val(trSeq+1);
  });

  $("#collection_insurance").on('keyup', function () {
    total_money_format();
  });
  $("#collection_insurance").trigger("keyup");

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
    var rotate = $(this).siblings('.rotate');
    rotate.val(0);
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
