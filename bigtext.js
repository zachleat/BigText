;(function($)
{
    // Purposeful Global
    BigText = {
        STARTING_PX_FONT_SIZE: 11,
        DEFAULT_MAX_FONT_SIZE_EM: 48,
        GLOBAL_STYLE_ID: 'bigtext-style',
        STYLE_ID: 'bigtext-id',
        LINE_CLASS_PREFIX: 'bigtext-line',
        LINE_FOCUS_CLASS: 'bigtext-focus',
        DEFAULT_CHILD_SELECTOR: '> div',
        childSelectors: {
            div: '> div',
            ol: '> li',
            ul: '> li'
        },
        DATA_KEY: 'bigtextOptions',
        counter: 0,
        init: function($head)
        {
            if(!$('#'+BigText.GLOBAL_STYLE_ID).length) {
                $head.append(BigText.generateStyleTag(BigText.GLOBAL_STYLE_ID, ['.bigtext { font-size: ' + BigText.STARTING_PX_FONT_SIZE + 'px; }']));
            }
        },
        getStyleId: function(elementId)
        {
            return BigText.STYLE_ID + '-' + elementId;
        },
        generateStyleTag: function(id, css)
        {
            return $('<style>' + css.join('\n') + '</style>').attr('id', id);
        },
        generateFontSizeCss: function(elementId, linesFontSizes, lineWordSpacings)
        {
            var css = [],
                styleId = BigText.getStyleId(elementId);
    
            for(var j=0, k=linesFontSizes.length; j<k; j++) {
                css.push('#' + elementId + ' .' + BigText.LINE_CLASS_PREFIX + j + ' { font-size: ' + linesFontSizes[j] + 'em;' + 
                    (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') + ' }');
            }
    
            $('#' + styleId).remove();
            return BigText.generateStyleTag(styleId, css);
        },
        testLineDimensions: function($line, maxwidth, property, size, interval, units)
        {
            $line.css(property, size + units);
    
            if($line.width() >= maxwidth) {
                $line.css(property, '');
    
                return parseFloat((parseFloat(size) - interval).toFixed(2));
            }
    
            return false;
        }
    };

    $.fn.bigtext = function(options)
    {
        var $headCache = $('head');
        BigText.init($headCache);
    
        options = $.extend({
                    maxfontsize: BigText.DEFAULT_MAX_FONT_SIZE_EM,
                    childSelector: '',
                    /* function(onResizeFunction) { 
                     *     $(window).unbind('resize.bigtext').bind('resize', onResizeFunction);
                     * }
                     */
                    bindResize: null,
                    resize: true
                }, options || {});
    
        return this.each(function()
        {
            var $t = $(this).addClass('bigtext'),
                id = $t.attr('id'),
                childSelector = options.childSelector ||
                            BigText.childSelectors[this.tagName.toLowerCase()] ||
                            BigText.DEFAULT_CHILD_SELECTOR,
                maxwidth = $t.width(),
                $c = $t.clone(true)
                            .addClass('bigtext-cloned')
                            .removeAttr('id')
                            .css({
                                'min-width': parseInt(maxwidth, 10),
                                width: 'auto',
                                position: 'absolute',
                                left: -9999,
                                top: -9999
                            }).appendTo(document.body);

            if(!id) {
                id = 'bigtext-id' + (BigText.counter++);
                $t.attr('id', id);
            }

            if(options.resize) {
                // Cache options, used in BigText.resizeFunction
                $t.data(BigText.DATA_KEY, options);

                function resizeFunction()
                {
                    var $t = $('#'+id);
                    $t.bigtext($t.data(BigText.DATA_KEY));
                }

                if($.isFunction(options.bindResize)) {
                    options.bindResize(resizeFunction);
                } else if($.throttle) {
                    // https://github.com/cowboy/jquery-throttle-debounce
                    $(window).unbind('resize.bigtext').bind('resize.bigtext', $.throttle(100, resizeFunction));
                } else if($.fn.smartresize) {
                    // https://github.com/lrbabe/jquery-smartresize/
                    $(window).unbind('smartresize.bigtext').bind('smartresize.bigtext', resizeFunction);
                }
            }

            var styleId = BigText.getStyleId(id);
            $('#' + styleId).remove();
    
            // font-size isn't the only thing we can modify, we can also mess with:
            // word-spacing and letter-spacing.
            // Note: webkit does not respect subpixel letter-spacing or word-spacing,
            // nor does it respect hundredths of a font-size em.
            var fontSizes = [],
                wordSpacings = [];
    
            $c.find(childSelector).css({
                float: 'left',
                clear: 'left'
            }).each(function(lineNumber) {
                var $line = $(this),
                    intervals = [16,8,4,2,1,.1,.01],
                    fontMatch = 1,
                    lineMax;
    
                for(var m=0, n=intervals.length; m<n; m++) {
                    inner: for(var j=1, k=10; j<=k; j++) {
                        lineMax = BigText.testLineDimensions($line, maxwidth, 'font-size', fontMatch + j*intervals[m], intervals[m], 'em');
    
                        if(lineMax !== false) {
                            fontMatch = lineMax;
                            break inner;
                        }
                    }
    
                    if(fontMatch > options.maxfontsize) {
                        break;
                    }
                }
    
                if(fontMatch > options.maxfontsize) {
                    fontSizes.push(options.maxfontsize);
                } else {
                    fontSizes.push(fontMatch);
                }
            }).each(function(lineNumber) {
                var $line = $(this),
                    wordSpacing = 0,
                    interval = 1,
                    maxWordSpacing;
    
                // must re-use font-size, even though it was removed above.
                $line.css('font-size', fontSizes[lineNumber] + 'em');
    
                for(var m=0, n=10; m<n; m+=interval) {
                    maxWordSpacing = BigText.testLineDimensions($line, maxwidth, 'word-spacing', m, interval, 'px');
                    if(maxWordSpacing !== false) {
                        wordSpacing = maxWordSpacing;
                        break;
                    }
                }
    
                $line.css('font-size', '');
                wordSpacings.push(wordSpacing);
            }).removeAttr('style');
    
            $headCache.append(BigText.generateFontSizeCss(id, fontSizes, wordSpacings));
    
            $c.remove();
    
            $t.find(childSelector).each(function(lineNumber)
            {
                $(this).each(function()
                    {
                        // remove existing line classes.
                        this.className = this.className.replace(new RegExp('\\s*' + BigText.LINE_CLASS_PREFIX + '\\d+'), '');
                    })
                    .addClass(BigText.LINE_CLASS_PREFIX + lineNumber)
                    [maxwidth / fontSizes[lineNumber] < 80 ? 'addClass' : 'removeClass'](BigText.LINE_FOCUS_CLASS);
            });
        });
    };
})(jQuery);
