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

		arr.sort(function(a, b){
			  var akind = a.kind.toLowerCase();
			  var bkind = b.kind.toLowerCase(); 
			  return ((akind < bkind) ? -1 : ((akind > bkind) ? 1 : 0));
			}
		);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var kind = obj.kind;
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;

					kind == "paper-silver" ? kind = "当纸白银的" : kind = "当现货白银的"
					if(deal == "spot"){
						deal = "成交价";
						price = price + "美元/盎司";
					}
					else{
						deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
						price = price + "元/克";
					}
					
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.silver tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					var kind = obj.kind;
					kind == "paper-silver" ? kind = "当纸白银的" : kind = "当现货白银的";
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.silver tbody').append("<tr><td>"+kind+"</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
			}
		}
	}

	if(localStorage["gold"] == undefined){
		// do nothing
	}
	else{
		var arr = JSON.parse(localStorage["gold"]);

		arr.sort(function(a, b){
			  var akind = a.kind.toLowerCase();
			  var bkind = b.kind.toLowerCase(); 
			  return ((akind < bkind) ? -1 : ((akind > bkind) ? 1 : 0));
			}
		);

		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(obj.type=="price"){
					var kind = obj.kind;
					var deal = obj.deal;
					var direction = obj.direction;
					var price = obj.price;
					kind == "paper-gold" ? kind = "当纸黄金的" : kind = "当现货黄金的"
					if(deal == "spot"){
						deal = "成交价";
						price = price + "美元/盎司";
					}
					else{
						deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
						price = price + "元/克";
					}
					direction == "gt" ? direction="大于等于" : direction="小于等于";
					$('.gold tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
				}
				else{
					var trend = obj.trend;
					var range = obj.range;
					var kind = obj.kind;
					kind == "paper-gold" ? kind = "当纸黄金的" : kind = "当现货黄金的";
					trend == "inc" ? trend = "涨幅大于" : trend = "跌幅大于";
					$('.gold tbody').append("<tr><td>"+kind+"</td><td>"+ trend +"</td><td colspan='2'>"+range+"% 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
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
			obj.deal = $('input[name="silver-bank"]:checked').val() || 'spot';
			obj.direction = $('input[name="silver-direction"]:checked').val();
			
			obj.price = parseFloat($('input[name="silver-price"]').val()).toFixed(2);
			obj.kind = $('select[name="silver-kind"]').val();
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
			
			
			var deal,direction,kind,price;

			obj.kind=="paper-silver" ? kind = "当纸白银的": kind = "当现货白银的";
			if(obj.deal == 'spot'){
				deal = "成交价";
				price = parseFloat(obj.price).toFixed(2) + "美元/盎司";
			}
			else{
				obj.deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
				price = parseFloat(obj.price).toFixed(2) + "元/克";
			}

			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.silver tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");
		
			
		}
		else{
			obj.id = "gold"+$.now();
			obj.deal = $('input[name="gold-bank"]:checked').val()|| 'spot';
			obj.direction = $('input[name="gold-direction"]:checked').val() ;
			obj.price = parseFloat($('input[name="gold-price"]').val()).toFixed(2);
			obj.kind = $('select[name="gold-kind"]').val();
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
			
			var deal,direction,kind,price;
			obj.kind=="paper-gold" ? kind = "当纸黄金的": kind = "当现货黄金的";
			
			if(obj.deal == 'spot'){
				deal = "成交价";
				price = parseFloat(obj.price).toFixed(2) + "美元/盎司";
			}
			else{
				obj.deal == "in" ? deal = "银行买入价" : deal = "银行卖出价";
				price = parseFloat(obj.price).toFixed(2) + "元/克";
			}

			obj.direction == "gt" ? direction="大于等于" : direction="小于等于";
			$('.gold tbody').append("<tr><td>"+kind+"</td><td>"+ deal +"</td><td>"+direction+"</td><td>"+price+" 时提醒我.</td><th><a  data-id='"+obj.id+"' class='del' href='#'>删除此提醒</a></th></tr>");

			
		}
	});

	$("button.add-alert").click(function(e){
		var obj = {}
		obj.type="rise";
		if(e.target.id=="add-silver-rise"){
			obj.id = "silver"+$.now();
			obj.trend = $('input[name="silver-trend"]:checked').val();
			obj.range = parseFloat($('input[name="silver-range"]').val()).toFixed(2);
			obj.kind = $('select[name="trend-silver-kind"]').val();
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
			var kind;

			if(obj.kind == "paper-silver"){
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
			obj.id = "gold"+$.now();
			obj.trend = $('input[name="gold-trend"]:checked').val();
			obj.range = parseFloat($('input[name="gold-range"]').val()).toFixed(2);
			obj.kind = $('select[name="trend-gold-kind"]').val();
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
			var kind;
			if(obj.kind == "paper-gold"){
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
