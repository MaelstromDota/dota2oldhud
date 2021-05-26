let pContainer = $("#Buffs");
let cooldown = [];
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
		if (pPanel == null || pPanel == undefined) {
			pPanel = $.CreatePanel("Panel", pContainer, "");
			pPanel.BLoadLayoutSnippet("Buff");
		};
		if (Buffs.GetElapsedTime(unit, buffs[i]) < 0.5) {cooldown[buffs[i]]=false;};
		pPanel.style.marginLeft = `${42 * i}px`;
		let border = pPanel.FindChildTraverse("border");
		let elapsed = Buffs.GetElapsedTime(unit, buffs[i]);
		border.style.clip = `radial(50% 50%, 0deg, ${360 - elapsed * 18}deg)`;
		if (Buffs.IsDebuff(unit,buffs[i])) {border.SetImage("file://{images}/hud/border_debuff.png")}
		pPanel.FindChildTraverse("image").SetImage(`s2r://panorama/images/spellicons/${Buffs.GetTexture(unit,buffs[i])}_png.vtex`)
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