var BigTextWizard = {
    LINE_HEIGHT_STYLE_ID: 'bigtext-wizard-lineheight-styleinjection',
    CUSTOM_STYLE_ID: 'bigtext-wizard-styleinjection',
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
    _init: function()
    {
        BigTextWizard.setCustomStyle();

        var html = $('.bigtext').bigtext().html();
        BigTextWizard.initializeLineHeights();
        BigTextWizard.setHtml(html);
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
    generateStyleTag: function(id, css)
    {
        return $('<div/>').attr('id', id).html('<style>' + css.join('\n') + '</style>');
    },
    splitQuoteEvent: function(event)
    {
        var $bt = $('.bigtext').empty(),
            quote = $(this).val().split('\n');

        for(var j=0, k=quote.length; j<k; j++) {
            $bt.append('<div>' + quote[j] + '</div>');
        }

        BigTextWizard.init();
    },
    transform3dEvent: function() {
        BigTextWizard.transform3d.call($('#bigtext'), $('#3d-x-slider').is(':checked') ? 1 : 0, $('#3d-y-slider').is(':checked') ? 1 : 0, $('#3d-z-slider').is(':checked') ? 1 : 0, $('#3d-angle-slider').slider('value') + 'deg');
    },
    transform3d: function(x, y, z, angle) {
        // front: -90 < x, y < 90
        $('#bigtext').css('-webkit-transform', 'rotate3d(' + x + ',' + y + ',' + z + ',' + angle + ')');
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
    setHtml: function(html)
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
                        (html || $('.bigtext').html()),
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
            $lines = $('.bigtext > div');

        if(!$sliders.length && $sliders.length != $lines.length) {
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
                BigTextWizard.setHtml();
            });
        });
    }
};


$('#widthSlider').slider({
    min: 320,
    max: 600,
    range: 'min',
    value: 340
}).bind('slidechange', function() {
    var value = $(this).slider('value');
    $('#posterWidth').html(value);
    $('.bigtext').width(value).find('div').each(function() {
        $(this).removeAttr('style').removeAttr('class');
    });

    BigTextWizard.init();
});

$('#quote').bind('keyup', $.throttle(100, BigTextWizard.splitQuoteEvent)).bind('change', BigTextWizard.splitQuoteEvent);

$('#dialog').dialog({
    autoOpen: false,
    width: 500,
    buttons: {
        "OK": function() { 
            $(this).dialog("close"); 
        }
    },
    modal: true
});

$('#customStyle').bind('change', BigTextWizard.init);

$('#refresh').button().bind('click', BigTextWizard.init)

$("#sourceCode").button().bind('click', function()
{
    $('#dialog').dialog('open');

    return false;
});

$('#font').bind('change', function()
{
    BigTextWizard.init();
});

$('#tabs, #sizingTabs').tabs();

$('#3d-angle-slider').slider({
    min: -85,
    max: 85,
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
        $bt = $('#bigtext'),
        existingTransform = $bt.css('-webkit-transform'),
        AMOUNT = 200,
        x = 0,
        y = 0,
        z = 0;

    switch(id) {
        case 'translate-x-minus':
            x = (-1*AMOUNT) + 'px';
            break;
        case 'translate-x-plus':
            x = AMOUNT + 'px';
            break;
        case 'translate-y-minus':
            y = (-1*AMOUNT) + 'px';
            break;
        case 'translate-y-plus':
            y = AMOUNT + 'px';
            break;
        case 'translate-z-minus':
            z = (-1*AMOUNT) + 'px';
            break;
        case 'translate-z-plus':
            z = AMOUNT + 'px';
            break;
    }

    $bt.css('-webkit-transform', existingTransform + ' translate3d(' + x + ',' + y + ',' + z + ')');
});

$(window).bind('load', function()
{
    BigTextWizard.init();
});