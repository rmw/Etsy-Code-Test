var ETSY = ETSY || {}; 
(function($) {
	ETSY.Shop = {
		id : null,
		result : {},
		callback : {},
		init : function() {
			ETSY.Shop.result = {
				processing : false,
				complete : false,
				ok : false,
				error : false,
				data : {},
				setOK: function(ok) { ETSY.Shop.result.ok = ok; ETSY.Shop.result.error = !ok; }
			}
		},
		get : function(shop_id, callback) {
			ETSY.Shop.id = shop_id || ETSY.Shop.id;
			ETSY.Shop.callback = callback;
			ETSY.Shop.init();
			ETSY.Shop.result.processing = true;
			ETSY.api.getActiveListings(ETSY.Shop.id, {
				success: ETSY.Shop._getSuccess, 
				error: ETSY.Shop._getError
			});
		},
		_getSuccess : function(data) {
			if(data.ok) {
				if(data.count > 0) {
					var result = ETSY.Shop.result.data;
					//multiple by -1 to reverse the sort (most favorited first)
					result.topFavs = _.sortBy(data.results, function(d) {
						return -1 * d.num_favorers;
					});
					result.priceCount = {}, result.priceFavs = {};
					_.each(result.topFavs, function(d) {
						var p = d.price.toString();
						result.priceFavs[p] = (result.priceFavs[p] || 0) + d.num_favorers;
						result.priceCount[p] = (result.priceCount[p] || 0) + 1;
					});
					result.sorted_prices = _.sortBy(_.keys(result.priceCount), function(p) {
						return parseFloat(p);
					});
				} 
				ETSY.Shop._doneProcessing(data, true);
			} else {
				ETSY.Shop._getError(data);
			}
		},
		_getError : function(data) {
			if(data && data.error)
				ETSY.Shop.result.data.error = data.error;
			ETSY.Shop._doneProcessing(data, false);
		},
		_doneProcessing: function(data, ok) {
			ETSY.Shop.result.setOK(ok);
			ETSY.Shop.result.data.orig = data;
			ETSY.Shop.result.data.count = data.count;
			ETSY.Shop.result.complete = true;
			ETSY.Shop.result.processing = false;
			if (ETSY.Shop.callback) { ETSY.Shop.callback(); }
		}
	};
})(jQuery);
