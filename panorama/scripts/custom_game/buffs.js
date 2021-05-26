let pContainer = $("#Buffs");
function Main(){
	let unit = Players.GetLocalPlayerPortraitUnit();
	let buffs = [];
	for (let i=0; i < Entities.GetNumBuffs(unit); i++){
		if (!Buffs.IsHidden(unit, Entities.GetBuff(unit,i))){
			buffs.push(Entities.GetBuff(unit,i));
		};
	};
	for (let i=0; i < buffs.length; i++){
		var pPanel = pContainer.GetChild(i);
		let stacks = Buffs.GetStackCount(unit, buffs[i]);
		let stack = stacks < 1 ? '' : stacks;
		if (pPanel == null || pPanel == undefined) {
			pPanel = $.CreatePanel("Panel", pContainer, "");
			pPanel.BLoadLayoutSnippet("Buff");
			let dpanel = pPanel.FindChildTraverse("buffid");
			dpanel.SetPanelEvent("onmouseover", function(){$.DispatchEvent("DOTAShowBuffTooltip", dpanel, unit, buffs[i], false);})
			dpanel.SetPanelEvent("onmouseout", function(){$.DispatchEvent("DOTAHideBuffTooltip", dpanel);})
			dpanel.SetPanelEvent("onactivate", function(){
				if (GameUI.IsAltDown()){
					Game.ServerCmd(`say_team ${$.Localize('#i_under_buff')} ${stack} ${$.Localize('#DOTA_Tooltip_'+Buffs.GetName(unit, buffs[i]))}`);
				};
			})
		};
		pPanel.style.marginLeft = `${48 * i}px`;
		let border = pPanel.FindChildTraverse("border");
		let elapsed = Buffs.GetElapsedTime(unit, buffs[i]);
		border.style.clip = `radial(50% 50%, 0deg, ${360 - elapsed * 18}deg)`;
		let stackstext = pPanel.FindChildTraverse("stacks");
		if (stacks < 1) {stackstext.style.visibility = 'collapse';} else {stackstext.style.visibility = 'visible'; stackstext.text = stacks;};
		if (Buffs.IsDebuff(unit,buffs[i])) {border.SetImage("file://{images}/hud/border_debuff.png");};
		let path = Abilities.IsItem(Buffs.GetAbility(unit, buffs[i])) ? 'items' : 'spellicons';
		let icon = path == 'items' ? Buffs.GetTexture(unit,buffs[i]).substring(5, Buffs.GetTexture(unit,buffs[i]).length) : Buffs.GetTexture(unit,buffs[i]);
		pPanel.FindChildTraverse("image").SetImage(`s2r://panorama/images/${path}/${icon}_png.vtex`);
	};
	for (let i = buffs.length; i < pContainer.GetChildCount(); i++) {
		let pPanel = pContainer.GetChild(i);
		pPanel.DeleteAsync(0);
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