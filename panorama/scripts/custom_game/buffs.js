let pContainer = $("#Buffs");
var isitem = [];
var buffs = [];
function Main(){
	let unit = Players.GetLocalPlayerPortraitUnit();
	buffs = [];
	for (let i=0; i < Entities.GetNumBuffs(unit); i++){
		if (!Buffs.IsHidden(unit, Entities.GetBuff(unit,i))){
			buffs.push(Entities.GetBuff(unit,i));
		};
	};
	for (let i=0; i < buffs.length; i++){
		buff = buffs[i];
		var pPanel = pContainer.GetChild(i);
		let stacks = Buffs.GetStackCount(unit, buffs[i]);
		if (pPanel == null || pPanel == undefined) {
			pPanel = $.CreatePanel("Panel", pContainer, "");
			pPanel.BLoadLayoutSnippet("Buff");
			let iPanel = pPanel.FindChildTraverse("buffid");
			iPanel.SetPanelEvent("onmouseover", showbufftooltip.bind(i))
			iPanel.SetPanelEvent("onmouseout", hidebufftooltip.bind(i))
			iPanel.SetPanelEvent("onactivate", clickbuff.bind(i));
		};
		pPanel.style.marginLeft = `${48 * i}px`;
		let border = pPanel.FindChildTraverse("border");
		let elapsed = Buffs.GetElapsedTime(unit, buffs[i]);
		let duration = Buffs.GetDuration(unit, buffs[i]);
		$.Msg(Buffs.GetCreationTime(unit, buffs[i]))
		border.style.clip = `radial(50% 50%, 0deg, ${360 - elapsed/duration*360}deg)`;
		let stackstext = pPanel.FindChildTraverse("stacks");
		if (stacks < 1) {stackstext.style.visibility = 'collapse';} else {stackstext.style.visibility = 'visible'; stackstext.text = stacks;};
		if (Buffs.IsDebuff(unit,buffs[i])) {border.SetImage("file://{images}/hud/border_debuff.png");} else {border.SetImage("file://{images}/hud/border_buff.png")};
		let name = Buffs.GetName(unit, buffs[i]);
		if (Abilities.IsItem(Buffs.GetAbility(unit, buffs[i]))) {isitem.push(name.toString());};
		let path = isitem.includes(name.toString()) ? 'items' : 'spellicons';
		let icon = path == 'items' ? Buffs.GetTexture(unit,buffs[i]).substring(5, Buffs.GetTexture(unit,buffs[i]).length) : Buffs.GetTexture(unit,buffs[i]);
		pPanel.FindChildTraverse("image").SetImage(`s2r://panorama/images/${path}/${icon}_png.vtex`);
	};
	for (let i = buffs.length; i < pContainer.GetChildCount(); i++) {
		let pPanel = pContainer.GetChild(i);
		pPanel.DeleteAsync(0);
	};
	return;
};
function showbufftooltip(){$.DispatchEvent("DOTAShowBuffTooltip", pContainer.GetChild(parseInt(this)).FindChildTraverse("buffid"), Players.GetLocalPlayerPortraitUnit(), buffs[parseInt(this)], Entities.IsEnemy(Players.GetLocalPlayerPortraitUnit()));}
function hidebufftooltip(){$.DispatchEvent("DOTAHideBuffTooltip", pContainer.GetChild(parseInt(this)).FindChildTraverse("buffid"));}
function clickbuff(){
	if (GameUI.IsAltDown()){
		if (Entities.GetLocalPlayer() == Players.GetLocalPlayerPortraitUnit() || Entities.IsEnemy(Players.GetLocalPlayerPortraitUnit())) {Players.BuffClicked(Players.GetLocalPlayerPortraitUnit(), buffs[parseInt(this)], true);};
	};
};
function Update() {
	$.Schedule(Game.GetGameFrameTime(), Update);
	Main();
};
(function () {
	pContainer.RemoveAndDeleteChildren();
	Update();
})();
GameEvents.Subscribe("dota_player_update_selected_unit", function(){pContainer.RemoveAndDeleteChildren(); Update();});