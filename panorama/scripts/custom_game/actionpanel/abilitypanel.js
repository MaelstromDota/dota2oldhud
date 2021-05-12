var SilenceState;
(function (SilenceState) {
    SilenceState[SilenceState["None"] = 0] = "None";
    SilenceState[SilenceState["Abilities"] = 1] = "Abilities";
    SilenceState[SilenceState["Passives"] = 2] = "Passives";
    SilenceState[SilenceState["All"] = 3] = "All";
})(SilenceState || (SilenceState = {}));
var AbilityState;
(function (AbilityState) {
    AbilityState[AbilityState["Default"] = 0] = "Default";
    AbilityState[AbilityState["Active"] = 1] = "Active";
    AbilityState[AbilityState["AbilityPhase"] = 2] = "AbilityPhase";
    AbilityState[AbilityState["NoMana"] = 3] = "NoMana";
    AbilityState[AbilityState["Cooldown"] = 4] = "Cooldown";
    AbilityState[AbilityState["Muted"] = 5] = "Muted";
})(AbilityState || (AbilityState = {}));
var AbilityPanel = (function () {
    function AbilityPanel(parent, ability, unit) {
        this.panel = $.CreatePanel("Panel", parent, "");
        this.panel.BLoadLayoutSnippet("AbilityPanel");
        this.panel.SetPanelEvent("onmouseover", this.showTooltip.bind(this));
        this.panel.SetPanelEvent("onmouseout", this.hideTooltip.bind(this));
        this.panel.SetPanelEvent("onactivate", this.onLeftClick.bind(this));
        this.panel.SetPanelEvent("oncontextmenu", this.onRightClick.bind(this));
        this.ability = ability;
        this.abilityName = Abilities.GetAbilityName(ability);
        this.ownerUnit = unit;
        this.level = 0;
        this.maxLevel = Abilities.GetMaxLevel(this.ability);
        this.learning = false;
        this.autocast = false;
        this.state = AbilityState.Default;
        this.pips = [];
        var image = this.panel.FindChildTraverse("AbilityImage");
        image.abilityname = this.abilityName;
        image.contextEntityIndex = this.ownerUnit;
        if (Abilities.IsPassive(this.ability)) {
            this.panel.FindChildTraverse("AbilityFrame").AddClass("Passive");
        }
        if (Abilities.IsAutocast(this.ability)) {
            this.panel.FindChildTraverse("AutocastPanel").style.visibility = "visible";
        }
        if (!Entities.IsEnemy(unit)) {
            this.addLevelPips();
            this.setLevel(Abilities.GetLevel(this.ability));
        }
        this.panel.FindChildTraverse("ManaLabel").style.visibility = "collapse";
        var hotkey = Abilities.GetKeybind(this.ability);
        if (Abilities.IsPassive(this.ability)) {
            this.panel.FindChildTraverse("HotkeyLabel").style.visibility = "collapse";
        }
        else {
            this.panel.FindChildTraverse("HotkeyLabel").text = hotkey;
        }
    }
    AbilityPanel.prototype.addLevelPips = function () {
        var pipContainer = this.panel.FindChildTraverse("PipContainer");
        if (this.maxLevel < 8) {
            for (var i = 0; i < this.maxLevel; i++) {
                var pip = $.CreatePanel("Panel", pipContainer, "");
                if (i < this.level) {pip.AddClass("LeveledPip");} else {pip.AddClass("EmptyPip");} if (this.maxLevel > 5) {pip.AddClass("Small");}
                this.pips.push(pip);
            }
        }
        else {
            var pipLabel = $.CreatePanel("Label", pipContainer, "");
            pipLabel.text = "0/" + this.maxLevel;
            this.pips[0] = pipLabel;
        }
    };
    AbilityPanel.prototype.setLevel = function (level) {
        var manaCost = Abilities.GetManaCost(this.ability);
        this.level = level;
        if (!Entities.IsEnemy(this.ownerUnit)) {
            if (level === 0) {
                this.panel.FindChildTraverse("AbilityImage").AddClass("NotLearned");
                this.panel.FindChildTraverse("ManaLabel").style.visibility = "collapse";
            }
            else {
                this.panel.FindChildTraverse("AbilityImage").RemoveClass("NotLearned");
                if (manaCost > 0) {
                    this.panel.FindChildTraverse("ManaLabel").style.visibility = "visible";
                    this.panel.FindChildTraverse("ManaLabel").text = String(manaCost);
                } else {this.panel.FindChildTraverse("ManaLabel").style.visibility = "collapse";}
            }
            if (this.maxLevel < 8) {
                var pipContainer = this.panel.FindChildTraverse("PipContainer");
                for (var i = 0; i < level; i++) {
                    var pip = this.pips[i];
                    if (pip.BHasClass("EmptyPip") || pip.BHasClass("AvailablePip")) {
                        pip.RemoveClass("EmptyPip");
                        pip.RemoveClass("AvailablePip");
                        pip.AddClass("LeveledPip");
                    }
                }
                if (level < this.maxLevel) {
                    if (Abilities.CanAbilityBeUpgraded(this.ability) === AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED
                        && Entities.GetAbilityPoints(this.ownerUnit) > 0) {
                        this.pips[level].RemoveClass("EmptyPip");
                        this.pips[level].AddClass("AvailablePip");
                    }
                    else {
                        this.pips[level].RemoveClass("AvailablePip");
                        this.pips[level].AddClass("EmptyPip");
                    }
                }
            }
            else {
                this.pips[0].text = level + "/" + this.maxLevel;
            }
        }
    };
    AbilityPanel.prototype.reinit = function () {
        if (!Entities.IsEnemy(this.ownerUnit)) {this.setLevel(Abilities.GetLevel(this.ability));}
        this.setLearnMode(this.learning);
        var hotkey = Abilities.GetKeybind(this.ability);
        this.panel.FindChildTraverse("HotkeyLabel").text = hotkey;
        if (this.state === AbilityState.Cooldown && Abilities.IsCooldownReady(this.ability)) {
            this.state = AbilityState.Default;
            this.panel.FindChildTraverse("AbilityImage").RemoveClass("Active");
            this.panel.FindChildTraverse("AbilityImage").RemoveClass("AbilityPhase");
            this.panel.FindChildTraverse("AbilityImage").RemoveClass("Cooldown");
            this.panel.FindChildTraverse("AbilityPhaseMask").style.visibility = "collapse";
            this.panel.FindChildTraverse("CooldownLabel").style.visibility = "collapse";
        }
    };
    AbilityPanel.prototype.setLearnMode = function (learnMode) {
        this.learning = false;
        if (learnMode && Abilities.CanAbilityBeUpgraded(this.ability) === AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED) {
            this.panel.FindChildTraverse("LearnOverlay").style.visibility = "visible";
            this.panel.FindChildTraverse("AbilityImage").RemoveClass("NotLearned");
            this.learning = true;
        }
        else {
            this.panel.FindChildTraverse("LearnOverlay").style.visibility = "collapse";
            if (this.level === 0 || Entities.IsEnemy(this.ownerUnit)) {this.panel.FindChildTraverse("AbilityImage").AddClass("NotLearned");}
        }
    };
    AbilityPanel.prototype.showTooltip = function () {
        var abilityButton = this.panel.FindChildTraverse("AbilityButton");
        $.DispatchEvent("DOTAShowAbilityTooltipForEntityIndex", abilityButton, this.abilityName, this.ownerUnit);
    };
    AbilityPanel.prototype.hideTooltip = function () {
        var abilityButton = this.panel.FindChildTraverse("AbilityButton");
        $.DispatchEvent("DOTAHideAbilityTooltip", abilityButton);
    };
    AbilityPanel.prototype.onLeftClick = function () {
        if (this.learning) {Abilities.AttemptToUpgrade(this.ability);} else {Abilities.ExecuteAbility(this.ability, this.ownerUnit, false);}
    };
    AbilityPanel.prototype.onRightClick = function () {
        if (Abilities.IsAutocast(this.ability)) {
            Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO, AbilityIndex: this.ability, ShowEffects: true});
        }
    };
    AbilityPanel.prototype.startCooldown = function (duration) {
        var totalDuration = Abilities.GetCooldownLength(this.ability);
        var cooldownPanel = this.panel.FindChildTraverse("cooldownswipe");

        cooldownPanel.style.opacity = "0.75";
        cooldownPanel.style.clip = "radial(50% 50%, 0deg, 0deg)";
        cooldownPanel.style.animationName = "SpellCooldown";
        cooldownPanel.style.animationDuration = `${totalDuration}s`;
        cooldownPanel.style.animationTimingFunction = `linear`;
        cooldownPanel.style.animationIterationCount = 1;
        
        var cooldownLabel = this.panel.FindChildTraverse("CooldownLabel");
        cooldownLabel.text = String(Math.ceil(duration));
        cooldownLabel.style.visibility = "visible";
        $.Schedule(0.1, this.updateCooldown.bind(this));
    };
    AbilityPanel.prototype.updateCooldown = function () {
        var cooldownPanel = this.panel.FindChildTraverse("cooldownswipe");

        if (Abilities.IsCooldownReady(this.ability)) {
            this.panel.FindChildTraverse("CooldownLabel").style.visibility = "collapse";
            cooldownPanel.style.opacity = "0";
            cooldownPanel.style.animationDuration = '0s';
            cooldownPanel.style.clip = "radial(50% 50%, 0deg, -360deg)";
            return;
        }
        var cooldown = Abilities.GetCooldownTimeRemaining(this.ability);
        this.panel.FindChildTraverse("CooldownLabel").text = String(Math.ceil(cooldown));
        $.Schedule(0.1, this.updateCooldown.bind(this));
    };
    AbilityPanel.prototype.setSilenceState = function (state) {
        var silenceMask = this.panel.FindChildTraverse("SilencedMask");
        if (state !== SilenceState.None) {silenceMask.style.visibility = "visible";} else {silenceMask.style.visibility = "collapse";}
    };
    AbilityPanel.prototype.update = function () {
        var state = AbilityState.Default;
        if (Abilities.GetLocalPlayerActiveAbility() === this.ability) {state = AbilityState.Active;}
        else if (Abilities.IsInAbilityPhase(this.ability) || Abilities.GetToggleState(this.ability)) {state = AbilityState.AbilityPhase;}
        else if (!Abilities.IsCooldownReady(this.ability)) {state = AbilityState.Cooldown;}
        else if (!Abilities.IsOwnersManaEnough(this.ability)) {state = AbilityState.NoMana;}
        var abilityImage = this.panel.FindChildTraverse("AbilityImage");
        var abilityPhaseMask = this.panel.FindChildTraverse("AbilityPhaseMask");
        var cooldownLabel = this.panel.FindChildTraverse("CooldownLabel");
        var cdShineMask = this.panel.FindChildTraverse("CDShineMask");
        var autocastMask = this.panel.FindChildTraverse("AutocastMask");
        var manaMask = this.panel.FindChildTraverse("AbilityManaMask");
        if (state !== this.state) {
            if (state === AbilityState.Default) {
                abilityImage.RemoveClass("Active");
                abilityImage.RemoveClass("AbilityPhase");
                abilityImage.RemoveClass("Cooldown");
                abilityImage.RemoveClass("NoMana");
                abilityPhaseMask.style.visibility = "collapse";
                cooldownLabel.style.visibility = "collapse";
                manaMask.style.visibility = "collapse";
                if (this.state === AbilityState.Cooldown) {cdShineMask.AddClass("CooldownEndShine");}
            }
            else if (state === AbilityState.Active) {
                abilityImage.AddClass("Active");
                abilityImage.RemoveClass("AbilityPhase");
                abilityImage.RemoveClass("Cooldown");
                abilityImage.RemoveClass("NoMana");
                abilityPhaseMask.style.visibility = "collapse";
                manaMask.style.visibility = "collapse";
                cooldownLabel.style.visibility = "collapse";
            }
            else if (state === AbilityState.AbilityPhase) {
                abilityImage.RemoveClass("Active");
                abilityImage.AddClass("AbilityPhase");
                abilityImage.RemoveClass("Cooldown");
                abilityImage.RemoveClass("NoMana");
                abilityPhaseMask.style.visibility = "visible";
                manaMask.style.visibility = "collapse";
                cooldownLabel.style.visibility = "collapse";
            }
            else if (state == AbilityState.NoMana) {
                abilityImage.RemoveClass("Active");
                abilityImage.RemoveClass("AbilityPhase");
                abilityImage.AddClass("NoMana")
                abilityPhaseMask.style.visibility = "collapse";
                manaMask.style.visibility = "visible";
            }
            else if (state === AbilityState.Cooldown) {
                abilityImage.RemoveClass("Active");
                abilityImage.RemoveClass("AbilityPhase");
                abilityImage.AddClass("Cooldown");
                abilityPhaseMask.style.visibility = "collapse";
                cdShineMask.RemoveClass("CooldownEndShine");
                this.startCooldown(Abilities.GetCooldownTimeRemaining(this.ability));
            }
            this.state = state;
        }
        if (Abilities.GetAutoCastState(this.ability) !== this.autocast) {
            this.autocast = Abilities.GetAutoCastState(this.ability);
            if (this.autocast) {autocastMask.style.visibility = "visible";} else {autocastMask.style.visibility = "collapse";}
        }
    };
    return AbilityPanel;
}());
