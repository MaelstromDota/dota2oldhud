function OnLVLButtonPressed() {if (Game.IsInAbilityLearnMode()){Game.EndAbilityLearnMode()}else{Game.EnterAbilityLearnMode()}};
function PointCheker() {
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
	$.Schedule(Game.GetGameFrameTime(), PointCheker)
};
PointCheker();