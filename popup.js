var background = chrome.extension.getBackgroundPage();
var info = document.getElementById('info');
var tips = document.getElementById('tips');
background.setInfo(info,false);
setInterval(function(){
	background.setInfo(info,tips);
},5000);
$("a.a-graph").click(function(e){
	e.preventDefault();
	if($(this).html()=="收起"){
		$("a.a-graph").html("查看");
		$("#status").slideUp();
		return;
	}
	if($(this).html()=="查看"){
		$("a.a-graph").html("查看");
		$(this).html("收起");
	}
	if(e.target.href.indexOf("#silver-graph")!=-1){
		$("#status").show();
		$("#status h2").html("纸白银走势:");
		$("#graph").hide().html("<img src='http://price.zhjtong.com/1_ying_72_320_240.gif' alt='纸白银72小时走势图'/>").slideDown('normal');
	}
	else if(e.target.href.indexOf("#gold-graph")!=-1){
		$("#status").show();
		$("#status h2").html("纸黄金走势:");
		$("#graph").hide().html("<img src='http://price.zhjtong.com/1_gh_72_320_240.gif' alt='纸黄金72小时走势图'/>").slideDown('normal');
	}
	else if(e.target.href.indexOf("#silver-spot")!=-1){
		$("#status").show();
		$("#status h2").html("现货白银走势:");
		$("#graph").hide().html("<img src='http://chart.icbctd.com/silver_72_320_240.gif' alt='现货白银72小时走势图'/>").slideDown('normal');
	}
	else if(e.target.href.indexOf("#gold-spot")!=-1){
		$("#status").show();
		$("#status h2").html("现货黄金走势:");
		$("#graph").hide().html("<img src='http://chart.icbctd.com/gold_72_320_240.gif' alt='现货黄金72小时走势图'/>").slideDown('normal');
	}
});

$("a.a-setting").click(function(){
	var type= $(this).data("type");
	chrome.tabs.create({url: "options.html#"+type+"-h2"});
});
