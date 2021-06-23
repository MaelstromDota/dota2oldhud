var lastUnit = [];
var last = [];
var render = [];
function ClickPortrait(portrait){
	let localplayer = Entities.GetLocalPlayer();
	if (GameUI.IsShiftDown()) {
		let selected_entities = Players.GetSelectedEntities(Players.GetLocalPlayer());
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
			if (page == i) {$(`#group${i}`).SetImage("s2r://panorama/images/hud/multiunit_page_active_png.vtex");} else {$(`#group${i}`).SetImage("s2r://panorama/images/hud/multiunit_page_png.vtex");};
		}
	};
}
function statsupdate(){
	Game.CreateCustomKeyBind("U", "lvlupattributes")
	Game.AddCommand("lvlupattributes", LevelUpAttributes, "", 0)
	let statsleft = $.GetContextPanel().GetParent().FindChildTraverse("LeftStatsBox");
	let statsright = $.GetContextPanel().GetParent().FindChildTraverse("RightStatsBox");
	let unit = Players.GetLocalPlayerPortraitUnit();
	GameEvents.SendCustomGameEventToServer('recalulatestats', {unit: unit});
	$("#damagetext").text = Math.ceil((Entities.GetDamageMin(unit) + Entities.GetDamageMax(unit)) / 2);
	if (Math.ceil(Entities.GetDamageBonus(unit)) == 0) {$("#damagetextbonus").text = '';
	$("#damagetext").style.position = "-10px 1.25px 0px"} else {$("#damagetextbonus").text = `+${Math.ceil(Entities.GetDamageBonus(unit))}`;
	$("#damagetext").style.position = "-25px 1.25px 0px";};
	$("#armortext").text = Math.ceil(Entities.GetPhysicalArmorValue(unit) - Entities.GetBonusPhysicalArmor(unit))
	if (Math.ceil(Entities.GetBonusPhysicalArmor(unit)) == 0) {$("#armortextbonus").text = '';} else {$("#armortextbonus").text = `+ ${Math.ceil(Entities.GetBonusPhysicalArmor(unit))}`;};
	$("#speedtext").text = Math.ceil(Entities.GetIdealSpeed(unit));
	if (Entities.GetStats(unit) != 0) {
		$("#strtext").text = Entities.GetStats(unit).str;
		if (Entities.GetStats(unit).strbonus == 0) {$("#strtextbonus").text = ''; $("#strtext").style.position = '190px 15px 0px';} else {$("#strtextbonus").text = `+ ${Entities.GetStats(unit).strbonus}`; $("#strtext").style.position = '175px 15px 0px';};
		$("#agitext").text = Entities.GetStats(unit).agi;
		if (Entities.GetStats(unit).agibonus == 0) {$("#agitextbonus").text = ''; $("#agitext").style.position = '190px 50px 0px';} else {$("#agitextbonus").text = `+ ${Entities.GetStats(unit).agibonus}`; $("#agitext").style.position = '176px 50px 0px';};
		$("#inttext").text = Entities.GetStats(unit).int;
		if (Entities.GetStats(unit).intbonus == 0) {$("#inttextbonus").text = ''; $("#inttext").style.position = '190px 85px 0px';} else {$("#inttextbonus").text = `+ ${Entities.GetStats(unit).intbonus}`; $("#inttext").style.position = '175px 85px 0px';};
		$("#attmain").style.visibility = 'collapse';
		if (Entities.GetStats(unit).att != 3 && Entities.GetStats(unit).att != -1) {$("#attmain").style.visibility = 'visible';}
		if (Entities.GetStats(unit).att == 0){$("#attmain").style.position = "130.5px 8px 0px";} else if (Entities.GetStats(unit).att == 1){$("#attmain").style.position = "130.5px 45px 0px";} else if (Entities.GetStats(unit).att == 2){$("#attmain").style.position = "130.5px 79px 0px";};
	};
	if (Game.IsInAbilityLearnMode() && Abilities.CanAbilityBeUpgraded(Entities.GetAbilityByName(unit,'attribute_bonus_datadriven')) === AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED) {
		$('#AttributeBonus').style.visibility = 'visible';
		$('#HotkeyLabel').style.visibility = 'visible';
	} else {
		$('#AttributeBonus').style.visibility = 'collapse';
		$('#HotkeyLabel').style.visibility = 'collapse';
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
			if (units[i-(i_value)] != undefined && units[i-(i_value)] == Players.GetLocalPlayerPortraitUnit()) {$(`#PortraitBorder${i}`).style.visibility = "visible";} else {$(`#PortraitBorder${i}`).style.visibility = "collapse";};
			if (i!=11 && units[i-(i_value)] != undefined) {$(`#HPBar${i}`).style.width = `${(Entities.GetHealth(units[i-i_value]) / Entities.GetMaxHealth(units[i-i_value])) * 100 -15}%`;};
			if (units[i-(i_value)] != undefined && Entities.GetMaxMana(units[i-(i_value)]) != 0 && i!=11) {$(`#MPBar${i}`).style.width = `${(Entities.GetMana(units[i-i_value]) / Entities.GetMaxMana(units[i-i_value])) * 100 -15}%`;} else if (units[i-(i_value)] != undefined && Entities.GetMaxMana(units[i-(i_value)]) == 0 && i!=11) {$(`#MPBar${i}`).style.width = '85%';};
		};
	};
	let strlabel, strperlvllabel, agilabel, agiperlvllabel, intlabel, intperlvllabel, attackspeed, damage, attackrange, armor, physical, magical;
	let tooltippanel = $.GetContextPanel().GetParent().GetParent().GetParent()
    if (tooltippanel.FindChildTraverse("StrengthTooltip") != undefined) {
        strlabel = tooltippanel.FindChildTraverse("StrengthTooltip").FindChildTraverse('str');
        strbonuslabel = tooltippanel.FindChildTraverse("StrengthTooltip").FindChildTraverse('strbonus');
        strperlvllabel = tooltippanel.FindChildTraverse("StrengthTooltip").FindChildTraverse('strperlvl');
        strlvl = tooltippanel.FindChildTraverse("StrengthTooltip").FindChildTraverse('attrlvl');
        strmain = tooltippanel.FindChildTraverse("StrengthTooltip").FindChildTraverse('attmain');
    };
	if (tooltippanel.FindChildTraverse("AgilityTooltip") != undefined) {
		agilabel = tooltippanel.FindChildTraverse("AgilityTooltip").FindChildTraverse('agi');
		agibonuslabel = tooltippanel.FindChildTraverse("AgilityTooltip").FindChildTraverse('agibonus');
		agiperlvllabel = tooltippanel.FindChildTraverse("AgilityTooltip").FindChildTraverse('agiperlvl');
		agilvl = tooltippanel.FindChildTraverse("AgilityTooltip").FindChildTraverse('attrlvl');
		agimain = tooltippanel.FindChildTraverse("AgilityTooltip").FindChildTraverse('attmain');
	}
	if (tooltippanel.FindChildTraverse("IntellectTooltip") != undefined){
		intlabel = tooltippanel.FindChildTraverse("IntellectTooltip").FindChildTraverse('int');
        intbonuslabel = tooltippanel.FindChildTraverse("IntellectTooltip").FindChildTraverse('intbonus');
        intperlvllabel = tooltippanel.FindChildTraverse("IntellectTooltip").FindChildTraverse('intperlvl');
        intlvl = tooltippanel.FindChildTraverse("IntellectTooltip").FindChildTraverse('attrlvl');
        intmain = tooltippanel.FindChildTraverse("IntellectTooltip").FindChildTraverse('attmain');
	}
    if (Entities.GetStats(unit) != 0) {
		let lvl = Abilities.GetLevel(Entities.GetAbilityByName(unit, "attribute_bonus_datadriven")) - 1;
		if (strlabel != undefined){
			if (Entities.GetStats(unit).att == 0) {
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
			strperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+Entities.GetStats(unit).strperlvl.toFixed(2);
			strlvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
		}
		if (agilabel != undefined){
			if (Entities.GetStats(unit).att == 1) {
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
			agiperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+Entities.GetStats(unit).agiperlvl.toFixed(2);
			agilvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
		}
		if (intlabel != undefined){
			if (Entities.GetStats(unit).att == 2) {
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
			intperlvllabel.text = $.Localize("#DOTA_StatTooltip_GainPerLevel")+Entities.GetStats(unit).intperlvl.toFixed(2);
			intlvl.text = $.Localize("#DOTA_StatTooltip_TotalAttributesSkilled")+lvl;
		}
    };
	if (tooltippanel.GetParent().FindChildTraverse("MainTooltip") != undefined) {
		attackspeed = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('attackspeed');
		damage = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('damage');
		attackrange = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('attackrange');
		armor = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('armor');
		physical = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('physical');
		magical = tooltippanel.GetParent().FindChildTraverse("MainTooltip").FindChildTraverse('magical');
	}
	if (attackspeed != undefined) {
		attackspeed.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackSpeed")}${(Entities.GetAttackSpeed(unit) * 100).toFixed(0)} (${(1/Entities.GetAttacksPerSecond(unit)).toFixed(2)}${$.Localize("#DOTA_DmgArmorTooltip_AttackSpeedSeconds")})`;
		damage.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackDamage")}${Entities.GetDamageMin(unit)} - ${Entities.GetDamageMax(unit)}`;
		attackrange.text = `${$.Localize("#DOTA_DmgArmorTooltip_AttackRange")}${Entities.GetAttackRange(unit)}`;
		armor.text = `${$.Localize("#DOTA_DmgArmorTooltip_Armor")}${Entities.GetPhysicalArmorValue(unit).toFixed(1)}`;
		physical.text = `${$.Localize("#DOTA_DmgArmorTooltip_DmgResist")}${(100*((0.06*Entities.GetPhysicalArmorValue(unit))/(1+0.06*Entities.GetPhysicalArmorValue(unit)))).toFixed(0)}%`;
		magical.text = `${$.Localize("#DOTA_DmgArmorTooltip_MagicDmgResist")}${Entities.GetBaseMagicalResistanceValue(unit).toFixed(0)}%`;
	}
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
function LevelUpAttributes(){
	if (Game.IsInAbilityLearnMode()) {Abilities.AttemptToUpgrade(Entities.GetAbilityByName(Entities.GetLocalPlayer(), 'attribute_bonus_datadriven'));}
};
function UseQuickCastOnPortrait(table){
	let units = Players.GetSelectedEntities(Players.GetLocalPlayer());
	let localplayer = Entities.GetLocalPlayer();
	function compareNumeric(a, b) {if (a > b) return 1; if (a == b) return 0; if (a < b) return -1;};
	units.sort(compareNumeric);
	for (let i=0; i < units.length -1; i++) {
		if (!Entities.IsAlive(units[i])) {units.splice[i,1];};
	};
	let portraits = units.length <= 10 ? units.length : 10
	let order = table['order_type'];
	let ability = table['ability'];
	let x,y,z,pos,target;
	if (order == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION){
		x = table['x'];
		y = table['y'];
		z = table['z'];
		pos = [x,y,z];
	} else if (order == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET){
		target = table['target'];
		pos = Entities.GetAbsOrigin(target);
	};
	let fScreenX = Game.WorldToScreenX(pos[0], pos[1], pos[2]);
	let fScreenY = Game.WorldToScreenY(pos[0], pos[1], pos[2]);
	for (let i=1;i<=portraits;i++){
		let portrait = $(`#Portrait${i}${i}`)
		if (Math.abs(GameUI.GetPanelPosition(portrait).x, fScreenX) < 19 && Math.abs(GameUI.GetPanelPosition(portrait).y, fScreenY) < 24) {
			let pos = Entities.GetAbsOrigin(lastUnit[i])
			Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP});
			Abilities.ExecuteAbility(Entities.GetAbilityByName(localplayer, "attribute_bonus_datadriven"), localplayer, true);
			Game.PrepareUnitOrders({OrderType: order, AbilityIndex: ability, Position: pos, TargetIndex: target});
		}
	}
}
GameEvents.Subscribe("dota_player_update_selected_unit", OnSelectionUpdated);
GameEvents.Subscribe("abilityorder", UseQuickCastOnPortrait);
statsupdate();