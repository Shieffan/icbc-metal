$("document").ready(function(){

	var hash = window.location.hash;
	if(hash){
		$("html,body").animate({scrollTop: $(hash).offset().top}, 500);
	}

	if(localStorage["paper-silver"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["paper-silver"]);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
					price = price + "元/克";		
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.silver tbody').append("<tr><td>当纸白银的</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.silver tbody').append("<tr><td>当纸白银的</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}

	if(localStorage["spot-silver"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["spot-silver"]);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					price = price + "元/克";		
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.silver tbody').append("<tr><td>当现货白银的</td><td>成交价</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.silver tbody').append("<tr><td>当现货白银的</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}
	
	if(localStorage["paper-gold"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["paper-gold"]);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
					price = price + "元/克";		
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.gold tbody').append("<tr><td>当纸黄金的</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.gold tbody').append("<tr><td>当纸黄金的</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}

	if(localStorage["spot-gold"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["spot-gold"]);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					price = price + "元/克";		
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.gold tbody').append("<tr><td>当现货黄金的</td><td>成交价</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.gold tbody').append("<tr><td>当现货黄金的</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
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
		var type = id.split('_')[0];
		
		var arr = JSON.parse(localStorage[type]);
		arr = jQuery.grep(arr, function (obj) { return obj.id != id; });
		localStorage[type] = JSON.stringify(arr);
		
		$(this).parent().parent().remove();
		return false;
	});

	$("button.add").click(function(e){
		var obj = {}
		obj.type="price";
		if(e.target.id=="add-silver"){
			obj.price = parseFloat($('input[name="silver-price"]').val()).toFixed(2);
			kind = $('select[name="silver-kind"]').val();
			obj.id = kind + "_" + $.now();
			obj.direction = $('input[name="silver-direction"]:checked').val();

			if($('select[name="silver-kind"]').val()=="paper-silver"){
				obj.deal = $('input[name="silver-bank"]:checked').val();

			}
			
			if(localStorage[kind] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage[kind]);
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			
			var deal,direction,price;

			kind=="paper-silver" ? kind = "当纸白银的": kind = "当现货白银的";
			if(obj.deal){
				obj.deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
				price = parseFloat(obj.price).toFixed(2) + "元/克";
			}
			else{
				deal = "成交价";
				price = parseFloat(obj.price).toFixed(2) + "美元/盎司";
			}
			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.silver tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
		else{
			obj.price = parseFloat($('input[name="gold-price"]').val()).toFixed(2);
			var kind = $('select[name="gold-kind"]').val();
			obj.id = kind + "_" + $.now();
			obj.direction = $('input[name="gold-direction"]:checked').val();

			if($('select[name="gold-kind"]').val()=="paper-gold"){
				obj.deal = $('input[name="gold-bank"]:checked').val();

			}

			
			if(localStorage[kind] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage[kind]);
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			
			
			var deal,direction,price;

			kind=="paper-gold" ? kind = "当纸黄金的": kind = "当现货黄金的";
			if(obj.deal){
				obj.deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
				price = parseFloat(obj.price).toFixed(2) + "元/克";
			}
			else{
				deal = "成交价";
				price = parseFloat(obj.price).toFixed(2) + "美元/盎司";
			}

			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.gold tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
	});

	$("button.add-alert").click(function(e){
		var obj = {}
		obj.type="rise";
		if(e.target.id=="add-silver-rise"){
			
			obj.trend = $('input[name="silver-trend"]:checked').val();
			obj.range = parseFloat($('input[name="silver-range"]').val()).toFixed(2);
			var kind = $('select[name="trend-silver-kind"]').val();
			obj.id = kind + "_" + $.now();
			if(localStorage[kind] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage[kind]);
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			
			var trend = obj.trend;
			

			if(kind == "paper-silver"){
				var range = parseFloat(obj.range).toFixed(2);
				kind = "当纸白银的";
			}else{
				var range = parseFloat(obj.range).toFixed(2);
				kind = "当现货白银的";
			}
			
			trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";

			$('.silver tbody').append("<tr><td>"+kind+"</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		}
		else{
			
			obj.trend = $('input[name="gold-trend"]:checked').val();
			obj.range = parseFloat($('input[name="gold-range"]').val()).toFixed(2);
			var kind = $('select[name="trend-gold-kind"]').val();
			obj.id = kind + "_" + $.now();
			if(localStorage[kind] == undefined){
				var arr = [];
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			else{
				var arr = JSON.parse(localStorage[kind]);
				arr.push(obj);
				localStorage[kind] = JSON.stringify(arr);
			}
			
			var trend = obj.trend;
			
			if(kind == "paper-gold"){
				var range = parseFloat(obj.range).toFixed(2);
				kind = "当纸黄金的";
				trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
			}else{
				var range = parseFloat(obj.range).toFixed(2);
				kind = "当现货黄金的";
				trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
			}
			
			$('.gold tbody').append("<tr><td>"+kind+"</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
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

	$("select.select-price").change(function(){
		if($(this).val()=="spot-silver" || $(this).val()=="spot-gold" ){
			$(this).next().html("成交价");
		}else{
			if($(this).val() == "paper-silver"){
				$(this).next().html('<input type="radio" value="in" name="silver-bank">银行买入价<input type="radio" name="silver-bank" checked="checked" value="out">银行卖出价');
			}else{
				$(this).next().html('<input type="radio" value="in" name="gold-bank">银行买入价<input type="radio" name="gold-bank" checked="checked" value="out">银行卖出价');
			}
			
		}
		
	});
});
