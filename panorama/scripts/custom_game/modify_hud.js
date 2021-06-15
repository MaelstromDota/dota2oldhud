function removetrash(){
	let pregame = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("PreGame");
	pregame.FindChildTraverse('StartingItemsBackpackRow').style.visibility = 'collapse';
	pregame.FindChildTraverse('StartingItemsRightColumn').style.visibility = 'collapse';
	let newUI = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("HUDElements");
	let customui = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("CustomUIRoot");
	newUI.FindChildTraverse('inventory_backpack_list').style.visibility = 'collapse';
	newUI.FindChildTraverse('GridNeutralsTab').style.visibility = 'collapse';
	newUI.FindChildTraverse('AghsStatusShard').style.visibility = 'collapse';
	newUI.FindChildTraverse('ShopCourierControls').style.visibility = 'collapse';
	newUI.FindChildTraverse('shop_launcher_bg').style.visibility = 'collapse';
	newUI.FindChildTraverse('stash').style.marginBottom = '90px';
	newUI.FindChildTraverse('stash').style.marginRight = '350px';
	newUI.FindChildTraverse('QuickBuyRows').style.marginBottom = '95px';
	newUI.FindChildTraverse('QuickBuyRows').style.height = '68px';
	newUI.FindChildTraverse('QuickBuyRows').style.width = '213px';
	newUI.FindChildTraverse('QuickBuyRows').style.horizontalAlign = 'right';
	newUI.FindChildTraverse('QuickBuyRows').style.backgroundColor = "#000000";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("Hint").style.marginLeft = "10px";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("ClearQuickBuy").style.marginRight = "12px";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("ClearQuickBuy").style.marginTop = "45px";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("QuickBuySlot8").style.verticalAlign = "top";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("QuickBuySlot8").style.marginTop = "10px";
	newUI.FindChildTraverse('QuickBuyRows').FindChildTraverse("StickyItemSlotContainer").style.backgroundColor = "#00000000";
	newUI.FindChildTraverse('lower_hud').FindChildTraverse('center_block').FindChildTraverse('ButtonAndLevel').style.visibility = 'collapse';
	newUI.FindChildTraverse('QuickStatsContainer').style.visibility = 'collapse';
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, true );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, true );
	if (customui.FindChildTraverse('ZooHUD') != undefined && customui.FindChildTraverse('ZooHUD').FindChildTraverse("HeroViewButton") != undefined) {
		customui.FindChildTraverse('ZooHUD').FindChildTraverse("HeroViewButton").style.marginBottom = "34px";
		customui.FindChildTraverse('ZooHUD').FindChildTraverse("InspectButton").style.marginBottom = "36px";
		customui.FindChildTraverse('ZooHUD').FindChildTraverse("InspectButton").style.marginLeft = "128px";
	}
	$.Schedule( 1, removetrash )
}
removetrash()