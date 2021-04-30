function removetrash(){
	$.Schedule( 1, removetrash )
	var pregame = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("PreGame");
	pregame.FindChildTraverse('StartingItemsBackpackRow').style.visibility = 'collapse';
	pregame.FindChildTraverse('StartingItemsRightColumn').style.visibility = 'collapse';
	var newUI = $.GetContextPanel().GetParent().GetParent().FindChildTraverse("HUDElements");
	newUI.FindChildTraverse('inventory_backpack_list').style.visibility = 'collapse';
	newUI.FindChildTraverse('GridNeutralsTab').style.visibility = 'collapse';
	newUI.FindChildTraverse('AghsStatusShard').style.visibility = 'collapse';
	newUI.FindChildTraverse('lower_hud').FindChildTraverse('center_block').FindChildTraverse('ButtonAndLevel').style.visibility = 'collapse';
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, true );
    GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, true );
}
removetrash()