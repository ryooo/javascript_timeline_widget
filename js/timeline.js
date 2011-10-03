
(function ($) {
	$.jsonp.setup({
		// jsonpキャッシュ無効
		pageCache: false,
		// ブラウザキャッシュ無効
		cache: false,
		callbackParameter: "callback",
		// 5000(ms) = 5(s)
		timeout: 5E3
	});
	$(function () {
		// jsonに含まれるツイート数
		var tweetCount = 8;
		// ツイート1件ごとに表示するミリ秒
		var tweetDelay = 2500;
		var template = $("div#message_template > div.message");
		var messageHead = $("div#message_head");
		var messages = [];
		funcLoadtweets = function () {
			// APIを叩く
			$.jsonp({
				// ボタンのHTMLを取得
				url: "json/registed_tweets.js",
				data: {},
				dataType : "jsonp",
				callback:"set_messages",
				// タイムアウト時はerror()を実行
				// 5000(ms) = 5(s)
				timeout : 5E3,
				success : function (rows) {
					for (var i in rows){
						// jsonから取得したツイートをすべてタイマーにセット
						// iを数値として扱うために-1
						var delay = tweetDelay * (i - 1 + 1);
						// ieでsetTimeoutに引数を渡すためfunctionの形をとる
						(function (row) {
							window.setTimeout(function(){
								// templateを元に要素を作成
								var message = template.clone();
								message.find("a.nick_name").attr("href", row.user_url).text(row.nick_name);
								message.find("span.message").text(row.message);
								message.find("div.image > a").attr("href", row.user_url).find("img").attr("src", row.user_image);
								message.find("span.user_attr").text(row.user_attr);
								messageHead.after(message);
								message.slideDown(800, function(){
									message.fadeTo(500, 1);
									// 適当なタイミングで要素を削除
									messages.unshift(message);
									if (messages.length > 5) messages.pop().remove();
								});
							}, delay);
						})(rows[i]);
					}
				},
				error : function () {
					clearInterval(timer);
				}
			});
		};
		// jsonを読み込むタイミング
		timer = setInterval("funcLoadtweets()", tweetCount * tweetDelay);
		funcLoadtweets();
	});
})(jQuery.noConflict());
