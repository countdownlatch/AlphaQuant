/**
 * Created by Jerome on 2016/5/15.
 */
var editor = ace.edit("policy_editor");
$("#policy_editor").css("display", 'block');
document.getElementById('policy_editor').style.fontSize = $('#editor-fontsize').val() + 'px';
editor.setTheme("ace/theme/" + $('#editor-theme').val());
editor.getSession().setMode("ace/mode/python");
if ($('#editor-wropmode').val() == 'true') {
    editor.getSession().setUseWrapMode(true);  //支持代码折叠
}
else {
    editor.getSession().setUseWrapMode(false);  //支持代码折叠
}
//代码提示
// ace.require("ace/ext/language_tools");
// editor.setOptions({
//     enableBasicAutocompletion: true,
//     enableSnippets: true,
//     enableLiveAutocompletion: true
// });

var log_info = ace.edit('policy_ace_log_error')
document.getElementById('policy_ace_log_error').style.fontSize = $('#editor-fontsize').val() + 'px';
log_info.setTheme("ace/theme/" + $('#editor-theme').val());
log_info.getSession().setMode("ace/mode/logs")
log_info.setReadOnly(false);

//log_info.resize();


//使用highlight.js为文章中的代码添加语法高亮
//hljs.initHighlightingOnLoad();


$(function () {


    $("#font-size-12").click(function () {
        document.getElementById('policy_editor').style.fontSize = '12px';
        document.getElementById('policy_ace_log_error').style.fontSize = '12px';
        saveEditor('12', null, null);
    });

    $("#font-size-14").click(function () {
        document.getElementById('policy_editor').style.fontSize = '14px';
        document.getElementById('policy_ace_log_error').style.fontSize = '14px';
        saveEditor('14', null, null);
    });

    $("#font-size-16").click(function () {
        document.getElementById('policy_editor').style.fontSize = '16px';
        document.getElementById('policy_ace_log_error').style.fontSize = '16px';
        saveEditor('16', null, null);
    });

    $("#theme-monokai").click(function () {
        editor.setTheme("ace/theme/monokai");
        log_info.setTheme("ace/theme/monokai");
        saveEditor(null, 'monokai', null);
    });

    $("#theme-eclipse").click(function () {
        editor.setTheme("ace/theme/eclipse");
        log_info.setTheme("ace/theme/eclipse");
        saveEditor(null, 'eclipse', null);
    });

    $("#theme-twilight").click(function () {
        editor.setTheme("ace/theme/twilight");
        log_info.setTheme("ace/theme/twilight");
        saveEditor(null, 'twilight', null);
    });

    $("#wropmode-true").click(function () {
        editor.getSession().setUseWrapMode(true);  //支持代码折叠
        saveEditor(null, null, true);
    });

    $("#wropmode-false").click(function () {
        editor.getSession().setUseWrapMode(false);  //支持代码折叠
        saveEditor(null, null, false);
    });

    $("#saveBtn").click(function () {
        savePolicy();
    });


    $("#editor-search").click(function () {
        editor.commands.exec("find", editor);
    });

    $("#Keyboard").click(function () {
        editor.commands.exec("showKeyboardShortcuts", editor);
    });

    //编辑器快捷键
    editor.commands.addCommand({
        name: 'savePolicy',
        bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
        exec: function (editor) {
            savePolicy();
        },
        readOnly: false // 如果不需要使用只读模式，这里设置false
    });

    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {
            win: "Ctrl-Alt-h",
            mac: "Command-Alt-h"
        },
        exec: function (a) {
            ace.config.loadModule("ace/ext/keybinding_menu", function (b) {
                b.init(a);
                a.showKeyboardShortcuts()
            })
        }
    });
    editor.commands.addCommands([{
        name: "buildPolicy",
        bindKey: {
            win: "Ctrl-Alt-b",
            mac: "Command-Alt-b"
        },
        exec: function (a) {
            buildPolicy(0);
            $("#build-loading").removeClass('hidden');
            $("#policy-status").addClass("hidden");
            $("#log-loading").removeClass('hidden');
        },
        readOnly: false
    }]);

    editor.commands.addCommands([{
        name: "loopback",
        bindKey: {
            win: "Ctrl-Alt-L",
            mac: "Command-Alt-L"
        },
        exec: function (a) {
            buildPolicy(1);
        },
        readOnly: false
    }]);

    /*$("#findNext").click(function () {
     editor.findNext();

     });

     $("#findPrev").click(function () {
     editor.findPrevious();
     });*/


    editor.getSession().on('change', function (e) {
        $("#saveBtn").val("保存");
        $("#saveBtn").removeAttr('disabled');
    });

 

    //设置定时器,每隔5秒自动保存
    setInterval(function () {
        autosave();
    }, 5000);

});

function autosave() {
    var saveVal = $("#saveBtn").val();
    if (saveVal == '保存') {
        savePolicy();
    }


}


function savePolicy() {
    var content = editor.getValue();
    var name = $("#policyTitle").val();
    var policy_id = $("#policy_id").val();
    $.ajax({
        type: "POST",
        url: "/savePolicy/",
        data: {
            content: content,
            policy_id: policy_id,
            name: name,
        },
        success: function (data) {
            $("#saveBtn").val("已保存");
            $("#saveBtn").attr("disabled", 'true')
        },
        error: function (jqXHR) {
            alert("发生错误：" + jqXHR.status);
        },
    });
}

function saveEditor(fontsize, theme, wropmode) {
    $.ajax({
        type: "POST",
        url: "/setEditorInfo/",
        data: {
            fontsize: fontsize,
            theme: theme,
            wropmode: wropmode,
        },
        success: function (data) {
        },
        error: function (jqXHR) {
            alert("发生错误：" + jqXHR.status);
        },
    });

}
