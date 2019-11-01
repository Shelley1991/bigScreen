const layer = layui.layer; //layui初始化
const form = layui.form;
const myChart1Color = ['#E78AB4', '#BF3273', '#AA2D6F', '#892557', '#681D48']; //环形图颜色
const myChart2Color = ['#D39863', '#BF7F32', '#AA712D', '#895925', '#68421D'];
let ProvinceName = 'all';
let page = 1; //页数；
let totalpage = 0; //总页数
let parameter = 'all/all'
$(function() {
    let myChart1 = echarts.init(document.getElementById('ring'));
    let myChart2 = echarts.init(document.getElementById('maint'));
    let myChart3 = echarts.init(document.getElementById('map'));
    pie(myChart1, myChart1Color, 1); //环形图
    pie(myChart2, myChart2Color, 2);

    window.addEventListener("resize", function() {
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
    });

    equipment() //设备+地图顶部+设备左边数据
    health() // 故障详情
    realTime() //故障实时信息

    //故障信息滚动特效
    let $this = $("#tables");
    let scrollTimer;
    $this.hover(function() {
        clearInterval(scrollTimer);
    }, function() {
        scrollTimer = setInterval(function() {
            scrollNews($this);
        }, 2000);
    }).trigger("mouseout");


    //身份判断
    if (identity == 'government') {
        $("#map1").show(); //地图区域显示
        $("#map2").hide();
        $("#area-open").show();

        for (var i = 0; i < mydata.length; i++) {
            mydata[i].value = Math.round(Math.random() * 200);
        }
        map('china.json', 'china', myChart3); //初始化全国地图

        //单击切换到省级地图，当mapCode有值,说明可以切换到下级地图
        myChart3.on('click', function(params) {
            $("#backmap").show();
            let name = params.name; //地区name
            if (isTopMap == 0) { //点击市弹窗
                model(); //打开模态框
                parameter = name + '/市';
                fn = true;
                select_province();
                setTimeout(() => {
                    maps_select(name);
                }, 100);
                Suspension_table();
                return;
            }
            ProvinceName = name;
            let mapCode = provinces[name]; //地区的json数据
            if (!mapCode) {
                return;
            }
            map(mapCode, name, myChart3);
        });
        //返回全国地图
        $("#backmap").on('click', function(params) {
            ProvinceName = 'pro';
            $("#backmap").hide();
            //返回全国地图
            map('china.json', 'china', myChart3);
        });

        //打开模态框
        $("#area-open").click(() => {
            model();
            select_province();
            Suspension_table(parameter)
        })

        //下拉框监听
        $("#pro").change(() => { //省
            let pro_name = $("#pro option:selected").val()
            page = 1;
            if (pro_name == '全国') {
                parameter = 'all/all'
            } else {
                parameter = pro_name + '/省';
            }
            select_city(pro_name)
            Suspension_table() //table


        })
        $("#cty").change(() => { //市
            let cty_name = $("#cty option:selected").val()
            page = 1;
            if (cty_name == '全省') {
                parameter = 'all/all'
            } else {
                parameter = cty_name + '/市';
            }
            select_county(cty_name)
            Suspension_table() //table
        })

        // $("#county").change(() => { //区
        //     let county_name = $("#county option:selected").val()
        //     Suspension_table(county_name) //table
        // })

    } else if (identity == 'enterprise') {
        $("#map1").hide(); //地图区域隐藏
        $("#map2").show();
        $("#area-open").hide();
        $("#details").removeClass('special')

        select_province(); //下拉框
        map_table() //table

        //下拉框监听
        $("#pro2").change(() => { //省
            let pro2_name = $("#pro2 option:selected").val()
            if (pro2_name == '全国') {
                parameter = 'all/all'
            } else {
                parameter = pro2_name + '/省';
            }
            console.log(parameter)
            select_city(pro2_name)
            map_table()


        })
        $("#cty2").change(() => { //市
            let cty2_name = $("#cty2 option:selected").val()
            if (cty2_name == '全省') {
                parameter = 'all/all'
            } else {
                parameter = cty2_name + '/市';
            }
            select_county(cty2_name)
            map_table()
        })

        // $("#county").change(() => { //区
        //     let county_name = $("#county option:selected").val()
        //     Suspension_table(county_name) //table
        // })
    }

})




//故障信息滚动特效
let scrollNews = (obj) => {
    let $self = obj.find("ul:first");
    let lineHeight = $self.find("li:first").height();
    $self.animate({ "margin-top": -lineHeight + "px" }, 600, function() {
        $self.css({ "margin-top": "0px" }).find("li:first").appendTo($self);
    })
}

//模态框
let model = () => {
    layer.open({
        type: 1, //类型
        anim: 4, //弹出动画
        shade: 0.7, //遮罩层的透明度
        area: ['500px', '550px'], //定义宽和高'35%', '60%'
        title: ' ', //题目
        extend: 'css/index.css',
        skin: 'model',
        shadeClose: true, //点击遮罩层关闭
        content: $('#model') //打开的内容
    });
}

//设备+地图顶部
let equipment = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByPopulationInfo", //请求的服务端地址
        type: "get",
        success: function(data) {
            let leftdate = data.data.leftdate[0];
            let centerdate = data.data.centerdate[0];
            let leftdate2 = data.data.leftdate2[0];
            //设备
            $("#breakdown").html(leftdate.breakdown);
            $("#floorp").html(leftdate.floorp);
            $("#mfrequency").html(leftdate.mfrequency);
            $("#mprice").html((leftdate.mprice / 100000000).toFixed(2));
            if (identity == 'government') {
                //地图顶部
                $("#test1").runNum(centerdate.provincec);
                $("#test2").runNum(centerdate.city);
                $("#test3").runNum(centerdate.run);
                $("#test4").runNum(centerdate.breakdown);
                $("#test5").runNum(Math.round(centerdate.price / 100000000));
            } else if (identity == 'enterprise') {
                $("#Manufacturer").html(leftdate2.Manufacturer);
                $("#Maintenance").html(leftdate2.Maintenance);
                $("#village").html(leftdate2.village);
                $("#Number").html(leftdate2.Number);
            }
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

// 隐患详情
let health = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/FindByStateInfo", //请求的服务端地址
        type: "get",
        success: function(data) {
            let trouble1arr = [];
            trouble1arr.push(data.data.rows.name0)
            trouble1arr.push(data.data.rows.name3)
            trouble1arr.push(data.data.rows.name1)
            trouble1arr.push(data.data.rows.name2)
            let maxnum = Math.max.apply(null, trouble1arr); //最大值
            let avgs = Math.ceil(maxnum / 8 * 10);
            let proportion1 = Math.ceil((data.data.rows.name0 / avgs) * 100) + '%'
            let proportion2 = Math.ceil((data.data.rows.name3 / avgs) * 100) + '%'
            let proportion3 = Math.ceil((data.data.rows.name1 / avgs) * 100) + '%'
            let proportion4 = Math.ceil((data.data.rows.name2 / avgs) * 100) + '%'
            $("#proportion1 div").css({ "width": proportion1 });
            $("#proportion2 div").css({ "width": proportion2 });
            $("#proportion3 div").css({ "width": proportion3 });
            $("#proportion4 div").css({ "width": proportion4 });
            $("#trouble1").html(data.data.rows.name0);
            $("#trouble2").html(data.data.rows.name3);
            $("#trouble3").html(data.data.rows.name1);
            $("#trouble4").html(data.data.rows.name2);
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//隐患实时信息
let realTime = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByHiddenNameInfo", //请求的服务端地址
        type: "get",
        success: function(data) {
            let realTimedate = data.data;
            realTimedate.forEach((val, index, arr) => {
                let valProvince = val.province;
                if (val.province == null) {
                    valProvince = '暂无位置';
                }
                $("#fault-content-ul").append(
                    `<li class="fl flexR"  id="${val.ident}">
                        <div class="flex1 tb">${val.name}</div>
                        <div class="flex1 tb">${valProvince}</div>
                        <div class="flex1 tb">${val.status}</div>
                    </li>`
                )
            })

            //跳转子页面
            $('#fault-content-ul li').each(function() {
                $(this).click(function() {
                    let ids = $(this).attr('id')
                    location.href = "survey.html?deviceID=" + ids;
                })
            })

            //隔行变色
            $("#tables li:even").css('background-color', '#242A32');
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//电梯环形图
let pie = (obj, color, num) => {
    $.ajax({
        url: url + "MdeviceIfmweb/FindByHiddenZhanBiInfo", //请求的服务端地址
        type: "get",
        success: function(data) {
            let datas = '';
            let eMaintenance = data.data.guzhang; //故障
            let eBrand = data.data.yinhuan; //隐患
            if (num == 1) {
                datas = eMaintenance;
            } else if (num == 2) {
                datas = eBrand;
            }
            option = {
                color: color,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}<br/>{c}({d}%)"
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['20%', '45%'],
                    center: ['55%', '45%'],
                    data: datas.sort(function(a, b) { return b.value - a.value; }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff',
                                fontSize: '14px',
                            },
                            formatter: '{b}:\n{c}({d}%)'
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 100;
                    }
                }]
            };
            obj.setOption(option);
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

let isTopMap = 1;
//地图
let map = (mapCode, name, myChart3) => {
    $.get(mapCode, function(data) {
        if (data) {
            echarts.registerMap(name, data);
            if (name != 'china') {
                let provincedatas = data.features.map((val, idx, features) => {
                    let json = {}
                    let ar = []
                    json.name = val.properties.name;
                    json.value = val.properties.cp;
                    return json;
                })
                isTopMap = 0;
                ProvinceOne(name, myChart3, provincedatas); //单个省份地图
            } else {
                isTopMap = 1;
                chinas(name, myChart3); //全国地图
            }
        } else {
            alert('无法加载该地图');
        }
    });
}

let convertData = function(data) {
    var res = [];
    for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].sname];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                sname: data[i].sname,
                value: geoCoord.concat(data[i].value),
                shichang: data[i].shichang,
                juli: data[i].juli,
            });
        }
    }
    return res;
};

//全国地图
let chinas = (name, myChart3) => {
    $.ajax({
        url: url + "MdeviceIfmweb/FindByMapInfo/all", //请求的服务端地址
        type: "get",
        success: function(data) {
            let datas = data.data;
            for (let x = 0; x < datas.length; x++) {
                for (let y = 0; y < mydatas.length; y++) {
                    mydatas[y].shichang = 0;
                    mydatas[y].juli = 0;
                    if (datas[x].name == mydatas[y].name) {
                        mydatas[y].value = datas[x].value
                        mydatas[y].shichang = datas[x].totalt;
                        mydatas[y].juli = datas[x].totalk;
                        continue;
                    }
                }
            }
            var option = {
                tooltip: {
                    padding: 0,
                    transitionDuration: 1,
                    textStyle: {
                        color: '#fff',
                        decoration: 'none',
                    },
                    // trigger: 'item',
                    // show: true,
                    formatter: (params) => {
                        let tipHtml = '';
                        tipHtml =
                            `<div style="width:200px;height:130px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
                                <div style="font-size:16px;margin-bottom:15px;">|&nbsp;${params.data.name}</div>
                                <div style="color:#fff;font-size:14px;">
                                    <div style="width:0;height:0; border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:14px solid #636FD3;float:left;margin:4px 10px 0 0;"></div>
                                    <div style="float: left;">设备量（台）:</div>
                                    <div style="float: right;">${params.data.value}</div>
                                </div>
                            </div>`
                        return tipHtml;
                    },
                },
                //左侧小导航图标
                visualMap: {
                    show: true,
                    bottom: '0%',
                    left: '3%',
                    max: '1000',
                    calculable: true,
                    seriesIndex: [0], //series执行顺序
                    textStyle: {
                        color: '#fff',
                    },
                    inRange: {
                        color: ['#2F1965', '#A697D3', ]
                    },
                },
                geo: {
                    zoom: 1.2,
                    map: name,
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
                            areaColor: '#976CFF',
                            borderColor: '#A697D3',
                        },
                        emphasis: {
                            areaColor: '#976CFF',
                        }
                    },

                },
                series: [{
                        name: '数据',
                        type: 'map',
                        geoIndex: 0,
                        mapType: name,
                        data: mydatas,
                        itemStyle: {
                            normal: {
                                color: '#fff',
                            },
                        },
                    },
                    {
                        name: '散点',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(mydatas),
                        symbolSize: function(val) {
                            let paos = 0;
                            if (val[2] == 0) {
                                paos = 0;
                            } else if (val[2] > 0 && val[2] <= 500) {
                                paos = 5;
                            } else if (val[2] > 500 && val[2] <= 5000) {
                                paos = 10;
                            } else if (val[2] > 5000) {
                                paos = 15;
                            }
                            return paos;
                        },
                        tooltip: {
                            formatter: (params) => {
                                let tipHtml = '';
                                tipHtml =
                                    `<div style="width:200px;height:130px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
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
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff'
                            }
                        }
                    },
                    {
                        name: '点', //气泡
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin', //气泡
                        symbolSize: function(val) {
                            let paos = 0;
                            if (val[2] == 0) {
                                paos = 0;
                            } else if (val[2] > 0 && val[2] <= 500) {
                                paos = 25;
                            } else if (val[2] > 500 && val[2] <= 5000) {
                                paos = 30;
                            } else if (val[2] > 5000) {
                                paos = 40;
                            }
                            return paos;
                        },
                        tooltip: {
                            formatter: (params) => {
                                let tipHtml = '';
                                tipHtml =
                                    `<div style="width:200px;height:130px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
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
                        label: { //气泡里面的 内容属性
                            normal: {
                                formatter: (params) => {
                                    return params.data.value[2]
                                },
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 8,
                                    fontFamily: 'Arial',
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#00B4D6', //气泡标志颜色
                            }
                        },
                        zlevel: 6,
                        data: convertData(mydatas),
                    },
                    {
                        name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(mydatas.sort(function(a, b) {
                            return b.value - a.value;
                        }).slice(0, 10)),
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        tooltip: {
                            formatter: (params) => {
                                let tipHtml = '';
                                tipHtml =
                                    `<div style="width:200px;height:130px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
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
                                formatter: '{b}',
                                position: 'left',
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                shadowBlur: 20,
                                shadowColor: '#fff'
                            }
                        },
                    }
                ]
            };
            myChart3.setOption(option, true)
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//单个省份地图
let ProvinceOne = (name, myChart3, provincedatas) => {
    $.ajax({
        url: url + "MInformation/FindProOrCityInfo/" + ProvinceName, //请求的服务端地址
        type: "get",
        success: function(data) {
            if (data.data.length != 0) {
                let da = data.data;
                for (let a = 0; a < provincedatas.length; a++) {
                    for (let b = 0; b < da.length; b++) {
                        if (da[b].name == provincedatas[a].name) {
                            provincedatas[a].value.push(da[b].value)
                            continue;
                        }
                    }
                }
            }
            var options = {
                tooltip: {
                    padding: 0,
                    transitionDuration: 1,
                    textStyle: {
                        color: '#fff',
                        decoration: 'none',
                    },
                    formatter: (params) => {
                        let tipHtml = '';
                        tipHtml =
                            `<div style="width:200px;height:60px;border-radius:5px;background:rgba(51,51,51,0.2);color:#fff;padding:20px;">
                                <div style="font-size:16px;margin-bottom:15px;">|&nbsp;${params.data.name}</div>
                                <div style="color:#fff;font-size:14px;">
                                    <div style="width:0;height:0; border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:14px solid #636FD3;float:left;margin:4px 10px 0 0;"></div>
                                    <div style="float: left;">设备量（台）:</div>
                                    <div style="float: right;">${params.data.value}</div>
                                </div>
                            </div>`
                        return tipHtml;
                    },
                    show: true,
                },
                //左侧小导航图标
                visualMap: {
                    show: true,
                    bottom: '0%',
                    left: '3%',
                    max: '500',
                    calculable: true,
                    seriesIndex: [0], //series执行顺序
                    textStyle: {
                        color: '#fff',
                    },
                    inRange: {
                        color: ['#2F1965', '#A697D3', ]
                    },
                },
                geo: {
                    zoom: 1.1,
                    map: name,
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
                            areaColor: '#976CFF',
                            borderColor: '#A697D3',
                        },
                        emphasis: {
                            areaColor: '#976CFF',
                        }
                    },

                },
                series: [{
                        name: '市',
                        type: 'map',
                        geoIndex: 0,
                        mapType: name,
                        label: {
                            normal: { //默认效果配置
                                show: true,
                            },
                            emphasis: { //鼠标放上去效果配置
                                show: true,
                            },
                            // formatter: '{b}',
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff',
                            },
                        },
                        data: data.data,
                    },
                    {
                        name: '散点',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: provincedatas,
                        symbolSize: function(val) {
                            let paos = 0;
                            if (val[2] == 0) {
                                paos = 0;
                            } else if (val[2] > 0 && val[2] <= 100) {
                                paos = 5;
                            } else if (val[2] > 100 && val[2] <= 1000) {
                                paos = 10;
                            } else if (val[2] > 1000) {
                                paos = 15;
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
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                shadowBlur: 20,
                                shadowColor: '#fff'
                            }
                        },
                    },
                    {
                        name: '点', //气泡
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin', //气泡
                        symbolSize: function(val) {
                            let paos = 0;
                            if (val[2] == 0) {
                                paos = 0;
                            } else if (val[2] > 0 && val[2] <= 20) {
                                paos = 25;
                            } else if (val[2] > 20 && val[2] <= 30) {
                                paos = 30;
                            } else if (val[2] > 30) {
                                paos = 40;
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
                        label: { //气泡里面的 内容属性
                            normal: {
                                formatter: (params) => {
                                    return params.data.value[2]
                                },
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 8,
                                    fontFamily: 'Arial',
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#00B4D6', //气泡标志颜色
                            }
                        },
                        zlevel: 6,
                        data: provincedatas,
                    },
                    {
                        name: '', //散点
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: provincedatas.sort(function(a, b) {
                            return b.value - a.value;
                        }).slice(0, 10),
                        symbolSize: function(val) {
                            let paos = 0;
                            if (val[2] == 0) {
                                paos = 0;
                            } else if (val[2] > 0 && val[2] <= 100) {
                                paos = 5;
                            } else if (val[2] > 100 && val[2] <= 1000) {
                                paos = 10;
                            } else if (val[2] > 1000) {
                                paos = 15;
                            }
                            return paos;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
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
                                formatter: '{b}',
                                position: 'left',
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                shadowBlur: 20,
                                shadowColor: '#fff'
                            }
                        },
                    }
                ]
            };
            myChart3.setOption(options, true)
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//下拉框
let select_province = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByMapsInfo/all/all", //请求的服务端地址
        type: "get",
        success: function(data) {
            $("#pro").html('');
            $("#cty").html('');
            $("#county").html('');
            data.data.forEach((val, idx, arr) => {
                let zan = val.province
                if (val.province == '暂无位置信息') {
                    zan = '全国'
                }
                if (identity == 'government') {
                    $("#pro").append(`<option value="${zan}">${zan}</option>`)
                } else if (identity == 'enterprise') {
                    $("#pro2").append(`<option value="${zan}">${zan}</option>`)
                }

            })

        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//悬浮框-获取市
let select_city = (obj) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByMapsInfo/" + obj + '/市', //请求的服务端地址
        type: "get",
        success: function(data) {
            if (identity == 'government') {
                $("#cty").html('');
                $("#county").html('');
                $("#cty").append(`<option value="全省">全省</option>`)
                $("#county").append(`<option value="全市">全市</option>`)
            } else if (identity == 'enterprise') {
                $("#cty2").html('');
                $("#county2").html('');
                $("#cty2").append(`<option value="全省">全省</option>`)
                $("#county2").append(`<option value="全市">全市</option>`)
            }
            data.data.forEach((val, idx, arr) => {
                if (identity == 'government') {
                    $("#cty").append(`<option value="${val.city}">${val.city}</option>`)
                    $("#county").append(`<option value="${val.district}">${val.district}</option>`)
                } else if (identity == 'enterprise') {
                    $("#cty2").append(`<option value="${val.city}">${val.city}</option>`)
                    $("#county2").append(`<option value="${val.district}">${val.district}</option>`)
                }

            })
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//悬浮框-获取县区
let select_county = (obj) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByMapsInfo/" + obj + '/区', //请求的服务端地址
        type: "get",
        success: function(data) {
            if (identity == 'government') {
                $("#county").html('')
                $("#county").append(`<option value="全市">全市</option>`)
            } else if (identity == 'enterprise') {
                $("#county2").html('')
                $("#county2").append(`<option value="全市">全市</option>`)
            }
            data.data.forEach((val, idx, arr) => {
                if (identity == 'government') {
                    $("#county").append(`<option value="${val.district}">${val.district}</option>`)
                } else if (identity == 'enterprise') {
                    $("#county2").append(`<option value="${val.district}">${val.district}</option>`)
                }

            })
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//地图 悬浮框-select
let maps_select = (obj) => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByMapsInfo/" + obj + '/区', //请求的服务端地址
        type: "get",
        success: function(data) {
            $("#cty").html('')
            $("#county").html('')
            $("#cty").append(`<option value="全省">全省</option>`)
            $("#county").append(`<option value="全市">全市</option>`)
            data.data.forEach((val, idx, arr) => {
                $("#cty").append(`<option value="${val.city}" selected>${val.city}</option>`)
                $("#county").append(`<option value="${val.district}">${val.district}</option>`)
                $("#pro option[value= '" + val.province + "']").attr("selected", "selected");
            })
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}

//悬浮框table
let Suspension_table = () => {
    $.ajax({
        url: url + "MdeviceIfmweb/findByArrdessInfo/" + parameter + '/' + page, //请求的服务端地址
        type: "get",
        success: function(data) {
            let tabledate = data.data.rows;
            totalpage = data.data.totalpage; //总页数
            $("#model-tb-ul").html('');
            tabledate.forEach((val, index, arr) => {
                $("#model-tb-ul").append(
                    `<li class="flexR" id="${val.ident}">
                        <div class="flex1 tb">${val.name}</div>
                        <div class="flex1 tb">${val.status}</div>
                        <div class="flex1 tb">${val.create_time}</div>
                    </li>`
                )
            })

            //跳转子页面
            $('#model-tb-ul li').each(function() {
                $(this).click(function() {
                    let ids = $(this).attr('id')
                    location.href = "survey.html?deviceID=" + ids;
                })
            })

            //隔行换色
            $("#model-tb ul li:odd").css('background-color', 'rgba(24,30,40,0.3)');
            if (fuck == 0) {
                Pages() //分页
            } else {
                fuck--;
            }
        },
        error: function() {
            alert('error'); //错误的处理
        }
    });
}
let fuck = 0;
//分页
let Pages = () => {
    $("#page_div").paging({
        pageNo: 1,
        totalPage: totalpage,
        callback: function(num) {
            page = num;
            fuck++;
            Suspension_table()
        }
    })
}

//地图table
let map_table = () => {
        $.ajax({
            url: url + "MdeviceIfmweb/findByArrdessInfos2/" + parameter, //请求的服务端地址
            type: "get",
            success: function(data) {
                let tabledate2 = data.data;
                $("#equipment-ul-tb").html('');
                tabledate2.forEach((val, index, arr) => {
                    let icon = 'img/组件-当前状态-图标备份-2.png';
                    if (val.icon == 0) {
                        icon = 'img/组件-当前状态-图标备份-2.png';
                    } else if (val.icon == 1) {
                        icon = 'img/组件-当前状态-图标备份-6.png';
                    }
                    $("#equipment-ul-tb").append(
                        `<li class="flexR"  id="${val.ident}">
                                <div class="flex1 tb mark-son">
                                    <img src="${icon}" alt="" class="stateimg">
                                </div>
                                <div class="flex2 tb">${val.name}</div>
                                <div class="flex2 tb">${val.create_time}</div>
                        </li>`
                    )
                })

                //跳转子页面
                $('#equipment-ul-tb li').each(function() {
                    $(this).click(function() {
                        let ids = $(this).attr('id')
                        location.href = "survey.html?deviceID=" + ids;
                    })
                })

                //隔行换色
                $("#equipment-tb ul li:even").css('background-color', 'rgba(110,113,119,0.2)');
            },
            error: function() {
                alert('error'); //错误的处理
            }
        });
    }
    //随机数
let randomData = () => {
    return Math.round(Math.random() * 200);
}

var mydatas = [
    { name: '北京市', value: 0, sname: '北京' }, { name: '天津市', value: 0, sname: '天津' },
    { name: '上海市', value: 0, sname: '上海' },
    { name: '重庆市', value: 0, sname: '重庆' },
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
];

var provinces = {
    '上海市': 'province/shanghai.json',
    '河北省': 'province/hebei.json',
    '山西省': 'province/shanxi.json',
    '内蒙古自治区': 'province/neimenggu.json',
    '辽宁省': 'province/liaoning.json',
    '吉林省': 'province/jilin.json',
    '黑龙江省': 'province/heilongjiang.json',
    '江苏省': 'province/jiangsu.json',
    '浙江省': 'province/zhejiang.json',
    '安徽省': 'province/anhui.json',
    '福建省': 'province/fujian.json',
    '江西省': 'province/jiangxi.json',
    '山东省': 'province/shandong.json',
    '河南省': 'province/henan.json',
    '湖北省': 'province/hubei.json',
    '湖南省': 'province/hunan.json',
    '广东省': 'province/guangdong.json',
    '广西壮族自治区': 'province/guangxi.json',
    '海南省': 'province/hainan.json',
    '四川省': 'province/sichuan.json',
    '贵州省': 'province/guizhou.json',
    '云南省': 'province/yunnan.json',
    '西藏自治区': 'province/xizang.json',
    '陕西省': 'province/shanxi1.json',
    '甘肃省': 'province/gansu.json',
    '青海省': 'province/qinghai.json',
    '宁夏回族自治区': 'province/ningxia.json',
    '新疆维吾尔自治区': 'province/xinjiang.json',
    '北京市': 'province/beijing.json',
    '天津市': 'province/tianjin.json',
    '重庆市': 'province/chongqing.json',
    '香港特别行政区': 'province/xianggang.json',
    '澳门特别行政区': 'province/aomen.json'
};
// 各省份的数据
var mydata = [{
    name: '北京市'
}, {
    name: '天津市'
}, {
    name: '上海市'
}, {
    name: '重庆市'
}, {
    name: '河北省'
}, {
    name: '河南省'
}, {
    name: '云南省'
}, {
    name: '辽宁省'
}, {
    name: '黑龙江省'
}, {
    name: '湖南省'
}, {
    name: '安徽省'
}, {
    name: '山东省'
}, {
    name: '新疆维吾尔自治区'
}, {
    name: '江苏省'
}, {
    name: '浙江省'
}, {
    name: '江西省'
}, {
    name: '湖北省'
}, {
    name: '广西壮族自治区'
}, {
    name: '甘肃省'
}, {
    name: '山西省'
}, {
    name: '内蒙古自治区'
}, {
    name: '陕西省'
}, {
    name: '吉林省'
}, {
    name: '福建省'
}, {
    name: '贵州省'
}, {
    name: '广东省'
}, {
    name: '青海省'
}, {
    name: '西藏自治区'
}, {
    name: '四川省'
}, {
    name: '宁夏回族自治区'
}, {
    name: '海南省'
}, {
    name: '台湾省'
}, {
    name: '香港特别行政区'
}, {
    name: '澳门特别行政区'
}];

var geoCoordMap = {
    '新疆': [86.61, 40.79],
    '西藏': [89.13, 30.66],
    '黑龙江': [128.34, 47.05],
    '吉林': [126.32, 43.38],
    '辽宁': [123.42, 41.29],
    '内蒙古': [112.17, 42.81],
    '北京': [116.40, 40.40],
    '宁夏': [106.27, 36.76],
    '山西': [111.95, 37.65],
    '河北': [115.21, 38.44],
    '天津': [117.04, 39.52],
    '青海': [97.07, 35.62],
    '甘肃': [103.82, 36.05],
    '山东': [118.01, 36.37],
    '陕西': [108.94, 34.46],
    '河南': [113.46, 34.25],
    '安徽': [117.28, 31.86],
    '江苏': [120.26, 32.54],
    '上海': [121.46, 31.28],
    '四川': [103.36, 30.65],
    '湖北': [112.29, 30.98],
    '浙江': [120.15, 29.28],
    '重庆': [107.51, 29.63],
    '湖南': [112.08, 27.79],
    '江西': [115.89, 27.97],
    '贵州': [106.91, 26.67],
    '福建': [118.31, 26.07],
    '云南': [101.71, 24.84],
    '台湾': [121.01, 23.54],
    '广西': [108.67, 23.68],
    '广东': [113.98, 22.82],
    '海南': [110.03, 19.33],
    '澳门': [113.54, 22.19],
    '香港': [114.17, 22.32],
};


//数字滚动特效
(function($) {
    /*jQuery瀵硅薄娣诲姞  runNum  鏂规硶*/
    $.fn.extend({
        /*
         *	婊氬姩鏁板瓧
         *	@ val 鍊硷紝	params 鍙傛暟瀵硅薄
         *	params{addMin(闅忔満鏈€灏忓€�),addMax(闅忔満鏈€澶у€�),interval(鍔ㄧ敾闂撮殧),speed(鍔ㄧ敾婊氬姩閫熷害),width(鍒楀),height(琛岄珮)}
         */
        runNum: function(val, params) {
            /*鍒濆鍖栧姩鐢诲弬鏁�*/
            var valString = val
            var par = params || {};
            var runNumJson = {
                el: $(this),
                value: valString,
                valueStr: valString.toString(10),
                height: par.height || 30,
                interval: par.interval || 3000,
                speed: par.speed || 1000,
                width: par.width || 17,
                length: valString.toString(10).length
            };
            $._runNum._list(runNumJson.el, runNumJson);
            $._runNum._interval(runNumJson.el.children("li"), runNumJson);
        }
    });
    /*jQuery瀵硅薄娣诲姞  _runNum  灞炴€�*/
    $._runNum = {
        /*鍒濆鍖栨暟瀛楀垪琛�*/
        _list: function(el, json) {
            var str = '';
            for (var i = 0; i < json.length; i++) {
                var w = json.width * i;
                var t = json.height * parseInt(json.valueStr[i]);
                var h = json.height * 10;
                str += '<li style="width:' + json.width + 'px;left:' + w + 'px;top:0px;height:' + h + 'px;">';
                for (var j = 0; j < 10; j++) {
                    str += '<div style="height:' + json.height + 'px;line-height:' + json.height + 'px;">' + j + '</div>';
                }
                str += '</li>';
            }
            el.html(str);
        },
        /*鎵ц鍔ㄧ敾鏁堟灉*/
        _animate: function(el, value, json) {
            for (var x = 0; x < json.length; x++) {
                var topPx = value[x] * json.height;
                el.eq(x).animate({ top: -topPx + 'px' }, json.speed);
            }
        },
        /*瀹氭湡鍒锋柊鍔ㄧ敾鍒楄〃*/
        _interval: function(el, json) {
            var val = json.value;
            $._runNum._animate(el, val.toString(10), json);
        }
    }
})(jQuery);