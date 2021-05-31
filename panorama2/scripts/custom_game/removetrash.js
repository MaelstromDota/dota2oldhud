function removetrash(){
	$.Schedule( 1, removetrash )
	var pregame = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("PreGame");
	pregame.FindChildTraverse('StartingItemsBackpackRow').style.visibility = 'collapse';
	pregame.FindChildTraverse('StartingItemsRightColumn').style.visibility = 'collapse';
	var newUI = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("HUDElements");
	newUI.FindChildTraverse('inventory_backpack_list').style.visibility = 'collapse';
	newUI.FindChildTraverse('GridNeutralsTab').style.visibility = 'collapse';
	newUI.FindChildTraverse('AghsStatusShard').style.visibility = 'collapse';
	newUI.FindChildTraverse('stash').style.marginBottom = '90px';
	newUI.FindChildTraverse('stash').style.marginRight = '350px';
	newUI.FindChildTraverse('QuickBuyRows').style.marginBottom = '95px';
	newUI.FindChildTraverse('QuickBuyRows').style.height = '68px';
	newUI.FindChildTraverse('QuickBuyRows').style.width = '213px';
	newUI.FindChildTraverse('QuickBuyRows').style.horizontalAlign = 'right';
	newUI.FindChildTraverse('QuickBuyRows').style.backgroundColor = "#000000";
	newUI.FindChildTraverse('lower_hud').FindChildTraverse('center_block').FindChildTraverse('ButtonAndLevel').style.visibility = 'collapse';
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, true );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, true );
}
removetrash()