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
    $("#stricon").style.border = "0px none #ffffff"
    $("#agiicon").style.border = "0px none #ffffff"
    $("#inticon").style.border = "0px none #ffffff"
    if (CustomNetTables.GetTableValue("stats", unit).att == 0){$("#stricon").style.border = "1px solid #ffbe07"} else if (CustomNetTables.GetTableValue("stats", unit).att == 1){$("#agiicon").style.border = "1px solid #ffbe07"} else if (CustomNetTables.GetTableValue("stats", unit).att == 2){$("#inticon").style.border = "1px solid #ffbe07"}
}
statsupdate()