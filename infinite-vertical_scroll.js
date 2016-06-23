( function() {
        $.expr.filters.offscreen = function(el) {
            var element_top = $(el).offset().top;
            var element_bottom = $(el).outerHeight() + element_top;
            var window_top = window.pageYOffset || document.documentElement.scrollTop;
            var window_bottom = window_top + window.innerHeight;
            return ((element_bottom + 500) < window_top || (element_top - 500) > window_bottom);

            // return ((el.offsetLeft + el.offsetWidth) < 0
            // || (el.offsetTop + el.offsetHeight) < 0
            // || (el.offsetLeft > window.innerWidth
            // || el.offsetTop > window.innerHeight));
        };
    }());
( function() {
        var infinite_scroll = function() {
            var elem = $(this);
            var url = $(this).data("url");
            var parameters = $(this).data("params");
            var $window = $(window);
            var timeout_promise = null;
            var loading = false;
            var nopages = false;
            elem.data('customFirstPage', 1);
            elem.data('customLastPage', 1);
            var add_to_bottom = function(data) {
                elem.append(data);
            };
            var scroller = function(elem) {
                $(window).on("scroll", function() {
                    if (!elem.is(":visible")) {
                        return;
                    }

                    if (timeout_promise) {
                        window.clearTimeout(timeout_promise);
                    }
                    var timeout_promise = window.setTimeout(function() {
                        var window_bottom = $window.innerHeight() + $window.scrollTop();
                        var window_top = $window.scrollTop();
                        var element_bottom = elem.offset().top + elem.height();
                        var element_top = elem.offset().top;

                        var images = elem.find('img.book-cover');
                        for (var index = 0; index < images.length; index++) {
                            if ($(images[index]).is(":offscreen")) {(
                                 function(image) {
                                        if ($(image).outerHeight() > 150) {
                                            var src = $(image).attr("src");
                                            var height = $(image).outerHeight();
                                            var width = $(image).outerWidth();
                                            $(image).css({
                                                "height" : height + "px",
                                                "width" : width + "px"
                                            });
                                            if(src != "/static/images/transparent.png"){
                                                image.dataset.resource = src;
                                                $(image).data("resource", src);   
                                            }
                                            $(image).attr("src", "/static/images/transparent.png");
                                        } else {
                                            var promise = $.Deferred();
                                            image.onload = function() {
                                                promise.resolve();
                                            };
                                            promise.then(function() {
                                                var src = $(image).attr("src");
                                                var height = $(image).outerHeight();
                                                var width = $(image).outerWidth();
                                                $(image).css({
                                                    "height" : height + "px",
                                                    "width" : width + "px"
                                                });
                                                if(src != "/static/images/transparent.png"){
                                                    image.dataset.resource = src;
                                                    $(image).data("resource", src);   
                                                }
                                                $(image).attr("src", "/static/images/transparent.png");
                                            });
                                        }
                                    }(images[index]));
                            } else {
                                var src = $(images[index]).attr("src");
                                var data_src = $(images[index]).data("resource");
                                if (src != data_src) {
                                    $(images[index]).attr("src", data_src);
                                }
                            }
                        }

                        if (element_bottom - window_bottom < 6000 && !loading && !nopages) {
                            loading = true;
                            var first_page = parseInt(elem.data('customFirstPage'), 10);
                            var last_page = parseInt(elem.data('customLastPage'), 10);
                            
                            var url_parameters = location.search.substring(1);
                            try{
                                var data = JSON.parse('{"' + decodeURI(url_parameters).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');    
                            }catch(e){
                                var data = {};
                            };
                            
                            
                            data["page"] = last_page + 1;

                            //load books
                            $.ajax({
                                url : url,
                                data : data,
                                success : function(data) {
                                    add_to_bottom(data);
                                    elem.data('customFirstPage', first_page + 1);
                                    elem.data('customLastPage', last_page + 1);
                                    loading = false;
                                },
                                error: function(data){
                                  add_to_bottom("<div id='end-of-list'>End of List</div>");
                                  loading = false;
                                  nopages = true;  
                                }
                            });
                        }
                    }, 1);
                });
            };
            scroller(elem);
        };
        $.fn.extend({
            infinite_scroll : infinite_scroll
        });
    }());
