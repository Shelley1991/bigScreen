/*
 * @Author: your name
 * @Date: 2019-10-29 16:21:19
 * @LastEditTime: 2019-10-31 15:43:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Json_Code\Internet-ofthings\js\index.js
 */
let province_data = ''; //省
let city_data = ''; //市
let county_data = ''; //区县
let street_data = ''; //街道
let community_data = ''; //小区
let lift_data = ''; //电梯
let confirm_arr = '' //省市区县街道小区电梯合并
let pr = ''
let ct = '';

let href_lift_id = ''
let maChar_p = '';
let maChar_c = '';
let maChar_s = '';
let tooltips = 0 //判断地图与省市model联动
let splitNumbers1 = 0,
    splitNumbers2 = 0,
    splitNumbers3 = 0;

//1 = index.html,2 = property.html ,3 = elevator.html
htmlsite = 1;
//地图用到的变量
let backStack = [];
let addressCode, geoJsonData;
let mapData = [];
let countryMap;
let mapName;
let findProvince, findCity;

storage_data = null; //记录model层点击的数据


//获取浏览器窗口高度
function indexInnerHeight(){
    var autoHeight = 0;
    //获取浏览器窗口高度
    if( window.innerHeight){
        autoHeight = window.innerHeight;
    }
    else if ((!window.innerHeight) && (document.body) && (document.body.clientHeight)){
        autoHeight = document.body.clientHeight;
    }
    //通过深入Document内部对body进行检测，获取浏览器窗口高度
    else if ((!window.innerHeight)&& ((!document.body)||(!document.body.clientHeight))&& document.documentElement && document.documentElement.clientHeight){
        autoHeight = document.documentElement.clientHeight;
    }
    document.body.style.height = autoHeight + 'px';
}

window.onload = function(){
    indexInnerHeight();
}

$(() => {


    //地图初始化
    myChart = echarts.init(document.getElementById('map'));

    window.addEventListener("resize", function() {
        indexInnerHeight();
        myChart.resize();
    });

    setInterval(() => {
        maptop();
    }, 10000)

    if (sessionStorage.getItem("property") != null) {

        storage_data = JSON.parse(sessionStorage.getItem("property"));

        if (storage_data != "" && storage_data != "undefined" && storage_data != null && storage_data.province != "") {

            province_data = Base64.decode(storage_data.province);
            city_data = Base64.decode(storage_data.city);
            // county_data =  Base64.decode(storage_data.county);
            // street_data =  Base64.decode(storage_data.street);
            // community_data = Base64.decode(storage_data.community);
            // lift_data = Base64.decode(storage_data.lift);
            if (province_data != "") {
                $("#backmap").show();
            }
            if (Base64.decode(storage_data.city) == '') {
                $("#position_city").html(province_data);
            } else {
                $("#position_city").html(city_data);
            }
            findMap(province_data, city_data);
        } else {
            layer.closeAll();
            $("#position_city").html('全国');
            province_data = ''; //省
            city_data = ''; //市
            county_data = ''; //区县
            street_data = ''; //街道
            community_data = ''; //小区
            lift_data = ''; //电梯
            confirm_arr = '' //省市区县街道小区电梯合并
            $("#column1").html('');
            $("#column2").html('');
            $("#column3").html('');
            $("#column4").html('');
            $("#column5").html('');
            $("#column6").html('');
            tooltips = 0;
            findMap('', '');
            getGeo("100000", "zhongguo", 2, myChart); //地图
            Provinces_cities(storage_data) //省市
        }

    } else {
        var propertytemp = {};
        propertytemp.province = "";
        propertytemp.city = "";
        propertytemp.street = "";
        propertytemp.county = "";
        propertytemp.community = "";
        propertytemp.lift = "";
        sessionStorage.setItem("property", JSON.stringify(propertytemp));
    }

    //地图点击事件
    //点击事件
    myChart.on('click', function(params) { //地图点击事件
        $("#backmap").show();
        if (params.data.level == "province") {
            if (params.data.name == "上海市" || params.data.name == "天津市" || params.data.name == "北京市" || params.data.name == "重庆市") {
                // maChar_p = params.data.name
                // maChar_c = params.data.name;
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.province = Base64.encode(params.data.name);
                propertytemp.city = Base64.encode(params.data.name);
                propertytemp.county = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
            } else {
                // maChar_p = params.data.name
                // maChar_c = '';
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.province = Base64.encode(params.data.name);
                propertytemp.city = "";
                propertytemp.county = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
            }
            $("#pr").html('市');
            maChar_s = '';
        }
        if (params.data.level == "city") {
            $("#pr").html('区');
            // maChar_c = params.data.name;
            // maChar_s = '';

            var propertytemp = JSON.parse(sessionStorage.getItem("property"));
            // propertytemp.province = params.data.name;
            propertytemp.city = Base64.encode(params.data.name);
            propertytemp.county = "";
            sessionStorage.setItem("property", JSON.stringify(propertytemp));
        }
        if (params.data.level == "district") {
            //maChar_s = params.data.name


            var propertytemp = JSON.parse(sessionStorage.getItem("property"));
            // propertytemp.province = params.data.name;
            // propertytemp.city = params.data.name;
            propertytemp.county = Base64.encode(params.data.name);
            sessionStorage.setItem("property", JSON.stringify(propertytemp));
            model($("#model"), htmlsite);

        }
        $("#position_city").html(params.data.name)
        tooltips = 1;
        storage_data = JSON.parse(sessionStorage.getItem("property"));

        Provinces_cities(storage_data); //省市
        getGeo(params.data.adcode, params.data.name, 0, myChart);
    });

    //返回上一级地图
    $("#backmap").click(() => {
        tooltips == 1
        goback(myChart);
        //sessionStorage.removeItem("Item");
    })

    getGeo("100000", "zhongguo", 2, myChart); //地图
    Provinces_cities(storage_data) //省市

    // bar("bar", 'year'); //电梯健康柱状图
    // maptop(); //地图顶部
    // realTime() //故障情况
    // Maintenance() //维保信息
    // pieAjax() //饼状图Ajax
    // ranking('') //电梯安全排行

    //年月季周按钮切换
    $('#health_uls li').click(function() {
        $(this).css({ "color": "#00AAFF" }).siblings().css({ "color": "" });
        let ids = $(this).attr('id')
        bar("bar", ids);
    })


    //打开model
    $("#model_open").click(() => {
        model($("#model"), htmlsite);
    })

    // //model取消按钮
    // $("#cancel").click(() => {
    //     layer.closeAll();
    //     province_data = ''; //省
    //     city_data = ''; //市
    //     county_data = ''; //区县
    // })

    //model确定按钮
    // $("#confirm").click(() => {
    //     sessionStorage.removeItem("Item");
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
    //     // console.log(province_data, city_data, county_data, street_data, community_data, lift_data)
    //     if (confirm_arr_lens < 3) {
    //         if (province_data == '') {
    //             alert("请选择！");
    //             return;
    //         }
    //         $("#position_city").html(province_data + city_data + county_data);
    //         findMap(province_data, city_data);
    //         getGeo("100000", "zhongguo", 2, myChart); //地图
    //         layer.closeAll();
    //         maptop(); //地图顶部
    //         bar("bar", 'year'); //电梯健康柱状图
    //         realTime(); //故障情况
    //         Maintenance(); //维保信息
    //         ranking('');//电梯安全排行
    //     } else if (confirm_arr_lens == 3) {

    //     } else if (confirm_arr_lens > 3 && confirm_arr_lens <= 5) {
    //         let property = {
    //             province: Base64.encode(province_data),
    //             city: Base64.encode(city_data),
    //             county: Base64.encode(county_data),
    //             street: Base64.encode(street_data),
    //             community: Base64.encode(community_data)
    //         }
    //         sessionStorage.setItem("property", JSON.stringify(property))
    //         location.href = "property.html";
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
        // layer.closeAll();
        // $("#position_city").html('全国');
        // province_data = ''; //省
        // city_data = ''; //市
        // county_data = ''; //区县
        // street_data = ''; //街道
        // community_data = ''; //小区
        // lift_data = ''; //电梯
        // confirm_arr = '' //省市区县街道小区电梯合并
        // $("#column1").html('');
        // $("#column2").html('');
        // $("#column3").html('');
        // $("#column4").html('');
        // $("#column5").html('');
        // $("#column6").html('');
        // tooltips = 0;
        // findMap('', '');
        // getGeo("100000", "zhongguo", 2, myChart); //地图
        // Provinces_cities(storage_data) //省市
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

//电梯故障运行
function elevator_failure() {
    var $this = $("#tables");
    $this.hover(function() {
        clearInterval(scrollTimer);
    }, function() {
        scrollTimer = setInterval(function() {
            scrollNews($this);
        }, 2000);
    }).trigger("mouseout");
}

//故障信息滚动特效
let scrollNews = (obj) => {
    let $self = obj.find("ul:first");
    let lineHeight = $self.find("li:first").height();
    $self.animate({ "margin-top": -lineHeight + "px" }, 600, function() {
        $self.css({ "margin-top": "0px" }).find("li:first").appendTo($self);
    })
}

// //model省市
// let Provinces_cities = () => {
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
//             $("#column1 li:even ").css('background', '#00293D');

//             if (tooltips == 1) {
//                 $('#column1 li').each(function() {
//                     if ($(this).attr("data-name") == maChar_p) { //判断省份设置选中
//                         $(this).hide();
//                         let ids = $(this).attr('id');
//                         $("#column2").html('');
//                         $("#column3").html('');
//                         $("#column4").html('');
//                         $("#column5").html('');
//                         $("#column6").html('');
//                         $("#column1").prepend(
//                             `<li id="${ids}" data-name="${maChar_p}" class="colorsadd">
//                                     ${maChar_p}
//                                     <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                 </li>`
//                         )
//                         let filtecity = city.filter((val, idx, city) => {
//                             return val.id == ids
//                         })
//                         $("#column2").html('');
//                         filtecity.forEach((val, index, arr) => {
//                             $("#column2").append(
//                                 `<li id="${val.id}" data-name="${val.NAME}">
//                                         ${val.NAME}
//                                         <img src="img/右箭头.png" alt="" class="img_arrow">
//                                     </li>`
//                             )
//                         })
//                         $("#column2 li:even").css('background', '#00293D');
//                         if (maChar_c != '') { //市判断
//                             $("#column2").html('');
//                             $("#column3").html('');
//                             $("#column4").html('');
//                             $("#column5").html('');
//                             $("#column6").html('');
//                             $("#column2").prepend(
//                                 `<li data-name="${maChar_c}" class="colorsadd">
//                                         ${maChar_c}
//                                         <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                     </li>`
//                             )
//                             if (maChar_s != '') { //区县判断
//                                 $("#column3").html('')
//                                 $("#column4").html('')
//                                 $("#column5").html('');
//                                 $("#column6").html('');
//                                 $("#column3").prepend(
//                                     `<li data-name="${maChar_s}" class="colorsadd">
//                                             ${maChar_s}
//                                             <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
//                                         </li>`
//                                 )
//                                 street_ajax(maChar_p, maChar_c, maChar_s);
//                             } else {
//                                 county_ajax(maChar_p, maChar_c)
//                             }
//                         }
//                     }
//                 })

//                 if (maChar_p == '') {
//                     $("#column2").html('')
//                     $("#column3").html('')
//                     $("#column4").html('')
//                 }
//                 province_data = maChar_p;
//                 city_data = maChar_c
//                 county_data = maChar_s

//                 tooltips == 0
//             }

//             //选中省
//             $('#column1 li').click(function() {
//                 city_data = '';
//                 county_data = '';
//                 street_data = '';
//                 community_data = '';
//                 lift_data = '';
//                 let ids = $(this).attr('id')
//                 $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                 $(this).find("img").show()
//                 $(this).siblings().find("img").hide()
//                 province_data = $(this).attr('data-name')
//                 let filtecity = city.filter((val, idx, city) => {
//                     return val.id == ids
//                 })
//                 $("#column2").html('');
//                 $("#column3").html('');
//                 $("#column4").html('');
//                 $("#column5").html('');
//                 $("#column6").html('');
//                 filtecity.forEach((val, index, arr) => {
//                     $("#column2").append(
//                         `<li id="${val.id}" data-name="${val.NAME}">
//                             ${val.NAME}
//                             <img src="img/右箭头.png" alt="" class="img_arrow">
//                         </li>`
//                     )
//                 })
//                 $("#column2 li:even ").css('background', '#00293D');

//                 //选中市
//                 $('#column2 li').click(function() {
//                     county_data = '';
//                     street_data = '';
//                     community_data = '';
//                     lift_data = '';
//                     let ids = $(this).attr('id')
//                     $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                     $(this).find("img").show()
//                     $(this).siblings().find("img").hide()
//                     city_data = $(this).attr('data-name');

//                     //区县
//                     county_ajax(province_data, city_data);
//                 })
//             })
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
//             $('#column3 li').click(function() {
//                 street_data = '';
//                 community_data = '';
//                 lift_data = '';
//                 let ids = $(this).attr('id')
//                 $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                 $(this).find("img").show()
//                 $(this).siblings().find("img").hide()
//                 county_data = $(this).attr('data-name');
//                 //区县
//                 street_ajax(province_data, city_data, county_data);
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
//             $('#column4 li').click(function() {
//                 community_data = '';
//                 lift_data = '';
//                 let ids = $(this).attr('id')
//                 $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                 $(this).find("img").show()
//                 $(this).siblings().find("img").hide()
//                 street_data = $(this).attr('data-name');
//                 community_ajax(province_data, city_data, county_data, street_data)
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
//             $('#column5 li').click(function() {
//                 lift_data = '';
//                 let ids = $(this).attr('id')
//                 $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                 $(this).find("img").show()
//                 $(this).siblings().find("img").hide()
//                 community_data = $(this).attr('data-name');
//                 lift_ajax(province_data, city_data, county_data, street_data, community_data)
//             })
//             $("#column5 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }

// //电梯
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
//             $('#column6 li').click(function() {
//                 let ids = $(this).attr('id')
//                 $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
//                 $(this).find("img").show()
//                 $(this).siblings().find("img").hide()
//                 lift_data = $(this).attr('data-name');
//                 href_lift_id = ids
//             })
//             $("#column6 li:even ").css('background', '#00293D');
//         },
//         error: function() {}
//     });
// }


//电梯安全排行
let ranking = (obj) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findUseRank/" + obj + '/' + confirm_arr,
        type: "get",
        success: function(data) {
            let datas = data.data
            $("#Safety_ul").html('');
            let x = 0
            if (datas.length < 6) {
                x = 6 - datas.length;
                for (let i = 0; i < x; i++) {
                    datas.push({
                        name: '',
                        province: '',
                        status: '',
                    })
                }
            }
            datas.forEach((val, index, arr) => {
                let valProvince = val.province;
                let idxs = ''
                if (index >= datas.length - x + 2) {
                    idxs = ''
                } else {
                    idxs = index + 1
                }
                $("#Safety_ul").append(
                    `<li>
                        <div class="idx">${idxs}</div>
                        <div class="community_name">${val.name}</div>
                    </li>`
                )
            })

            $("#Safety_ul li:odd ").css('background', '#001925');
            $("#Safety_ul li ").eq(0).addClass("top1 ");
            $("#Safety_ul li ").eq(1).addClass("top2 ");
            $("#Safety_ul li ").eq(2).addClass("top3 ");
        },
        error: function() {}
    });
}


//地图区域
let maptop = () => {
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

//故障情况
let realTime = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findBreakdownInfo/" + confirm_arr,
        type: "get",
        success: function(data) {
            let realTimedate = data.data;
            $("#fault-cont-ul").html('');
            let x = 0
            if (realTimedate.length < 6) {
                x = 6 - realTimedate.length;
                for (let i = 0; i < x; i++) {
                    realTimedate.push({
                        name: '',
                        province: '',
                        status: '',
                    })
                }
            }
            realTimedate.forEach((val, index, arr) => {
                $("#fault-cont-ul").append(
                    `<li class="tier flexR">
                        <div class="flex1">${val.name}</div>
                        <div class="flex1">${val.province}</div>
                        <div class="flex1">${val.status}</div>
                    </li>`
                )
            })

            //隔行变色
            $("#fault-cont-ul li:odd ").css('background', '#00496E');
            if (x == 0) {
                elevator_failure();
            } else {
                clearInterval(scrollTimer);
                $("#tables").unbind() //移除元素的所有事件
            }
        },
        error: function() {}
    });
}

//维保信息
let Maintenance = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRepairStat/" + confirm_arr,
        type: "get",
        success: function(data) {
            let datas = data.data

            //设备
            $("#unit4").html('');
            $("#unit5").html('');
            $("#unit6").html('');
            $("#Maintenance1").html(nums(datas.trouble, 'unit4'));
            $("#Maintenance2").html(nums(datas.repair, 'unit5'));
            $("#Maintenance3").html(nums(datas.price, 'unit6'));
        },
        error: function() {}
    });
}


//饼状图Ajax
let pieAjax = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findOverView", //请求的服务端地址
        type: "get",
        success: function(data) {
            let chuangjia = data.data.chuangjia //电梯厂家
            let baoyou = data.data.baoyou //电梯保有量
            let shengshi = data.data.shengshi //省事
            let xiaoqu = data.data.xiaoqu //小区物业
            let fangchan = data.data.fangchan //房产公司
            let weibao = data.data.weibao //维保公司
            pie("pie1", 'rgba(45,177,84,80%)', 'rgba(8,38,25,90%)', 'rgba(45,177,84,40%)', chuangjia.counts, chuangjia.count);
            pie("pie2", 'rgba(50,95,251,80%)', 'rgba(09,18,36,90%)', 'rgba(50,95,251,40%)', xiaoqu.counts, xiaoqu.count);
            pie("pie3", 'rgba(247,131,74,80%)', 'rgba(43,30,24,90%)', 'rgba(247,131,74,40%)', baoyou.counts, baoyou.count);
            pie("pie4", 'rgba(247,98,97,80%)', 'rgba(50,27,29,90%)', 'rgba(247,98,97,40%)', fangchan.counts, fangchan.count);
            pie("pie5", 'rgba(0,170,255,80%)', 'rgba(0,37,55,90%)', 'rgba(0,170,255,40%)', shengshi.counts, shengshi.count);
            pie("pie6", 'rgba(247,197,71,80%)', 'rgba(42,41,43,90%)', 'rgba(247,197,71,40%)', weibao.counts, weibao.count);
            $("#num1").html(chuangjia.percent)
            $("#num2").html(xiaoqu.percent)
            $("#num3").html(baoyou.percent)
            $("#num4").html(fangchan.percent)
            $("#num5").html(shengshi.percent)
            $("#num6").html(weibao.percent)
        },
        error: function() {}
    });
}

//饼状图
let pie = (obj, color1, color2, color3, counts, value) => {
        let myChart = echarts.init(document.getElementById(obj));
        option = {
            series: [{
                    type: 'pie',
                    clockwise: false,
                    hoverAnimation: false,
                    radius: ['00%', '80%'],
                    startAngle: 90,
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: value,
                        itemStyle: {
                            color: color1,
                        }
                    }, {
                        value: counts - value,
                        itemStyle: {
                            color: 'transparent',
                        }
                    }]
                },
                {
                    type: 'pie',
                    clockwise: true,
                    hoverAnimation: false,
                    radius: ['00%', '64%'],
                    startAngle: 90,
                    center: ['50%', '50%'],

                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: counts - value,
                        itemStyle: {
                            color: color2,
                            borderWidth: 2,
                            borderColor: color3
                        }
                    }, {
                        value: value,
                        itemStyle: {
                            color: 'transparent',
                        }
                    }]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function() {
            myChart.resize();
        });
    }
    //电梯健康状况柱状图
let bar = (bar, dates) => {
    let myCharts = echarts.init(document.getElementById(bar));
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
            myCharts.clear();
            myCharts.setOption(option);
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        error: function() {}
    });
}





//返回
function goback(myChart) {
    var back = backStack.pop();
    if (typeof(back) != "undefined" && typeof(back.mapName) != "undefined") {
        mapName = back.mapName;
        if (mapName == '') { //定位标题判断显示
            $("#position_city").html('全国')
        } else {
            $("#position_city").html(mapName)
        }
        geoJsonData = back.geoJsonData;
        if (geoJsonData.features[0].properties.level == "province") { //电梯安全性能排行判断显示
            $("#pr").html('省');
            var propertytemp = JSON.parse(sessionStorage.getItem("property"));
            propertytemp.province = "";
            propertytemp.city = "";
            propertytemp.street = "";
            propertytemp.county = "";
            propertytemp.community = "";
            propertytemp.lift = "";

            $("#column1").html('');
            $("#column2").html('');
            $("#column3").html('');
            $("#column4").html('');
            $("#column5").html('');
            $("#column6").html('');
            sessionStorage.setItem("property", JSON.stringify(propertytemp));
            $("#backmap").hide();
        }
        if (geoJsonData.features[0].properties.level == "city") {
            $("#pr").html('市');
            var propertytemp = JSON.parse(sessionStorage.getItem("property"));
            // propertytemp.province = params.data.name;

            propertytemp.city = "";
            propertytemp.street = "";
            propertytemp.county = "";
            propertytemp.community = "";
            propertytemp.lift = "";
            $("#column2").html('');
            $("#column3").html('');
            $("#column4").html('');
            $("#column5").html('');
            $("#column6").html('');
            sessionStorage.setItem("property", JSON.stringify(propertytemp));
            // model($("#model"),htmlsite);
        }
        if (geoJsonData.features[0].properties.level == "district") {

            var propertytemp = JSON.parse(sessionStorage.getItem("property"));
            // propertytemp.province = params.data.name;
            // propertytemp.city = params.data.name;
            propertytemp.street = "";
            propertytemp.county = "";
            propertytemp.community = "";
            propertytemp.lift = "";
            $("#column3").html('');
            $("#column4").html('');
            $("#column5").html('');
            $("#column6").html('');
            sessionStorage.setItem("property", JSON.stringify(propertytemp));
            //model($("#model"),htmlsite);
        }
        storage_data = JSON.parse(sessionStorage.getItem("property"));
        Provinces_cities(storage_data) //省市
        loadMapData(back.geoJsonData, 0, myChart);
        createOption(myChart);
    }
}
//将需要查找的省市记录到全局变量,等待创建中国地图后调用
function findMap(province, city) {
    if (province == city)
        city = "";
    findProvince = province;
    findCity = city;
}


//下载地图,参数:邮政编号、地图名、
//isSpic=0,直接调用createOption；
//isSpic=1,find省后,进入find市回调；
//isSpic=2,首次进入中国地图,并判断是否需要findmap；
function getGeo(adCode, mN, isSpic, myChart) {
    if (isSpic == 2) {
        backStack = []
    }
    backStack.push({ mapName: mapName, geoJsonData: geoJsonData });
    mapName = mN;
    $.get("mapj/" + adCode + ".json", function(response) {
        geoJsonData = response;
        loadMapData(geoJsonData, isSpic, myChart);
    });
}
//循环地图装载mapdata,参数:地图json
function loadMapData(geoJsonData, isSpic, myChart) {
    if (mapName == 'zhongguo') {
        mapName = ''
    }
    $.ajax({
        url: url + "MdeviceIfmweb/findMapInfo/" + mapName, //请求的服务端地址
        type: "get",
        success: function(data) {
            echarts.registerMap(mapName, geoJsonData);
            mapData = [];
            for (let i in geoJsonData['features']) {
                var a = geoJsonData.features[i];
                // a.properties.name = a.properties.name.substring(0, 2);
                if (mapName == "") {
                    a.properties.level = "province";
                    a.properties.adcode = a.adcode
                }
                mapData.push({
                    name: a.properties.name,
                    value: [a.properties.center[0], a.properties.center[1], 0],
                    level: a.properties.level,
                    adcode: a.properties.adcode,
                    sname: a.properties.name,
                });
            }
            let datas = data.data;
            for (let x = 0; x < datas.length; x++) {
                for (let y = 0; y < mapData.length; y++) {
                    if (datas[x].name == mapData[y].name) {
                        mapData[y].value.pop()
                        mapData[y].value.push(datas[x].count);
                        continue;
                    }
                }
            }
            if (mapName == '') {
                for (let x = 0; x < province_sname.length; x++) {
                    for (let y = 0; y < mapData.length; y++) {
                        if (province_sname[x].name == mapData[y].name) {
                            mapData[y].sname = province_sname[x].sname
                            continue;
                        }
                    }
                }
            }
            retFunction(isSpic, myChart);

            if (mapData[0].level == "city") {
                if (mapName == '') {} else {
                    pr = mapName + '/'
                }
                ct = ''
            } else if (mapData[0].level == "district") {
                ct = mapName
            } else if (mapData[0].level == "province") {
                pr = ''
                ct = ''
            }
            confirm_arr = pr + ct;
            bar("bar", 'year'); //电梯健康柱状图
            maptop(); //地图顶部
            realTime() //故障情况
            Maintenance() //维保信息
            pieAjax() //饼状图Ajax
            ranking('') //电梯安全排行

        },
        error: function() {}
    });
}
//装配完的回调方法，参数：是否调用createOption
//isSpic=0,默认操作,直接调用createOption；
//isSpic=1,find省后,进入find市回调；
//isSpic=2,首次进入中国地图,并判断是否需要findmap；
function retFunction(isSpic, myChart) {
    if (isSpic == 0) {
        createOption(myChart);
    } else if (isSpic == 1) {
        var prop = getNextGeo(findCity, geoJsonData);
        getGeo(prop.adcode, findCity, 0, myChart);
    } else if (isSpic == 2) {
        if (typeof(findProvince) != "undefined" && findProvince != null && findProvince != "") {
            var prop = getNextGeo(findProvince, geoJsonData);
            if (typeof(findCity) != "undefined" && findCity != null && findCity != "") {
                getGeo(prop.adcode, findProvince, 1, myChart);
            } else {
                getGeo(prop.adcode, findProvince, 0, myChart);
            }
        } else {
            createOption(myChart);
        }
    }
}

//检索下一级地图找到mapN对应的地图,return后是
function getNextGeo(mapN, geo) {
    for (let i in geo.features) {
        var a = geo.features[i];
        if (a.properties.name.substring(0, 2) == mapN.substring(0, 2)) {
            return a.properties;
        }
    }
}




//地图渲染
function createOption(myChart) {
    var option = {
        tooltip: {
            padding: 0,
            transitionDuration: 1,
            textStyle: {
                color: '#fff',
                decoration: 'none',
            },
            trigger: 'item',
            show: true,
            formatter: (params) => {
                let tipHtml = '';
                tipHtml =
                    `<div style="width:200px;height:60px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
                                        <div style="font-size:16px;margin-bottom:15px;">|&nbsp;${params.data.name}</div>
                                        <div style="color:#fff;font-size:14px;">
                                            <div style="width:0;height:0; border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:14px solid #636FD3;float:left;margin:4px 10px 0 0;"></div>
                                            <div style="float: left;">设备量（台）:</div>
                                            <div style="float: right;">${params.data.value[2]}</div>
                                        </div>
                                    </div>`
                return tipHtml;
            },
        },
        //左侧小导航图标
        visualMap: {
            show: false,
            bottom: '0%',
            left: '3%',
            max: '4000',
            calculable: true,
            seriesIndex: [0], //series执行顺序
            textStyle: {
                color: '#fff',
            },
            inRange: {
                color: ['#0A151a', '#295266', ]
            },
        },
        geo: {
            zoom: 1.1,
            map: mapName,
            label: {
                normal: {
                    color: '#fff',
                    show: false
                },
                emphasis: {
                    color: '#fff',
                    show: false,
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 0.5, // 区域边框宽度
                    areaColor: '#3d7a99',
                    borderColor: '#3d7a99',
                },
                emphasis: {
                    areaColor: '#3d7a99',
                }
            },

        },
        series: [{
                name: '数据',
                type: 'map',
                geoIndex: 0,
                mapType: mapName,
                data: mapData,
                itemStyle: {
                    normal: {
                        color: '#fff',
                    },
                },
                label: {
                    normal: {
                        formatter: (params) => {
                            return params.data.sname;
                        },
                        position: 'right',
                        show: true,
                        fontSize: 10,
                        color: '#fff',
                    },
                    emphasis: {
                        show: true
                    }
                },
            },
            {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: mapData,
                symbolSize: function(val) {
                    let paos = 0;
                    if (val[2] == 0) {
                        paos = 0;
                    } else if (val[2] > 0) {
                        paos = 5;
                    }
                    return paos;
                },
                tooltip: {
                    formatter: (params) => {
                        let tipHtml = '';
                        tipHtml =
                            `<div style="width:200px;height:60px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
                                                <div style="font-size:16px;margin-bottom:15px;">|&nbsp;${params.data.name}</div>
                                                <div style="color:#fff;font-size:14px;">
                                                    <div style="width:0;height:0; border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:14px solid #636FD3;float:left;margin:4px 10px 0 0;"></div>
                                                    <div style="float: left;">设备量（台）:</div>
                                                    <div style="float: right;">${params.data.value[2]}</div>
                                                </div>
                                            </div>`
                        return tipHtml;
                    },
                    show: true
                },
                label: {
                    normal: {
                        formatter: (params) => {
                            return params.data.sname;
                        },
                        position: 'right',
                        show: true,
                        fontSize: 10,
                        color: '#fff',
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff',
                        borderWidth: 3,
                        borderColor: '#3E9CC1',
                        borderType: 'solid',
                    }
                }
            },
        ]
    };
    myChart.setOption(option, true)
}

let province_sname = [
    { name: '北京市', value: 0, sname: '北京' }, { name: '天津市', value: 0, sname: '天津' },
    { name: '上海市', value: 0, sname: '上海' }, { name: '重庆市', value: 0, sname: '重庆' },
    { name: '河北省', value: 0, sname: '河北' }, { name: '河南省', value: 0, sname: '河南' },
    { name: '云南省', value: 0, sname: '云南' }, { name: '辽宁省', value: 0, sname: '辽宁' },
    { name: '黑龙江省', value: 0, sname: '黑龙江' }, { name: '湖南省', value: 0, sname: '湖南' },
    { name: '安徽省', value: 0, sname: '安徽' }, { name: '山东省', value: 0, sname: '山东' },
    { name: '新疆维吾尔自治区', value: 0, sname: '新疆' }, { name: '江苏省', value: 0, sname: '江苏' },
    { name: '浙江省', value: 0, sname: '浙江' }, { name: '江西省', value: 0, sname: '江西' },
    { name: '湖北省', value: 0, sname: '湖北' }, { name: '广西壮族自治区', value: 0, sname: '广西' },
    { name: '甘肃省', value: 0, sname: '甘肃' }, { name: '山西省', value: 0, sname: '山西' },
    { name: '内蒙古自治区', value: 0, sname: '内蒙古' }, { name: '陕西省', value: 0, sname: '陕西' },
    { name: '吉林省', value: 0, sname: '吉林' }, { name: '福建省', value: 0, sname: '福建' },
    { name: '贵州省', value: 0, sname: '贵州' }, { name: '广东省', value: 0, sname: '广东' },
    { name: '青海省', value: 0, sname: '青海' }, { name: '西藏自治区', value: 0, sname: '西藏' },
    { name: '四川省', value: 0, sname: '四川' }, { name: '宁夏回族自治区', value: 0, sname: '宁夏' },
    { name: '海南省', value: 0, sname: '海南' }, { name: '台湾省', value: 0, sname: '台湾' },
    { name: '香港特别行政区', value: 0, sname: '香港' }, { name: '澳门特别行政区', value: 0, sname: '澳门' }
];;