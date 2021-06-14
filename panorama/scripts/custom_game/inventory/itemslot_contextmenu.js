function ShowInShop() {
	GameEvents.SendEventClientSide("dota_link_clicked", {"link": (`dota.item.${Abilities.GetAbilityName($.GetContextPanel().GetAttributeInt("itemID", -1))}`), "shop": 0, "recipe": 0});
    $.DispatchEvent("DismissAllContextMenus");
}
function Sell() {
    Items.LocalPlayerSellItem($.GetContextPanel().GetAttributeInt("itemID", -1));
    $.DispatchEvent("DismissAllContextMenus");
}
function Disassemble() {
    Items.LocalPlayerDisassembleItem($.GetContextPanel().GetAttributeInt("itemID", -1));
    $.DispatchEvent("DismissAllContextMenus");
}
function Alertable() {
    Items.LocalPlayerItemAlertAllies($.GetContextPanel().GetAttributeInt("itemID", -1));
    $.DispatchEvent("DismissAllContextMenus");
}
function DropFromStash() {
    Items.LocalPlayerDropItemFromStash($.GetContextPanel().GetAttributeInt("itemID", -1));
    $.DispatchEvent("DismissAllContextMenus");
}
function MoveToStash() {
    Items.LocalPlayerMoveItemToStash($.GetContextPanel().GetAttributeInt("itemID", -1));
    $.DispatchEvent("DismissAllContextMenus");
}
function LockCombine() {
    Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, AbilityIndex: $.GetContextPanel().GetAttributeInt("itemID", -1)});
    $.DispatchEvent("DismissAllContextMenus");
}
function UnlockCombine() {
    Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, AbilityIndex: $.GetContextPanel().GetAttributeInt("itemID", -1), TargetIndex: 0});
    $.DispatchEvent("DismissAllContextMenus");
}
