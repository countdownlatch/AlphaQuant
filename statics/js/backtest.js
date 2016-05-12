var task_id = $("#back_task_id").val();
getBacktestInfo(task_id)
getPolicyResult(task_id,1)
var time = [];
var stock_price = [];
var b = [];
var c = [];

function getBacktestInfo(taskId){
    $.ajax({
        type: "POST",
        url: "/getBacktestInfo/",
        data: {
            taskId: taskId,
        },
        success: function (task) {
            $("#beginTime").text(task.beginTime);
            $("#endTime").text(task.endTime);
            $("#money").text("￥"+task.money);
            $("#rate").text(task.rate);
            $("#policyTitle").val(task.policy_name);
        }
    });
}

function getPolicyResult(taskId,offset){
    $.ajax({
        type: "POST",
        url: "/getPolicyResult/",
        data: {
            taskId:taskId,
            offset:offset,
        },
        success:function(result){
            if(result=='not exist'){
                setTimeout( getPolicyResult(taskId,offset),1000);
            }
            else{
                finish_flag = result.finish_flag;
                time = time.concat(result.time);
                stock_price = stock_price.concat(result.stock_price);
                b = b.concat(result.b);
                c = c.concat(result.c);
                if(finish_flag != 1){
                    offset = offset + 1;
                    getPolicyResult(taskId,offset)
                }else{

                   // $('#log_info').html(result.log);
                    $('#backtest_chats').highcharts({                   //图表展示容器，与div的id保持一致
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
                     $("#status").text(" 回测完成");
                }

            }

        }
    });

}