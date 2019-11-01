/*
 * @Author: your name
 * @Date: 2019-10-29 16:21:19
 * @LastEditTime: 2019-10-31 13:28:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Json_Code\Internet-ofthings\js\property.js
 */
let province_data = ''; //省
let city_data = ''; //市
let county_data = ''; //区县
let street_data = ''; //街道
let community_data = ''; //小区
let lift_data = ''; //电梯
let confirm_arr = '' //省市区县街道小区电梯合并
let maChar_p = '';
let maChar_c = '';
let maChar_s = '';
let tooltips = 0 //判断地图与省市model联动
let href_lift_id = '';
let dingid = ''
let splitNumbers1 = 0,
    splitNumbers2 = 0,
    splitNumbers3 = 0;
//1 = index.html,2 = property.html ,3 = elevator.html
htmlsite = 2;
storage_data = null ; //记录model层点击的数据

    //获取浏览器窗口高度
function propertyInnerHeight(){
    var nowHeight = 0;
    console.log(window.innerHeight)
    //获取浏览器窗口高度
    if( window.innerHeight){
        nowHeight = window.innerHeight;
    }
    else if ((!window.innerHeight) && (document.body) && (document.body.clientHeight)){
        nowHeight = document.body.clientHeight;
    }
    //通过深入Document内部对body进行检测，获取浏览器窗口高度
    else if ((!window.innerHeight)&& ((!document.body)||(!document.body.clientHeight))&& document.documentElement && document.documentElement.clientHeight){
        nowHeight = document.documentElement.clientHeight;
    }
    document.body.style.height = nowHeight + 'px';
}

window.onload = function(){
    propertyInnerHeight();
}

$(() => {

       if(sessionStorage.getItem("property") != null){

        storage_data  = JSON.parse(sessionStorage.getItem("property"));

        if (storage_data != "" && storage_data != "undefined" && storage_data != null) {

            province_data = Base64.decode(storage_data.province);
            city_data = Base64.decode(storage_data.city);
            county_data = Base64.decode(storage_data.county);
            street_data = Base64.decode(storage_data.street);
            community_data = Base64.decode(storage_data.community);
            confirm_arr = province_data + '/' + city_data + '/' + county_data + '/' + street_data + '/' + community_data;
            if (Base64.decode(storage_data.community) == '') {
                $("#position_city").html(street_data);
            } else {
                $("#position_city").html(community_data);
            }
        }
    
    }
    // let storage_data = JSON.parse(sessionStorage.getItem("property"));
    // if (storage_data != "" && storage_data != "undefined" && storage_data != null) {
    //     province_data = Base64.decode(storage_data.province);
    //     city_data = Base64.decode(storage_data.city);
    //     county_data = Base64.decode(storage_data.county);
    //     street_data = Base64.decode(storage_data.street);
    //     community_data = Base64.decode(storage_data.community);
    //     confirm_arr = province_data + '/' + city_data + '/' + county_data + '/' + street_data + '/' + community_data;
    //     if (Base64.decode(storage_data.community) == '') {
    //         $("#position_city").html(street_data);
    //     } else {
    //         $("#position_city").html(community_data);
    //     }
    // }

    myCharts = echarts.init(document.getElementById("bar"));

    window.addEventListener("resize", function() {
        propertyInnerHeight();
        myCharts.resize();
    });

    setInterval(() => {
        equipment_top();
    }, 10000)

    bars(myCharts, 'year'); //电梯健康柱状图
    equipment_top(); //地图顶部
    pieAjax1() //电梯运行情况
    rankings() //电梯安全性能排行
    equipment_list() //设备列表
    faultajax('year') //电梯故障隐患率
    if (community_data == '') {
        baidu_map(street_data, city_data, )
    } else {
        baidu_map(community_data, city_data, )
    }
    // 百度地图API功能
    Provinces_cities(storage_data); //省市

    //故障年月季周按钮切换
    $('#fault li').each(function() {
        $(this).click(function() {
            $(this).css({ "color": "#00AAFF" }).siblings().css({ "color": "" });
            let ids = $(this).attr('data-ids')
            faultajax(ids);
        })
    })

    //年月季周按钮切换
    $('#health_uls li').each(function() {
        $(this).click(function() {
            $(this).css({ "color": "#00AAFF" }).siblings().css({ "color": "" });
            let ids = $(this).attr('id')
            bars(myCharts, ids);
        })
    })


    //打开model
    $("#model_open").click(() => {
        model($("#model"),htmlsite);
    })

    //model取消按钮
    $("#cancel").click(() => {
        layer.closeAll();
    })

    // //model确定按钮
    // $("#confirm").click(() => {
    //     // sessionStorage.removeItem("property");
    //     if (province_data != '') {
    //         confirm_arr = `${province_data}`;
    //     }
    //     if (province_data != '' && city_data != '') {
    //         confirm_arr = `${province_data}/${city_data}`
    //     }
    //     if (province_data != '' && city_data != '' && county_data != '') {
    //         confirm_arr = `${province_data}/${city_data}/${county_data}`
    //     }
    //     if (province_data != '' && city_data != '' && county_data != '' && street_data != '') {
    //         confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}`
    //     }
    //     if (province_data != '' && city_data != '' && county_data != '' && street_data != '' && community_data != '') {
    //         confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}`
    //     }
    //     if (province_data != '' && city_data != '' && county_data != '' && street_data != '' && community_data != '' && lift_data != '') {
    //         confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}/${lift_data}`
    //     }
    //     let confirm_arr_lens = confirm_arr.split('/').length;
    //     if (confirm_arr_lens < 3) {
    //         let Item = {
    //             province: Base64.encode(province_data),
    //             city: Base64.encode(city_data)
    //         }
    //         sessionStorage.setItem("Item", JSON.stringify(Item))
    //         location.href = "index.html";
    //     } else if (confirm_arr_lens > 3 && confirm_arr_lens <= 5) {
    //         console.log(province_data, city_data, county_data, street_data, community_data)
    //         if (street_data == '') {
    //             alert("请选择！")
    //             return;
    //         }
    //         $("#position_city").html(street_data + community_data);
    //         layer.closeAll();
    //         bars(myCharts, 'year'); //电梯健康柱状图
    //         equipment_top(); //地图顶部
    //         pieAjax1() //电梯运行情况
    //         rankings() //电梯安全性能排行
    //         equipment_list() //设备列表
    //         faultajax('year') //电梯故障隐患率
    //         if (community_data == '') {
    //             baidu_map(street_data, city_data, )
    //         } else {
    //             baidu_map(community_data, city_data, )
    //         } // 百度地图API功能
    //         let property = {
    //             province: Base64.encode(province_data),
    //             city: Base64.encode(city_data),
    //             county: Base64.encode(county_data),
    //             street: Base64.encode(street_data),
    //             community: Base64.encode(community_data)
    //         }
    //         sessionStorage.setItem("property", JSON.stringify(property))
    //     } else if (confirm_arr_lens == 6) {
    //         let property = {
    //             province: Base64.encode(province_data),
    //             city: Base64.encode(city_data),
    //             county: Base64.encode(county_data),
    //             street: Base64.encode(street_data),
    //             community: Base64.encode(community_data),
    //             lift: Base64.encode(lift_data),
    //             deviceID: Base64.encode(href_lift_id)
    //         }
    //         sessionStorage.setItem("property", JSON.stringify(property))
    //         location.href = "elevator.html";
    //     }
    // })

    //切换至全国
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
})

//模态框
// let model = () => {
//     layer.open({
//         type: 1, //类型
//         anim: 5, //弹出动画
//         shade: 0.5, //遮罩层的透明度
//         area: ['97%', '83%'], //定义宽和高'35%', '60%'
//         offset: '13%',
//         closeBtn: 0, //右上关闭
//         move: false, //关闭拖动
//         title: ' ', //题目
//         extend: 'css/comm.css',
//         skin: 'model',
//         shadeClose: false, //点击遮罩层关闭
//         content: $('#model') //打开的内容
//     });
// }


//数字滚动
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


//设备顶部
let equipment_top = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findAllInfo/" + confirm_arr,
        type: "get",
        success: function(data) {
            let bts = data.data.centerdate[0]
            let tops = data.data.leftdate[0]

            //地图顶部
            //数字滚动
            $(".ans1").html('')
            $(".ans2").html('')
            $(".ans3").html('')

            splitNumber(".ans1", tops.RunTime, splitNumbers1);
            splitNumber(".ans2", tops.RunMeter, splitNumbers2);
            splitNumber(".ans3", tops.RunFloor, splitNumbers3);
            splitNumbers1 = tops.RunTime;
            splitNumbers2 = tops.RunMeter;
            splitNumbers3 = tops.RunFloor;
            //设备
            $("#equipment1").html(nums(bts.run, 'unit1'));
            $("#equipment2").html(nums(bts.price, 'unit2'));
            $("#equipment3").html(nums(tops.RunPerson, 'unit3'));

            //地图底部
            $("#province").html(addCommas(bts.provincec));
            $("#city").html(addCommas(bts.city));
            $("#district").html(addCommas(bts.district));
            $("#street").html(addCommas(bts.street));
            $("#community").html(addCommas(bts.community));
        },
        error: function() {}
    });
}


//电梯运行情况
let pieAjax1 = () => {
    $.ajax({
        url: url + "EstateWeb/findRunInfo/" + confirm_arr, //请求的服务端地址
        type: "get",
        success: function(data) {
            let runtime = data.data.runtime //运行时间占比
            let waittime = data.data.waittime //等待时间
            let comfortlevel = data.data.comfortlevel //舒适度
            let efficiency = data.data.efficiency //运行效率
            pie("pie1", '#00aaff', 'rgba(0, 170, 255, 0.3)', runtime.counts, runtime.count);
            pie("pie2", '#f7834a', 'rgba(247, 131, 74, 0.3)', waittime.counts, waittime.count);
            pie("pie3", '#f7c547', 'rgba(247, 197, 71, 0.3)', comfortlevel.counts, comfortlevel.count);
            pie("pie4", '#f76261', 'rgba(247, 98, 97, 0.3)', efficiency.counts, efficiency.count);
            $("#num1").html(runtime.percent)
            $("#num2").html(waittime.percent)
            $("#num3").html(comfortlevel.percent)
            $("#num4").html(efficiency.percent)
        },
        error: function() {}
    });
}

//电梯运行情况pie
let pie = (obj, color1, color2, counts, value) => {
    let myChart = echarts.init(document.getElementById(obj));
    myChart.clear();
    option = {
        series: [{
                name: "",
                hoverAnimation: false,
                clockWise: false,
                type: 'pie',
                data: [value, counts - value],
                radius: ['0%', '60%'],
                center: ['50%', '50%'],
                color: [color1, 'transparent'],
                labelLine: { show: false },
            },
            {
                type: 'pie',
                hoverAnimation: false,
                selectedMode: 'single',
                startAngle: -45,
                selectedOffset: 100,
                clockwise: true,
                radius: ['65%', '80%'],
                center: ['50%', '50%'],
                color: [color2], //'#FBFE27','rgb(11,228,96)','#FE5050'
                data: [{
                        value: 60,
                        name: '已收佣金',
                    },
                    {
                        value: 540,
                        name: '未收佣金'
                    }
                ].sort(function(a, b) {
                    return a.value - b.value
                }),

                label: {
                    show: false,

                },
                itemStyle: {
                    show: false,
                    color: '#330000',
                    borderColor: '#330000',
                    normal: {
                        borderWidth: '3',
                        borderColor: 'rgba(0,0,0,255)',
                    },
                },

            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

//电梯安全性能排行
let rankings = () => {
    $.ajax({
        url: url + "EstateWeb/findUseRank/" + confirm_arr,
        type: "get",
        success: function(data) {
            let all = data.data.all;
            let rank = data.data.rank;
            $("#current_name").html(rank.name)
            $("#ming").html(rank.count)

            $("#Safety_ul").html('');
            let x = 0
            if (all.length < 6) {
                x = 6 - all.length;
                for (let i = 0; i < x; i++) {
                    all.push({
                        count: '',
                        name: ""
                    })
                }
            }
            all.forEach((val, index, arr) => {
                let idxs = ''
                if (index >= all.length - x) {
                    idxs = ''
                } else {
                    idxs = index + 1
                }
                $("#Safety_ul").append(
                    `<li class="">
                            <div class="idx">${idxs}</div>
                            <div class="community_name">${val.name}</div>
                        </li>`
                )
            })

            //隔行变色
            $("#Safety_ul li:odd ").css('background', '#001925');
        },
        error: function() {}
    });
}


//设备列表
let equipment_list = () => {
    $.ajax({
        url: url + "EstateWeb/findEquipmentList/" + confirm_arr,
        type: "get",
        success: function(data) {
            let all = data.data;
            $("#lists").html('');
            let x = 0
            if (all.length < 10) {
                x = 10 - all.length;
                for (let i = 0; i < x; i++) {
                    all.push({
                        break: '',
                        chronic: '',
                        id: '',
                        name: "",
                        repair: '',
                        safe: '',
                    })
                }
            }
            all.forEach((val, index, arr) => {
                $("#lists").append(
                    `<li class="flexR" id="${val.id}" data-name="${val.name}" data-community="${val.community}">
                        <div class="flex1 flex_one">${val.name}</div>
                        <div class="flex1">${val.safe}</div>
                        <div class="flex1">${val.break}</div>
                        <div class="flex1">${val.chronic}</div>
                        <div class="flex1">${val.repair}</div>
                    </li>`
                )
            })

            //跳转子页面
            $('#lists li').each(function() {
                $(this).click(function() {
                    let ids = $(this).attr('id');
                    let name = $(this).attr('data-name');
                    let community = $(this).attr('data-community');
                    // let property = {
                    //     province: Base64.encode(province_data),
                    //     city: Base64.encode(city_data),
                    //     county: Base64.encode(county_data),
                    //     street: Base64.encode(street_data),
                    //     community: Base64.encode(community_data),
                    //     lift: Base64.encode(name),
                    //     deviceID: Base64.encode(ids)
                    // }
                    // sessionStorage.setItem("property", JSON.stringify(property))
                    var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                    propertytemp.community = Base64.encode(community),
                    propertytemp.deviceID =Base64.encode(ids);
                    propertytemp.lift =Base64.encode(name);
                    sessionStorage.setItem("property", JSON.stringify(propertytemp));
                    location.href = "elevator.html";
                })
            })

            // //隔行变色
            $("#lists li:even ").css('background', '#00293D');
        },
        error: function() {}
    });
}

//电梯故障隐患率
let faultajax = (data) => {
    $.ajax({
        url: url + "EstateWeb/findBreakChronic/" + data + '/' + confirm_arr, //请求的服务端地址
        type: "get",
        success: function(data) {
            let top = data.data.breakdown //top
            let bottom = data.data.chronic //bottom

            //顶部
            fault_top('fault1', '#00AAFF', '#003956', top[0].counts, top[0].count)
            fault_top('fault2', '#F7C547', '#4a411e', top[1].counts, top[1].count)
            fault_top('fault3', '#325FFB', '#0f2354', top[2].counts, top[2].count)
            fault_top('fault4', '#F76261', '#4a2426', top[3].counts, top[3].count)
            $("#fault_num1").html(top[0].percent)
            $("#fault_num2").html(top[1].percent)
            $("#fault_num3").html(top[2].percent)
            $("#fault_num4").html(top[3].percent)
            $("#fault_name1").html(top[0].name)
            $("#fault_name2").html(top[1].name)
            $("#fault_name3").html(top[2].name)
            $("#fault_name4").html(top[3].name)
            $("#block1").html(top[0].count)
            $("#block2").html(top[1].count)
            $("#block3").html(top[2].count)
            $("#block4").html(top[3].count)

            // 底部
            fault_bottom('fault5', '#00AAFF', '#00496e', bottom[0].counts, bottom[0].count)
            fault_bottom('fault6', '#F7C547', '#635424', bottom[1].counts, bottom[1].count)
            fault_bottom('fault7', '#325FFB', '#142b6c ', bottom[2].counts, bottom[2].count)
            fault_bottom('fault8', '#F76261', '#632d2f', bottom[3].counts, bottom[3].count)

            $("#fault_num5").html(bottom[0].percent)
            $("#fault_num6").html(bottom[1].percent)
            $("#fault_num7").html(bottom[2].percent)
            $("#fault_num8").html(bottom[3].percent)
            $("#fault_name5").html(bottom[0].name)
            $("#fault_name6").html(bottom[1].name)
            $("#fault_name7").html(bottom[2].name)
            $("#fault_name8").html(bottom[3].name)

            //底部汇总
            fault_bottom_summary('fault10', bottom)

        },
        error: function() {}
    });
}

//电梯故障隐患率顶部
let fault_top = (obj, color1, color2, counts, value) => {
    let myChart = echarts.init(document.getElementById(obj));
    myChart.clear();
    option = {
        series: [{
                name: '',
                type: 'pie',
                startAngle: 90,
                clockWise: false, //顺时加载
                hoverAnimation: false,
                radius: ['83%', '88%'],
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
                    },
                    {
                        value: counts - value,
                        name: '',
                        itemStyle: {
                            color: "transparent"
                        }
                    }
                ]
            },
            {
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
                    },
                    {
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
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

//电梯故障隐患率底部
let fault_bottom = (obj, color1, color2, counts, value) => {
    let myChart = echarts.init(document.getElementById(obj));
    myChart.clear();
    var placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
        }
    };
    option = {
        tooltip: {
            show: false
        },
        legend: {
            show: false
        },
        toolbox: {
            show: false
        },
        series: [{
                name: '',
                type: 'pie',
                startAngle: 90,
                clockWise: false,
                radius: ['75%', '85%'],
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                    value: counts,
                    name: '直达',
                    itemStyle: {
                        color: [color2],
                    },
                }, ]
            },
            {
                name: '',
                startAngle: 90,
                color: [color1],
                type: 'pie',
                clockWise: false,
                radius: ['85%', '86%'],
                hoverAnimation: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                data: [{
                    value: value,
                    name: '',
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                            shadowBlur: 0,
                            borderColor: color1,
                        }
                    }
                }, {
                    value: counts * 0.1,
                    name: '',
                    itemStyle: placeHolderStyle
                }, {
                    value: counts - value - counts * 0.1 * 2,
                    name: '',
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                            shadowBlur: 0,
                            borderColor: color1,
                        }
                    }
                }, {
                    value: counts * 0.1,
                    name: '',
                    itemStyle: placeHolderStyle
                }, ]
            },
            {
                name: '访问来源',
                color: [color1],
                startAngle: 90,
                type: 'pie',
                hoverAnimation: false,
                radius: [0, '40%'],
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                    value: counts,
                    name: '直达',
                }, ]
            },
        ]
    }
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

//电梯故障隐患率底部
let fault_bottom_summary = (obj, bottom) => {
    let myChart = echarts.init(document.getElementById(obj));
    myChart.clear();
    var placeHolderStyle = {
        normal: {
            color: '#003956',
        },
    };
    var dataStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
        }
    };
    option = {
        color: ["#F76261", "#F7C547", "#325FFB", "#00AAFF", ],
        series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: ['35%', '40%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                    }
                },
                hoverAnimation: false,
                data: [{
                        value: bottom[3].counts - bottom[3].count,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    },
                    {
                        value: bottom[3].count,
                        name: 'A'
                    }

                ],

            },
            {
                name: 'Line 2',
                type: 'pie',
                clockWise: false,
                radius: ['50%', '55%'],
                itemStyle: dataStyle,
                hoverAnimation: false,

                data: [{
                        value: bottom[1].counts - bottom[1].count,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    },
                    {
                        value: bottom[1].count,
                        name: 'B'
                    }
                ]
            },
            {
                name: 'Line 3',
                type: 'pie',
                clockWise: false,
                hoverAnimation: false,
                radius: ['65%', '70%'],
                itemStyle: dataStyle,

                data: [{
                        value: bottom[2].counts - bottom[2].count,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    },
                    {
                        value: bottom[2].count,
                        name: 'C'
                    }
                ]
            },
            {
                name: 'Line 4',
                type: 'pie',
                clockWise: false,
                hoverAnimation: false,
                radius: ['80%', '85%'],
                itemStyle: dataStyle,

                data: [{
                        value: bottom[0].counts - bottom[0].count,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    },
                    {
                        value: bottom[0].count,
                        name: 'D'
                    }
                ]
            },

        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

/* 地图坐标位置查询 */
// 百度地图API功能

// 百度地图API功能
let baidu_map = (obj1, obj2) => {
    console.log(confirm_arr)
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


//电梯健康状况柱状图
let bars = (myCharts, dates) => {
    myCharts.clear();
    $.ajax({
        url: url + "MdeviceIfmweb/findChronicInfo/" + dates + '/' + confirm_arr,
        type: "get",
        success: function(data) {
            let datas = data.data.trouble
            let namedata = []
            let value = []
            datas.forEach((val, idx) => {
                namedata.push(val.name);
                value.push(val.value)
            })
            let sum = value.reduce((prev, cur, index, arr) => {
                return prev + cur;
            });
            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: '20',
                    x: '0',
                    x2: '10',
                    y2: '0',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: namedata,
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
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '40%',
                    data: value,
                    label: {
                        normal: { 
                            show: true,
                            position: 'top' ,
                            formatter: (data) => {
                                let vlas = ''
                                if (data.value == 0) {
                                    vlas = 0 + '%'
                                } else {
                                    vlas = (data.value / sum * 100).toFixed(0) + '%'
                                }
                                return vlas
                            },
                        }
                    },
                    itemStyle: {
                        normal: {　　　　　　　　 //这里是重点
                            color: function(params) {
                                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                let colorList = ['#00AAFF', '#325FFB', '#F7C547', '#F76261'];
                                return colorList[params.dataIndex]
                            }
                        }
                    }
                }]
            };
            myCharts.setOption(option);
        },
        error: function() {}
    });
}


// //model省市
// let Provinces_cities2 = () => {
//     $.ajax({
//         url: url + "MdeviceIfmweb/findRegionInfo",
//         type: "get",
//         success: function(data) {
//             let provice = data.data.provice
//             let city = data.data.city
//             $("#column1").html('');
//             provice.forEach((val, index, arr) => {
//                 $("#column1").append(
//                     `<li id="${val.id}" data-name="${val.NAME}">
//                         ${val.NAME}
//                         <img src="img/右箭头.png" alt="" class="img_arrow">
//                     </li>`
//                 )
//             })

//             //选中省份
//             console.log(province_data, city_data, county_data, street_data, community_data)
//             $('#column1 li').each(function() {
//                 if ($(this).attr("data-name") == province_data) { //判断省份设置选中
//                     $(this).hide();
//                     let ids = $(this).attr('id');
//                     $("#column1").prepend(
//                         `<li  id="${ids}" data-name="${province_data}" class="colorsadd">
//                                 ${province_data}
//                                 <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                             </li>`
//                     )
//                     $("#column2").html('')
//                     $("#column3").html('')
//                     $("#column4").html('')
//                     $("#column5").html('')
//                     $("#column6").html('')
//                     if (city_data != '') { //市判断
//                         $("#column2").prepend(
//                             `<li data-name="${city_data}" class="colorsadd">
//                                     ${city_data}
//                                     <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                 </li>`
//                         )
//                         $("#column3").html('')
//                         $("#column4").html('')
//                         $("#column5").html('')
//                         $("#column6").html('')
//                         if (county_data != '') { //区县判断
//                             $("#column3").prepend(
//                                 `<li data-name="${county_data}" class="colorsadd">
//                                         ${county_data}
//                                         <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                     </li>`
//                             )
//                             $("#column4").html('')
//                             $("#column5").html('')
//                             $("#column6").html('')
//                             if (street_data != '') { //街道判断
//                                 $("#column4").prepend(
//                                     `<li data-name="${street_data}" class="colorsadd">
//                                             ${street_data}
//                                             <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                         </li>`
//                                 )
//                                 $("#column6").html('')
//                                 if (community_data != '') { //小区判断
//                                     $("#column5").html(' ')
//                                     $("#column6").html('')
//                                     $("#column5").prepend(
//                                         `<li data-name="${community_data}" class="colorsadd">
//                                                     ${community_data}
//                                                     <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                                 </li>`
//                                     )
//                                     lift_ajax(province_data, city_data, county_data, street_data, community_data)
//                                 } else {
//                                     community_ajax(province_data, city_data, county_data, street_data)
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 // if (maChar_p == '') {
//                 //     $("#column2").html('')
//                 //     $("#column3").html('')
//                 //     $("#column4").html('')
//                 // }
//                 $(this).click(function() {
//                     city_data = '';
//                     county_data = '';
//                     street_data = '';
//                     community_data = '';
//                     lift_data = '';
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     province_data = $(this).attr('data-name')
//                         // confirm_arr = province_data
//                     let filtecity = city.filter((val, idx, city) => {
//                         return val.id == ids
//                     })
//                     $("#column2").html('');
//                     $("#column3").html('');
//                     $("#column4").html('');
//                     $("#column5").html('');
//                     $("#column6").html('');
//                     filtecity.forEach((val, index, arr) => {
//                         $("#column2").append(
//                             `<li id="${val.id}" data-name="${val.NAME}">
//                                 ${val.NAME}
//                                 <img src="img/右箭头.png" alt="" class="img_arrow">
//                             </li>`
//                         )
//                     })

//                     //选中市
//                     $('#column2 li').each(function() {
//                         $(this).click(function() {
//                             county_data = '';
//                             street_data = '';
//                             community_data = '';
//                             lift_data = '';
//                             let ids = $(this).attr('id')
//                             $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                             $(this).find("img").show()
//                             $(this).siblings().find("img").hide()
//                             city_data = $(this).attr('data-name');
//                             // confirm_arr = `${province_data}/${city_data}`

//                             //区县
//                             county_ajax(province_data, city_data);
//                         })
//                     })
//                     $("#column2 li:even ").css('background', '#00293D');
//                 })
//             })
//             $("#column1 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }

// //区县
// let county_ajax = (province_data, city_data) => {
//     $.ajax({
//         url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data,
//         type: "get",
//         success: function(data) {
//             let district = data.data.district
//             $("#column3").html('');
//             $("#column4").html('');
//             $("#column5").html('');
//             $("#column6").html('');
//             district.forEach((val, index, arr) => {
//                 $("#column3").append(
//                     `<li id="${val.id}" data-name="${val.name}">
//                         ${val.name}
//                         <img src="img/右箭头.png" alt="" class="img_arrow">
//                     </li>`
//                 )
//             })

//             //选中区县
//             $('#column3 li').each(function() {
//                 $(this).click(function() {
//                     street_data = '';
//                     community_data = '';
//                     lift_data = '';
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     county_data = $(this).attr('data-name');
//                     // confirm_arr = `${province_data}/${city_data}/${county_data}`;
//                     //区县
//                     street_ajax(province_data, city_data, county_data);
//                 })
//             })
//             $("#column3 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }

// //街道
// let street_ajax = (province_data, city_data, county_data) => {
//     $.ajax({
//         url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data,
//         type: "get",
//         success: function(data) {
//             let street = data.data.street
//             $("#column4").html('');
//             $("#column5").html('');
//             $("#column6").html('');
//             street.forEach((val, index, arr) => {
//                 $("#column4").append(
//                     `<li id="${val.id}" data-name="${val.name}">
//                         ${val.name}
//                         <img src="img/右箭头.png" alt="" class="img_arrow">
//                     </li>`
//                 )
//             })

//             //选中街道
//             $('#column4 li').each(function() {
//                 $(this).click(function() {
//                     community_data = '';
//                     lift_data = '';
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     street_data = $(this).attr('data-name');
//                     // confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}`;
//                     community_ajax(province_data, city_data, county_data, street_data)
//                 })
//             })
//             $("#column4 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }

// //小区
// let community_ajax = (province_data, city_data, county_data, street_data) => {
//     $.ajax({
//         url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data + '/' + street_data,
//         type: "get",
//         success: function(data) {
//             let community = data.data.community
//             $("#column5").html('');
//             $("#column6").html('');
//             community.forEach((val, index, arr) => {
//                 $("#column5").append(
//                     `<li id="${val.id}" data-name="${val.name}">
//                         ${val.name}
//                         <img src="img/右箭头.png" alt="" class="img_arrow">
//                     </li>`
//                 )
//             })

//             //选中小区
//             $('#column5 li').each(function() {
//                 $(this).click(function() {
//                     lift_data = '';
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     community_data = $(this).attr('data-name');
//                     // confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}`;
//                     lift_ajax(province_data, city_data, county_data, street_data, community_data)
//                 })
//             })
//             $("#column5 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }

//电梯
// let lift_ajax = (province_data, city_data, county_data, street_data, community_data) => {
//     $.ajax({
//         url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data + '/' + street_data + '/' + community_data,
//         type: "get",
//         success: function(data) {
//             let name = data.data.name
//             $("#column6").html('');
//             name.forEach((val, index, arr) => {
//                 $("#column6").append(
//                     `<li id="${val.id}" data-name="${val.name}">
//                         ${val.name}
//                     </li>`
//                 )
//             })
//             $('#column6 li').each(function() {
//                 $(this).click(function() {
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     lift_data = $(this).attr('data-name');
//                     href_lift_id = ids
//                         // confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}/${lift_data}`
//                 })
//             })
//             $("#column6 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }