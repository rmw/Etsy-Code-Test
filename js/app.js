(function($) {
	var top_fav_template = "<a href='{{url}}'>{{title}}</a><span class='favs'>{{num_favorers}}</span><span class='price'>${{price}}</span>"
	$(document).ready(function() {
		$('#etsy-shop').bind('submit', function(e) {
			var shop_id = $('#etsy-shop-name').val();
			$('#etsy-results').empty();
			$('<p>Analyzing ' + shop_id + '</p>').appendTo('#etsy-results');
			//ETSY.getActiveListings(shop_id);
			ETSY.Shop.get(shop_id, function() {
				//display results
				var shop = ETSY.Shop;
				var result = shop.result;
				$('#etsy-results').empty();
				if(result.ok) {
					var data = ETSY.Shop.result.data;
					if(data.count > 0) {
						$('<h1>Most Favorited Items</h1>').appendTo('#etsy-results');
						var top_favs = $('<ol />');
						for(var i=0; i < 5; ++i) {
							var item = data.topFavs[i];
							var title = item.title + '::' + item.num_favorers + ':: $' + item.price;
							$('<li />')
								.append($('<span />').addClass('fav_heart'))
								.append($('<span />').addClass('favs').text(item.num_favorers))
								.append($('<a />').attr('href', item.url).text(item.title))
								.append($('<span />').addClass('price').text('$' + item.price))
								.appendTo(top_favs);
						};
						$('#etsy-results').append(top_favs);
						//get graph data sorted by price
						var favs = [], price_count = [];
						for(var i = 0; i < data.sorted_prices.length; ++i) {
							var key = data.sorted_prices[i];
							favs.push(data.priceFavs[key]);
							price_count.push(data.priceCount[key]);
						}
						displayPriceGraph(price_count);
						displayPriceFavGraph(favs);
					} else {
						$('<p>No results.</p>').appendTo('#etsy-results');
					}
				} else {
					if(data && data.error)
						alert(data.error);
					else
						alert('error');
				}
			});
			return false;
		});
	});
	function displayPriceGraph(data) {
		$('<div id="price-count" />').appendTo('#etsy-results');
		displayPriceXHighChart('price-count', 'Price Range', 'Number of items', data);
	}

	function displayPriceFavGraph(data) {
		$('<div id="price-vs-favs" />').appendTo('#etsy-results');
		displayPriceXHighChart('price-vs-favs', 'Price vs. Favorites', 'Number of favorers', data);
	}
	
	function displayPriceXHighChart(el_name, title, yTitle, data) {
		new Highcharts.Chart({
			chart : {
				renderTo : el_name,
				type : 'line'
			},
			title : {
				text : title
			},
			xAxis : {
				categories : ETSY.Shop.result.data.sorted_prices
			},
			yAxis : {
				title : {
					text : yTitle
				}
			},
			series : [{
				name : ETSY.Shop.id,
				data : data
			}]
		});
	}

})(jQuery);
