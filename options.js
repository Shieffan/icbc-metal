$("document").ready(function(){

	var hash = window.location.hash;
	if(hash){
		$("html,body").animate({scrollTop: $(hash).offset().top}, 500);
	}

	if(localStorage["silver"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["silver"]);
		if(arr.length>=1){
			$(".silver table").before('<p class="tips">已设置提醒：</p>');
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					deal == "in" ? deal = "当银行买入价" : deal = "当银行卖出价";
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.silver tbody').append("<tr><td>"+ deal +"</td><td>"+direction+"</td><td>￥"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "当涨幅大于" : trend = "当跌幅大于";
					$('.silver tbody').append("<tr><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}

	if(localStorage["gold"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["gold"]);
		if(arr.length>=1){
			$(".gold table").before('<p class="tips">已设置提醒：</p>');
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					deal == "in" ? deal = "当银行买入价" : deal = "当银行卖出价";
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.gold tbody').append("<tr><td>"+ deal +"</td><td>"+direction+"</td><td>￥"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "当涨幅大于" : trend = "当跌幅大于";
					$('.gold tbody').append("<tr><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}

	if(localStorage["silver-spread"])
		$('input[name="silver-spread"]').val(localStorage["silver-spread"]);
	if(localStorage["gold-spread"])
		$('input[name="gold-spread"]').val(localStorage["gold-spread"]);

	$("table.list").on('click','a.del',function(e){
		e.preventDefault();
		var id = $(this).data('id');
		if(id.indexOf("silver")!=-1){
			var arr = JSON.parse(localStorage["silver"]);
			arr = jQuery.grep(arr, function (obj) { return obj.id != id; });
			localStorage["silver"] = JSON.stringify(arr);
		}
		else{
			var arr = JSON.parse(localStorage["gold"]);
			arr = jQuery.grep(arr, function (obj) { return obj.id != id; });
			localStorage["gold"] = JSON.stringify(arr);
		}

		$(this).parent().parent().remove();
		return false;
	});

	$("button.add").click(function(e){
		var obj = {}
		obj.type="price";
		if(e.target.id=="add-silver"){
			obj.id = "silver"+$.now();
			obj.deal = $('input[name="silver-bank"]:checked').val();
			obj.direction = $('input[name="silver-direction"]:checked').val();
			obj.price = parseFloat($(".silver input.price").val());
			if(localStorage["silver"] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage["silver"] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage["silver"]);
				arr.push(obj);
				localStorage["silver"] = JSON.stringify(arr);
			}
			
			var deal,direction;
			obj.deal == "in" ? deal = "当银行买入价" : deal = "当银行卖出价";
			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.silver tbody').append("<tr><td>"+ deal +"</td><td>"+direction+"</td><td>￥"+parseFloat(obj.price).toFixed(2)+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
		else{
			obj.id = "gold"+$.now();
			obj.deal = $('input[name="gold-bank"]:checked').val();
			obj.direction = $('input[name="gold-direction"]:checked').val();
			obj.price = parseFloat($(".gold input.price").val());
			if(localStorage["gold"] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage["gold"] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage["gold"]);
				arr.push(obj);
				localStorage["gold"] = JSON.stringify(arr);
			}
			
			obj.deal == "in" ? deal = "当银行买入价" : deal = "当银行卖出价";
			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.gold tbody').append("<tr><td>"+ deal +"</td><td>"+direction+"</td><td>￥"+parseFloat(obj.price).toFixed(2)+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
	});

	$("button.add-alert").click(function(e){
		var obj = {}
		obj.type="rise";
		if(e.target.id=="add-silver-rise"){
			obj.id = "silver"+$.now();
			obj.trend = $('input[name="silver-trend"]:checked').val();
			obj.range = parseFloat($('input[name="silver-range"]').val());
			if(localStorage["silver"] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage["silver"] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage["silver"]);
				arr.push(obj);
				localStorage["silver"] = JSON.stringify(arr);
			}
			
			var trend = obj.trend;
			var range = parseFloat(obj.range).toFixed(2);
			trend == "inc" ? trend = "当涨幅大于" : trend = "当跌幅大于";
			$('.silver tbody').append("<tr><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
		else{
			obj.id = "gold"+$.now();
			obj.trend = $('input[name="gold-trend"]:checked').val();
			obj.range = parseFloat($('input[name="gold-range"]').val());
			if(localStorage["gold"] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage["gold"] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage["gold"]);
				arr.push(obj);
				localStorage["gold"] = JSON.stringify(arr);
			}
			
			var trend = obj.trend;
			var range = parseFloat(obj.range).toFixed(2);
			trend == "inc" ? trend = "当涨幅大于" : trend = "当跌幅大于";
			$('.gold tbody').append("<tr><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
	});

	$("button.set-spread").click(function(){
		var silverSpread = parseFloat($('input[name="silver-spread"]').val());
		var goldSpread = parseFloat($('input[name="gold-spread"]').val());
		localStorage['silver-spread'] =silverSpread;
		localStorage['gold-spread'] = goldSpread;
		$("#success-tips").html("新点差已保存！");
		window.setTimeout(function(){
			$("#success-tips").fadeOut(800);
		},1500);
	});
});
