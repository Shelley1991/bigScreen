const url = 'http://www.zaagtech-inc.com:61010/monitorsDemo/';
// const url = 'http://192.168.1.186:8080/';

/* 截取URL参数值 */
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//数字三位加逗号 + 单位判断
function addCommas(nStr, obj) {
    var conts = interception2(nStr).split(',');
    var nStr = conts[0]
    var unit = conts[1]
    $("#" + obj).html(unit);
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//截取字符串
function interception2(num) {
    var arrs = ['', '千', '百万', '十亿', '亿亿', ];
    var nums = Math.floor(num).toString().length
    len = 0
    while (nums > 6) {
        nums -= 3
        len += 1
        num = num.toString().substring(0, nums);
    }
    var unit = arrs[len]
    return num + ',' + unit
}

//数字三位加逗号
function thousands(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//单位判断 + 保留2位小数
function nums(Num, obj) {
    if (Num == undefined) {
        return;
    }
    var arrs = ['', '万', '亿', ];
    let len = Num.toString().length;
    if (len < 5) {
        return Num
    }
    if (len >= 5 && len < 7) {
        $("#" + obj).html('万');
        return (Num / 10000).toFixed(2);
    }
    if (len >= 7 && len < 9) {
        $("#" + obj).html('万');
        return (Num / 10000).toFixed(0);
    }
    if (len >= 9 && len < 11) {
        $("#" + obj).html('亿');
        return (Num / 100000000).toFixed(2);
    }
    if (len >= 11) {
        $("#" + obj).html('亿');
        return (Num / 100000000).toFixed(0);
    }
}


var d = new Date();
var y = d.getFullYear();
var m = d.getMonth() + 1;
var ds = d.getDate();
if (ds <= 9) {
    ds = '0' + ds;
}
var h = d.getHours();
if (h <= 9) {
    h = '0' + h;
}
var f = d.getMinutes();
if (f <= 9) {
    f = '0' + f;
}
var s = d.getSeconds();
if (s <= 9) {
    s = '0' + s;
}
var days = d.getDay();

switch (days) {
    case 1:
        days = '星期一';
        break;
    case 2:
        days = '星期二';
        break;
    case 3:
        days = '星期三';
        break;
    case 4:
        days = '星期四';
        break;
    case 5:
        days = '星期五';
        break;
    case 6:
        days = '星期六';
        break;
    case 0:
        days = '星期日';
        break;

}
// y + '-' + m + '-' + ds + ' ' +
$("#timeOne").html(h + ':' + f + ':' + s + ' ');
$("#timeTwo").html(y + '.' + m + '.' + ds + ' ' + days);