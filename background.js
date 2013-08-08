function getSilverSpread(){
	if(localStorage["silver-spread"])
		return parseFloat(localStorage["silver-spread"])/2;
	else
		return 0.02;
}
function getGoldSpread(){
	if(localStorage["gold-spread"])
		return parseFloat(localStorage["gold-spread"])/2;
	else
		return 0.4;
}
function setInfo(el,tips){
    $.ajax( {    
        url:'http://wap.icbc.com.cn/WapDynamicSite/GoldMarket/Default.aspx',  
        type:'get',    
        cache:false,     
		timeout:5000,
		beforeSend:function(){
			if(tips){
				$(tips).html("正在刷新...");
			}
		},
        success:function(data) {    
            var str = data.replace(/[\r\n\t]/g,'');
            var pattern = /<form.*<\/form>/;
            var html = pattern.exec(str)[0];
            html = $(html);
            var silver = html.find("#ObjectList1_ctl02_table2");
            var gold = html.find("#ObjectList1_ctl01_table2");
            var cur_silver_price_in = (parseFloat(silver.find("td").eq(1).html())-getSilverSpread()).toFixed(2);
            var cur_silver_price_out = (parseFloat(silver.find("td").eq(1).html())+getSilverSpread()).toFixed(2);
            var cur_silver_increase = silver.find("td").eq(2).html();
            var cur_gold_price_in = (parseFloat(gold.find("td").eq(1).html())-getGoldSpread()).toFixed(2);
            var cur_gold_price_out = (parseFloat(gold.find("td").eq(1).html())+getGoldSpread()).toFixed(2);
            var cur_gold_increase = gold.find("td").eq(2).html();
           
            $(el).find("#silver td").eq(0).html(cur_silver_price_in);
            $(el).find("#silver td").eq(1).html(cur_silver_price_out);
            $(el).find("#silver td").eq(2).html(cur_silver_increase+"%");
            $(el).find("#gold td").eq(0).html(cur_gold_price_in);
            $(el).find("#gold td").eq(1).html(cur_gold_price_out);
            $(el).find("#gold td").eq(2).html(cur_gold_increase+"%");
            if(tips){
            	 $(tips).html("已刷新！");
            }
        },    
        error : function() {    
             // do nothing.
        }    
    });  
	
	$.ajax( {    
        url:'http://quote.forex.hexun.com/2010/Data/FRunTimeQuote.ashx?code=XAUUSD',  
        type:'get',    
        cache:false,     
		timeout:5000,
        success:function(data) {    
            var pattern = /\[(.*)\]/;
            var str = pattern.exec(data)[1].replace(/'/g,"");
           
            var dataArray = str.split(',');
            
            var cur_f_spot_gold_price = dataArray[2];
            if(parseFloat(dataArray[4])>0){
            	var cur_f_spot_gold_increase = "+" + dataArray[4]
            }else{
            	var cur_f_spot_gold_increase = dataArray[4];
            }

            $(el).find("#spot-gold td").eq(0).html(cur_f_spot_gold_price);
            $(el).find("#spot-gold td").eq(1).html(cur_f_spot_gold_increase);

        },    
        error : function() {    
             // do nothing.
        }    
    });  

    $.ajax( {    
        url:'http://quote.forex.hexun.com/2010/Data/FRunTimeQuote.ashx?code=XAGUSD',  
        type:'get',    
        cache:false,     
		timeout:5000,
        success:function(data) {    
            var pattern = /\[(.*)\]/;
            var str = pattern.exec(data)[1].replace(/'/g,"");
           
            var dataArray = str.split(',');
            
            var cur_f_spot_silver_price = dataArray[2];
            
            if(parseFloat(dataArray[4])>0){
            	var cur_f_spot_silver_increase = "+" + dataArray[4]
            }else{
            	var cur_f_spot_silver_increase = dataArray[4];
            }

            $(el).find("#spot-silver td").eq(0).html(cur_f_spot_silver_price);
            $(el).find("#spot-silver td").eq(1).html(cur_f_spot_silver_increase);

        },    
        error : function() {    
             // do nothing.
        }    
    });  
	
	

}

chrome.notifications.onButtonClicked.addListener(function(notID,index) {
	var detailURL = "http://www.icbc.com.cn/ICBC/%E7%BD%91%E4%B8%8A%E9%BB%84%E9%87%91/%E8%A1%8C%E6%83%85%E6%8A%A5%E4%BB%B7/";
    chrome.tabs.create({ url: detailURL });
});

setInterval(function(){
 $.ajax( {    
        url:'http://wap.icbc.com.cn/WapDynamicSite/GoldMarket/Default.aspx',  
        type:'get',    
        cache:false, 
		timeout:10000,
        success:function(data) {    
            var str = data.replace(/[\r\n\t]/g,'');
            var pattern = /<form.*<\/form>/;
            var html = pattern.exec(str)[0];
            html = $(html);
            var silver = html.find("#ObjectList1_ctl02_table2");
            var gold = html.find("#ObjectList1_ctl01_table2");
            var cur_f_silver_price = parseFloat(silver.find("td").eq(1).html());
           	var cur_f_silver_range = parseFloat(silver.find("td").eq(2).html());
            var cur_f_gold_price = parseFloat(gold.find("td").eq(1).html());
            var cur_f_gold_range = parseFloat(gold.find("td").eq(2).html());

            
			var time = new Date(),
			h = time.getHours(), // 0-24 format
			m = time.getMinutes();
			s = time.getSeconds();
			time = h+":"+m+":"+s;
			var messages = [];
			var item = {};
			if(localStorage["silver"] == undefined){
				// do nothing
			}
			else
			{
				var arr = JSON.parse(localStorage["silver"]);
				if(arr.length>=1)
				{
					
					for(var i=0;i<arr.length;i++){
						var obj = arr[i];
						if(!obj) continue;
						if(obj.type=="price"){
							var direction = obj.direction;
							var deal = obj.deal;
							var price = parseFloat(obj.price);
							if(direction == "gt"){
								if(deal == "in"){
									if(cur_f_silver_price-getSilverSpread() >= price){
										item = {title: '['+time+'] 白银价格提醒',message:'白银的银行买入价格￥'+(cur_f_silver_price-getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
										messages.push(item);
										delete arr[i];
									}
								}else{
									if(cur_f_silver_price+getSilverSpread() >= price){
										item = {title:'['+time+'] 白银价格提醒',message:'白银的银行卖出价格￥'+(cur_f_silver_price+getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
										messages.push(item);
										delete arr[i];
									}
								}
							}
							else{
								if(deal == "in"){
									if(cur_f_silver_price-getSilverSpread() <= price){
										item = {title:'['+time+'] 白银价格提醒',message:'白银的银行买入价格￥'+(cur_f_silver_price-getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
										messages.push(item);
										delete arr[i];
									}
								}else{
									if(cur_f_silver_price+getSilverSpread() <= price){
										item = {title:'['+time+'] 白银价格提醒',message:'白银的银行卖出价格￥'+(cur_f_silver_price+getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
										messages.push(item);
										delete arr[i];
									}
								}
							}
						}
						else{
							var trend = obj.trend;
							var range = parseFloat(obj.range);
							if(trend=="inc"){
								if(cur_f_silver_range > 0  && cur_f_silver_range >= range){
									item = {title: '['+time+'] 白银涨幅预警',message:'白银的涨幅 '+cur_f_silver_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
									messages.push(item);
									delete arr[i];
								}
							}
							else{
								if(cur_f_silver_range < 0 && Math.abs(cur_f_silver_range) >= range){
									item = {title: '['+time+'] 白银跌幅预警',message:'白银的跌幅 '+Math.abs(cur_f_silver_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2)+"%."};
									messages.push(item);
									delete arr[i];
								}

							}
						}
					}
					var newarr = [];
					
					for(var i=0;i<arr.length;i++){
						obj = arr[i];
						if(obj){
							
							newarr.push(obj);
						}
					}
					
					localStorage["silver"] = JSON.stringify(newarr);
					

				}
			}

			if(localStorage["gold"] == undefined){
				// do nothing
			}
			else
			{
				var arr = JSON.parse(localStorage["gold"]);
				if(arr.length>=1)
				{
					
					for(var i=0;i<arr.length;i++){
						var obj = arr[i];
						if(!obj) continue;
						if(obj.type=="price"){
							var direction = obj.direction;
							var deal = obj.deal;
							var price = parseFloat(obj.price);
							
							if(direction == "gt"){
								if(deal == "in"){
									if(cur_f_gold_price-getGoldSpread() >= price){
										item = {title:'['+time+'] 黄金价格提醒',message:'黄金现在的银行买入价格￥'+(cur_f_gold_price-getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price}
										messages.push(item);
										delete arr[i];
									}
								}else{
									if(cur_f_gold_price+getGoldSpread() >= price){
										item = {title:'['+time+'] 黄金价格提醒',message:'黄金现在的银行卖出价格￥'+(cur_f_gold_price+getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price}
										messages.push(item);
										delete arr[i];
									}
								}
							}
							else{
								if(deal == "in"){
									if(cur_f_gold_price-getGoldSpread() <= price){
										item = {title:'['+time+'] 黄金价格提醒',message:'黄金现在的银行买入价格￥'+(cur_f_gold_price-getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price}
										messages.push(item);
										delete arr[i];
									}
								}else{
									if(cur_f_gold_price+getGoldSpread() <= price){
										item = {title:'['+time+'] 黄金价格提醒',message:'黄金现在的银行卖出价格￥'+(cur_f_gold_price+getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price}
										messages.push(item);
										delete arr[i];
									}
								}
							}
						}
						else{
							var trend = obj.trend;
							var range = parseFloat(obj.range);
							if(trend=="inc"){
								if(cur_f_gold_range > 0  && cur_f_gold_range >= range){
									item = {title: '['+time+'] 黄金涨幅预警',message:'黄金的涨幅 '+cur_f_gold_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) + "%."};
									messages.push(item);
									delete arr[i];
								}
							}
							else{
								if(cur_f_gold_range < 0 && Math.abs(cur_f_gold_range) >= range){
									item = {title: '['+time+'] 黄金跌幅预警',message:'黄金的跌幅 '+Math.abs(cur_f_gold_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) + "%."};
									messages.push(item);
									delete arr[i];
								}

							}

						}
					}
					var newarr = [];
					
					for(var i=0;i<arr.length;i++){
						obj = arr[i];
						if(obj){
							
							newarr.push(obj);
						}
					}
					
					localStorage["gold"] = JSON.stringify(newarr);
					
					

				}
			}

           	
			if(messages.length){
				var opt={};
				for(var i=0;i<messages.length;i++){
					var opt = {
							type : "basic",
							title: messages[i].title,
							message: messages[i].message,
							iconUrl:"not.png",
							buttons: [{ title:'查看实时行情', iconUrl: 'link.png'}],
						}
				
					chrome.notifications.create("metal_price_"+i, opt, function(notID){
						
						setTimeout(function(){
							chrome.notifications.clear(notID,function(res){
								
							});
						},12000)
					});	
				}
				
			}
        },    
        error : function() {    
             
        }    
    });  
},60000)