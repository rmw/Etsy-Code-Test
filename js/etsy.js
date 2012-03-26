/**
 * @author Rebecca Miller-Webster
 */

var ETSY = ETSY || {}; (function($) {
	ETSY = {
		_api_key : "xz9zew66bdm4w6mnd4ht1osp",
		_url : "http://openapi.etsy.com/v2/",
		getActiveListings : function(shop_id) {
			var url = ETSY._url + "shops/" + shop_id + "/listings/active.js?api_key=" + ETSY._api_key;
			$.ajax({
				url : url,
				dataType : 'jsonp',
				success : function(data) {
					if(data.ok) {
						$('#etsy-images').empty();
						alert(data.count);
						if(data.count > 0) {
							console.log(data);
							var sorted = _.sortBy(data.results, function(d) { return -1 * d.num_favorers; });
							var results = _.map(sorted, function(d) {
								return d.title + ': ' + d.num_favorers + " " + d.price;
							});
							$('<p>' + results.join('<br />') + '</p>').appendTo('#etsy-images');
						} else {
							$('<p>No results.</p>').appendTo('#etsy-images');
						}
					} else {
						$('#etsy-images').empty();
						alert(data.error);
					}
				},
				error: function() {
					alert('error');
				}
			});
		}
	};
})(jQuery);
