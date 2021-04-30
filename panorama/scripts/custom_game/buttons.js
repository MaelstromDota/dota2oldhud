function test(){
    $.Schedule(1, test);
    var newUI = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("HUDElements");
    // newUI.FindChildTraverse('GlyphScanContainer').style.width = '1920px'
    // newUI.FindChildTraverse('GlyphScanContainer').FindChildTraverse('glyph').style.zIndex = '3'
}
test()