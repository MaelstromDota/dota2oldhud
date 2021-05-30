let pContainer = $("#Buffs");
var iconn = [];
function Main(){
	let unit = Players.GetLocalPlayerPortraitUnit();
	let localplayer = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
	let buffs = [];
	for (let i=0; i < buffs.length; i++){
		buffs.pop();
	};
	for (let i=0; i < Entities.GetNumBuffs(unit); i++){
		if (!Buffs.IsHidden(unit, Entities.GetBuff(unit,i))){
			buffs.push(Entities.GetBuff(unit,i));
		};
	};
	for (let i=0; i < buffs.length; i++){
		var pPanel = pContainer.GetChild(i);
		let stacks = Buffs.GetStackCount(unit, buffs[i]);
		if (pPanel == null || pPanel == undefined) {
			pPanel = $.CreatePanel("Panel", pContainer, "");
			pPanel.BLoadLayoutSnippet("Buff");
			let dpanel = pPanel.FindChildTraverse("buffid");
			dpanel.SetPanelEvent("onmouseover", function(){$.DispatchEvent("DOTAShowBuffTooltip", dpanel, unit, buffs[i], false);})
			dpanel.SetPanelEvent("onmouseout", function(){$.DispatchEvent("DOTAHideBuffTooltip", dpanel);})
			dpanel.SetPanelEvent("onactivate", function(){
				if (GameUI.IsAltDown()){
					if (localplayer == unit || Entities.IsEnemy(unit)) {Players.BuffClicked(unit, buffs[i], true);};
				};
			})
		};
		pPanel.style.marginLeft = `${48 * i}px`;
		let border = pPanel.FindChildTraverse("border");
		let elapsed = Buffs.GetElapsedTime(unit, buffs[i]);
		let duration = Buffs.GetDuration(unit, buffs[i]);
		border.style.clip = `radial(50% 50%, 0deg, ${360 - elapsed/duration*360}deg)`;
		let stackstext = pPanel.FindChildTraverse("stacks");
		if (stacks < 1) {stackstext.style.visibility = 'collapse';} else {stackstext.style.visibility = 'visible'; stackstext.text = stacks;};
		if (Buffs.IsDebuff(unit,buffs[i])) {border.SetImage("file://{images}/hud/border_debuff.png");} else {border.SetImage("file://{images}/hud/border_buff.png")};
		let id = buffs[i].toString()
		// $.Msg(id)
		// if (iconn[id] != true) {
		// 	iconn[id] = true;
		// 	let path = Abilities.IsItem(Buffs.GetAbility(unit, buffs[i])) ? 'items' : 'spellicons';
		// 	let icon = path == 'items' ? Buffs.GetTexture(unit,buffs[i]).substring(5, Buffs.GetTexture(unit,buffs[i]).length) : Buffs.GetTexture(unit,buffs[i]);
		// 	pPanel.FindChildTraverse("image").SetImage(`s2r://panorama/images/${path}/${icon}_png.vtex`);
		// };
		// if (duration - elapsed < 0.1) {iconn[id] = false};
	};
	for (let i = buffs.length; i < pContainer.GetChildCount(); i++) {
		let pPanel = pContainer.GetChild(i);
		pPanel.DeleteAsync(0);
	};
	for (let i=0; i < buffs.length; i++){
		buffs.pop();
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