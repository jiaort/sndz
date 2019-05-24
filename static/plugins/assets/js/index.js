$(function(){
  var data_id = getUrlParam("data_id");
  $.ajax({
    url: "/manager/account/screen-data/",
    type: 'GET',
    data: {
      "data_type": $("#data_type").val(),
      "data_id": data_id
    },
    success: function (data) {
      if (data.code == ERROR_CODE.SUCCESS) {
        var months = [];
        var weights = [];
        for (var index in data.month_data) {
          months.push(data.month_data[index]["name"] + '月');
          weights.push(data.month_data[index]["weight"]);
        }
        /* 交易量月份柱状图 */
        var changedetail = echarts.init(document.getElementById('changedetail'));
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
            }
          },
          toolbox: {
            show:false,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data:['',''],
            show:false
          },
          grid:{
            top:'18%',
            right:'5%',
            bottom:'8%',
            left:'5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: months,
              splitLine:{
                show:false,
                lineStyle:{
                  color: '#3c4452'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                textStyle:{
                  color:"#fff"
                },
                lineStyle:{
                  color: '#519cff'
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '交易量(kg)',
              nameTextStyle:{
                color:'#fff'
              },
              splitLine:{
                show:true,
                lineStyle:{
                  color: '#23303f'
                }
              },
              axisLine: {
                show:false,
                lineStyle: {
                  color: '#115372'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                textStyle:{
                  color:"#fff"
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          color:"yellow",
          series: [
            {
              name:'交易量',
              type:'bar',
              data:weights,
              boundaryGap: '45%',
              barMaxWidth:'50',
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                        '#6bc0fb','#7fec9d','#fedd8b','#ffa597','#84e4dd','#7fec9s','#feddda','#ffawq7','#84edsd','#fedd8s','#fsf597','#84ewdd'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        if (weights.length > 0) {
          changedetail.setOption(option);
        }

        /* 养殖户交易量排名 */
        var seller_name = [];
        var seller_weight = [];
        for (var index in data.seller_data) {
          seller_name.push(data.seller_data[index]["name"]);
          seller_weight.push(data.seller_data[index]["weight"]);
        }
        var graduateyear = echarts.init(document.getElementById('graduateyear'));
        option = {
          title: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisTick: {
              show: false
            },
            axisLabel:{
              textStyle:{
                color:"#fff"
              },
              lineStyle:{
                color: '#519cff'
              },
              alignWithLabel: true,
              interval:0
            }
          },
          yAxis: {
            type: 'category',
            data: seller_name,
            axisTick: {
              show: false
            },
            axisLabel:{
              textStyle:{
                color:"#fff"
              },
              lineStyle:{
                color: '#519cff'
              },
              alignWithLabel: true,
              interval:0
            }
          },
          series: [
            {
              type: 'bar',
              data: seller_weight,
              barMaxWidth:'50',
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                        '#6bc0fb','#7fec9d','#fedd8b','#ffa597','#84e4dd','#7fec9d','#fedd8b','#ffa597','#84e4dd'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        if (seller_weight.length > 0) {
          graduateyear.setOption(option);
        }

        /* 站点交易排行 */
        var station_name = [];
        var station_weight = [];
        for (var index in data.station_data) {
          station_name.push(data.station_data[index]["name"]);
          station_weight.push(data.station_data[index]["weight"]);
        }
        var station = echarts.init(document.getElementById('station'));
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
            }
          },
          toolbox: {
            show:false,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data:['',''],
            show:false
          },
          grid:{
            top:'18%',
            right:'5%',
            bottom:'8%',
            left:'5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: station_name,
              splitLine:{
                show:false,
                lineStyle:{
                  color: '#3c4452'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                rotate: 30,
                textStyle:{
                  color:"#fff"
                },
                lineStyle:{
                  color: '#519cff'
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '交易量(kg)',
              nameTextStyle:{
                color:'#fff'
              },
              splitLine:{
                show:true,
                lineStyle:{
                  color: '#23303f'
                }
              },
              axisLine: {
                show:false,
                lineStyle: {
                  color: '#115372'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                textStyle:{
                  color:"#fff"
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          color:"yellow",
          series: [
            {
              name:'交易量',
              type:'bar',
              data:station_weight,
              boundaryGap: '45%',
              barMaxWidth: 50,
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                        '#6bc0fb','#7fec9d','#fedd8b','#ffa597','#84e4dd','#7fec9d','#fedd8b','#ffa597','#84e4dd','#fedd8b','#ffa597','#84e4dd'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        if (station_weight.length > 0){
          station.setOption(option);
        }

        /* 乡镇前十交易 */
        var township_name = [];
        var township_weight = [];
        for (var index in data.township_data) {
          township_name.push(data.township_data[index]["name"]);
          township_weight.push(data.township_data[index]["weight"]);
        }
        var township = echarts.init(document.getElementById('township'));
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
            }
          },
          toolbox: {
            show:false,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data:['',''],
            show:false
          },
          grid:{
            top:'18%',
            right:'5%',
            bottom:'8%',
            left:'5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: township_name,
              splitLine:{
                show:false,
                lineStyle:{
                  color: '#3c4452'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                rotate: 30,
                textStyle:{
                  color:"#fff"
                },
                lineStyle:{
                  color: '#519cff'
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '交易量(kg)',
              nameTextStyle:{
                color:'#fff'
              },
              splitLine:{
                show:true,
                lineStyle:{
                  color: '#23303f'
                }
              },
              axisLine: {
                show:false,
                lineStyle: {
                  color: '#115372'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                textStyle:{
                  color:"#fff"
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          color:"yellow",
          series: [
            {
              name:'交易量',
              type:'bar',
              data:township_weight,
              boundaryGap: '45%',
              barMaxWidth:'50',
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                        '#6bc0fb','#7fec9d','#fedd8b','#ffa597','#84e4dd','#7fec9d','#fedd8b','#ffa597','#84e4dd','#fedd8b','#ffa597','#84e4dd'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        if (township_weight.length > 0){
          township.setOption(option);
        }

        /* 采购商交易量 */
        var buyers_name = [];
        var buyers_weight = [];
        for (var index in data.buyers_data) {
          buyers_name.push(data.buyers_data[index]["name"]);
          buyers_weight.push(data.buyers_data[index]["weight"]);
        }
        var buyers = echarts.init(document.getElementById('buyers'));
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
            }
          },
          toolbox: {
            show:false,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          legend: {
            show:false
          },
          grid:{
            top:'18%',
            right:'5%',
            bottom:'8%',
            left:'5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: buyers_name,
              splitLine:{
                show:false,
                lineStyle:{
                  color: '#3c4452'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                rotate: 30,
                textStyle:{
                  color:"#fff"
                },
                lineStyle:{
                  color: '#519cff'
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '交易量(kg)',
              nameTextStyle:{
                color:'#fff'
              },
              splitLine:{
                show:true,
                lineStyle:{
                  color: '#23303f'
                }
              },
              axisLine: {
                show:false,
                lineStyle: {
                  color: '#115372'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel:{
                textStyle:{
                  color:"#fff"
                },
                alignWithLabel: true,
                interval:0
              }
            }
          ],
          color:"yellow",
          series: [
            {
              name:'交易量',
              type:'bar',
              data:buyers_weight,
              barMaxWidth: 50,
              boundaryGap: '45%',
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                        '#6bc0fb','#7fec9d','#fedd8b','#ffa597','#84e4dd','#7fec9d','#fedd8b','#ffa597','#84e4dd','#fedd8b','#ffa597','#84e4dd'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        if (buyers_weight.length > 0) {
          buyers.setOption(option);
        }

        /* 采购商地图分布 */
        var map_area_list = [];
        var max = 0;
        var min = 9999999;
        for(var i in data.distribution) {
          data.distribution[i].province = data.distribution[i].province;
          data.distribution[i].total = data.distribution[i].count;
          map_area_list.push(data.distribution[i]);
        }
        map_area_list.map(function(item){
          if (item.province) {
            item.name = item.province.replace("省", "").replace("市", "").replace("维吾尔", "").replace("自治区", "").replace("壮族", "").replace("回族", "");
          }
          item.value = item.total;
          max = item.value > max?item.value:max;
          min = item.value < min?item.value:min;
        });
        (max == min) && (max += 10);
        var mapadd = echarts.init(document.getElementById('mapadd'));
        option = {
          tooltip: {
            trigger: 'item'
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center'
          },
          visualMap: {
            min: (min - min%10)<0?0:(min-min%10),
            max: max || 10,
            text:['High','Low'],
            textStyle: {
              color: "#4c60ff"
            },
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue','yellow', 'orangered']
            },
          },
          series: [
            {
              name: '采购商分布',
              type: 'map',
              mapType: 'china', // 自定义扩展图表类型
              data:map_area_list,
              itemStyle: {
                normal: {
                  label:{show:true},
                  areaColor: '#4c60ff',
                  borderColor: '#002097'
                },
                emphasis: {
                  label:{show:true},
                  areaColor: '#293fff'
                }
              }
            }
          ]
        };
        mapadd.setOption(option);
      }
    },
    error: function () {
    }
  });
  /* 实时天气状况 */
  AMap.plugin('AMap.Weather', function() {
    //创建天气查询实例
    var weather = new AMap.Weather();

    //执行实时天气信息查询
    weather.getLive('潢川县', function(err, data) {
      if (data.info == "OK") {
        $("#city").text("城市：" + data.city);
        $("#weather").text("天气：" + data.weather);
        $("#temperature").text("温度：" + data.temperature + "℃");
        $("#windDirection").text("风向：" + data.windDirection);
        $("#humidity").text("空气湿度：" + data.humidity);
        $("#reportTime").text("发布时间：" + data.reportTime);
      }
    });
  });
});
