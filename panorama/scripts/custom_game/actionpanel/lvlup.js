var LearnActive = false;
var SaveAbilityList = [];
(function () {
    SearchForSkills()
})();
function SearchForSkills() {
    SaveAbilityList = []
    for (let i = 0; i <= 32; i++) {
        var Aentity = Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), i )
        var Aname = Abilities.GetAbilityName( Aentity )
        if ( Abilities.IsDisplayedAbility( Aentity ) && Aname != 'attribute_bonus_datadriven' ) {
            SaveAbilityList.push(i)
        }
    }
    $.Msg(SaveAbilityList)
}
function OnLVLButtonPressed() {
    LearnActive = !LearnActive
    PointCheker()
}
function PointCheker() {
    if (Entities.GetAbilityPoints( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) ) != 0) {
        $('#LevelUpButton').style.opacity = 1
        if (LearnActive) {
            let AbilityUp = [];
            for (let i = 0; i < SaveAbilityList.length; i++) {
                var Aentity = Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i] )
                var Aname = Abilities.GetAbilityName( Aentity )
                if ( Abilities.CanAbilityBeUpgraded( Aentity ) == 0 && Entities.GetLevel(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())) >= Abilities.GetHeroLevelRequiredToUpgrade(Aentity)) {
                    if (Abilities.GetAbilityType(Aentity) == 1) {
                        AbilityUp.push(AbilityUp[AbilityUp.length - 1] + 1)
                    } else {
                        AbilityUp.push(i)
                    }
                }
            }
            HideUpgradableAbilities()
            VisibleLvlUpBacklighting(AbilityUp)
        } else {
            HideUpgradableAbilities()
        }
    } else {
        LearnActive = false
        $('#LevelUpButton').style.opacity = 0;
        HideUpgradableAbilities()
    }
}
function VisibleLvlUpBacklighting(AbilityUp) {
    let AllAbilities = $('#AbilitiesContainer').Children()
    for (let i = 0; i < AbilityUp.length; i++) {
        AllAbilities[AbilityUp[i]].FindChildTraverse("AbilityImage").style.saturation = '1';
        AllAbilities[AbilityUp[i]].FindChildTraverse("AbilityImage").style.brightness = '1';
        AllAbilities[AbilityUp[i]].FindChildTraverse("LearnOverlay").style.visibility = 'visible';
    }
}
function HideUpgradableAbilities() {
    let AllAbilities = $('#AbilitiesContainer').Children()
    for (let i = 0; i < AllAbilities.length; i++) {
        AllAbilities[i].FindChildTraverse("LearnOverlay").style.visibility = 'collapse';
        if (Abilities.GetLevel(Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), i )) == 0) {
            AllAbilities[i].FindChildTraverse("AbilityImage").style.saturation = '0';
            AllAbilities[i].FindChildTraverse("AbilityImage").style.brightness = '0.03';
        }
    }
}
function AddLeaenSkill() {
    SearchForSkills()
    let AllAbilities = $('#AbilitiesContainer').Children()
    for (let i = 0; i < SaveAbilityList.length; i++) {
        AllAbilities[i].FindChildTraverse("LearnOverlay").SetPanelEvent('onactivate', function () {
            let order = {
                OrderType : dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
                UnitIndex: Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()),
                AbilityIndex: Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i] ),
                Queue : OrderQueueBehavior_t.DOTA_ORDER_QUEUE_NEVER,
                ShowEffects : false
            };
            Game.PrepareUnitOrders( order );
        })
    }
}
function UpdateSelectedUnit() {
    if (Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) != Players.GetLocalPlayerPortraitUnit()) {
        LearnActive = false
        HideUpgradableAbilities()
        PointCheker()
    }
}
GameEvents.Subscribe("dota_player_learned_ability", PointCheker );
GameEvents.Subscribe("dota_player_gained_level", PointCheker );
GameEvents.Subscribe("dota_player_update_selected_unit", UpdateSelectedUnit );
function OnPanelLoaded() {
    $.Schedule(3.0, function () {
        SearchForSkills()
        PointCheker()
        AddLeaenSkill()
    }); 
}