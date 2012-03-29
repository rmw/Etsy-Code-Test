/**
 * @author Rebecca Miller-Webster
 */

var ETSY = ETSY || {};
(function($) {
	ETSY = {
		_api_key : "xz9zew66bdm4w6mnd4ht1osp",
		_url : "http://openapi.etsy.com/v2/",
		api : {
			getActiveListings : function(shop_id, callbacks) {
				var url = ETSY._url + "shops/" + shop_id + "/listings/active.js?api_key=" + ETSY._api_key;
				$.ajax({
					url : url,
					dataType : 'jsonp',
					success : function(data) {
						if(callbacks && callbacks.success)
							callbacks.success(data);
					},
					error : function(data) {
						if(callbacks && callbacks.success)
							callbacks.error(data);
					}
				});
			}
		}
	};
})(jQuery);
