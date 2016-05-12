/**
 * Created by Jerome on 2016/5/11.
 */

var editor = ace.edit("policy_editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/python");

var log_info = ace.edit('policy_ace_log_error')
log_info.setTheme("ace/theme/twilight");
log_info.setReadOnly(true);

$(function () {
    $('.datetimepicker').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',//选择完日期后，input框里的时间值的格式
        minView: 'month',
        endDate: new Date(),//结束日期时间，在此之后的都不可选，同理也有beigin
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
});

$(document).ready(function () {

    var policy_id = $("#policy_id").val();
    $("#saveBtn").click(function () {
        var content = editor.getValue();
        var name = $("#policyTitle").val();
        $.ajax({
            type: "POST",
            url: "/savePolicy/",
            data: {
                content: content,
                policy_id: policy_id,
                name: name,
            },
            success: function (data) {
                alert("保存成功");
            },
            error: function (jqXHR) {
                alert("发生错误：" + jqXHR.status);
            },
        });
    });

    $("#buildBtn").click(function () {
        time = [];
        stock_price = [];
        b = [];
        c = [];
        var company = $("#company").val();
        var beginTime = $("#beginTime").val();
        var endTime = $("#endTime").val();
        var money = $("#money").val();
        var rate = $("#rate").val();
        if (company == "") {
            alert("公司不能为空");
            return;
        }
        if (money == '') {
            alert("启动资金不能为空");
            return;
        }
        var parameter = company + ',' + beginTime + ',' + endTime + ',' + money + ',' + rate;
        $.ajax({
            type: "POST",
            url: "/buildPolicy/",
            data: {
                policy_id: policy_id,
                parameter: parameter,
            },
            // dataType: "json",
            success: function (taskId) {
                alert("编译成功");
                getPolicyResult(taskId, 1)
            },
            error: function (jqXHR) {
                alert("发生错误：" + jqXHR.status);
            },
        });
    });


});


var time = [];
var stock_price = [];
var b = [];
var c = [];
var log = [];

function getPolicyResult(taskId,offset){
    $.ajax({
        type: "POST",
        url: "/getPolicyResult/",
        data: {
            taskId:taskId,
            offset:offset,
        },
        success:function(result) {
            if (result == 'not exist') {
                setTimeout(function () {
                    getPolicyResult(taskId, offset)
                }, 1000);
            }
            else {
                finish_flag = result.finish_flag;
                time = time.concat(result.time);
                stock_price = stock_price.concat(result.stock_price);
                b = b.concat(result.b);
                c = c.concat(result.c);
                log = log.concat(result.log)
                if (finish_flag != 1) {
                    offset = offset + 1;
                    getPolicyResult(taskId, offset)
                } else {

                    $('#policy_result_chart').highcharts({                   //图表展示容器，与div的id保持一致
                        chart: {
                            type: 'line'                         //指定图表的类型，默认是折线图（line）
                        },
                        tooltip: {
                            crosshairs: true,     //数据显示
                            shared: true
                        },
                        title: {
                            text: ' Highcharts Demo'      //指定图表标题
                        },
                        xAxis: {
                            categories: time  //指定x轴分组
                        },
                        yAxis: {
                            title: {
                                text: 'something'                  //指定y轴的标题
                            }
                        },
                        series: [{                                 //指定数据列
                            name: '策略收益',                          //数据列名
                            data: b                   //数据
                        }, {
                            name: '基准收益',
                            data: c
                        },
                            /*{
                             name: 'stock_price',
                             data: a
                             }*/]
                    });
                    alert(log)
                    $('#policy_log').html((String)(log));
                    $.ajax({
                        type: "POST",
                        url: "/getResultInfo/",
                        data: {
                            taskId: taskId,
                        },
                        success: function (resultInfo) {
                            $("#strategy_return").text(resultInfo.strategy_return);
                            $("#basic_return").text(resultInfo.basic_return);
                            $("#alpha").text(resultInfo.alpha);
                            $("#beta").text(resultInfo.beta);
                            $("#sharp").text(resultInfo.sharp);
                            $("#maxdown").text(resultInfo.maxdown);

                        },
                        error: function(jqXHR){
                            alert("发生错误：" + jqXHR.status);
                        },


                    });

                }

            }
        }
    });

}

