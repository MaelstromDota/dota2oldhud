function OnLVLButtonPressed() {if (Game.IsInAbilityLearnMode()){Game.EndAbilityLearnMode()}else{Game.EnterAbilityLearnMode()}};
function Main() {
	if (Entities.GetAbilityPoints(Entities.GetLocalPlayer()) > 0 && Entities.GetLocalPlayer() == Players.GetLocalPlayerPortraitUnit()) {
		$('#LevelUpButton').style.opacity = 1;
		$('#Hotkey').style.visibility = 'visible';
		$('#LVLUPText').text = `${$.Localize("#DOTA_LevelUp")} +${Entities.GetAbilityPoints(Entities.GetLocalPlayer())}`;
		$('#Hotkey').text = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_LEARN_ABILITIES).toString();
	} else {
		$('#Hotkey').style.visibility = 'collapse';
		$('#LevelUpButton').style.opacity = 0;
		Game.EndAbilityLearnMode();
	};
	$("#Death").visible = !Entities.IsAlive(Players.GetLocalPlayerPortraitUnit());
	$("#BuyBack").visible = !Entities.IsAlive(Players.GetLocalPlayerPortraitUnit()) && Entities.IsPlayer(Players.GetLocalPlayerPortraitUnit());
	$("#DeathTimer").visible = Entities.IsPlayer(Players.GetLocalPlayerPortraitUnit());
	$("#DeathTimer").SetDialogVariableInt("seconds", Players.GetRespawnSeconds(Players.GetCurrentUnitPlayerID())+1);
	$("#BuyBackCost").text = Players.GetBuybackCost(Players.GetLocalPlayer());
	$("#DeathTimer").text = $.Localize("#DOTAold_RespawnTime",$("#DeathTimer"));
	if (Entities.IsPlayer(Players.GetLocalPlayerPortraitUnit()) && Players.CanPlayerBuyback(Players.GetCurrentUnitPlayerID())) {$("#BuyBack").SetImage("file://{images}/hud/buyback_button.png");} else if (Entities.IsPlayer(Players.GetLocalPlayerPortraitUnit())) {$("#BuyBack").SetImage("file://{images}/hud/no_buyback_button.png");};
	$.Schedule(Game.GetGameFrameTime(), Main);
};
function PingRespawnTime() {
	if (GameUI.IsAltDown()) {
		$("#Death").SetDialogVariableInt("seconds", Players.GetRespawnSeconds(Players.GetCurrentUnitPlayerID())+1)
		$("#Death").SetDialogVariable("name", $.Localize(`#${Entities.GetUnitName(Players.GetLocalPlayerPortraitUnit())}`))
		if (Entities.GetLocalPlayer() == Players.GetLocalPlayerPortraitUnit()) {Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Self_Dead",$("#Death"))}`)} else
		if (Entities.IsEnemy(Players.GetLocalPlayerPortraitUnit())) {Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Enemy_Dead",$("#Death"))}`)} else
		{Game.ServerCmd(`say_team ${$.Localize("#DOTAold_HPMana_Alert_Ally_Dead",$("#Death"))}`)};
	}
}
function BuyBack() {
	if (GameUI.IsAltDown()) {
		if (Entities.GetLocalPlayer() == Players.GetLocalPlayerPortraitUnit()) {
			$("#BuyBack").SetDialogVariable("seconds", Math.abs(Players.GetBuybackCooldown(Players.GetLocalPlayer())).toString())
			$("#BuyBack").SetDialogVariableInt("gold", Math.abs(Players.GetGold(Players.GetLocalPlayer()) - Players.GetBuybackCost(Players.GetLocalPlayer())))
			let alert = $.Localize('#DOTAold_BuyBackStateAlert_Ready',$('#BuyBack'))
			if (Players.GetBuybackCooldown(Players.GetLocalPlayer()) > 0) {alert = $.Localize('#DOTAold_BuyBackStateAlert_Cooldown'),$('#BuyBack')} else
			if (Players.GetGold(Players.GetLocalPlayer()) < Players.GetBuybackCost(Players.GetLocalPlayer())) {alert = $.Localize('#DOTAold_BuyBackStateAlert_Gold',$('#BuyBack'))} else
			if (!Players.CanPlayerBuyback(Players.GetLocalPlayer())) {alert = $.Localize('#DOTAold_BuyBackStateAlert_ReapersScythe',$('#BuyBack'))};
			Game.ServerCmd(`say_team ${alert}`)
		}
	} else if (Entities.GetLocalPlayer() == Players.GetLocalPlayerPortraitUnit()) {Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK});};
}
Main();