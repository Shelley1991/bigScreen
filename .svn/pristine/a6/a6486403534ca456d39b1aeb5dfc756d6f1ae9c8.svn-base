/*
 * @Author: Json.xu 
 * @Date: 2019-10-30 10:29:23 
 * @Last Modified by: Json.xu
 * @Last Modified time: 2019-10-30 10:33:48
 */

/**
 * @description: 模态框
 * @param {content_id：传入需要模态框的ID} 
 * @return: 
 */
let model = (content_id, htmlsite) => {
    layer.open({
        type: 1, //类型
        anim: 5, //弹出动画
        shade: 0.5, //遮罩层的透明度
        area: ['97%', '83%'], //定义宽和高'35%', '60%'
        offset: '13%',
        closeBtn: 0, //右上关闭
        move: false, //关闭拖动
        title: ' ', //题目
        extend: 'css/comm.css',
        skin: 'model',
        shadeClose: false, //点击遮罩层关闭
        content: content_id //打开的内容
    });
    if (htmlsite == 1) {

        //do something

    }
    if (htmlsite == 2) {

        //do something

    }
    if (htmlsite == 3) {

        //do something

    }
}

//model取消按钮
$("#cancel").click(() => {
    layer.closeAll();
    province_data = ''; //省
    city_data = ''; //市
    county_data = ''; //区县
})

//model确定按钮
$("#confirm").click(() => {
    _$this = $(this);
    historydata = JSON.parse(sessionStorage.getItem("property"));
    if (historydata != null && historydata.province != undefined) {
        var province_data = Base64.decode(historydata.province);
        var city_data = Base64.decode(historydata.city);
        var county_data = Base64.decode(historydata.county);
        var street_data = Base64.decode(historydata.street);
        var community_data = Base64.decode(historydata.community);
        var lift_data = Base64.decode(historydata.lift);

        if (province_data != '') {
            confirm_arr = `${province_data}`;
        }
        if (province_data != '' && city_data != '') {
            confirm_arr = `${province_data}/${city_data}`
        }
        if (province_data != '' && city_data != '' && county_data != '') {
            confirm_arr = `${province_data}/${city_data}/${county_data}`
        }
        if (province_data != '' && city_data != '' && county_data != '' && street_data != '') {
            confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}`
        }
        if (province_data != '' && city_data != '' && county_data != '' && street_data != '' && community_data != '') {
            confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}`
        }
        if (province_data != '' && city_data != '' && county_data != '' && street_data != '' && community_data != '' && lift_data != '') {
            confirm_arr = `${province_data}/${city_data}/${county_data}/${street_data}/${community_data}/${lift_data}`
        }
    }

    let confirm_arr_lens = confirm_arr.split('/').length;
    // console.log(province_data, city_data, county_data, street_data, community_data, lift_data)
    $("#confirm").html("确定").css("width","80px");;
    if (confirm_arr_lens < 3) {
        if (province_data == '') {
            return;
        }
        location.href = "index.html";


    } else if (confirm_arr_lens == 3) {
        //location.href = "index.html";
        $("#confirm").html("需要选择具体的街道").css("width","180px");
        return;
    } else if (confirm_arr_lens > 3 && confirm_arr_lens <= 5) {
        //sessionStorage.removeItem("property");
        let property = {
            province: Base64.encode(province_data),
            city: Base64.encode(city_data),
            county: Base64.encode(county_data),
            street: Base64.encode(street_data),
            community: Base64.encode(community_data),
            lift: "",
            deviceID: ""
        }
        sessionStorage.setItem("property", JSON.stringify(property))
        location.href = "property.html";
    } else if (confirm_arr_lens == 6) {
        // sessionStorage.removeItem("property");
        let property = {
            province: Base64.encode(province_data),
            city: Base64.encode(city_data),
            county: Base64.encode(county_data),
            street: Base64.encode(street_data),
            community: Base64.encode(community_data),
            lift: Base64.encode(lift_data),
            deviceID: Base64.encode(href_lift_id)
        }
        sessionStorage.setItem("property", JSON.stringify(property))
        location.href = "elevator.html";
    }


    if (htmlsite == 1) {
        $("#position_city").html(province_data + city_data + county_data);
        findMap(province_data, city_data);
        getGeo("100000", "zhongguo", 2, myChart); //地图
        layer.closeAll();
        maptop(); //地图顶部
        bar("bar", 'year'); //电梯健康柱状图
        realTime(); //故障情况
        Maintenance(); //维保信息
        ranking(''); //电梯安全排行
    }
    if (htmlsite == 2) {
        $("#position_city").html(street_data + community_data);
        layer.closeAll();
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
        } // 百度地图API功能
        let property = {
            province: Base64.encode(province_data),
            city: Base64.encode(city_data),
            county: Base64.encode(county_data),
            street: Base64.encode(street_data),
            community: Base64.encode(community_data),
            lift: "",
            deviceID: ""
        }
        sessionStorage.setItem("property", JSON.stringify(property))
    }

    if (htmlsite == 3) {

    }

})
$("body").on("click", "#column2 li", function() {
    //选中市
  

        $("#column3").html('');
        $("#column4").html('');
        $("#column5").html('');
        $("#column6").html('');
        county_data = '';
        street_data = '';
        community_data = '';
        lift_data = '';
        let ids = $(this).attr('id');
        $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
        $(this).find("img").show()
        $(this).siblings().find("img").hide()
        city_data = $(this).attr('data-name');
       
        var propertytemp = JSON.parse(sessionStorage.getItem("property"));
        province_data = Base64.decode(propertytemp.province);
        propertytemp.city = Base64.encode($(this).attr('data-name'));
        propertytemp.street = "";
        propertytemp.county = "";
        propertytemp.community = "";
        propertytemp.lift = "";
        sessionStorage.setItem("property", JSON.stringify(propertytemp));
        //区县
        county_ajax(province_data, city_data);
    });
//model省市
let Provinces_cities = (historydata) => {
    //如果historydata为null,定义为第一次进入首页。


    $.ajax({
        url: url + "MdeviceIfmweb/findRegionInfo",
        type: "get",
        success: function (data) {
            let provice = data.data.provice;
            let city = data.data.city;
            $("#column1").html('');
            provice.forEach((val, index, arr) => {
                $("#column1").append(
                    `<li id="${val.id}" data-name="${val.NAME}">
                        ${val.NAME}
                        <img src="img/右箭头.png" alt="" class="img_arrow">
                    </li>`
                )
            })
            $("#column1 li:even ").css('background', '#00293D');

            $('#column1 li').each(function () {
                if (historydata != null && historydata.province != undefined) {
                    var temp_province = Base64.decode(historydata.province);
                    var temp_city = Base64.decode(historydata.city);
                    var temp_county = Base64.decode(historydata.county);
                    var temp_street = Base64.decode(historydata.street);
                    var temp_community = Base64.decode(historydata.community);
                    var temp_lift = Base64.decode(historydata.lift);

                    if ($(this).attr("data-name") == temp_province) { //判断省份设置选中
                        $(this).hide();
                        let ids = $(this).attr('id');
                        $("#column2").html('');
                        $("#column3").html('');
                        $("#column4").html('');
                        $("#column5").html('');
                        $("#column6").html('');
                        $("#column1").prepend(
                            `<li id="${ids}" data-name="${temp_province}" class="colorsadd">
                                        ${temp_province}
                                        <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                    </li>`
                        )
                        // let filtecity = city.filter((val) => {
                        //     return val.id == ids
                        // })
                        // $("#column2").html('');
                        city.forEach((val) => {
                            if (val.id == ids && val.NAME != temp_city) {

                                //$(this).hide();
                                $("#column2").append(

                                    `<li id="${val.id}" data-name="${val.NAME}" >
                                             ${val.NAME}
                                            <img src="img/右箭头.png" alt="" class="img_arrow">
                                        </li>`
                                )
                             
                            }
                        });
                        
                        $("#column2 li:even").css('background', '#00293D');
                        
                        if (temp_city != '') { //市判断
                            //$("#column2").html('');

                            $("#column2").prepend(
                                `<li data-name="${temp_city}" class="colorsadd">
                                            ${temp_city}
                                            <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                        </li>`
                            )

                            if(temp_city != "" &&  $("#column3").html() =="" && temp_street == ""){
                                $("#column2 li").first().click();
                            }

                            if (temp_county != '') { //区县判断

                                $("#column3").prepend(
                                    `<li data-name="${temp_county}" class="colorsadd">
                                                ${temp_county}
                                                <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                            </li>`
                                );
                                county_ajax(temp_province, temp_city, temp_county,temp_street);
                            }

                            if (temp_street != "") { //街道


                                $("#column4").prepend(
                                    `<li data-name="${temp_street}" class="colorsadd">
                                                ${temp_street}
                                                <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                            </li>`
                                )
                                street_ajax(temp_province, temp_city, temp_county, temp_street,temp_community);

                            }

                            if (temp_community != "") { //小区


                                $("#column5").prepend(
                                    `<li data-name="${temp_community}" class="colorsadd">
                                                ${temp_community}
                                                <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                            </li>`
                                )
                                community_ajax(temp_province, temp_city, temp_county, temp_street, temp_community ,temp_lift);

                            }

                            if (temp_lift != "") { //电梯


                                $("#column6").prepend(
                                    `<li data-name="${temp_lift}" class="colorsadd">
                                                ${temp_lift}
                                                <img src="img/右箭头.png" alt="" class="img_arrow" style="display:block;">
                                            </li>`
                                )
                                lift_ajax(temp_province, temp_city, temp_county, temp_street, temp_community, temp_lift);

                            }
                        }

                    
                    }
                }

            })

            // if (temp_province == '') {
            //     $("#column2").html('')
            //     $("#column3").html('')
            //     $("#column4").html('')
            // }
            // province_data = temp_province;
            // city_data = temp_city;
            // county_data = temp_county;


            //选中省
            $('#column1 li').click(function () {
                city_data = '';
                county_data = '';
                street_data = '';
                community_data = '';
                lift_data = '';
                let ids = $(this).attr('id')
                $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
                $(this).find("img").show();
                $(this).siblings().find("img").hide();
                province_data = $(this).attr('data-name');
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.province = Base64.encode($(this).attr('data-name'));
                propertytemp.city = "";
                propertytemp.street = "";
                propertytemp.county = "";
                propertytemp.community = "";
                propertytemp.lift = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
                let filtecity = city.filter((val, idx, city) => {
                    return val.id == ids
                })
                $("#column2").html('');
                $("#column3").html('');
                $("#column4").html('');
                $("#column5").html('');
                $("#column6").html('');
                filtecity.forEach((val, index, arr) => {
                    $("#column2").append(
                        `<li id="${val.id}" data-name="${val.NAME}">
                            ${val.NAME}
                            <img src="img/右箭头.png" alt="" class="img_arrow">
                        </li>`
                    )
                })
                $("#column2 li:even ").css('background', '#00293D');
           
            })
        },
        error: function () {}
    });


}

//区县
let county_ajax = (province_data, city_data, temp,temp1) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data,
        type: "get",
        success: function (data) {
            let district = data.data.district;
            //$("#column3").html('');
            //$("#column4").html('');
            //$("#column5").html('');
            //$("#column6").html('');
            district.forEach((val) => {
                if (val.name != temp) {
                    $("#column3").append(
                        `<li id="${val.id}" data-name="${val.name}">
                            ${val.name}
                            <img src="img/右箭头.png" alt="" class="img_arrow">
                        </li>`
                    )
                }

            })

            //选中区县
            $('#column3 li').click(function () {

                $("#column4").html('');
                $("#column5").html('');
                $("#column6").html('');
                street_data = '';
                community_data = '';
                lift_data = '';
                let ids = $(this).attr('id')
                $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
                $(this).find("img").show()
                $(this).siblings().find("img").hide()
                county_data = $(this).attr('data-name');
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.county = Base64.encode($(this).attr('data-name'));
                propertytemp.community = "";
                propertytemp.street = "";
                propertytemp.lift = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
                //区县
                street_ajax(province_data, city_data, county_data);
            })
            $("#column3 li:even ").css('background', '#00293D');
            if(temp != "" &&  $("#column4").html() =="" && temp1 == ""){
                $("#column3 li").first().click();
            }
        },
        error: function () {}
    });
}

//街道
let street_ajax = (province_data, city_data, county_data, temp,temp1) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data,
        type: "get",
        success: function (data) {
            let street = data.data.street;
            //$("#column4").html('');
            //$("#column5").html('');
            //$("#column6").html('');
            street.forEach((val) => {
                if (val.name != temp) {
                    $("#column4").append(
                        `<li id="${val.id}" data-name="${val.name}">
                            ${val.name}
                            <img src="img/右箭头.png" alt="" class="img_arrow">
                        </li>`
                    )
                }

            })

            //选中街道
            $('#column4 li').click(function () {
                $("#confirm").html("确定").css("width","80px");;
                $("#column5").html('');
                $("#column6").html('');
                community_data = '';
                lift_data = '';
                let ids = $(this).attr('id')
                $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
                $(this).find("img").show()
                $(this).siblings().find("img").hide()
                street_data = $(this).attr('data-name');
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.street = Base64.encode($(this).attr('data-name'));
                propertytemp.community = "";
                propertytemp.lift = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
                community_ajax(province_data, city_data, county_data, street_data)
            })
            $("#column4 li:even ").css('background', '#00293D');
            
            if(temp != "" &&  $("#column5").html() ==""&& temp1 == ""){
                $("#column4 li").first().click();
            }
        },
        error: function () {}
    });
}

//小区
let community_ajax = (province_data, city_data, county_data, street_data, temp,temp1) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data + '/' + street_data,
        type: "get",
        success: function (data) {
            let community = data.data.community;
            // $("#column5").html('');
            // $("#column6").html('');
            community.forEach((val) => {
                if (val.name != temp) {
                    $("#column5").append(
                        `<li id="${val.id}" data-name="${val.name}">
                        ${val.name}
                        <img src="img/右箭头.png" alt="" class="img_arrow">
                    </li>`
                    )
                }
            })

            //选中小区
            $('#column5 li').click(function () {
                $("#column6").html('');
                lift_data = '';
                let ids = $(this).attr('id');
                $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
                $(this).find("img").show()
                $(this).siblings().find("img").hide()
                community_data = $(this).attr('data-name');
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.community = Base64.encode($(this).attr('data-name'));
                propertytemp.lift = "";
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
                lift_ajax(province_data, city_data, county_data, street_data, community_data)
            })
            $("#column5 li:even ").css('background', '#00293D');

            if(temp != "" &&  $("#column6").html() ==""&& temp1 == ""){
                $("#column5 li").first().click();
            }
        },
        error: function () {}
    });
}

//电梯
let lift_ajax = (province_data, city_data, county_data, street_data, community_data, temp) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findRegionInfo/" + province_data + '/' + city_data + '/' + county_data + '/' + street_data + '/' + community_data,
        type: "get",
        success: function (data) {
          
            let name = data.data.name;

            name.forEach((val) => {
                if (val.name != temp) {
                    $("#column6").append(
                        `<li id="${val.id}" data-name="${val.name}">
                            ${val.name}
                        </li>`
                    )
                }

            })
            $('#column6 li').click(function () {
                let ids = $(this).attr('id')
                $(this).addClass("colorsadd").siblings().removeClass("colorsadd");
                $(this).find("img").show()
                $(this).siblings().find("img").hide();
                var propertytemp = JSON.parse(sessionStorage.getItem("property"));
                propertytemp.lift = Base64.encode($(this).attr('data-name'));
                sessionStorage.setItem("property", JSON.stringify(propertytemp));
                lift_data = $(this).attr('data-name');

                href_lift_id = ids;
            })
            $("#column6 li:even ").css('background', '#00293D');

           
        },
        error: function () {}
    });
}
