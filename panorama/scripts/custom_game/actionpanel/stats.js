function statsupdate(){
	$.Schedule(0.1, statsupdate)
    var unit = Players.GetLocalPlayerPortraitUnit()
    $("#damagetext").text = Math.ceil((Entities.GetDamageMin(unit) + Entities.GetDamageMax(unit)) / 2)
    if (Math.ceil(Entities.GetDamageBonus(unit)) == 0) {$("#damagetextbonus").text = ''
    $("#damagetext").style.position = "-10px 1.25px 0px"} else {$("#damagetextbonus").text = '+ ' + Math.ceil(Entities.GetDamageBonus(unit))
    $("#damagetext").style.position = "-22px 1.25px 0px"}
    $("#armortext").text = Math.ceil(Entities.GetPhysicalArmorValue(unit) - Entities.GetBonusPhysicalArmor(unit))
    if (Math.ceil(Entities.GetBonusPhysicalArmor(unit)) == 0) {$("#armortextbonus").text = ''} else {$("#armortextbonus").text = '+ ' + Math.ceil(Entities.GetBonusPhysicalArmor(unit))}
    $("#speedtext").text = Math.ceil(Entities.GetIdealSpeed(unit))
    GameEvents.SendCustomGameEventToServer('recalulatestats', {unit: unit});
    $("#strtext").text = CustomNetTables.GetTableValue("stats", unit).str
    if (CustomNetTables.GetTableValue("stats", unit).strbonus == 0) {$("#strtextbonus").text = ''} else {$("#strtextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).strbonus}
    $("#agitext").text = CustomNetTables.GetTableValue("stats", unit).agi
    if (CustomNetTables.GetTableValue("stats", unit).agibonus == 0) {$("#agitextbonus").text = ''} else {$("#agitextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).agibonus}
    $("#inttext").text = CustomNetTables.GetTableValue("stats", unit).int
    if (CustomNetTables.GetTableValue("stats", unit).intbonus == 0) {$("#inttextbonus").text = ''} else {$("#inttextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).intbonus}
}
statsupdate()