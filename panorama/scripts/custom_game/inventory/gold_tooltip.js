function update() {
    let heroLevel = Players.GetLevel(Players.GetLocalPlayer());
    let buybackCost = Players.GetBuybackCost(Players.GetLocalPlayer());
    let buybackSurplus = Players.GetGold(Players.GetLocalPlayer()) - buybackCost - (heroLevel * 30);
    $("#reliable").SetDialogVariableInt("reliable_gold", Players.GetReliableGold(Players.GetLocalPlayer()));
    $("#unreliable").SetDialogVariableInt("unreliable_gold", Players.GetUnreliableGold(Players.GetLocalPlayer()));
    $("#deathCost").SetDialogVariableInt("death_cost", heroLevel * 30);
    $("#buybackCost").SetDialogVariableInt("buyback_cost", buybackCost);
    let buybackTime = Players.GetLastBuybackTime(Players.GetLocalPlayer());
    if (buybackTime == 0) {$("#buybackCooldown").text = $.Localize("#DOTA_HUD_BuybackCooldownReady");} else {
        buybackTime = buybackTime + (60 * 7) - Game.GetGameTime();
        if (buybackTime > 0) {
            $("#buybackCooldown").SetDialogVariable("buyback_cooldown", Math.floor(buybackTime / 60) + ":" + ("00" + Math.floor(buybackTime % 60)).slice(-2));
            $("#buybackCooldown").text = $.Localize("#DOTA_HUD_BuybackCooldownNotReady", $("#buybackCooldown"));
        } else {$("#buybackCooldown").text = $.Localize("#DOTA_HUD_BuybackCooldownReady");}
    }
    $("#buybackCostExtra").SetHasClass("Surplus", buybackSurplus > -1);
    if (buybackSurplus > -1) {
        $("#buybackCostExtra").SetDialogVariableInt("buyback_gold_surplus", buybackSurplus);
        $("#buybackCostExtra").text = $.Localize("#DOTA_HUD_BuybackCost_Surplus", $("#buybackCostExtra"));
    }
    else {
        $("#buybackCostExtra").SetDialogVariableInt("buyback_gold_needed", Math.abs(buybackSurplus));
        $("#buybackCostExtra").text = $.Localize("#DOTA_HUD_BuybackCost_Needed", $("#buybackCostExtra"));
    }
	$.Schedule(0.1, update)
}
update();