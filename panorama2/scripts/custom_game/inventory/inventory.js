function econHover(origin) {$.DispatchEvent("DOTAShowTextTooltipStyled", $(origin), "#dota_settings_selectcourier", "EconTooltip");}
function econHoverEnd(origin) {$.DispatchEvent("DOTAHideTextTooltip");}
function statusClicked() {GameUI.SelectUnit(currentCourier, false);}
function burstClicked() {GameEvents.SendCustomGameEventToServer('useability', {pid: Players.GetLocalPlayer(), unit: currentCourier, ability: "courier_burst"});}
function deliverClicked() {GameEvents.SendCustomGameEventToServer('useability', {pid: Players.GetLocalPlayer(), unit: currentCourier, ability: "courier_take_stash_and_transfer_items"});}
var ItemDB = {587: "default", 10150: "dire", 10324: "portal", 10346: "mana_pool"};
var currentUnit = Players.GetLocalPlayerPortraitUnit();
var currentCourier = -1;
var courierDeathTime = 0;
function onSteamInventoryChanged(event) {var skinName = GameUI.CustomUIConfig().itemdef[event.itemdef];
    if (skinName !== undefined) {$("#spacer").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/spacer.png");
        $("#rocks").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/rocks_16_9.png");
        $("#background").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/inventory/background_wide.png");}}
function onUnitChanged(event) {
    onInventoryChanged(event);
    if (Players.GetLocalPlayerPortraitUnit() == currentCourier) {$("#courier").AddClass("Selected");} else {$("#courier").RemoveClass("Selected");}
    if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != Players.GetLocalPlayerPortraitUnit()) {$("#stats").SetHasClass("Hidden", true);} else {$("#stats").SetHasClass("Hidden", false);}
    currentUnit = Players.GetQueryUnit(Players.GetLocalPlayer());}
function onInventoryItemChanged(event) {if (Abilities.GetAbilityName(event.entityIndex) == "item_flying_courier") {flyingCourierCheck();}
    onInventoryChanged(null);}
function onInventoryChanged(event) {for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {var item = items_1[_i];
    item.update();}}
function onShopChanged(event) {if (event.shopmask > 0) {$("#shop").AddClass("ShopActive");} else {$("#shop").RemoveClass("ShopActive");}}
GameEvents.Subscribe("inventory_updated", onSteamInventoryChanged);
GameEvents.Subscribe("dota_inventory_changed", onInventoryChanged);
GameEvents.Subscribe("dota_inventory_item_changed", onInventoryItemChanged);
GameEvents.Subscribe("dota_player_update_selected_unit", onUnitChanged);
GameEvents.Subscribe("dota_player_update_query_unit", onUnitChanged);
function onEntityKilled(event) {$("#lhd-value").SetDialogVariableInt("lasthits", Players.GetLastHits(Players.GetLocalPlayer()));
    $("#lhd-value").SetDialogVariableInt("denies", Players.GetDenies(Players.GetLocalPlayer()));}
GameEvents.Subscribe("entity_killed", onEntityKilled);
function onHeroDeath(event) {$("#kda-value").SetDialogVariableInt("kills", Players.GetKills(Players.GetLocalPlayer()));
    $("#kda-value").SetDialogVariableInt("deaths", Players.GetDeaths(Players.GetLocalPlayer()));
    $("#kda-value").SetDialogVariableInt("assists", Players.GetAssists(Players.GetLocalPlayer()));}
GameEvents.Subscribe("entity_killed", onHeroDeath);
function onCourierDeathTimeUpdate() {var time = courierDeathTime--;
    $("#deadCourierTimer").text = Math.floor(time / 60) + ":" + ("00" + (time % 60)).slice(-2);
    if (courierDeathTime < 1)
    return;
    $.Schedule(1, onCourierDeathTimeUpdate);}
function onCourierDeath(event) {$("#courier").AddClass("Dead");
    if ($("#courier").BHasClass("Flying")) {courierDeathTime = 60 * 3;} else {courierDeathTime = 60 * 2;}
    $.Schedule(1, onCourierDeathTimeUpdate);}
GameEvents.Subscribe("dota_courier_lost", onCourierDeath);
function onCourierRespawn(event) {$("#courier").RemoveClass("Dead");}
GameEvents.Subscribe("dota_courier_respawned", onCourierRespawn);
function onCourierSpawn(event) {if (Entities.GetClassname(event.entindex) == "npc_dota_courier") {if (Entities.GetTeamNumber(event.entindex) == Players.GetTeam(Players.GetLocalPlayer())) {
    $("#courier").AddClass("Courier");
    currentCourier = event.entindex;
    flyingCourierCheck();}}}
GameEvents.Subscribe("npc_spawned", onCourierSpawn);
function flyingCourierCheck() {if (currentCourier == -1) {return;}
    if (Entities.HasFlyMovementCapability(currentCourier)) {$("#courier").AddClass("Flying"); return;}
    $.Schedule(0.05, flyingCourierCheck);}
GameEvents.Subscribe("dota_player_shop_changed", onShopChanged);
onEntityKilled(null);
onHeroDeath(null);
var items = [];
for (var i = 0; i < 12; i++) {var parent_1 = $("#row0");
    if (i > 5) {continue;} else if (i > 2) {parent_1 = $("#row1");} // TODO: make
    items[i] = new ItemPanel(parent_1, i);}
$("#deadCourierTimer").text = "N/A";
function onGoldChanged() {$.Schedule(0.1, onGoldChanged)
    $("#goldCount").text = Players.GetGold(Entities.GetPlayerOwnerID(Players.GetLocalPlayerPortraitUnit())).toString();}
onGoldChanged()