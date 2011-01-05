BigTextTest = TestCase('BigTextTest');

BigTextTest.prototype.tolerance = 8;

BigTextTest.prototype.testExists = function()
{
    assertTrue(!!BigText);
    assertTrue(!!$.fn.bigtext);
};

BigTextTest.prototype.testStyleInjection = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext();

    assertTrue('Test to make sure the style tag was inserted.', $('#' + BigText.STYLE_ID).length === 1);
};

BigTextTest.prototype.testDoubleStyleInjection = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext();
    $('#test').bigtext();

    assertTrue('Test to make sure the style tag wasn\'t inserted twice.', $('#' + BigText.STYLE_ID).length === 1);
};


BigTextTest.prototype.testCleanup = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext();

    assertTrue('Clone should be deleted.', $('.bigtext-cloned').length === 0);
};

BigTextTest.prototype.testOneLine = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a single line.</div></div>');
    $('#test').bigtext();

    assertTrue('Class added.', $('#test').is('.bigtext'));
    assertTrue('First line class added.', $('#test > div').is('.bigtext-line0'));
    assertTrue('Font size must be larger than the starting pixel size.', parseInt($('#test > div').css('font-size'), 10) > BigText.STARTING_PX_FONT_SIZE);
};

BigTextTest.prototype.testTwoLines = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is</div><div>a longer second line</div></div>');
    $('#test').bigtext();

    assertTrue('Class added.', $('#test').is('.bigtext'));

    var lines = $('#test > div');
    assertTrue('First line class added.', lines.eq(0).is('.bigtext-line0'));
    assertTrue('Second line class added.', lines.eq(1).is('.bigtext-line1'));

    assertTrue('The second line is longer, and should be a smaller font size.', parseInt(lines.eq(0).css('font-size'), 10) > parseInt(lines.eq(1).css('font-size'), 10));
    assertTrue('The first line\'s width should be about 600px.', lines.eq(0).width() > 600 - this.tolerance && lines.eq(0).width() < 600 + this.tolerance);
    assertTrue('The second line\'s width should be about 600px.', lines.eq(1).width() > 600 - this.tolerance && lines.eq(1).width() < 600 + this.tolerance);
};

BigTextTest.prototype.testThreeLines = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is</div><div>a longer second line</div><div>An even longer third line.</div></div>');
    $('#test').bigtext();

    assertTrue('Class added.', $('#test').is('.bigtext'));

    var lines = $('#test > div');
    assertTrue('First line class added.', lines.eq(0).is('.bigtext-line0'));
    assertTrue('Second line class added.', lines.eq(1).is('.bigtext-line1'));
    assertTrue('Third line class added.', lines.eq(2).is('.bigtext-line2'));

    assertTrue('The second line is longer, and should be a smaller font size.', parseInt(lines.eq(0).css('font-size'), 10) > parseInt(lines.eq(1).css('font-size'), 10));
    assertTrue('The third line is longer, and should be an even smaller font size.', parseInt(lines.eq(1).css('font-size'), 10) > parseInt(lines.eq(2).css('font-size'), 10));
    assertTrue('The first line\'s width should be about 600px.', lines.eq(0).width() > 600 - this.tolerance && lines.eq(0).width() < 600 + this.tolerance);
    assertTrue('The second line\'s width should be about 600px.', lines.eq(1).width() > 600 - this.tolerance && lines.eq(1).width() < 600 + this.tolerance);
    assertTrue('The third line\'s width should be about 600px.', lines.eq(2).width() > 600 - this.tolerance && lines.eq(2).width() < 600 + this.tolerance);
};

BigTextTest.prototype.testMaxFontSize = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>1</div></div>');
    $('#test').bigtext();

    assertEquals('Font size should equal the maximum.', $('#test > div').css('font-size'), BigText.STARTING_PX_FONT_SIZE * BigText.DEFAULT_MAX_FONT_SIZE_EM + 'px');
};

BigTextTest.prototype.testUnbrokenSingleWord = function()
{
    $(document.body).append('<div id="test" style="width:300px"><div>This</div></div>');
    $('#test').bigtext();

    assertTrue('Font size must be larger than the starting pixel size.', parseInt($('#test > div').css('font-size'), 10) > BigText.STARTING_PX_FONT_SIZE);
};