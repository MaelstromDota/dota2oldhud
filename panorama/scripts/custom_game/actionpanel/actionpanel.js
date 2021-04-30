(function () {
    var SilenceState;
    (function (SilenceState) {
        SilenceState[SilenceState["None"] = 0] = "None";
        SilenceState[SilenceState["Abilities"] = 1] = "Abilities";
        SilenceState[SilenceState["Passives"] = 2] = "Passives";
        SilenceState[SilenceState["All"] = 3] = "All";
    })(SilenceState || (SilenceState = {}));
    var ItemDB = {
        587: "default",
        10150: "dire",
        10324: "portal",
        11349: "mana_pool"
    };
    var units = {};
    var currentUnit = -1;
    var abilities = {};
    var learnMode = false;
    var silenceState = SilenceState.None;
    function SetActionPanel(unit) {
        var abilityContainer = $("#AbilitiesContainer");
        for (var ab in abilities) {
            abilities[ab].panel.style.visibility = "collapse";
        }
        abilityContainer.RemoveClass("AbilityLayout" + countAbilityLayout(currentUnit));
        currentUnit = unit;
        if (units[unit] !== undefined) {
            abilities = units[unit];
        }
        else {
            units[unit] = {};
            abilities = units[unit];
        }
        updateVisibleAbilities();
        learnMode = false;
        for (var ab in abilities) {
            abilities[ab].setLearnMode(learnMode);
        }
        if (!Entities.IsEnemy(unit)) {
            silenceState = getSilenceState(unit);
            for (var ab in abilities) {
                abilities[ab].setSilenceState(silenceState);
            }
        }
        abilityContainer.AddClass("AbilityLayout" + countAbilityLayout(unit));
		$("#HeroName").text = $.Localize(Entities.GetUnitName(currentUnit))
		$("#Portrait").SetUnit(Entities.GetUnitName(currentUnit),Entities.GetUnitName(currentUnit),true)
		onUpdate()
    }
    function onUpdateSelectedUnit(event) {
        var unit = Players.GetLocalPlayerPortraitUnit();
        SetActionPanel(unit);
    }
    function onUpdateQueryUnit(event) {
        var unit = Players.GetQueryUnit(Players.GetLocalPlayer());
        if (unit !== -1) {
            SetActionPanel(unit);
        }
    }
    function onStatsChanged(event) {
        for (var ab in abilities) {
            abilities[ab].reinit();
        }
    }
    function onAbilityChanged(event) {
        updateVisibleAbilities();
    }
    function onSteamInventoryChanged(event) {
        var skinName = GameUI.CustomUIConfig().itemdef[event.itemdef];
        if (skinName !== undefined) {
            $("#MinimapBorder").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/actionpanel/minimapborder.png");
            $("#MinimapSpacer").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/actionpanel/spacer_16_9.png");
            $("#PortraitBorder").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/actionpanel/portrait_wide.png");
            $("#center_left_wide").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/actionpanel/center_left_wide.png");
            $("#center_right").SetImage("raw://resource/flash3/images/hud_skins/" + skinName + "/actionpanel/center_right.png");
        }
    }
    function updateVisibleAbilities() {
        var abilityContainer = $("#AbilitiesContainer");
        for (var ab in abilities) {
            abilities[ab].panel.style.visibility = "collapse";
        }
        var slot = 0;
        var abilityCount = Entities.GetAbilityCount(currentUnit) - 1;
        while (slot < abilityCount) {
            var ability = Entities.GetAbility(currentUnit, slot);
            if (ability === -1) {
                break;
            }
            if (!Abilities.IsAttributeBonus(ability) && !Abilities.IsHidden(ability)) {
                if (abilities[ability] !== undefined) {
                    abilities[ability].panel.style.visibility = "visible";
                    abilities[ability].reinit();
                }
                else {
                    var abilityPanel = new AbilityPanel(abilityContainer, ability, currentUnit);
                    abilities[ability] = abilityPanel;
                }
                if (slot > 0) {
                    var previousAbility = Entities.GetAbility(currentUnit, slot - 1);
                    if (abilities[previousAbility] !== undefined) {
                        abilityContainer.MoveChildAfter(abilities[ability].panel, abilities[previousAbility].panel);
                    }
                }
            }
            slot++;
        }
    }
    function countAbilityLayout(unit) {
        var count = 0;
        for (var slot = 0; slot < Entities.GetAbilityCount(currentUnit); slot++) {
            var ability = Entities.GetAbility(unit, slot);
            if (ability === -1) {
                break;
            }
            if (!Abilities.IsAttributeBonus(ability) && !Abilities.IsHidden(ability)) {
                count++;
            }
        }
        return count;
    }
    function getSilenceState(unit) {
        var state = SilenceState.None;
        if (Entities.IsSilenced(unit) || Entities.IsHexed(unit))
            state += SilenceState.Abilities;
        if (Entities.PassivesDisabled(unit))
            state += SilenceState.Passives;
        return state;
    }
    function onUpdate() {
        var currentUnit = Players.GetLocalPlayerPortraitUnit()
        if (Game.IsInAbilityLearnMode() !== learnMode) {
            learnMode = Game.IsInAbilityLearnMode();
            for (var ab in abilities) {
                abilities[ab].setLearnMode(learnMode);
            }
        }
        $("#HealthBarInner").style.width = (Entities.GetHealth(currentUnit) / Entities.GetMaxHealth(currentUnit)) * 100 + "%";
        $("#ManaBarInner").style.width = (Entities.GetMana(currentUnit) / Entities.GetMaxMana(currentUnit)) * 100 + "%";
		$("#HealthBarText").text = (Entities.GetHealth(currentUnit) + '/' + Entities.GetMaxHealth(currentUnit)) + ' +' + Entities.GetHealthThinkRegen(currentUnit);
        $("#ManaBarText").text = (Entities.GetMana(currentUnit) + '/' + Entities.GetMaxMana(currentUnit)) + ' +' + Entities.GetManaThinkRegen(currentUnit).toFixed(1);
        $("#LevelNumber").text = Players.GetLevel(Game.GetLocalPlayerID());
        $("#XPLabel").text = Entities.GetCurrentXP(currentUnit) + '/' + (Entities.GetNeededXPToLevel(currentUnit));
        if (String(Number(Entities.GetCurrentXP(currentUnit) / Entities.GetNeededXPToLevel(currentUnit) * 40)) != 'NaN') {$("#XPBar").style.width = (Number(Entities.GetCurrentXP(currentUnit) / Entities.GetNeededXPToLevel(currentUnit) * 40) + '%');}
        if (!Entities.IsEnemy(currentUnit)) {
            var silenceS = getSilenceState(currentUnit);
            if (silenceS !== silenceState) {
                silenceState = silenceS;
                for (var ab in abilities) {
                    abilities[ab].setSilenceState(silenceState);
                }
            }
            for (var ab in abilities) {
                abilities[ab].update();
            }
        }
        $.Schedule(0.005, onUpdate);
    }
    GameEvents.Subscribe("dota_player_update_selected_unit", onUpdateSelectedUnit);
    GameEvents.Subscribe("dota_player_update_query_unit", onUpdateQueryUnit);
    GameEvents.Subscribe("dota_portrait_unit_stats_changed", onStatsChanged);
    GameEvents.Subscribe("dota_ability_changed", onAbilityChanged);
    GameEvents.Subscribe("inventory_updated", onSteamInventoryChanged);
    var unit = Players.GetQueryUnit(Players.GetLocalPlayer());
    if (unit === -1) {
        unit = Players.GetLocalPlayerPortraitUnit();
    }
    SetActionPanel(unit);
    onUpdate();
})();