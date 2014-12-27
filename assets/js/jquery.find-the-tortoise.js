/*!
* Version 0.1
* jQuery: find-the-tortoise plugin - jquery.find-the-tortoise.js
* Copyright - 2013 - https://github.com/sylouuu/
* This source code is under the MIT License
*/

/*jslint browser: true, devel: true, eqeq: true, plusplus: true, unparam: true, vars: true, white: true */
/*global $, jQuery*/
(function($) {

    'use strict';

    $.fn.findTheTortoise = function(options) {

        /**
        * Default values
        */
        var defaults = {
            rows: 12,
            cols: 12,
            lives: 7
        };

        /**
        * Extend options
        */
        var p = $.extend(true, {}, defaults, options);

        /**
        * Working variables
        */
        var
            $container = this,
            $table,
            $cells,
            x, y;

        /**
        * Main object
        */
        var app = {

            /**
            * Function that generates a random number
            *
            * @param integer min
            * @param integer max
            *
            * @return integer
            */
            getRandom: function(min, max) {
                return(Math.round(Math.random() * (max - min)) + min);
            },

            /**
            * Function that animates an element
            *
            * @param object animating_options
            */
            animating: function(animating_options) {
                /**
                * Default values
                */
                var animating_defaults = {
                    $trigger: null,
                    event_name: null,
                    effect_name: null,
                    reset: true,
                    callback: false
                };

                /**
                * Extend options
                */
                var animating_params = $.extend(true, {}, animating_defaults, animating_options);

                /**
                * Event handler
                */
                animating_params.$trigger.on(animating_params.event_name, function() {
                    /**
                    * Element
                    */
                    var $this = $(this);

                    /**
                    * Animating
                    */
                    $this
                        .addClass('animated '+ animating_params.effect_name)
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {

                            if(animating_params.reset) {
                                /**
                                * Animation ended
                                */
                                $this.removeClass('animated '+ animating_params.effect_name);
                            }

                            /**
                            * Callback if needed
                            */
                            if(animating_params.callback) {
                                animating_params.callback($this);
                            }
                        });
                });
            },

            /**
            * Function that creates the table
            *
            * @param integer rows
            * @param integer cols
            */
            createTable: function(rows, cols) {
                /**
                * Table
                */
                $table = $('<table>').appendTo($container);

                /**
                * Table head
                */
                $('<thead>').html('<tr><th colspan="'+ cols +'">Find the tortoise</th></tr>').appendTo($table);

                /**
                * Table body
                */
                var $tbody = $('<tbody>').appendTo($table);

                var
                    tmp = '',
                    i = 1,
                    j = 1;

                /**
                * Looping rows
                */
                for(i = 1; i <= rows; i++) {
                    tmp += '<tr>';

                    /**
                    * Looping cols
                    */
                    for(j = 1; j <= cols; j++) {
                        tmp += '<td data-x="'+ i +'" data-y="'+ j +'">';
                        tmp +=     '<div class="circle">';
                        tmp +=         '<span>';
                        tmp +=             '<i class="glyphicons circle_question_mark"></i>';
                        tmp +=         '</span>';
                        tmp +=     '</div>';
                        tmp += '</td>';
                    }

                    tmp += '</tr>';
                }

                /**
                * Adding rows & cols
                */
                $tbody.html(tmp);

                /**
                * Settings cells
                */
                $cells = $table.find('td .circle');
            },

            /**
            * Events
            */
            events: function() {
                /**
                * Animating
                */
                app.animating({
                    $trigger: $cells,
                    event_name: 'mouseover',
                    effect_name: 'pulse'
                });

                /**
                * Animating
                */
                app.animating({
                    $trigger: $cells,
                    event_name: 'click',
                    effect_name: 'flipOutX',
                    reset: false,
                    callback: function($cell) {

                        $cell
                            .find('i.glyphicons')
                            .removeClass('circle_question_mark');

                        /**
                        * Working variables
                        */
                        var
                            $td = $cell.parent('td'),
                            opened_x = parseInt($td.data('x'), 10),
                            opened_y = parseInt($td.data('y'), 10),
                            $icon = $cell.find('i.glyphicons'),
                            won = false;

                        /**
                        * Wrong row
                        */
                        if(opened_x > x) {
                            $icon.addClass('up_arrow');
                        /**
                        * Still wrong row
                        */
                        } else if(opened_x < x) {
                            $icon.addClass('down_arrow');
                        /**
                        * Right row
                        */
                        } else {
                            /**
                            * Wrong col
                            */
                            if(opened_y > y) {
                                $icon.addClass('left_arrow');
                            /**
                            * Still wrong col
                            */
                            } else if(opened_y < y) {
                                $icon.addClass('right_arrow');
                            /**
                            * Right col
                            */
                            } else {
                                $icon.remove();
                                won = true;
                            }
                        }

                        /**
                        * Wrong cell
                        */
                        if(!won) {
                            /**
                            * Decreasing lives
                            */
                            p.lives--;

                            /**
                            * Animating
                            */
                            app.animating({
                                $trigger: $cells,
                                event_name: 'mouseover',
                                effect_name: 'pulse'
                            });

                            $cell
                                .attr('class', 'circle blue animated flipInX')
                                .show();
                        /**
                        * Right cell
                        */
                        } else {
                            $cell
                                .attr('class', 'circle tortoise green animated bounceIn')
                                .show();


                            setTimeout(function() {
                                /**
                                * Won
                                */
                                alert('You have won, retry?');

                                location.reload();
                            }, 3000);
                        }

                        /**
                        * Lost
                        */
                        if(p.lives === 0) {
                            /**
                            * Lost
                            */
                            alert('You have lost, retry?');

                            location.reload();
                        }
                    }
                });
            }
        };

        /**
        * Creating the table
        */
        app.createTable(12, 12);

        /**
        * Tortoise coords
        */
        x = app.getRandom(1, p.rows);
        y = app.getRandom(1, p.cols);

        /**
        * Launching events
        */
        app.events();

        /**
        * Preserving chainability
        */
        return this;
    };
}(jQuery));
