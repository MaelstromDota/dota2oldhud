function OnLVLButtonPressed() {if (Game.IsInAbilityLearnMode()){Game.EndAbilityLearnMode()}else{Game.EnterAbilityLearnMode()}};
function Main() {
	if (Entities.GetAbilityPoints(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())) > 0 && Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) == Players.GetLocalPlayerPortraitUnit()) {
		$('#LevelUpButton').style.opacity = 1;
		$('#Hotkey').style.visibility = 'visible';
		$('#LVLUPText').text = `${$.Localize("#DOTA_LevelUp")} +${Entities.GetAbilityPoints(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()))}`;
		$('#Hotkey').text = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_LEARN_ABILITIES).toString();
	} else {
		$('#Hotkey').style.visibility = 'collapse';
		$('#LevelUpButton').style.opacity = 0;
		Game.EndAbilityLearnMode();
	};
	$("#Death").visible = !Entities.IsAlive(Players.GetLocalPlayerPortraitUnit()) && Entities.IsRealHero(Players.GetLocalPlayerPortraitUnit());
	$("#BuyBack").visible = !Entities.IsAlive(Players.GetLocalPlayerPortraitUnit()) && Entities.IsRealHero(Players.GetLocalPlayerPortraitUnit());
	$("#DeathTimer").SetDialogVariableInt("seconds", Players.GetRespawnSeconds(Entities.GetPlayerOwnerID(Players.GetLocalPlayerPortraitUnit()))+1);
	$("#DeathTimer").text = $.Localize("#DOTAold_RespawnTime",$("#DeathTimer"));
	$.Schedule(Game.GetGameFrameTime(), Main)
};
function PingRespawnTime() {
	if (GameUI.IsAltDown()) {
		$("#Death").SetDialogVariableInt("seconds", Players.GetRespawnSeconds(Entities.GetPlayerOwnerID(Players.GetLocalPlayerPortraitUnit()))+1)
		$("#Death").SetDialogVariable("name", $.Localize(`#${Entities.GetUnitName(Players.GetLocalPlayerPortraitUnit())}`))
		if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) == Players.GetLocalPlayerPortraitUnit()) {Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Self_Dead",$("#Death"))}`)} else
		if (Entities.IsEnemy(Players.GetLocalPlayerPortraitUnit())) {Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Enemy_Dead",$("#Death"))}`)} else
		{Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Ally_Dead",$("#Death"))}`)};
	}
}
function BuyBack() {
	if (GameUI.IsAltDown()) {

	} else {Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK});};
}
Main();