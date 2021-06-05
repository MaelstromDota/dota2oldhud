var LearnActive = false;
var SaveAbilityList = [];
(function () {
	SearchForSkills();
})();
function SearchForSkills() {
	SaveAbilityList = [];
	for (let i = 0; i <= 32; i++) {
		var Aentity = Entities.GetAbility(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), i);
		var Aname = Abilities.GetAbilityName(Aentity);
		if (Abilities.IsDisplayedAbility(Aentity) && Aname != 'attribute_bonus_datadriven') {SaveAbilityList.push(i);};
	};
};
function OnLVLButtonPressed() {
	LearnActive = !LearnActive;
	PointCheker();
};
function PointCheker() {
	if (Entities.GetAbilityPoints(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())) > 0 && Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) == Players.GetLocalPlayerPortraitUnit()) {
		$('#LevelUpButton').style.opacity = 1;
		if (LearnActive) {
			let AbilityUp = [];
			for (let i = 0; i < SaveAbilityList.length; i++) {
				var Aentity = Entities.GetAbility(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i]);
				if (Abilities.CanAbilityBeUpgraded(Aentity) == 0 && Entities.GetLevel(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())) >= Abilities.GetHeroLevelRequiredToUpgrade(Aentity)) {
					AbilityUp.push(i);
				};
			};
			HideUpgradableAbilities();
			VisibleLvlUpBacklighting(AbilityUp);
		} else {
			HideUpgradableAbilities();
		};
	} else {
		LearnActive = false;
		$('#LevelUpButton').style.opacity = 0;
		HideUpgradableAbilities();
	};
};
function VisibleLvlUpBacklighting(AbilityUp) {
	let AllAbilities = $('#AbilitiesContainer').Children();
	for (let i = 0; i < AbilityUp.length; i++) {
		AllAbilities[AbilityUp[i]].FindChildTraverse("AbilityImage").RemoveClass("NotLearned");
		AllAbilities[AbilityUp[i]].FindChildTraverse("LearnOverlay").style.visibility = 'visible';
	};
};
function HideUpgradableAbilities() {
	let AllAbilities = $('#AbilitiesContainer').Children();
	if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) == Players.GetLocalPlayerPortraitUnit()) {
		for (let i = 0; i < AllAbilities.length; i++) {
			AllAbilities[i].FindChildTraverse("LearnOverlay").style.visibility = 'collapse';
			if (Abilities.GetLevel(Entities.GetAbility(Players.GetLocalPlayerPortraitUnit(), i)) < 1) {
				AllAbilities[i].FindChildTraverse("AbilityImage").AddClass("NotLearned");
			};
		};
	};
};
function AddLearnSkill() {
	SearchForSkills();
	let AllAbilities = $('#AbilitiesContainer').Children();
	for (let i = 0; i < SaveAbilityList.length; i++) {
		AllAbilities[i].FindChildTraverse("LearnOverlay").SetPanelEvent('onactivate', function () {
			Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY, UnitIndex: Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), AbilityIndex: Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i] ), Queue: OrderQueueBehavior_t.DOTA_ORDER_QUEUE_NEVER, ShowEffects: false});
		});
	};
};
function UpdateSelectedUnit() {
	if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != Players.GetLocalPlayerPortraitUnit()) {
		LearnActive = false;
	};
	PointCheker();
};
GameEvents.Subscribe("dota_player_learned_ability", PointCheker );
GameEvents.Subscribe("dota_player_gained_level", PointCheker );
GameEvents.Subscribe("dota_player_update_selected_unit", UpdateSelectedUnit );
function OnPanelLoaded() {
	$.Schedule(3, function () {
		SearchForSkills();
		PointCheker();
		AddLearnSkill();
	}); 
};