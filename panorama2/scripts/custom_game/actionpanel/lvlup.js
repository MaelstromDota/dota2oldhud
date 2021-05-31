// Глабальные переменные
var LearnActive = false;
var SaveAbilityList = [];


// Безымянная функция
(function () {
    SearchForSkills()

})();


// Находит все прокачеваемые скилы
function SearchForSkills() {
    SaveAbilityList = []
    for (let i = 0; i <= 32; i++) {
        var Aentity = Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), i )
        var Aname = Abilities.GetAbilityName( Aentity )
        if ( Abilities.IsDisplayedAbility( Aentity ) && Aname != 'attribute_bonus_datadriven' ) {
            SaveAbilityList.push(i)
            $.Msg(`[${i}]: the skill exists,  name = ${Aname},  Type = ${Abilities.GetAbilityType(Aentity)}, test = ${Abilities.GetHeroLevelRequiredToUpgrade(Aentity)}`)
        }
    }
    $.Msg(SaveAbilityList)
}

// Функция кнопки лвлапа
function OnLVLButtonPressed() {
    LearnActive = !LearnActive
    $.Msg(`LearnActive = ${LearnActive}`)
    PointCheker()
} 

// Функция поределяющая еслть ли скилл поинт и в зависимости от результата добавляет ui лвлапа
function PointCheker() {
    // $.Msg('[PointCheker]: Run')
    if (Entities.GetAbilityPoints( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()) ) != 0) {
        $('#LevelUpButton').style.opacity = 1
        if (LearnActive) {
            $.Msg('\n\n--------------------------------------------------------------------------------------')
            let AbilityUp = [];

            for (let i = 0; i < SaveAbilityList.length; i++) {
                var Aentity = Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i] )
                var Aname = Abilities.GetAbilityName( Aentity )
                if ( Abilities.CanAbilityBeUpgraded( Aentity ) == 0 && Entities.GetLevel(Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())) >= Abilities.GetHeroLevelRequiredToUpgrade(Aentity)) {
                    $.Msg(`GetHeroLevelRequiredToUpgrade: ${Abilities.GetHeroLevelRequiredToUpgrade(Aentity)}`)
                    if (Abilities.GetAbilityType(Aentity) == 1) {
                        AbilityUp.push(AbilityUp[AbilityUp.length - 1] + 1)
                    } else {
                        AbilityUp.push(i)
                    }
                    $.Msg(`[${i}]Skill can be learn`)
                }
            }
            // $('#LevelUpButton').SetFocus()
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

// Функция подсвечивающая абилки, которые можно вкачать и вкл возможность прокачки лкм
function VisibleLvlUpBacklighting(AbilityUp) {
    $.Msg('\n[VisibleLvlUpBacklighting]: Run')
    let AllAbilities = $('#AbilitiesContainer').Children()
    for (let i = 0; i < AbilityUp.length; i++) {
        AllAbilities[AbilityUp[i]].FindChildTraverse("AbilityImage").style.saturation = '1';
        AllAbilities[AbilityUp[i]].FindChildTraverse("AbilityImage").style.brightness = '1';
        AllAbilities[AbilityUp[i]].FindChildTraverse("LearnOverlay").style.visibility = 'visible';
    }
}


// Функция снимающая все подсветки и возможность прокачки лкм
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

// Добавление функции прокачки скиллов к кнопкам
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

// Проверка выбранного существа
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
// GameEvents.Subscribe("dota_inventory_item_added", AddMBAghanim );

// function AddMBAghanim(dat) {
//     $.Msg(`itemname = ${dat.itemname}`)
//     if (dat.itemname == 'item_ultimate_scepter') {
//         $.Msg('dat.itemname == item_ultimate_scepter')
//         ReSpawnLBLUPButtons()
//     }
// }


// Функция загружающая другие функции при загрузке элемента панели XD
function OnPanelLoaded() {
    $.Msg('Lodaded!!!!!!!\n\n\n\n\n__________\n\n')
    $.Schedule(3.0, function () {
        $.Msg('!__[]====')
        SearchForSkills()
        PointCheker()
        AddLeaenSkill()
    }); 
}



// function UpdateSkik(params) {
//     cooldownPanel.style.opacity = "0";
//     cooldownPanel.style.animationDuration = '0s';

//     var Aentity = Entities.GetAbility( Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer()), SaveAbilityList[i] )
//     let max = Abilities.GetCooldownLength( Aentity )
//     let current = Abilities.GetCooldownTimeRemaining( Aentity )
//     let procent = current/max  * 3.6

//     cooldownPanel.style.opacity = "1";
//     cooldownPanel.style.clip = `radial(50% 50%, 0deg, ${360 - procent}deg)`;

//     cooldownPanel.style.animationName = "SpellCooldown";
//     cooldownPanel.style.animationDuration = `${max - current}s`;
//     cooldownPanel.style.animationTimingFunction = `linear`;
//     cooldownPanel.style.animationIterationCount = 1;
// }


