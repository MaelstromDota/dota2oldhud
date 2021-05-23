var lastUnit = [];
var last = [];
var page = [];
var render = [];
function ClickPortrait(portrait){
    let localplayer = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
    if (GameUI.IsShiftDown()) {
        var selected_entities = Players.GetSelectedEntities(Players.GetLocalPlayer());
        function compareNumeric(a, b) {if (a > b) return 1; if (a == b) return 0; if (a < b) return -1;};
        selected_entities.sort(compareNumeric);
        selected_entities.splice(parseInt(portrait)-1, 1);
        GameUI.SelectUnit(selected_entities[0], false);
        for (let i=1; i < selected_entities.length; i++) {
            if (selected_entities.length==1) {GameUI.SelectUnit(selected_entities[i], false);} else {GameUI.SelectUnit(selected_entities[i], true);};
        };
    } else if (Abilities.GetLocalPlayerActiveAbility() == -1) {
        GameUI.SelectUnit(lastUnit[parseInt(portrait)], false);
    } else {
        GameEvents.Subscribe("UseAbility", UseAbility);
        let ability = Abilities.GetLocalPlayerActiveAbility();
        Abilities.ExecuteAbility(Entities.GetAbilityByName(localplayer, "attribute_bonus_datadriven"), localplayer, true);
        GameEvents.SendCustomGameEventToServer('getabilitybehavior', {ability: ability, target: lastUnit[portrait], player: Players.GetLocalPlayer()});
    };
};
function UseAbility(table){
    let behavior = table["behavior"];
    let ability = table["ability"];
    let target = table["target"];
    if (last[2] != Game.GetGameTime()) {
        last[2] = Game.GetGameTime();
        Game.PrepareUnitOrders({OrderType: behavior, AbilityIndex: ability, Position: Entities.GetAbsOrigin(target), TargetIndex: target});
    };
};
function PageMove(page){
    let units = Players.GetSelectedEntities(Players.GetLocalPlayer());
    function compareNumeric(a, b) {if (a > b) return 1; if (a == b) return 0; if (a < b) return -1;};
    units.sort(compareNumeric);
    for (let i=0; i < units.length -1; i++) {
        if (!Entities.IsAlive(units[i])) {units.splice[i,1];};
    };
    RenderPage(units,parseInt(page));
};
function RenderPage(units, page){
    let statsleft = $.GetContextPanel().GetParent().FindChildTraverse("LeftStatsBox");
    let statsright = $.GetContextPanel().GetParent().FindChildTraverse("RightStatsBox");
    let i_value = page === 1 ? 0 : page * 10 - 9;
    let i_max_value = page * 11 - page + 1;
    if (render["units"] != units) {
        render = [];
        render["units"] = units;
        for (let i=i_value; i < i_max_value; i++) {
            if (units[i] != undefined) {render.push(units[i]);};
        };
        $("#Stats").style.visibility = "collapse";
        $("#StatsBonus").style.visibility = "collapse";
        $("#SelectedUnits").style.visibility = "visible";
        statsleft.style.backgroundColor = "#00000000";
        statsright.style.backgroundColor = "#00000000";
        for (let i=0; i < 11; i++) {
            if (render[i-1] != undefined && lastUnit[i] != render[i-1] || render[i-1] != undefined && $(`#Portrait${i}${i}`).style.visibility != "visible") {
                if ($(`#Portrait${i}${i}`) != undefined) {
                    $(`#Portrait${i}`).SetUnit(Entities.GetUnitName(render[i-1]), Entities.GetUnitName(render[i-1]), true);
                    $(`#Portrait${i}${i}`).style.visibility = "visible";
                    lastUnit[i] = render[i-1];
                };
            };
            if (render[i-1] == undefined && $(`#Portrait${i}${i}`) != undefined) {$(`#Portrait${i}${i}`).style.visibility = "collapse";};
        };
        for (let i=1; i<=5;i++){
            if (page == i) {$(`#group${i}`).SetImage("file://{images}/hud/group_button_selected.png");} else {$(`#group${i}`).SetImage("file://{images}/hud/group_button.png");};
        }
    };
}
function statsupdate(){
    let statsleft = $.GetContextPanel().GetParent().FindChildTraverse("LeftStatsBox");
    let statsright = $.GetContextPanel().GetParent().FindChildTraverse("RightStatsBox");
    let unit = Players.GetLocalPlayerPortraitUnit();
    GameEvents.SendCustomGameEventToServer('recalulatestats', {unit: unit});
    $("#damagetext").text = Math.ceil((Entities.GetDamageMin(unit) + Entities.GetDamageMax(unit)) / 2);
    if (Math.ceil(Entities.GetDamageBonus(unit)) == 0) {$("#damagetextbonus").text = '';
    $("#damagetext").style.position = "-10px 1.25px 0px"} else {$("#damagetextbonus").text = `+ ${Math.ceil(Entities.GetDamageBonus(unit))}`;
    $("#damagetext").style.position = "-22px 1.25px 0px";};
    $("#armortext").text = Math.ceil(Entities.GetPhysicalArmorValue(unit) - Entities.GetBonusPhysicalArmor(unit))
    if (Math.ceil(Entities.GetBonusPhysicalArmor(unit)) == 0) {$("#armortextbonus").text = '';} else {$("#armortextbonus").text = `+ ${Math.ceil(Entities.GetBonusPhysicalArmor(unit))}`;};
    $("#speedtext").text = Math.ceil(Entities.GetIdealSpeed(unit));
    if (CustomNetTables.GetTableValue("stats", unit) != undefined) {
        $("#strtext").text = CustomNetTables.GetTableValue("stats", unit).str;
        if (CustomNetTables.GetTableValue("stats", unit).strbonus == 0) {$("#strtextbonus").text = '';} else {$("#strtextbonus").text = `+ ${CustomNetTables.GetTableValue("stats", unit).strbonus}`;};
        $("#agitext").text = CustomNetTables.GetTableValue("stats", unit).agi;
        if (CustomNetTables.GetTableValue("stats", unit).agibonus == 0) {$("#agitextbonus").text = '';} else {$("#agitextbonus").text = `+ ${CustomNetTables.GetTableValue("stats", unit).agibonus}`;};
        $("#inttext").text = CustomNetTables.GetTableValue("stats", unit).int;
        if (CustomNetTables.GetTableValue("stats", unit).intbonus == 0) {$("#inttextbonus").text = '';} else {$("#inttextbonus").text = `+ ${CustomNetTables.GetTableValue("stats", unit).intbonus}`;};
        $("#stricon").style.border = "0px none #ffffff";
        $("#agiicon").style.border = "0px none #ffffff";
        $("#inticon").style.border = "0px none #ffffff";
        if (CustomNetTables.GetTableValue("stats", unit).att == 0){$("#stricon").style.border = "1px solid #ffbe07";} else if (CustomNetTables.GetTableValue("stats", unit).att == 1){$("#agiicon").style.border = "1px solid #ffbe07";} else if (CustomNetTables.GetTableValue("stats", unit).att == 2){$("#inticon").style.border = "1px solid #ffbe07";};
    };
    let units = Players.GetSelectedEntities(Players.GetLocalPlayer());
    function compareNumeric(a, b) {if (a > b) return 1; if (a == b) return 0; if (a < b) return -1;};
    units.sort(compareNumeric);
    for (let i=0; i < units.length -1; i++) {
        if (!Entities.IsAlive(units[i])) {units.splice[i,1];};
    };
    if (units.length < 2) {
        $("#Stats").style.visibility = "visible";
        $("#StatsBonus").style.visibility = "visible";
        $("#SelectedUnits").style.visibility = "collapse";
        statsleft.style.backgroundColor = "black";
        statsright.style.backgroundColor = "black";
    } else {
        let currentpage = 1;
        for (let i=0; i < units.length -1; i++) {
            if (unit == units[i]) {currentpage = Math.ceil(i / 10) + 1; break};
        };
        if (currentpage < 1) {currentpage = 1} else if (currentpage > 5) {currentpage = 5};
        let i_value = currentpage === 1 ? 1: currentpage * 10 - 10;
        for (let i=1; i < 11; i++) {
            if (units[i-(i_value*i)] == unit) {$(`#PortraitBorder${i}`).style.visibility = "visible";} else {$(`#PortraitBorder${i}`).style.visibility = "collapse";};
        };
    };
    $.Schedule(Game.GetGameFrameTime(), statsupdate);
};
function OnSelectionUpdated(){
    let unit = Players.GetLocalPlayerPortraitUnit();
    let units = Players.GetSelectedEntities(Players.GetLocalPlayer());
    function compareNumeric(a, b) {if (a > b) return 1; if (a == b) return 0; if (a < b) return -1;};
    units.sort(compareNumeric);
    for (let i=0; i < units.length -1; i++) {
        if (!Entities.IsAlive(units[i])) {units.splice[i,1];};
    };
    if (units.length > 1) {
        let pages = Math.ceil(units.length / 10) < 2 ? 1 : Math.ceil(units.length / 10);
        if (pages > 5) {pages = 5;};
        let currentpage = 1;
        for (let i=0; i < units.length; i++) {
            if (unit == units[i]) {currentpage = Math.ceil(i / 10); break};
        };
        if (currentpage < 1) {currentpage = 1;} else if (currentpage > 5) {currentpage = 5;};
        for (let i=1; i < 6; i++) {
            if ($(`#group${i}`) != undefined && i <= pages && pages != 1) {$(`#group${i}`).style.visibility = 'visible';} else if ($(`#group${i}`) != undefined) {$(`#group${i}`).style.visibility = 'collapse';};
        };
        if (render["units"] != units) {RenderPage(units,currentpage);};
    };
}
GameEvents.Subscribe("dota_player_update_selected_unit", OnSelectionUpdated);
statsupdate();