var lastUnit = [];
function statsupdate(){
    $.Schedule(0.03, statsupdate);
    let unit = Players.GetLocalPlayerPortraitUnit();
    GameEvents.SendCustomGameEventToServer('recalulatestats', {unit: unit});
    $("#damagetext").text = Math.ceil((Entities.GetDamageMin(unit) + Entities.GetDamageMax(unit)) / 2);
    if (Math.ceil(Entities.GetDamageBonus(unit)) == 0) {$("#damagetextbonus").text = '';
    $("#damagetext").style.position = "-10px 1.25px 0px"} else {$("#damagetextbonus").text = '+ ' + Math.ceil(Entities.GetDamageBonus(unit));
    $("#damagetext").style.position = "-22px 1.25px 0px";};
    $("#armortext").text = Math.ceil(Entities.GetPhysicalArmorValue(unit) - Entities.GetBonusPhysicalArmor(unit))
    if (Math.ceil(Entities.GetBonusPhysicalArmor(unit)) == 0) {$("#armortextbonus").text = '';} else {$("#armortextbonus").text = '+ ' + Math.ceil(Entities.GetBonusPhysicalArmor(unit));};
    $("#speedtext").text = Math.ceil(Entities.GetIdealSpeed(unit));
    if (CustomNetTables.GetTableValue("stats", unit).str != undefined) {
        $("#strtext").text = CustomNetTables.GetTableValue("stats", unit).str;
        if (CustomNetTables.GetTableValue("stats", unit).strbonus == 0) {$("#strtextbonus").text = '';} else {$("#strtextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).strbonus;};
        $("#agitext").text = CustomNetTables.GetTableValue("stats", unit).agi;
        if (CustomNetTables.GetTableValue("stats", unit).agibonus == 0) {$("#agitextbonus").text = '';} else {$("#agitextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).agibonus;};
        $("#inttext").text = CustomNetTables.GetTableValue("stats", unit).int;
        if (CustomNetTables.GetTableValue("stats", unit).intbonus == 0) {$("#inttextbonus").text = '';} else {$("#inttextbonus").text = '+ ' + CustomNetTables.GetTableValue("stats", unit).intbonus;};
        $("#stricon").style.border = "0px none #ffffff";
        $("#agiicon").style.border = "0px none #ffffff";
        $("#inticon").style.border = "0px none #ffffff";
        if (CustomNetTables.GetTableValue("stats", unit).att == 0){$("#stricon").style.border = "1px solid #ffbe07"} else if (CustomNetTables.GetTableValue("stats", unit).att == 1){$("#agiicon").style.border = "1px solid #ffbe07"} else if (CustomNetTables.GetTableValue("stats", unit).att == 2){$("#inticon").style.border = "1px solid #ffbe07"};
    };
    let units = Players.GetSelectedEntities(Players.GetLocalPlayer());
    if (units.length > 1) {
        $("#Stats").style.visibility = "collapse";
        $("#StatsBonus").style.visibility = "collapse";
        $("#SelectedUnits").style.visibility = "visible";
        for (let i=1; i < 12; i++) {
            if (units[i-1] != undefined && lastUnit[i] != units[i-1] || units[i-1] != undefined && $(`#Portrait${i}`).style.visibility != "visible") {
                $(`#Portrait${i}`).SetUnit(Entities.GetUnitName(units[i-1]), Entities.GetUnitName(units[i-1]), true);
                $(`#Portrait${i}`).style.visibility = "visible";
                lastUnit[i] = units[i-1];
            } else if (units[i-1] == undefined && $(`#Portrait${i}`).style.visibility != "collapse") {$(`#Portrait${i}`).style.visibility = "collapse";};
        };
    } else {
        $("#Stats").style.visibility = "visible";
        $("#StatsBonus").style.visibility = "visible";
        $("#SelectedUnits").style.visibility = "collapse";
    };
};
statsupdate();