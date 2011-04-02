BigText Makes Text Big
============================

Requirements
----------------------------
1. jQuery
1. A block level parent element, with block level children.

Examples
----------------------------

### Normal Usage

    <div id="bigtext">
        <div>BIGTEXT</div>
        <div>Makes Text Big</div>
    </div>
    <script>
    $('#bigtext').bigtext();
    </script>

### Using a List (ordered/unordered)

    <ol id="bigtext">
        <li>BIGTEXT</li>
        <li>Makes Text Big</li>
    </li>
    <script>
    $('#bigtext').bigtext();
    </script>

### Using other block child elements

    <div id="bigtext">
        <p>BIGTEXT</p>
        <p>Makes Text Big</p>
    </div>
    <script>
    $('#bigtext').bigtext({
        childSelector: '> p'
    });
    </script>

### Exempting/Excluding Lines

    <ol id="bigtext">
        <li>BIGTEXT</li>
        <li class="bigtext-exempt">Makes Text Big</li>
    </li>
    <script>
    $('#bigtext').bigtext();
    </script>


### Mix and Match Fonts

    <ol id="bigtext">
        <li>
            <span style="font-family: sans-serif">BIG</span>
            <span style="font-family: serif">TEXT</span>
        </li>
        <li>Makes Text Big</li>
    </ol>
    <script>
    $('#bigtext').bigtext();
    </script>

### Using with Custom Font-Face

    <div id="bigtext">
        <div>BIGTEXT</div>
        <div>Makes Text Big</div>
    </div>
    <script src="//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
    $(function() {
        WebFont.load({
            custom: {
                families: ['LeagueGothicRegular'], // font-family name
                urls : ['css/fonts/league-gothic/stylesheet.css'] // URL to css
            },
            active: function() {
                $('#bigtext').bigtext();
            }
        });
    });
    </script>

### Change the default max font size

    <div id="bigtext">
        <div>BIG</div><!-- the shorter the line, the larger the size required --> 
    </div>
    <script>
    $('#bigtext').bigtext({
        maxfontsize: 60 // default is 48 (in ems)
    });
    </script>

Extra Features
----------------------------
### Re-BigText on Resize

BigText does not implement its own debounced resize event, to reduce duplicate code. However, it does search for existing implementations. For example, [Ben Alman's Throttle/Debounce plugin](https://github.com/cowboy/jquery-throttle-debounce) or [Louis-Remi Babe's SmartResize](https://github.com/lrbabe/jquery-smartresize/), in that order.

Common Problems
----------------------------

### ID CSS Styling
Do not use #your-id CSS rules to style. BigText clones the element to size it off-document, and does not maintain the ID attribute for the clone.

### Lines Wrapping Pre-BigText
The starting font-size must be small enough to guarantee that each individual line is not wrapping pre-BigText.  Adjust the amount of text per line, or set the starting font size using the example below.

#### Change the default min (starting) font size

    <div id="bigtext">
        <div>This is a really long line, that may be too long since it might wrap.</div>
    </div>
    <script>
    // Global Configuration Option
    BigText.STARTING_PX_FONT_SIZE = 8; // default is 11 (in px)
    $('#bigtext').bigtext();
    </script>
    
Releases
----------------------------

* `v1.0` Initial release
* `v1.1` Added line exempt feature.