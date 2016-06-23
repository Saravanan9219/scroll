( function() {
        var maximum_min_ele = function(_arr, value) {
            var arr = _arr.slice(0);
            arr.sort(function(a, b) {
                return a - b;
            });
            arr.reverse();
            for ( i = 0; i < arr.length; i++) {
                if (arr[i] <= value) {
                    return arr[i];
                }
            }
            return null;
        };

        var minimum_max_ele = function(_arr, value) {
            var arr = _arr.slice(0);
            arr.sort(function(a, b) {
                return a - b;
            });
            for ( i = 0; i < arr.length; i++) {
                if (arr[i] >= value) {
                    return arr[i];
                }
            }
            return null;
        };
        var horizontal_scroll = function(element, right_btn, left_btn) {
            this.data = {};
            element.dataset.hpScroll = "dxik";
            var $data = this.data;
            $data.element = element;
            $data.position = 0;
            $data.left = 0;
            $data.right = 0;
            $data.child_right_positions = [];
            $data.child_left_positions = [];
            $data.window_width = element.parentNode.offsetWidth;
            $data.maximum_right_position = element.parentNode.getBoundingClientRect().right;
            $data.maximum_left_position = element.parentNode.getBoundingClientRect().left;
            $data.length = $(element).children("div").length;
            $(element).data("hp_scroll", $data);
            var initial_width = 1;
            $(element).children("div").each(function() {
                initial_width = initial_width + $(this).outerWidth(true);
            });
            $(element).width(initial_width);
            $(element).children("div").each(function() {
                $data.child_right_positions.push(this.getBoundingClientRect().right);
                $data.child_left_positions.push(this.getBoundingClientRect().left);
            });
            $data.minimum_offset = initial_width - $(element).parent().width();
            $($data.element).parent().find(right_btn).bind("click", function() {
                //var $data = $(this).closest('.hp-scroll').data("hp_scroll");
                var element = $data.element;
                var last_element_position = $data.child_right_positions[$data.child_right_positions.length - 1];
                var max_min = maximum_min_ele($data.child_right_positions, Math.round($data.maximum_right_position));
                var last_pos = $data.child_right_positions.indexOf(max_min);
                //var last_element_position = $(element).children("div").eq(last_pos).offset().left + $(element).children("div").last().width();
                var replacement_width = 0;
                for ( i = 0; i <= last_pos; i++) {
                    replacement_width = replacement_width + $($data.element).children("div")[i].offsetWidth;
                }
                var apply_offset = 0 - replacement_width;                
                //console.log(apply_offset, $data.maximum_right_position, Math.round(last_element_position + apply_offset) <= Math.round($data.maximum_right_position));
                console.log($data, Math.round(last_element_position), Math.round($data.maximum_right_position + 1), Math.round(last_element_position) <= Math.round($data.maximum_right_position + 1));
                if(Math.round(last_element_position) <= Math.round($data.maximum_right_position + 1))
                {
                    console.log("returning false");
                    return false;
                }
                else if (Math.round(last_element_position - ($data.left + replacement_width)) <= Math.round($data.maximum_right_position)) {
                    replacement_width = $data.minimum_offset;
                    apply_offset = 0 - $data.minimum_offset;
                } 
                for ( i = 0; i < $data.child_right_positions.length; i++) {
                    $data.child_right_positions[i] = $data.child_right_positions[i] - ($data.left + replacement_width);
                    $data.child_left_positions[i] = $data.child_left_positions[i] - ($data.left + replacement_width);
                }
                $($data.element).animate({
                    "margin-left" : apply_offset + 'px'
                }, 500, function() {
                    var last_element_position = $(element).children("div").last().offset().left + $(element).children("div").last().outerWidth(true);
                    if (last_element_position < $data.maximum_right_position) {
                        console.log(last_element_position);
                        window.setTimeout(function() {
                            $($data.element).animate({
                                "margin-left" : "-" + $data.minimum_offset + 'px'
                            }, 500);
                        }, 750);
                    }
                });
                $data.position = $data.position + 1;
                $data.left = apply_offset;
                
            });

            $($data.element).parent().find(left_btn).bind("click", function() {
                //var $data = $(this).closest('.hp-scroll').data("hp_scroll");
                var element = $data.element;
                var max_min = maximum_min_ele($data.child_left_positions, Math.round($data.maximum_left_position - $data.window_width));
                var first_pos = $data.child_left_positions.indexOf(max_min);
                var replacement_width = 0;
                if(Math.round($data.child_left_positions[0]) >= $data.maximum_left_position){
                    return false;
                }
                for ( i = 0; i <= first_pos; i++) {
                    replacement_width = replacement_width + $($data.element).children("div")[i].offsetWidth;
                }
                for ( i = 0; i < $data.child_left_positions.length; i++) {
                    $data.child_left_positions[i] = $data.child_left_positions[i] - ($data.left + replacement_width);
                    $data.child_right_positions[i] = $data.child_right_positions[i] - ($data.left + replacement_width);
                }
                var apply_offset = 0 - replacement_width;
                $($data.element).animate({
                    "margin-left" : apply_offset + 'px'
                }, 500);
                $data.left = apply_offset;
            });

        };
        $.fn.extend({
            hp_scroll : function() {
                var self = this;
                $(window).load(function(){
                   $(self).each(function() {
                    if(!$(this).text().trim()){
                        $(this).css({"height":"0px"});
                        return;
                    }
                    new horizontal_scroll(this, ".mv-right", ".mv-left");
                    }); 
                });
            }
        });
    }());

