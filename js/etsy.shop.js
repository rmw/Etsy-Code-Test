/*
 * TODO:
 *   #1 - analyzer with Backbone event model
 */
var ETSY = ETSY || {};
/*
 * TODO:
 * 	var shop = ETSY.Shop('name');
 *   TODO: getting the results object needs to be a callback b/c of ajax
 *  var results = shop.ActiveListings
 * 		.get([ETSY.Analyzer.Listings.topFavs, ETSY.Analyzer.Listings.numInPrices, ETSY.Analyzer.listings.priceOfFavs])
 * 		.results;
 * 	(analyzers take the data object)
 *   if results.complete && results.ok
 *  	display: results.data.topFavs
 *  	display: results.data.numInPrices
 *  	display: results.data.priceOfFavs
 * 	else if results.data.errors == NO_RESULTS
 */ 
(function($) {
	//TODO: should be constructor that takes shop_id?
	ETSY.Shop = {
		id : null,
		result : {},
		init : function() {
			//TODO: unbind events
			ETSY.Shop.result = {
				processing : false,
				complete : false,
				ok : false,
				error : false,
				data : {},
				setOK: function(ok) { ETSY.Shop.result.ok = ok; ETSY.Shop.result.error = !ok; }
			}
		},
		// TODO: turn into ActiveListings : { get : function() ..., events : { GetSuccess : 'get:success' ... }, success, error }
		// TODO: etsy shop analyzer ... topFavs, numInPrice, priceOfFavs ... binds to events
		get : function(shop_id) {
			ETSY.Shop.id = shop_id || ETSY.Shop.id;
			ETSY.Shop.init();
			ETSY.Shop.result.processing = true;
			/* TODO:
			 * 	- success/error set data
			 *  - (loop thru data) get data sets (sorted by favs (top items), price count(price distribution), price keys & favs by price (price vs. favs))
			 * 		- how do? loop + event callback - jquery events? Backbone event model?
			 * 		- set results.data.orig = data
			 *  - in document.ready display data 
			 *  -	- top 5(?) favs with images and links (see etsy jquery example)
			 * 		- price distribution high chart
			 * 		- price vs fav high chart
			 */
			/*
			 * success : function(data) {
			 * 	var result = ETSY.Shop.result;
			 *  result.setOK(data.ok && data.count > 0);
			 *  result.data['orig'] = data;
			 *  if data.count > 0 then set error to NO_RESULTS
			 *  if data.ok then trigger get:success event on ETSY.Shop object and pass result
			 *  if data.error then trigger get:error event on ETSY.Shop object and pass result
			 * 	result.complete = true;
			 * 	result.processing = false;
			 *  callback with result
			 * },
			 * error: function() {
			 * 	result.setOK(false);
			 * trigger get:error event on ETSY.Shop object and pass data
			 * 	result.complete = true;
			 * 	result.processing = false;
			 *  callback with result
			 * }
			 */
			ETSY.api.getActiveListings(ETSY.Shop.id, ETSY.Shop._getSuccess, ETSY.Shop._getError);
			//TODO: these need to be done in callback
			ETSY.Shop.result.processing = false;
			ETSY.Shop.result.complete = true;
		},
		_getSuccess : function(data) {
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
					var favs = [];
					for(var i = 0; i < price_keys.length; ++i) {
						var key = price_keys[i];
						favs.push(prices[key]);
					}
					$('<div id="container" />').appendTo('#etsy-images');
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
							name : ETSY.Shop.id,
							data : favs
						}]
					});
				} else {
					$('<p>No results.</p>').appendTo('#etsy-images');
				}
			} else {

				alert(data.error);
			}
		},
		_getError : function(data) {
			$('#etsy-images').empty();
			if(data && data.error)
				alert(data.error);
			else
				alert('error');
		}
	};
})(jQuery);
