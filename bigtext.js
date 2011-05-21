;(function(window, $)
{
    var counter = 0,
        $headCache = $('head'),
        BigText = {
            STARTING_PX_FONT_SIZE: 32,
            DEFAULT_MAX_FONT_SIZE_PX: 528,
            GLOBAL_STYLE_ID: 'bigtext-style',
            STYLE_ID: 'bigtext-id',
            LINE_CLASS_PREFIX: 'bigtext-line',
            EXEMPT_CLASS: 'bigtext-exempt',
            INIT_KEY: 'bigtext-initialized',
            RATIO_KEY: 'bigtext-ratio',
            WORDSPACING_KEY: 'bigtext-wordspacing',
            DEFAULT_CHILD_SELECTOR: '> div',
            childSelectors: {
                div: '> div',
                ol: '> li',
                ul: '> li'
            },
            DATA_KEY: 'bigtextOptions',
            init: function()
            {
                if(!$('#'+BigText.GLOBAL_STYLE_ID).length) {
                    $headCache.append(BigText.generateStyleTag(BigText.GLOBAL_STYLE_ID, ['.bigtext * { white-space: nowrap; }',
                                                                                    '.bigtext .' + BigText.EXEMPT_CLASS + ', .bigtext .' + BigText.EXEMPT_CLASS + ' * { white-space: normal; }']));
                }
            },
            bindResize: function(eventName, resizeFunction)
            {
                if($.throttle) {
                    // https://github.com/cowboy/jquery-throttle-debounce
                    $(window).unbind(eventName).bind(eventName, $.throttle(100, resizeFunction));
                } else {
                    if($.fn.smartresize) {
                        // https://github.com/lrbabe/jquery-smartresize/
                        eventName = 'smartresize.' + eventNamespace;
                    }
                    $(window).unbind(eventName).bind(eventName, resizeFunction);
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
            generateCss: function(elementId, linesFontSizes, lineWordSpacings)
            {
                var css = [],
                    styleId = BigText.getStyleId(elementId);
    
                for(var j=0, k=linesFontSizes.length; j<k; j++) {
                    css.push('#' + elementId + ' .' + BigText.LINE_CLASS_PREFIX + j + ' {' + 
                        (linesFontSizes[j] ? ' font-size: ' + linesFontSizes[j] + 'px;' : '') + 
                        (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') +
                        '}');
                }
    
                $('#' + styleId).remove();
                return BigText.generateStyleTag(styleId, css);
            }
        };

    function testLineDimensions($line, maxWidth, property, size, interval, units)
    {
        var width;
        $line.css(property, size + units);

        width = $line.width();

        if(width >= maxWidth) {
            $line.css(property, '');

            if(width == maxWidth) {
                return {
                    match: 'exact',
                    size: parseFloat((parseFloat(size) - .1).toFixed(3))
                };
            }

            return {
                match: 'estimate',
                size: parseFloat((parseFloat(size) - interval).toFixed(3))
            };
        }

        return false;
    }

    function calculateSizes($t, childSelector, maxWidth, maxFontSize)
    {
        var $c = $t.clone(true)
                    .addClass('bigtext-cloned')
                    .css({
                        'min-width': parseInt(maxWidth, 10),
                        width: 'auto',
                        position: 'absolute',
                        left: -9999,
                        top: -9999
                    }).appendTo(document.body);

        // font-size isn't the only thing we can modify, we can also mess with:
        // word-spacing and letter-spacing.
        // Note: webkit does not respect subpixel letter-spacing or word-spacing,
        // nor does it respect hundredths of a font-size em.
        var fontSizes = [],
            wordSpacings = [],
            ratios = [];

        $c.find(childSelector).css({
            float: 'left',
            clear: 'left'
        }).each(function(lineNumber) {
            var $line = $(this),
                intervals = [4,1,.4,.1],
                lineMax;

            if($line.hasClass(BigText.EXEMPT_CLASS)) {
                fontSizes.push(null);
                ratios.push(null);
                return;
            }

            // TODO we can cache this ratio?
            var autoGuessSubtraction = 20, // px
                currentFontSize = parseFloat($line.css('font-size')),
                lineWidth = $line.width(),
                ratio = (lineWidth / currentFontSize).toFixed(6),
                newFontSize = parseFloat(((maxWidth - autoGuessSubtraction) / ratio).toFixed(3));

            outer: for(var m=0, n=intervals.length; m<n; m++) {
                inner: for(var j=1, k=4; j<=k; j++) {
                    if(newFontSize + j*intervals[m] > maxFontSize) {
                        newFontSize = maxFontSize;
                        break outer;
                    }

                    lineMax = testLineDimensions($line, maxWidth, 'font-size', newFontSize + j*intervals[m], intervals[m], 'px');
                    if(lineMax !== false) {
                        newFontSize = lineMax.size;

                        if(lineMax.match == 'exact') {
                            break outer;
                        }
                        break inner;
                    }
                }
            }

            ratios.push(maxWidth / newFontSize);

            if(newFontSize > maxFontSize) {
                fontSizes.push(maxFontSize);
            } else {
                fontSizes.push(newFontSize);
            }
        }).each(function(lineNumber) {
            var $line = $(this),
                wordSpacing = 0,
                interval = 1,
                maxWordSpacing;

            if($line.hasClass(BigText.EXEMPT_CLASS)) {
                wordSpacings.push(null);
                return;
            }

            // must re-use font-size, even though it was removed above.
            $line.css('font-size', fontSizes[lineNumber] + 'px');

            for(var m=1, n=5; m<n; m+=interval) {
                maxWordSpacing = testLineDimensions($line, maxWidth, 'word-spacing', m, interval, 'px');
                if(maxWordSpacing !== false) {
                    wordSpacing = maxWordSpacing.size;
                    break;
                }
            }

            $line.css('font-size', '');
            wordSpacings.push(wordSpacing);
        }).removeAttr('style');

        $c.remove();

        return {
            fontSizes: fontSizes,
            wordSpacings: wordSpacings,
            ratios: ratios
        };
    }

    function setId()
    {
        var id = $(this).attr('id');
        if(!id) {
            id = 'bigtext-id' + (counter++);
            $t.attr('id', id);
        }
        return id;
    }

    $.fn.bigtext = function(options)
    {
        BigText.init();

        options = $.extend({
                    maxfontsize: BigText.DEFAULT_MAX_FONT_SIZE_PX,
                    childSelector: '',
                    resize: true
                }, options || {});
    
        return this.each(function()
        {
            var $t = $(this).addClass('bigtext'),
                childSelector = options.childSelector ||
                            BigText.childSelectors[this.tagName.toLowerCase()] ||
                            BigText.DEFAULT_CHILD_SELECTOR,
                maxWidth = $t.width(),
                id = setId.call(this),
                firstRun = !$t.data(BigText.INIT_KEY);

            if(firstRun) {
                $t.data(BigText.INIT_KEY, true);

                if(options.resize) {
                    BigText.bindResize('resize.bigtext-event-' + id, function()
                    {
                        $('#' + id).bigtext(options);
                    });
                }
            }

            var styleId = BigText.getStyleId(id);
            $('#' + styleId).remove();

            var calculations;

            if(firstRun) {
                calculations = calculateSizes($t, childSelector, maxWidth, options.maxfontsize);
                $t.data(BigText.WORDSPACING_KEY, calculations.wordSpacings)
                    .data(BigText.RATIO_KEY, calculations.ratios)
                    .find(childSelector).each(function(lineNumber)
                    {
                        $(this).each(function()
                            {
                                // remove existing line classes.
                                this.className = this.className.replace(new RegExp('\\s*' + BigText.LINE_CLASS_PREFIX + '\\d+'), '');
                            })
                            .addClass(BigText.LINE_CLASS_PREFIX + lineNumber);
                    });
            } else {
                var fontSizes = [],
                    ratios = $t.data(BigText.RATIO_KEY);

                for(var j=0, k=ratios.length; j<k; j++) {
                    fontSizes.push(ratios[j] ? maxWidth / ratios[j] : null);
                }

                calculations = {
                    fontSizes: fontSizes,
                    wordSpacings: $t.data(BigText.WORDSPACING_KEY),
                    ratios: ratios
                };
            }

            $headCache.append(BigText.generateCss(id, calculations.fontSizes, calculations.wordSpacings));
        });
    };

    window.BigText = BigText;
})(this, jQuery);
