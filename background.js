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
            
            var cur_f_spot_gold_price = parseFloat(dataArray[2]).toFixed(2);
            if(parseFloat(dataArray[4])>0){
            	var cur_f_spot_gold_increase = "+" + dataArray[4].replace(/ /g,"");
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
            
            var cur_f_spot_silver_price = parseFloat(dataArray[2]).toFixed(2);
            
            if(parseFloat(dataArray[4])>0){
            	var cur_f_spot_silver_increase = "+" + dataArray[4].replace(/ /g,"");
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

function checkTime(i)
{
	if (i<10) 
	  {i="0" + i}
	return i
}
function getCurtime(){
	var d = new Date();
	return checkTime(d.getHours())+":"+checkTime(d.getMinutes())+":"+checkTime(d.getSeconds());
}
	

function produceNotification(data){
	var type = data.type;
	var metal_kind = data.kind;
	var cur_price = data.price;
	var cur_range = data.range;

	var messages = [];
	
	var time = getCurtime();
	var item = {};
	
	if(type == "silver"){
		if(!localStorage["silver"])	return;
		var arr = JSON.parse(localStorage["silver"]);
		
		if(arr.length>=1){
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(!obj) continue;
				if(metal_kind != obj.kind) return;
				if(obj.type=="price"){
					var direction = obj.direction;
					var deal = obj.deal;
					var price = parseFloat(obj.price);
					if(direction == "gt"){
						if(deal == "in"){
							if(cur_price-getSilverSpread() >= price){
								item = {title: '['+time+'] 纸白银价格提醒',message:'纸白银的银行买入价格￥'+(cur_price-getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}
						else if(deal=="out"){
							if(cur_price+getSilverSpread() >= price){
								item = {title:'['+time+'] 纸白银价格提醒',message:'纸白银的银行卖出价格￥'+(cur_price+getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}
						else{
							if(cur_price >= price){
								item = {title:'['+time+'] 现货白银价格提醒',message:'现货白银的成交价格$'+cur_price.toFixed(2)+' 已经到达了您所设置的提醒价格$'+price};
								messages.push(item);
								delete arr[i];
							}
						}
					}
					else{
						if(deal == "in"){
							if(cur_price-getSilverSpread() <= price){
								item = {title:'['+time+'] 纸白银价格提醒',message:'纸白银的银行买入价格￥'+(cur_price-getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}else if(deal == "out"){
							if(cur_price+getSilverSpread() <= price){
								item = {title:'['+time+'] 纸白银价格提醒',message:'纸白银的银行卖出价格￥'+(cur_price+getSilverSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}else{
							if(cur_price <= price){
								item = {title:'['+time+'] 现货白银价格提醒',message:'现货白银的成交价格$'+cur_price.toFixed(2)+' 已经到达了您所设置的提醒价格$'+price};
								messages.push(item);
								delete arr[i];
							}
						}
					}
				}
				else{
					var trend = obj.trend;
					var range = parseFloat(obj.range);
					var kind = obj.kind;
					if(trend=="inc"){
						if(cur_range > 0  && cur_range >= range){
							if(kind == "paper-silver"){
								item = {title: '['+time+'] 纸白银涨幅预警',message:'纸白银的涨幅 '+cur_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}else{
								item = {title: '['+time+'] 现货白银涨幅预警',message:'现货白银的涨幅 '+cur_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}
							messages.push(item);
							delete arr[i];
						}
					}
					else{
						if(cur_range < 0 && Math.abs(cur_range) >= range){
							if(kind == "paper-silver"){
								item = {title: '['+time+'] 纸白银跌幅预警',message:'纸白银的跌幅 '+ Math.abs(cur_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}else{
								item = {title: '['+time+'] 现货白银跌幅预警',message:'现货白银的跌幅 '+ Math.abs(cur_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}
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
	else{
		if(!localStorage["gold"])	return;
		console.log(data);
		var arr = JSON.parse(localStorage["gold"]);
		
		if(arr.length>=1){
			
			for(var i=0;i<arr.length;i++){
				var obj = arr[i];
				if(!obj) continue;
				if(metal_kind != obj.kind) continue;
				if(obj.type=="price"){
					var direction = obj.direction;
					var deal = obj.deal;
					var price = parseFloat(obj.price);
					if(direction == "gt"){
						if(deal == "in"){
							if(cur_price-getGoldSpread() >= price){
								item = {title: '['+time+'] 纸黄金价格提醒',message:'纸黄金的银行买入价格￥'+(cur_price-getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}
						else if(deal=="out"){

							if(cur_price+getGoldSpread() >= price){
								item = {title:'['+time+'] 纸黄金价格提醒',message:'纸黄金的银行卖出价格￥'+(cur_price+getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}
						else{
							if(cur_price >= price){
								item = {title:'['+time+'] 现货黄金价格提醒',message:'现货黄金的成交价格$'+cur_price.toFixed(2)+' 已经到达了您所设置的提醒价格$'+price};
								messages.push(item);
								delete arr[i];
							}
						}
					}
					else{
						
						if(deal == "in"){
							if(cur_price-getGoldSpread() <= price){
								item = {title:'['+time+'] 纸黄金价格提醒',message:'纸黄金的银行买入价格￥'+(cur_price-getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								delete arr[i];
							}
						}else if(deal == "out"){
							
							if(cur_price+getGoldSpread() <= price){
								item = {title:'['+time+'] 纸黄金价格提醒',message:'纸黄金的银行卖出价格￥'+(cur_price+getGoldSpread()).toFixed(2)+' 已经到达了您所设置的提醒价格￥'+price};
								messages.push(item);
								
								delete arr[i];
							}
						}else{
							if(cur_price <= price){
								item = {title:'['+time+'] 现货黄金价格提醒',message:'现货黄金的成交价格$'+cur_price.toFixed(2)+' 已经到达了您所设置的提醒价格$'+price};
								messages.push(item);
								delete arr[i];
							}
						}
					}
				}
				else{
					var trend = obj.trend;
					var range = parseFloat(obj.range);
					var kind = obj.kind;
					if(trend=="inc"){
						if(cur_range > 0  && cur_range >= range){
							if(kind == "paper-gold"){
								item = {title: '['+time+'] 纸黄金涨幅预警',message:'纸黄金的涨幅 '+cur_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}else{
								item = {title: '['+time+'] 现货黄金涨幅预警',message:'现货黄金的涨幅 '+cur_range.toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}
							messages.push(item);
							delete arr[i];
						}
					}
					else{
						if(cur_range < 0 && Math.abs(cur_range) >= range){
							if(kind == "paper-gold"){
								item = {title: '['+time+'] 纸黄金跌幅预警',message:'纸黄金的跌幅 '+ Math.abs(cur_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}else{
								item = {title: '['+time+'] 现货黄金跌幅预警',message:'现货黄金的跌幅 '+ Math.abs(cur_range).toFixed(2)+'% 已经到达了您所设置的预警幅度 '+range.toFixed(2) +"%."};
							}
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
		
			chrome.notifications.create("metal_price_"+metal_kind+i+$.now(), opt, function(notID){
				
				setTimeout(function(){
					chrome.notifications.clear(notID,function(res){
						
					});
				},12000)
			});	
		}
		
	}

}


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
            cur_f_silver_price = parseFloat(silver.find("td").eq(1).html());
            cur_f_silver_range = parseFloat(silver.find("td").eq(2).html());
            cur_f_gold_price = parseFloat(gold.find("td").eq(1).html());
            cur_f_gold_range = parseFloat(gold.find("td").eq(2).html());

            var obj1={
            	type:"silver",
            	kind:"paper-silver",
            	price:cur_f_silver_price,
            	range:cur_f_silver_range
            }
           
            produceNotification(obj1);

            var obj2={
            	type:"gold",
            	kind:"paper-gold",
            	price:cur_f_gold_price,
            	range:cur_f_gold_range
            }
           
            produceNotification(obj2);
        },    
        error : function() {    
             
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
            
            cur_f_spot_gold_price = parseFloat(dataArray[2]);
            cur_f_spot_gold_range = parseFloat(dataArray[4]);

            var obj={
            	type:"gold",
            	kind:"spot-gold",
            	price:cur_f_spot_gold_price,
            	range:cur_f_spot_gold_range
            };
            produceNotification(obj);

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
            
            cur_f_spot_silver_price = parseFloat(dataArray[2]);
            cur_f_spot_silver_range = parseFloat(dataArray[4]);

            var obj={
            	type:"silver",
            	kind:"spot-silver",
            	price:cur_f_spot_silver_price,
            	range:cur_f_spot_silver_range
            };
            produceNotification(obj);

        },    
        error : function() {    
             // do nothing.
        }    
    });  

   

},60000)