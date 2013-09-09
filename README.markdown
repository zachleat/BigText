BigText Makes Text Big
============================

* Read the [original blog post](http://www.zachleat.com/web/bigtext-makes-text-big/)
* Play around on the [demo](http://www.zachleat.com/bigtext/)
* Watch the [video](http://www.youtube.com/watch?v=OuqB6e6NPRM)

Requirements
----------------------------
1. jQuery
1. A block level parent element. BigText will force all children to be block level as well.

Examples
----------------------------

### Simple Example

    <div id="bigtext">
        <div>BIGTEXT</div>
        <div>Makes Text Big</div>
    </div>
    <script>
    $('#bigtext').bigtext();
    </script>

### Better, Progressive Enhancement-Based Example

Use `display: inline` children (like a `span`) so the text will flow correctly if BigText doesn’t run.

    <div id="bigtext">
        <span>BIGTEXT</span>
        <span>Makes Text Big</span>
    </div>
    <script>
    // Only BigText on “new-ish” browsers
    if( 'querySelectorAll' in document ) {
        $('#bigtext').bigtext({
			childSelector: '> span'
		});    
    }
    </script>

### Using a List (ordered/unordered)

    <ol id="bigtext">
        <li>BIGTEXT</li>
        <li>Makes Text Big</li>
    </ol>
    <script>
    $('#bigtext').bigtext();
    </script>

### Using other types of children

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
    </ol>
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

Works also with `letter-spacing`, `word-spacing`, and `text-transform`.

### Using with Custom Font-Face

**Warning**: a known issue exists with the [Google/TypeKit font loader in WebKit](https://github.com/typekit/webfontloader/issues/26).

    <div id="bigtext">
        <span>BIGTEXT</span>
        <span>Makes Text Big</span>
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
        <span>BIG</span><!-- the shorter the line, the larger the size required --> 
    </div>
    <script>
    $('#bigtext').bigtext({
        maxfontsize: 60 // default is 48 (in px)
    });
    </script>

### Adding a default min font size

    <div id="bigtext">
        <span>This is a super long line that will probably be resized to epically small proportions. We need a minimum font size!</span>
    </div>
    <script>
    $('#bigtext').bigtext({
        minfontsize: 16 // default is null
    });
    </script>

### Is your text static and unchanging?

See [Paravel's FitText plugin](http://fittextjs.com/). Curious how the two plugins compare? I've written a full [comparison between FitText and BigText](http://www.zachleat.com/web/fittext-and-bigtext/).

Extra Features
----------------------------
### Re-BigText on Resize (Responsive BigText)

BigText does not implement its own debounced resize event, to reduce duplicate code. However, it does search for existing implementations. For example, [Ben Alman's Throttle/Debounce plugin](https://github.com/cowboy/jquery-throttle-debounce) or [Louis-Remi Babe's SmartResize](https://github.com/lrbabe/jquery-smartresize/), in that order.  If no debounced plugin is found, BigText will bind to the native resize event.

### Debug Mode

BigText uses an off-canvas detached node to improve performance when sizing. Setting `DEBUG_MODE` to true will leave this detached node on the canvas for visual inspection for problem resolution.

    BigText.DEBUG_MODE = true;

Common Problems
----------------------------

### Lines Wrapping Pre-BigText
The starting font-size must be small enough to guarantee that each individual line is not wrapping pre-BigText. If the line is too long, BigText will not size it correctly.
    
Releases
----------------------------

* `v1.0` Initial release
* `v1.1` Added line exempt feature.
* `v1.2` Responsive BigText resizes with media queries and resize events (optionally debounced).
* `v1.3`
* `v1.4` on `2013-08-24` Numerous bug fixes, improved accuracy, adds debug mode. 

Build Status
----------------------------

[![Build Status](https://travis-ci.org/zachleat/BigText.png?branch=master)](https://travis-ci.org/zachleat/BigText)
