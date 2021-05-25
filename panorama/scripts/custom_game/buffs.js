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
		let ii = i;
		var pPanel = pContainer.GetChild(i);
		if (pPanel == null || pPanel == undefined) {
			pPanel = $.CreatePanel("Panel", pContainer, "");
			pPanel.BLoadLayoutSnippet("Buff");
		};
		pPanel.style.marginLeft = `${42 * ii}px`;
		let border = pPanel.FindChildTraverse("border")
		border.style.clip = "radial(50% 50%, 0deg, -360deg)";
        border.style.animationName = "BuffTimer";
        border.style.animationDuration = `${Buffs.GetDuration(unit, buffs[i])}s`;
        border.style.animationTimingFunction = `linear`;
        border.style.animationIterationCount = 1;
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