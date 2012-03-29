/**
 * @author Rebecca Miller-Webster
 */

var ETSY = ETSY || {}; (function($) {
	ETSY = {
		_api_key : "xz9zew66bdm4w6mnd4ht1osp",
		_url : "http://openapi.etsy.com/v2/",
		api : {
			getActiveListings : function(shop_id, success, error) {
				var url = ETSY._url + "shops/" + shop_id + "/listings/active.js?api_key=" + ETSY._api_key;
				$.ajax({
					url : url,
					dataType : 'jsonp',
					success : function(data) {
						success(data);
					},
					error : function(data) {
						error(data);
					}
				});
			}
		},
		getActiveListings : function(shop_id) {
			var url = ETSY._url + "shops/" + shop_id + "/listings/active.js?api_key=" + ETSY._api_key;
			$.ajax({
				url : url,
				dataType : 'jsonp',
				success : function(data) {
					if(data.ok) {
						$('#etsy-images').empty();
						if(data.count > 0) {
							console.log(data);
							//multiple by -1 to reverse the sort (most favorited first)
							var sorted = _.sortBy(data.results, function(d) {
								return -1 * d.num_favorers;
							});
							var price_max = 0;
							//set to high val - not the best way
							var price_min = 10000000000000000000000000000;
							var prices = {};
							var results = _.map(sorted, function(d) {
								price_max = Math.max(price_max, d.price);
								price_min = Math.min(price_min, d.price);
								prices[d.price.toString()] = (prices[d.price.toString()] || 0) + d.num_favorers;
								return d.title + ': ' + d.num_favorers + " " + d.price;
							});
							$('<p>' + results.join('<br />') + '</p>').appendTo('#etsy-images');
							$('<p>' + "Price range: $" + price_max + " - $" + price_min + "</p>").prependTo('#etsy-images');
							//create chart table
							var price_keys = _.sortBy(_.keys(prices), function(p) {
								return parseFloat(p);
							});
							console.log(price_keys);
							var table = "<th scope=\"row\">" + shop_id + "</th>";
							//header
							var table_header = "<thead><tr><td></td>";
							var favs = [];
							for(var i = 0; i < price_keys.length; ++i) {
								var key = price_keys[i];
								table_header += "<th scope=\"col\">" + key + "</th>"
								table += "<td>" + prices[key] + "</td>";
								favs.push(prices[key]);
							}
							table_header += "</tr></thead><tbody><tr>";
							table = "<table><caption>Price Distribution</caption>" + table_header + table;
							table += "</tr></tbody></table>"
							$(table).appendTo('#etsy-images');
							$('<div id="container" />').appendTo('#etsy-images');
							//$('table').visualize({type: 'line', width: '420px'});
							var chart1 = new Highcharts.Chart({
								chart : {
									renderTo : 'container',
									type : 'line'
								},
								title : {
									text : 'Price vs. Favorites'
								},
								xAxis : {
									categories : price_keys
								},
								yAxis : {
									title : {
										text : 'Number of favorers'
									}
								},
								series : [{
									name : shop_id,
									data : favs
								}]
							});
						} else {
							$('<p>No results.</p>').appendTo('#etsy-images');
						}
					} else {
						$('#etsy-images').empty();
						alert(data.error);
					}
				},
				error : function() {
					alert('error');
				}
			});
		}
	};
})(jQuery);
