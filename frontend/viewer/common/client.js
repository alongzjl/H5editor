var socket     = '';
var manager    = '';
var domin = 'beyondin.gopopon.com'
var port = 3111;
var url = 'http:'+domin+'/';

function log (msg) {
    console.log(msg);
}

var socket_config = {
    'server'    : 'http://'+domin+':'+port,
    'paltform'  : 'web',
}

var reg_info = {
    'key' : 11111,
    'm_key' : 22222,
};

function ctl_cmd(cmd) {};
//成功连接到老师后，把学生id传过去
function set_stu_id(cmd) {};

// socket 初始化
function init_socket() {
    manager = io.Manager(socket_config.server, {
            reconnection         : true,
            timeout              : 1000,
            reconnectionAttempts : 5000,
            reconnectionDelay    : 10,
            //reconnectionDelayMax : 1,
        }
    );
    socket = manager.socket('/');

    // 响应注册流程
    socket.on('reg', function(data) {
        try {
            var msg = JSON.parse(data);
            log(data)
            switch (msg.msg) {
                case 'unreg'     : unreg(); break;
                case 'connected' : log('connected'); break;
                default : log(data); break;
            }

        } catch (error) {
            log(error+"APP注册请求的JSON格式不正确");
            return
        }

    });

    // 响应断线逻辑 && 重连逻辑
    socket.on('disconnect',        function() { log('服务器断开连接');});
    socket.on('connect_error',     function() { log(' 连接错误!');});
    socket.on('reconnect_attempt', function() { log(' 开始重连');});
    socket.on('connect_stu_suc', function(data) { log(' 学生连接成功');set_stu_id(data)});
    socket.on('wait', function() { alert("有学生连接到老师了，请稍等")});
    //socket.on('no_teacher', function() { alert("当前没有老师")});
    socket.on('reconnect_failed',  function() {
        socket.close();
        manager.close();
        log(' 重连失败');
    });
    socket.on('control', function(data) { ctl_cmd(data);});
}

function unreg() {
    socket.emit('reg', JSON.stringify(reg_info));
}


function send_cmd(cmd) {
    try {
        socket.emit('control', JSON.stringify(cmd));
    } catch (e) {
        log(e);
    }
}

function teacher_init() {
    init_socket();
}

function student_init() {
    var args = GetUrlParms();
    var size = Object.size(args);
    try {
        var key = args.key;
        var m_key = args.m_key;
        var student_id = args.student_id;
        reg_info = {
            'key' : key,
            'm_key' : m_key,
            'is_teacher':0,
            'student_id':student_id,
        };
        init_socket();
    } catch(e) {
        console.log(e);
    }
}

function control_prev() {
    var cmd = {
        'cmd' : 'prev',
        'data' : '1',
    }
    send_cmd(cmd);
}

function control_next() {
    var cmd = {
        'cmd' : 'next',
        'data' : '1',
    }
    send_cmd(cmd);
}

function control_goto(page) {
    var cmd = {
        'cmd' : 'goto',
        'data' : page
    }
    send_cmd(cmd);
}

//activity滚动
function control_swiper_goto(page) {
    var cmd = {
        'cmd' : 'swiper_goto',
        'data' : page
    }
    send_cmd(cmd);
}

//答题结果页面题滚动
function control_ex_goto(page) {
    var cmd = {
        'cmd' : 'ex_goto',
        'data' : page
    }
    send_cmd(cmd);
}

function control_goto_exercise(){
    var cmd = {
        'cmd' : 'act',
        'data' : 'exercise'
    }
    send_cmd(cmd);
}

function control_goto_activity(){
    var cmd = {
        'cmd' : 'act',
        'data' : 'activity'
    }
    send_cmd(cmd);
}

function control_goto_scene(){
    var cmd = {
        'cmd' : 'act',
        'data' : 'scene'
    }
    send_cmd(cmd);
}

//学生提交答案
function control_submit_ans(){
    console.log("control_submit_ans");
    var cmd = {
        'cmd' : 'ans',
        'data' : 'finish'
    }
    send_cmd(cmd);
}

//老师评完分数
function control_submit_star(){
    var cmd = {
        'cmd' : 'star',
        'data' : 'finish'
    }
    send_cmd(cmd);
}


// 获取get参数
function GetUrlParms()
{
    var args=new Object();
    var query=location.search.substring(1);//获取查询串
    var pairs=query.split("&");//在逗号处断开

    for(var   i=0;i<pairs.length;i++) {
        var pos=pairs[i].indexOf('=');//查找name=value

        if(pos==-1) continue;//如果没有找到就跳过

        var argname=pairs[i].substring(0,pos);//提取name
        var value=pairs[i].substring(pos+1);//提取value
        args[argname]=unescape(value);//存为属性
    }
    return args;
}

// 产生随机字符串
function randomString(length)
{
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

// 生成配对的通讯密钥
function generate_keys()
{
    return {
        'key' : randomString(6),
        'm_key' : randomString(6),
    }
}

// 工具类，获取参数长度
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function screen_init()
{
    // 随机生成密钥
    reg_info  = generate_keys();
    // 连接初始化
    init_socket();
    var control_url = url + '?key='+reg_info.m_key+'&m_key='+reg_info.key;
    return control_url;
}
