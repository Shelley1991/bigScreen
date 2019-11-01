/*
 * @Author: your name
 * @Date: 2019-10-31 14:36:31
 * @LastEditTime: 2019-10-31 16:06:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Json_Code\Internet-ofthings\js\elevator.js
 */
const arrid = [2819, 2782, 2738, 2701, 2814, 2687, 2955, 2775]
var uid = '';
var city = '';
var name = '';
let original_uid = ''
let splitNumbers1 = 0,
    splitNumbers2 = 0,
    splitNumbers3 = 0;
let floor_data = '';

storage_data = null; //记录model层点击的数据
//1 = index.html,2 = property.html ,3 = elevator.html
htmlsite = 3;

if (sessionStorage.getItem("property") != null) {

    storage_data = JSON.parse(sessionStorage.getItem("property"));

    if (storage_data != "" && storage_data != "undefined" && storage_data != null) {
        original_uid = Base64.decode(storage_data.deviceID);
        name = Base64.decode(storage_data.lift);
        city = Base64.decode(storage_data.city);
        $("#place_names").html(name);
    }
}

//获取浏览器窗口高度
function elevatorInnerHeight() {
    var getNewHeight = 0;
    //获取浏览器窗口高度
    if (window.innerHeight) {
        getNewHeight = window.innerHeight;
    } else if ((!window.innerHeight) && (document.body) && (document.body.clientHeight)) {
        getNewHeight = document.body.clientHeight;
    }
    //通过深入Document内部对body进行检测，获取浏览器窗口高度
    else if ((!window.innerHeight) && ((!document.body) || (!document.body.clientHeight)) && document.documentElement && document.documentElement.clientHeight) {
        getNewHeight = document.documentElement.clientHeight;
    }
    document.body.style.height = getNewHeight + 'px';
}

window.onload = function() {
    elevatorInnerHeight();
}


// let storage_data = JSON.parse(sessionStorage.getItem("property"));
// if (storage_data != "" && storage_data != "undefined" && storage_data != null) {
//     original_uid = Base64.decode(storage_data.deviceID);
//     name = Base64.decode(storage_data.lift);
//     city = Base64.decode(storage_data.city);
//     $("#place_names").html(name);
// }
uid = arrid[original_uid % 8];
let myCharts = echarts.init(document.getElementById('fre_quent'));
let myCharts1 = echarts.init(document.getElementById('total_mil'));

$(document).ready(function() {
    //监听浏览器放大缩小
    window.onresize = function() {
        elevatorInnerHeight();
        myCharts.resize();
        myCharts1.resize();
    }

    setInterval(() => {
        findOperationInfo();
    }, 10000)
    Provinces_cities(storage_data); //省市


    run() /* 电梯运行情况  */
    mileage_count("week"); /* 电梯总里程折线数据 */
    floor_details('year') /* 楼层详情  */
    realTime(); /* 电梯故障维保信息数据 */
    findOperationInfo();
    baidu_map(name, city); //地图
    faultAjax('year'); //电梯故障隐患率顶部1
    weather1() // 今天天气
    weather2() // 五天天气

    $("#positioning").click(() => {
        // history.back(-1) //直接返回当前页的上一页，数据全部消息，是个新页面
        //history.go(-1)
        model($("#model"), htmlsite);
    })

    // /* 楼层详情标题日期切换事件 */
    $('#floor_uls li').each(function() {
        $(this).click(function() {
            $(this).css({
                "color": "#00AAFF"
            }).siblings().css({
                "color": ""
            });
            let ids = $(this).attr('data-id')
            floor_details(ids);
        })
    })
})

/* 电梯运行情况  */
let run = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRuningInfo/" + uid,
        type: "get",
        success: function(data) {
            let datas = data.data
            $("#upDown").html(datas.upDown)
            $("#speed").html(datas.speed)
            $("#floor").html(datas.floor)
            $("#onOff").html(datas.onOff)
        },
        error: function() {}
    });
}

/* 电梯参数数据请求 */
$.ajax({
        url: url + "MdeviceIfmweb/findElevatorDetail/" + uid,
        type: "GET",
        success: function(data) {
            if (data.code == 0) {
                var parameter_data = data.data[0];
                if (parameter_data != null && parameter_data != undefined) {
                    //最大速度
                    $("#upbig_speed").html(parameter_data.maxSpeed);
                    $("#downbig_speed").html(parameter_data.maxSpeed);
                    //开关门时间
                    $("#opendoor_time").html(parameter_data.openDoorTime);
                    $("#closedoor_time").html(parameter_data.closeDoorTime);
                    //层高
                    $("#total_height").html(parameter_data.maxHeight);
                    $("#avg_height").html(parameter_data.avgFloor.toFixed(2));
                    //其他参数
                    $("#default_floor").html(parameter_data.stayFloor);
                    $("#door_wide").html(parameter_data.doorWidth);
                } else {}
            } else {

            }
        },
        error: function(data) {
            //最大速度
            $("#upbig_speed").html("500");
            $("#downbig_speed").html("400");
            //开关门时间
            $("#opendoor_time").html("5");
            $("#closedoor_time").html("5");
            //层高
            $("#total_height").html("30");
            $("#avg_height").html("10");
            //其他参数
            $("#default_floor").html("10");
            $("#door_wide").html("2");
        }
    })
    /* end */



/* start */
/* 麻将牌总数据请求 */
let findOperationInfo = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findOperationInfo/" + original_uid,
        type: "GET",
        success: function(data) {
            if (data.code == 0) {
                var runinfo = data.data[0];
                if (runinfo != null && runinfo != undefined) {
                    $(".ans1").html('')
                    $(".ans2").html('')
                    $(".ans3").html('')
                    splitNumber(".ans1", runinfo.RunTime, splitNumbers1);
                    splitNumber(".ans2", runinfo.RunMeter, splitNumbers2);
                    splitNumber(".ans3", runinfo.RunFloor, splitNumbers3);
                    splitNumbers1 = runinfo.RunTime;
                    splitNumbers2 = runinfo.RunMeter;
                    splitNumbers3 = runinfo.RunFloor;

                    $("#total_number_of").html(nums(runinfo.RunPerson, 'unit1'));
                    $("#total_count").html(nums(runinfo.RepairCount, 'unit2'));
                    $("#running_time").html(nums(runinfo.RunTime, 'unit3'));
                } else {}
            } else {

            }
        },
        error: function(data) {}
    })
}


/* 上行次数 速度 振幅 总时长 */
$.ajax({
    url: url + "MdeviceIfmweb/findUpDown/" + original_uid,
    type: "GET",
    success: function(data) {
        var speed_amplitude = data.data;
        //上下次数
        $("#up").html(nums(speed_amplitude.up, 'unit_up1'));
        $("#down").html(nums(speed_amplitude.down, 'unit_up2'));
        //上下加速度
        $("#upSpeed").html(speed_amplitude.upSpeed);
        $("#downSpeed").html(speed_amplitude.downSpeed);
        //上下振幅
        $("#upSwing").html(speed_amplitude.upSwing);
        $("#downSwing").html(speed_amplitude.downSwing);
        //上下时长
        $("#downTime").html(nums(speed_amplitude.downTime, 'unit_up3'));
        $("#upTime").html(nums(speed_amplitude.upTime, 'unit_up4'));
    },
    error: function(data) {

    }
})


// }
/* end */



/* 频繁时段柱状图 */
// function columnar_count() {
var columnar_array = [23, 56, 78, 90, 12, 37];
/* 频繁时段 */
$.ajax({
        url: url + "MdeviceIfmweb/findHourArea/" + uid,
        type: "GET",
        success: function(data) {
            if (data.code == 0) {
                var mileage = data.data
                if (mileage != null && mileage != undefined) {
                    columnar_array = [mileage.a, mileage.b, mileage.c, mileage.d, mileage.e, mileage.f];
                    myCharts_columnar(columnar_array);
                } else {
                    myCharts_columnar(columnar_array);
                }
            } else {
                myCharts_columnar(columnar_array);
            }
        },
        error: function(data) {
            myCharts_columnar(columnar_array);
        }
    })
    // }

/* start */
/* 电梯总里程 折线 */
function mileage_count(date_unit) {
    /* 总里程折线图 */
    $.ajax({
        url: url + "MdeviceIfmweb/findRunMeter/" + uid + "/" + date_unit,
        type: "GET",
        success: function(data) {
            if (data.code == 0) {
                var mileage = data.data
                var a;
                var interv = 1;
                if (mileage != null && mileage != undefined) {
                    if (date_unit == "year") {
                        a = mileage.year;
                        interv = '';
                    } else if (date_unit == "month") {
                        a = mileage.month;
                        interv = 4;
                    } else if (date_unit == "week") {
                        a = mileage.week;
                        interv = '';
                    }
                    var key_data = [];
                    var value_data = [];
                    $.each(a, function(key, value) {
                        key_data.push(key);
                        value_data.push(value / 200)
                    });
                    if (key_data.length == 7) {
                        key_data = ['一', '二', '三', '四', '五', '六', '日']
                    }
                    myCharts_brokenline(key_data, value_data, interv);
                } else {}

            } else {

            }
        },
        error: function(data) {}
    })
}

/*楼层详情 */
let floor_details = (data) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findFloorInfo/" + data + '/' + uid,
        type: "get",
        success: function(data) {
            floor_data = data.data;
            fault_cont_data(data.data)
        },
        error: function() {}
    });
}

//楼层详情数据渲染
let fault_cont_data = (datas) => {
    $("#fault_cont_data").html('')
    let maxperson = '';
    let maxopenCount = '';
    let maxwaitCount = '';
    let maxwaitTime = '';
    datas.forEach((val, idx) => {
        if (val.floor == 1) {
            maxperson = Number(val.person) + (val.person * 0.1);
            maxopenCount = Number(val.openCount) + (val.openCount * 0.1);
            maxwaitCount = Number(val.waitCount) + (val.waitCount * 0.1);
            maxwaitTime = Number(val.waitTime) + (val.waitTime * 0.1);
        }
    })
    datas.forEach((val, idx) => {
        $("#fault_cont_data").append(
            `<li class="tier flexR" style="height: 17%;background:#001925;">
                                <div class="flex1" style="flex:0 80px">${val.floor+'F'}</div>
                                <div class="flex1">
                                    <progress value="${val.person}" max="${maxperson}" id='pro'></progress>
                                </div>
                                <div class="flex1">
                                    <progress class="progress1" value="${val.openCount}" max="${maxopenCount}" id=''></progress>
                                </div>
                                <div class="flex1">
                                    <progress class="progress2" value="${val.waitCount}" max="${maxwaitCount}" id=''></progress>
                                </div>
                                <div class="flex1">
                                    <progress class="progress3" value="${val.waitTime}" max="${maxwaitTime}" id=''></progress>
                                </div>
                            </li>`
        )
    })

    /* 楼层详情列表隔行换色 */
    $("#fault_cont_data li:odd ").css('background', '#00293D');
}

// 楼层详情排序点击按钮
var stay_flag = false;
var switch_flag = false;
var transport_flag = false;
var staytime_flag = false;

$('#stay_id').click(function() {
    $("#three").attr("src", "img/Polygon1.png");
    $("#four").attr("src", "img/Polygon4.png");
    $("#five").attr("src", "img/PolygonB1.png");
    $("#six").attr("src", "img/PolygonB4.png");
    $("#seven").attr("src", "img/PolygonL4.png");
    $("#eight").attr("src", "img/PolygonL2.png");
    if (stay_flag) {
        /* 升序 */
        $("#one").attr("src", "img/PolygonG4.png");
        $("#two").attr("src", "img/PolygonG3.png");
        stay_flag = false;
        let asc = floor_data.sort(function(a, b) {
            return a.person - b.person;
        });
        fault_cont_data(asc)
    } else {
        $("#two").attr("src", "img/PolygonG2.png");
        $("#one").attr("src", "img/PolygonG1.png");
        stay_flag = true;
        let Desc = floor_data.sort(function(a, b) {
            return b.person - a.person;
        });
        fault_cont_data(Desc)
    }
    switch_flag = false;
    transport_flag = false;
    staytime_flag = false;
})

$('#switch_id').click(function() {
    $("#one").attr("src", "img/PolygonG1.png");
    $("#two").attr("src", "img/PolygonG3.png");
    $("#five").attr("src", "img/PolygonB1.png");
    $("#six").attr("src", "img/PolygonB4.png");
    $("#seven").attr("src", "img/PolygonL4.png");
    $("#eight").attr("src", "img/PolygonL2.png");
    if (switch_flag) {
        /* 升序 */
        $("#three").attr("src", "img/Polygon3.png");
        $("#four").attr("src", "img/Polygon4.png");
        switch_flag = false;
        let asc = floor_data.sort(function(a, b) {
            return a.openCount - b.openCount;
        });
        fault_cont_data(asc)
    } else {
        $("#four").attr("src", "img/Polygon2.png");
        $("#three").attr("src", "img/Polygon1.png");
        switch_flag = true;
        let Desc = floor_data.sort(function(a, b) {
            return b.openCount - a.openCount;
        });
        fault_cont_data(Desc)
    }
    stay_flag = false;
    transport_flag = false;
    staytime_flag = false;
})

$('#transport_id').click(function() {
    $("#one").attr("src", "img/PolygonG1.png");
    $("#two").attr("src", "img/PolygonG3.png");
    $("#three").attr("src", "img/Polygon1.png");
    $("#four").attr("src", "img/Polygon4.png");
    $("#seven").attr("src", "img/PolygonL4.png");
    $("#eight").attr("src", "img/PolygonL2.png");
    if (transport_flag) {
        /* 升序 */
        $("#five").attr("src", "img/PolygonB3.png");
        $("#six").attr("src", "img/PolygonB4.png");
        transport_flag = false;
        let asc = floor_data.sort(function(a, b) {
            return a.waitCount - b.waitCount;
        });
        fault_cont_data(asc)
    } else {
        $("#six").attr("src", "img/PolygonB2.png");
        $("#five").attr("src", "img/PolygonB1.png");
        transport_flag = true;
        let Desc = floor_data.sort(function(a, b) {
            return b.waitCount - a.waitCount;
        });
        fault_cont_data(Desc)
    }
    stay_flag = false;
    switch_flag = false;
    staytime_flag = false;
})
$("#national").click(() => {
    var propertytemp = JSON.parse(sessionStorage.getItem("property"));
    propertytemp.province = "";
    propertytemp.city = "";
    propertytemp.street = "";
    propertytemp.county = "";
    propertytemp.community = "";
    propertytemp.lift = "";
    sessionStorage.setItem("property", JSON.stringify(propertytemp));
    location.href = "index.html";
})
$("#staytime_id").click(function() {
    $("#one").attr("src", "img/PolygonG1.png");
    $("#two").attr("src", "img/PolygonG3.png");
    $("#three").attr("src", "img/Polygon1.png");
    $("#four").attr("src", "img/Polygon4.png");
    $("#five").attr("src", "img/PolygonB1.png");
    $("#six").attr("src", "img/PolygonB4.png");

    if (staytime_flag) {
        /* 升序 */
        $("#seven").attr("src", "img/PolygonL1.png");
        $("#eight").attr("src", "img/PolygonL2.png");
        staytime_flag = false;
        let asc = floor_data.sort(function(a, b) {
            return a.waitTime - b.waitTime;
        });
        fault_cont_data(asc)
    } else {
        $("#eight").attr("src", "img/PolygonL3.png");
        $("#seven").attr("src", "img/PolygonL4.png");
        staytime_flag = true;
        let Desc = floor_data.sort(function(a, b) {
            return b.waitTime - a.waitTime;
        });
        fault_cont_data(Desc)
    }
    stay_flag = false;
    switch_flag = false;
    transport_flag = false;
})


/* 天气标题日期切换事件 */
$('#weather_click li').each(function() {
    $(this).click(function() {
        $(this).css({
            "color": "#00AAFF"
        }).siblings().css({
            "color": ""
        });
        let ids = $(this).attr('id')
        if (ids == 1) {
            $("#today_weather").show();
            $("#five_weather").hide();
        } else if (ids == 2) {
            $("#today_weather").hide();
            $("#five_weather").show();
        }
    })
})

/* 天气 */
let weather1 = () => {
    $.ajax({
        url: 'https://www.tianqiapi.com/api/?appid=26298324&appsecret=Bu26SjmY&version=v6&city=' + city.replace('市', ''),
        type: "get",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data) {
            //今天
            if (data.wea_img == 'xue') {
                $("#wea_img").attr('src', 'img/Frame 6.png');
            } else if (data.wea_img == 'lei') {
                $("#wea_img").attr('src', 'img/Frame 2.png');
            } else if (data.wea_img == 'yun') {
                $("#wea_img").attr('src', 'img/Frame 13.png');
            } else if (data.wea_img == 'shachen') {
                $("#wea_img").attr('src', 'img/Frame 12.png');
            } else if (data.wea_img == 'wu') {
                $("#wea_img").attr('src', 'img/Frame 11.png');
            } else if (data.wea_img == 'bingbao') {
                $("#wea_img").attr('src', 'img/Frame 2.png');
            } else if (data.wea_img == 'yu') {
                $("#wea_img").attr('src', 'img/Frame 5.png');
            } else if (data.wea_img == 'yin') {
                $("#wea_img").attr('src', 'img/Frame 3.png');
            } else if (data.wea_img == 'qing') {
                $("#wea_img").attr('src', 'img/Frame 4.png');
            }
            $("#wea").html(data.wea);
            $("#tem").html(data.tem + '℃');
            $("#humidity").html(data.humidity);
            $("#pressure").html(data.pressure + 'Pa');
            $("#win_meter").html(data.win_meter);
        },
        error: function() {}
    });
}

/* 五天天气 */
let weather2 = () => {
    console.log(city);
    $.ajax({
        url: 'https://www.tianqiapi.com/api/?appid=26298324&appsecret=Bu26SjmY&version=v1&city=' + city.replace('市', ''),
        type: "get",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data) {
            let five_data = data.data
            five_data.forEach((vla, idx, five_data) => {
                if (idx > 4) {
                    return false;
                }
                let wea_imgs = ''
                    //今天
                if (vla.wea_img == 'xue') {
                    wea_imgs = 'img/Frame 6.png'
                } else if (vla.wea_img == 'lei') {
                    wea_imgs = 'img/Frame 2.png'
                } else if (vla.wea_img == 'yun') {
                    wea_imgs = 'img/Frame 13.png'
                } else if (vla.wea_img == 'shachen') {
                    wea_imgs = 'img/Frame 12.png'
                } else if (vla.wea_img == 'wu') {
                    wea_imgs = 'img/Frame 11.png'
                } else if (vla.wea_img == 'bingbao') {
                    wea_imgs = 'img/Frame 2.png'
                } else if (vla.wea_img == 'yu') {
                    wea_imgs = 'img/Frame 5.png'
                } else if (vla.wea_img == 'yin') {
                    wea_imgs = 'img/Frame 3.png'
                } else if (vla.wea_img == 'qing') {
                    wea_imgs = 'img/Frame 4.png'
                }
                $("#five_weather").append(
                    `<div style="width: 20%;">
                                <div class="" style="text-align: center;">
                                    <p style="color: white;text-align: center;">${vla.day}</p>
                                    <img src="${wea_imgs}" width="40%" style="margin-top: 10px;" />
                                    <p style="color: white;text-align: center;margin-top: 8%;">${vla.tem2.replace('℃','')}-${vla.tem1}</p>
                                    <p style="color: rgba(255, 255, 255, 0.5);text-align: center;margin-top: 3%;">${vla.wea}</p>
                                </div>
                            </div>`
                )
            })
        },
        error: function() {}
    });
}

/* start */
/* 百度地图API功能 地图坐标位置查询*/
// 百度地图API功能

let baidu_map = (obj1, obj2) => {
        var map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
        var myGeo = new BMap.Geocoder();
        map.setMapStyle({
            style: 'dark'
        });
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(obj1, function(point) {
            if (point) {
                map.centerAndZoom(point, 13);
                map.addOverlay(new BMap.Marker(point));
            } else {

            }
        }, obj2);
    }
    /* end */

/* start */
/* 电梯故障隐患率日期切换事件 */
$('#fault_id li').each(function() {
    $(this).click(function() {
        $(this).css({
            "color": "#00AAFF"
        }).siblings().css({
            "color": ""
        });
        let ids = $(this).attr('data-id');
        faultAjax(ids);
    })
})



/* 故障维保信息数据请求 */
let realTime = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRepairInfo/" + uid,
        type: "get",
        success: function(data) {
            if (data.code == 0) {
                let realTimedate = data.data;
                let x = 0
                if (realTimedate.length < 5) {
                    x = 5 - realTimedate.length;
                    for (let i = 0; i < x; i++) {
                        realTimedate.push({
                            create_time: '',
                            personName: '',
                            phone: '',
                            repairName: '',
                        })
                    }
                }
                if (realTimedate != null && realTimedate != undefined) {
                    realTimedate.forEach((val, index, arr) => {
                            $("#fault_coua").append(
                                `<li class="tier flexR" style="background:#003149;">
											<div class="flex1">${val.repairName}</div>
											<div class="flex1">${val.create_time}</div>
											<div class="flex1">${val.personName}</div>
											<div class="flex1" style="margin-right:2%">${val.phone}</div>
										</li>`
                            )
                        })
                        /* 维保信息列表隔行换色 */
                    $("#fault_coua li:odd").css('background', '#00496E')
                } else {}
            } else {}
        },
        error: function() {}
    });
}

/* start */
/* 频繁时段柱状图 */
function myCharts_columnar(frequent_inter) {
    option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{c}%',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: '30',
            x: '0',
            x2: '10',
            y2: '0',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['0~4', '4~8', '8~12', '12~16', '16~20', '20~24'],
            axisTick: {
                alignWithLabel: true
            },
            axisTick: { //刻度
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#003956',
                }
            },
            axisLabel: {
                interval: 0,
                color: 'rgba(255, 255, 255, 0.5)',
            },
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            min: 0,
            splitNumber: 3, //刻度线个数（奇数）
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#003956',
                }
            },
            axisTick: { //刻度
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#003956',
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.5)',

            },
        }],
        series: [{
            name: '频繁时段',
            type: 'bar',
            barWidth: '40%',
            data: frequent_inter,
            itemStyle: {
                normal: { //这里是重点
                    color: function(params) {
                        //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                        let colorList = ['#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF'];
                        return colorList[params.dataIndex]
                    }
                }
            }
        }]
    };
    myCharts.setOption(option);
}
/* end */

/* start */
/* 电梯总里程标题日期切换事件 */
$('#health_uls li').each(function() {
    $(this).click(function() {
        $(this).css({
            "color": "#00AAFF"
        }).siblings().css({
            "color": ""
        });
        let ids = $(this).attr('id')
        if (ids == 1) {
            mileage_count("week");
        } else if (ids == 2) {
            mileage_count("month");
        } else if (ids == 3) {
            mileage_count("year");
        }
    })
})

/* 电梯总里程折线图 */
function myCharts_brokenline(count_mileage_data, count_mileage, interv) {
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: '30',
            x: '0',
            x2: '0',
            y2: '0',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: count_mileage_data,
            axisTick: {
                alignWithLabel: true
            },
            axisTick: { //刻度
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#003956',
                }
            },
            axisLabel: {
                interval: interv,
                color: 'rgba(255, 255, 255, 0.5)',
            }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            min: 0,
            splitNumber: 3, //刻度线个数（奇数）
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#003956',
                }
            },
            axisTick: { //刻度
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#00AAFF',
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.5)',

            },
        }],
        series: [{
            name: '总里程',
            type: 'line',
            barWidth: '40%',
            data: count_mileage,
            showSymbol: false,
            itemStyle: {
                normal: { //这里是重点
                    color: function(params) {
                        //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                        let colorList = ['#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF', '#00AAFF'];
                        return colorList[params.dataIndex]
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(30, 144, 255，0.5)'
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00AAFF'
                        }, {
                            offset: 1,
                            color: 'rgba(0, 180, 255, 0.102)'
                        },

                    ], false),
                }
            },
        }]
    };
    myCharts1.setOption(option);
}
/* end */

//电梯故障隐患率顶部1
let faultAjax = (data) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findBreakChronic/" + uid + "/" + data,
        type: "get",
        success: function(data) {
            fault_one('fault1', '#F7C547', 'rgba(247, 131, 74, 0.3)', data.data.breakdown[0].counts, data.data.breakdown[0].count)
            $("#f_num1").html(data.data.breakdown[0].percent)
            $("#f_name1").html(data.data.breakdown[0].name)
            $("#f_val1").html(data.data.breakdown[0].count)
            fault_one('fault2', '#F76261', 'rgba(247, 98, 97, 0.3)', data.data.chronic[0].counts, data.data.chronic[0].count)
            $("#f_num2").html(data.data.chronic[0].percent)
            $("#f_name2").html(data.data.chronic[0].name)
            $("#f_val2").html(data.data.chronic[0].count)
        },
        error: function() {}
    });
}
let fault_one = (obj, color1, color2, counts, value) => {
    let myChart = echarts.init(document.getElementById(obj));
    myChart.clear();
    option = {
        series: [{
            name: '',
            type: 'pie',
            startAngle: 90,
            clockWise: false, //顺时加载
            hoverAnimation: false,
            radius: ['90%', '95%'],
            center: ['50%', '50%'],
            data: [{
                value: value,
                name: '',
                itemStyle: {
                    normal: {
                        color: [color1],
                        borderWidth: 2,
                        shadowBlur: 0,
                        borderColor: color1,
                    }
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                },
            }, {
                value: counts - value,
                name: '',
                itemStyle: {
                    color: "transparent"
                }
            }]
        }, {
            name: '',
            type: 'pie',
            startAngle: 90,
            clockWise: false, //顺时加载
            hoverAnimation: false,
            radius: ['80%', '89%'],
            center: ['50%', '50%'],
            data: [{
                value: value,
                name: '',
                itemStyle: {
                    color: "transparent"
                }
            }, {
                value: counts - value,
                name: '',
                itemStyle: {

                    color: color2,
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                },
            }]
        }]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });

}

/* 数字滚动 */
let splitNumber = (obj, num, contrast) => {
    var dom = document.querySelector(obj)
    var digit = new Digit({
        number: num, // 到达指定数值停止滚动
        finish: 1, // 整体完成时间
        speed: 10, // 数值越大，越多数字同时进行翻滚，取值范围（1 ~ 10）
        direction: "right", // 动画方向
        dom: dom, // 在指定dom节点插入动画
        contrast: num - contrast
    })
    digit.render()
}