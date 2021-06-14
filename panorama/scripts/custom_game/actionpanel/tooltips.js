function Main(){
    let unit = Players.GetLocalPlayerPortraitUnit();
    GameEvents.SendCustomGameEventToServer('recalulatestats', {unit: unit});
    let strlabel, strperlvllabel, agilabel, agiperlvllabel, intlabel, intperlvllabel;
    if ($.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip") != undefined) {
        strlabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip").FindChildTraverse('str');
        strbonuslabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip").FindChildTraverse('strbonus');
        strperlvllabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip").FindChildTraverse('strperlvl');
        strlvl = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip").FindChildTraverse('attrlvl');
        strmain = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("StrengthTooltip").FindChildTraverse('attmain');
        agilabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AgilityTooltip").FindChildTraverse('agi');
        agibonuslabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AgilityTooltip").FindChildTraverse('agibonus');
        agiperlvllabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AgilityTooltip").FindChildTraverse('agiperlvl');
        agilvl = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AgilityTooltip").FindChildTraverse('attrlvl');
        agimain = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("AgilityTooltip").FindChildTraverse('attmain');
        intlabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("IntellectTooltip").FindChildTraverse('int');
        intbonuslabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("IntellectTooltip").FindChildTraverse('intbonus');
        intperlvllabel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("IntellectTooltip").FindChildTraverse('intperlvl');
        intlvl = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("IntellectTooltip").FindChildTraverse('attrlvl');
        intmain = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("IntellectTooltip").FindChildTraverse('attmain');
    };
    if (CustomNetTables.GetTableValue("stats", unit) != undefined && strlabel != undefined) {
        if (CustomNetTables.GetTableValue("stats", unit).att == 0) {
            strlabel.text = $.Localize("#DOTA_StatTooltip_Strength")+$.Localize('#DOTA_StatTooltip_PrimaryAttrib');
            strbonuslabel.text = $.Localize("#DOTA_StatTooltip_PrimaryBonus")+$.Localize("#DOTA_StatTooltip_StrengthBonus");
            strperlvllabel.style.position = '25px 60px 0px';
            strmain.style.visibility = 'visible';
        } else {
            strlabel.text = $.Localize("#DOTA_StatTooltip_Strength");
            strbonuslabel.text = $.Localize("#DOTA_StatTooltip_StrengthBonus");
            strperlvllabel.style.position = '25px 45px 0px';
            strmain.style.visibility = 'collapse';
        };
        if (CustomNetTables.GetTableValue("stats", unit).att == 1) {
            agilabel.text = $.Localize("#DOTA_StatTooltip_Agility")+$.Localize('#DOTA_StatTooltip_PrimaryAttrib');
            agibonuslabel.text = $.Localize("#DOTA_StatTooltip_PrimaryBonus")+$.Localize("#DOTA_StatTooltip_AgilityBonus");
            agiperlvllabel.style.position = '25px 60px 0px';
            agimain.style.visibility = 'visible';
        } else {
            agilabel.text = $.Localize("#DOTA_StatTooltip_Agility");
            agibonuslabel.text = $.Localize("#DOTA_StatTooltip_AgilityBonus");
            agiperlvllabel.style.position = '25px 45px 0px';
            agimain.style.visibility = 'collapse';
        };
        if (CustomNetTables.GetTableValue("stats", unit).att == 2) {
            intlabel.text = $.Localize("#DOTA_StatTooltip_Intelligence")+$.Localize('#DOTA_StatTooltip_PrimaryAttrib');
            intbonuslabel.text = $.Localize("#DOTA_StatTooltip_PrimaryBonus")+$.Localize("#DOTA_StatTooltip_IntelligenceBonus");
            intperlvllabel.style.position = '25px 60px 0px';
            intmain.style.visibility = 'visible';
        } else {
            intlabel.text = $.Localize("#DOTA_StatTooltip_Intelligence");
            intbonuslabel.text = $.Localize("#DOTA_StatTooltip_IntelligenceBonus");
            intperlvllabel.style.position = '25px 45px 0px';
            intmain.style.visibility = 'collapse';
        };
        strperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+CustomNetTables.GetTableValue("stats", unit).strperlvl.toFixed(2);
        agiperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+CustomNetTables.GetTableValue("stats", unit).agiperlvl.toFixed(2);
        intperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+CustomNetTables.GetTableValue("stats", unit).intperlvl.toFixed(2);
        let lvl = Abilities.GetLevel(Entities.GetAbilityByName(unit, "attribute_bonus_datadriven")) - 1;
        strlvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
        agilvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
        intlvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
    };
    let attackspeed = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('attackspeed');
    let damage = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('damage');
    let attackrange = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('attackrange');
    let armor = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('armor');
    let physical = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('physical');
    let magical = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('magical');
    attackspeed.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackSpeed")}${(Entities.GetAttackSpeed(unit) * 100).toFixed(0)} (${(1/Entities.GetAttacksPerSecond(unit)).toFixed(2)}${$.Localize("#DOTA_DmgArmorTooltip_AttackSpeedSeconds")})`;
    damage.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackDamage")}${Entities.GetDamageMin(unit)} - ${Entities.GetDamageMax(unit)}`;
    attackrange.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackRange")}${Entities.GetAttackRange(unit)}`;
    armor.text = `${$.Localize("#DOTA_DmgArmorTooltip_Armor")}${Entities.GetPhysicalArmorValue(unit).toFixed(1)}`;
    physical.text = `${$.Localize("#DOTA_DmgArmorTooltip_DmgResist")}${(100*((0.06*Entities.GetPhysicalArmorValue(unit))/(1+0.06*Entities.GetPhysicalArmorValue(unit)))).toFixed(0)}%`;
    magical.text = `${$.Localize("#DOTA_DmgArmorTooltip_MagicDmgResist")}${Entities.GetBaseMagicalResistanceValue(unit).toFixed(0)}%`;
    $.Schedule(Game.GetGameFrameTime(), Main)
}
Main()