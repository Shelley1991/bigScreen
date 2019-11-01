//初始化示例
//$("#page").paging({
//	pageNo: 1,
//	totalPage: 10,
//	totalSize: 100,
//	callback: function(num) {
//		alert(num);
//	}
//})
(function($, window, document, undefined) {
    //定义分页类
    function Paging(element, options) {
        this.element = element;
        //传入形参
        this.options = {
            pageNo: options.pageNo || 1,
            totalPage: options.totalPage,
            totalSize: options.totalSize,
            callback: options.callback
        };
        //根据形参初始化分页html和css代码
        this.init();
    }
    //对Paging的实例对象添加公共的属性和方法
    Paging.prototype = {
        constructor: Paging,
        init: function() {
            this.creatHtml();
            this.bindEvent();
        },
        creatHtml: function() {
            var me = this;
            var content = "";
            var current = me.options.pageNo;
            var total = me.options.totalPage;
            var totalNum = me.options.totalSize;
            content += "<a id=\"firstPage\">首页</a><a id='prePage'>上一页</a>";
            //总页数大于6时候
            if (total > 6) {
                //当前页数小于5时显示省略号
                if (current < 5) {
                    for (var i = 1; i < 6; i++) {
                        if (current == i) {
                            content += "<a class='current'>" + i + "</a>";
                        } else {
                            content += "<a>" + i + "</a>";
                        }
                    }
                    content += ". . .";
                    content += "<a>" + total + "</a>";
                } else {
                    //判断页码在末尾的时候
                    if (current < total - 3) {
                        for (var i = current - 2; i < current + 3; i++) {
                            if (current == i) {
                                content += "<a class='current'>" + i + "</a>";
                            } else {
                                content += "<a>" + i + "</a>";
                            }
                        }
                        content += ". . .";
                        content += "<a>" + total + "</a>";
                        //页码在中间部分时候	
                    } else {
                        content += "<a>1</a>";
                        content += ". . .";
                        for (var i = total - 4; i < total + 1; i++) {
                            if (current == i) {
                                content += "<a class='current'>" + i + "</a>";
                            } else {
                                content += "<a>" + i + "</a>";
                            }
                        }
                    }
                }
                //页面总数小于6的时候
            } else {
                for (var i = 1; i < total + 1; i++) {
                    if (current == i) {
                        content += "<a class='current'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
            }
            content += "<a id='nextPage'>下一页</a>";
            content += "<a id=\"lastPage\">尾页</a>";
            content += '<input type="number" min="1" id="skipPageNum" style="width:45px;height:28px;border:1px solid #dce0e0!important;text-align:center;margin: 0 4px;cursor: pointer;line-height:28px;color:#0073A9;font-size: 13px;display:inline-block;"/><a id=\"skipPageBtn\" style="width:35px;height:28px;outline:none;border:none;background:#0073A9;color:#fff;">确定</a>';//跳转到
            content += "<span class='totalPages'> 共<span>" + total + "</span>页 </span>";
            content += "<span class='totalSize'> 共<span>" + totalNum + "</span>条记录 </span>";
            me.element.html(content);
        },
        //添加页面操作事件
        bindEvent: function() {
            var me = this;
            me.element.off('click', 'a');
            me.element.on('click', 'a', function() {
                var num = $(this).html();
                var id = $(this).attr("id");
                if (id == "prePage") {
                    if (me.options.pageNo == 1) {
                        me.options.pageNo = 1;
                    } else {
                        me.options.pageNo = +me.options.pageNo - 1;
                    }
                } else if (id == "nextPage") {
                    if (me.options.pageNo == me.options.totalPage) {
                        me.options.pageNo = me.options.totalPage
                    } else {
                        me.options.pageNo = +me.options.pageNo + 1;
                    }

                } else if (id == "firstPage") {
                    me.options.pageNo = 1;
                } else if (id == "lastPage") {
                    me.options.pageNo = me.options.totalPage;
                } else if (id == "skipPageBtn") {
                    if (this.previousElementSibling.value > 0 && this.previousElementSibling.value <= me.options.totalPage) {
                        me.options.pageNo = Number(this.previousElementSibling.value);
                    } else {
                        return;
                    }
                } else {
                    me.options.pageNo = +num;
                }
                me.creatHtml();
                if (me.options.callback) {
                    me.options.callback(me.options.pageNo);
                }
            });
        }
    };
    //通过jQuery对象初始化分页对象
    $.fn.paging = function(options) {
            return new Paging($(this), options);
        }
        //	$('body').append('<style> *{padding: 0;margin: 0;}.page_div {margin - top: 20 px;margin - bottom: 20 px;font - size: 15 px;font - family: "microsoft yahei";color: #666666;margin-right: 10px;padding-left: 20px;box-sizing: border-box;}.page_div a {min-width: 30px;height: 28px;border: 1px solid # dce0e0!important;text - align: center;margin: 0 4 px;cursor: pointer;line - height: 28 px;color: #666666;font-size: 13px;display: inline-block;}# firstPage, #lastPage {width: 50 px;color: #0073A9;border: 1px solid # 0073 A9!important;}#prePage, #nextPage {width: 70 px;color: #0073A9;border: 1px solid # 0073 A9!important;}.page_div.current {background - color: #0073A9;border-color: # 0073 A9;color: #FFFFFF;}.totalPages {margin: 0 10 px;}.totalPages span,.totalSize span {color: #0073A9;margin: 0 5px;}</style>');
    var styleNode = document.createElement("style");
    styleNode.type = "text/css";
    styleNode.innerHTML = '*{padding:0;margin:0;} .page_div{margin-top:20px;margin-bottom:20px;font-size:15px;font-family:"microsoft yahei";color:#666666;margin-right:10px;padding-left:20px;box-sizing:border-box;} .page_div a {min-width:30px;height:28px;border:0;text-align:center;margin: 0 4px;cursor: pointer;line-height:28px;color:#666666;font-size: 13px;display: inline-block;} #firstPage,#lastPage {width:50px;color: #0073A9;border: 1px solid #0073A9!important;}#prePage, #nextPage {width:70px;color:#0073A9;border:0;} .page_div .current{background-color: #0073A9;border-color:#0073A9;color:#FFFFFF;} .totalPages {margin:0 10px;} .totalPages span,.totalSize span {color:#0073A9;margin: 0 5px;}';
    //	styleNode.innerHTML = 'body{background:red;}';
    document.getElementsByTagName("head")[0].appendChild(styleNode);
})(jQuery, window, document);