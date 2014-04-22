var BigTextWizard = {
    LINE_HEIGHT_STYLE_ID: 'bigtext-wizard-lineheight-styleinjection',
    CUSTOM_STYLE_ID: 'bigtext-wizard-styleinjection',
    DEFAULT_TEXT: '',
    loadedFonts: {},
    fontUrls: {
        'LeagueGothicRegular': 'css/league-gothic/stylesheet.css',
        'Droid Sans': 'http://fonts.googleapis.com/css?family=Droid+Sans',
        'Yanone Kaffeesatz': 'http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz',
        'Molengo': 'http://fonts.googleapis.com/css?family=Molengo',
        'Droid Sans Mono': 'http://fonts.googleapis.com/css?family=Droid+Sans+Mono',
        'Arvo': 'http://fonts.googleapis.com/css?family=Arvo:regular,bold',
        'Arimo': 'http://fonts.googleapis.com/css?family=Arimo',
        'Puritan': 'http://fonts.googleapis.com/css?family=Puritan',
        'IM Fell English': 'http://fonts.googleapis.com/css?family=IM+Fell+English'
    },
    clear: function(ignoreFocus)
    {
        var cleared = $('<div/>').html(BigTextWizard.DEFAULT_TEXT);
        $('#bigtext').empty().append(cleared);
        BigTextWizard._init();
        cleared.trigger('focus');
    },
    _init: function()
    {
        var $bt = $('#bigtext');
        $bt.bigtext();

        BigTextWizard.initializeLineHeights();
        BigTextWizard.initEditable.call($bt.find('> div'));
    },
    init: function()
    {
        var fontFamily = $('#font').val();
        if(BigTextWizard.loadedFonts[fontFamily]) {
            BigTextWizard._init();
        } else {
            BigTextWizard.loadFont(fontFamily, BigTextWizard._init);
        }
    },
    initEditable: function()
    {
        return this.attr({
                contenteditable: true,
                spellcheck: false
            })
            .unbind('keypress keyup, blur')
            .bind('keypress', function(event) 
            {
                var $t = $(this);
                if(event.which == 13) {
                    var element;
    
                    if(!event.shiftKey) {
                        element = $t.nextAll().eq(0);
                        if(!element.length) {
                            element = BigTextWizard.initEditable.call($('<div/>')).appendTo($t.parent());
                        }
                    } else {
                        element = $t.prevAll().eq(0);
                    }

                    // IE8 wasn't letting focus here without a timeout.
                    if($.browser.msie && $.browser.version <= 8) {
                        window.setTimeout(function() {
                            element.trigger('focus');
                        }, 100);
                    } else {
                        element.trigger('focus');
                    }
                    return false;
                }
            }).bind('keyup', $.throttle(250, function()
            {
                var $t = $(this);
                if($t.text() && $t.text() != BigTextWizard.DEFAULT_TEXT) {
                    $t.parent().removeClass('blurred');
                }
                
                $t.parent().bigtext();
            })).bind('blur', function()
            {
                var $t = $(this);
                if(!$.trim($t.text()) && $t.siblings().length > 0) {
                    $t.remove();
                }

                BigTextWizard.initializeLineHeights();
            });
    },
    generateStyleTag: function(id, css)
    {
        return $('<div/>').attr('id', id).html('<style>' + css.join('\n') + '</style>');
    },
    transform3dEvent: function() {
        BigTextWizard.rotate3d.call($('#bigtext'), $('#3d-x-slider').is(':checked') ? 1 : 0, $('#3d-y-slider').is(':checked') ? 1 : 0, $('#3d-z-slider').is(':checked') ? 1 : 0, $('#3d-angle-slider').slider('value') + 'deg');
    },
    rotate3d: function(x, y, z, angle) {
        // front: -90 < x, y < 90
        this.css('-webkit-transform', 'rotate3d(' + x + ',' + y + ',' + z + ',' + angle + ')');
    },
    translate: function(x, y, z)
    {
        var existingTransform = this.css('-webkit-transform') || ''; //rotate3d(0, 0, 0, 0deg)';

        this.css('-webkit-transform', (existingTransform ? existingTransform + ' ' : '') +
                                        'translate3d(' + (x ? x + 'px' : '0') + ',' + (y ? y + 'px' : '0') + ',' + (z ? z + 'px' : '0') + ')');
    },
    resetTransform: function()
    {
        $('#bigtext').css('-webkit-transform', '');
    },
    loadFont: function(fontFamily, callback)
    {
         WebFont.load({
            custom: {
                families: [fontFamily],
                urls : [BigTextWizard.fontUrls[fontFamily]]
            },
            active: function() {
                BigTextWizard.loadedFonts[fontFamily] = true;
                callback();
            }
        });
    },
    setCustomStyle: function()
    {
        var fontFace = $('#font').val();
        $('#' + BigTextWizard.CUSTOM_STYLE_ID).remove();
        BigTextWizard.generateStyleTag(BigTextWizard.CUSTOM_STYLE_ID, [$('#customStyle').val(),
                                                                        (fontFace ? '\n.bigtext { font-family: \'' + fontFace + '\'; }' : '')])
                        .appendTo('head');
    },
    setHtml: function()
    {
        function clean(html)
        {
            return (html || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        var fontFace = $('#font').val();
        $('#code').html(clean([
                        '<!doctype html>',
                        '<html>',
                        '<head>',
                            '<meta charset="utf-8"/>',
                            (fontFace ? '<link type="text/css" rel="stylesheet" href="' + BigTextWizard.fontUrls[fontFace] + '"/>' : ''),
                            '<style>',
                            $('#' + BigText.GLOBAL_STYLE_ID).html(),
                            $('#' + BigTextWizard.CUSTOM_STYLE_ID).html(),
                            $('#' + BigText.STYLE_ID).html(),
                            $('#' + BigTextWizard.LINE_HEIGHT_STYLE_ID).html(),
                            '</style>',
                        '</head>',
                        '<body>',
                        '<div class="bigtext">',
                        $('#bigtext').html(),
                        '</div>',
                        '</body>',
                        '</html>'].join('\n')));
    },
    setLineHeightCss: function()
    {
        $('#' + BigTextWizard.LINE_HEIGHT_STYLE_ID).remove();

        BigTextWizard.generateStyleTag(BigTextWizard.LINE_HEIGHT_STYLE_ID, $.makeArray($('#lineHeightSliders').find('> div').map(function(n)
        {
            var lineHeight = $(this).slider('value');
            return lineHeight !== 1 ? '.bigtext > .' + BigText.LINE_CLASS_PREFIX + (n+1) + ' { line-height: ' + lineHeight + 'em; }' : null;
        }))).appendTo('head'); 
    },
    initializeLineHeights: function()
    {
        var $sliders = $('#lineHeightSliders'),
            $lines = $('#bigtext > div');

        if($lines.length < 2) {
            $sliders.html('Add another line!');
            return;
        } else if($lines.length == $sliders.find('> div.ui-slider').length - 1) {
            return;
        }

        $sliders.empty();

        $lines.each(function(lineNumber)
        {
            if(!lineNumber) {
                return;
            }

            $('<div/>').appendTo($sliders).slider({
                min: 0,
                max: 2,
                step: .05,
                value: 1,
                orientation: 'vertical',
                range: 'min',
                animate: true
            }).bind('slidechange', function() {
                BigTextWizard.setLineHeightCss();
            });
        });
    }
};


$('#widthSlider').slider({
    min: 260,
    max: 1024,
    range: 'min',
    value: 430
}).bind('slidechange', function() {
    var value = $(this).slider('value');
    $('#posterWidth').html(value);
    $('#bigtext').width(value).find('div').each(function() {
        $(this).removeAttr('style').removeAttr('class');
    });

    BigTextWizard.init();
});

$('#customStyle').bind('change', function() {
    BigTextWizard.setCustomStyle();
    BigTextWizard.init();
});

$('#clear').button().bind('click', BigTextWizard.clear);

$('#refresh').button().bind('click', BigTextWizard.init);

$('#font').bind('change', function()
{
    BigTextWizard.setCustomStyle();
    BigTextWizard.init();
});

$('#tabs').tabs();

$('#3d-angle-slider').slider({
    min: -70,
    max: 70,
    range: 'min',
    value: 0,
    step: 1
}).bind('slidechange', function()
{
    var deg = $(this).slider('value') ;
    $('#3d-angle-value').html(deg + ' degree' + (deg != 1 ? 's' : ''));
    BigTextWizard.transform3dEvent();
});

$('#3d-animate-slider').bind('change', function()
{
    $('#bigtext').toggleClass('animate3d');
});
$('#tabs-3d .dimension-slider').bind('change', BigTextWizard.transform3dEvent);

$('#reset-3d').button().bind('click', function()
{
    $('#3d-angle-slider').slider('value', 0);
});

$('#random-3d').button().bind('click', function()
{
    if(Math.round(Math.random())) {
        $('#3d-x-slider').attr('checked', 'checked');
    } else {
        $('#3d-x-slider').removeAttr('checked');
    }

    if(Math.round(Math.random())) {
        $('#3d-y-slider').attr('checked', 'checked');
    } else {
        $('#3d-y-slider').removeAttr('checked');
    }

    if(Math.round(Math.random())) {
        $('#3d-z-slider').attr('checked', 'checked');
    } else {
        $('#3d-z-slider').removeAttr('checked');
    }

    // Setting the value triggers slidechange, which triggers transform3dEvent
    $('#3d-angle-slider').slider('value', Math.round(Math.random()*180) - 90);
});

$('#translate-buttons button').button().bind('click', function()
{
    var id = $(this).attr('id'),
        AMOUNT = 200,
        x = 0,
        y = 0,
        z = 0;

    switch(id) {
        case 'translate-x-minus':
            x = -1*AMOUNT;
            break;
        case 'translate-x-plus':
            x = AMOUNT;
            break;
        case 'translate-y-minus':
            y = -1*AMOUNT;
            break;
        case 'translate-y-plus':
            y = AMOUNT;
            break;
        case 'translate-z-minus':
            z = -1*AMOUNT;
            break;
        case 'translate-z-plus':
            z = AMOUNT;
            break;
    }

    BigTextWizard.translate.call($('#bigtext'), x, y, z);
});

$(window).bind('click', function(event)
{
    if(!$(event.target).closest('#toolbar').length) {
        $('#bigtext > div').eq(0).trigger('focus');
    }
}).bind('load', function()
{
    BigTextWizard.setCustomStyle();
    BigTextWizard.init();

    $('#3d-animate-slider').trigger('click').trigger('change');
}).bind('keydown', function(event) 
{
    // Keyboard shortcuts
    if(event.ctrlKey && event.altKey) {
        var $bigtext = $('#bigtext');

        switch(event.which) {
            case 90: // z
                BigTextWizard.clear();
                return false;
            case 67: // c
                $('body').toggleClass('bigtextWizardWhite').toggleClass('bigtextWizardBlack');
                return false;
            case 88: // x
                $('#random-3d').trigger('click');
                return false;
            case 37: // left arrow
                BigTextWizard.rotate3d.call($bigtext, 0, 0, 1, '-90deg');
                return false;
            case 39: // right arrow
                BigTextWizard.rotate3d.call($bigtext, 0, 0, 1, '90deg');
                return false;
            case 82: // r
                $('#reset-3d').trigger('click');
                return false;
            case 32: // space
            case 13: // enter
                $bigtext.removeClass('fadeIn').addClass('fadeOut');
                    //.find('> div').eq(0).trigger('focus');

                window.setTimeout(function()
                {
                    if(event.which == 32) {
                        $('#random-3d').trigger('click');
                    }
                    BigTextWizard.clear();
                    $bigtext.removeClass('fadeOut').addClass('fadeIn');
                }, 200);
                
                return false;
        }
    }
});