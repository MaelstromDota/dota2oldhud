CAddonTemplateGameMode = CAddonTemplateGameMode or class({})
function Precache(context)
end
function Activate()
	GameRules.AddonTemplate = CAddonTemplateGameMode()
	GameRules.AddonTemplate:InitGameMode()
end
function CAddonTemplateGameMode:InitGameMode()
	GameRules:GetGameModeEntity():SetThink( "OnThink", self, "GlobalThink", 2 )
	ListenToGameEvent('npc_spawned', Dynamic_Wrap(CAddonTemplateGameMode, 'OnNPCSpawned'), self)
	CustomGameEventManager:RegisterListener("recalulatestats", Dynamic_Wrap(CAddonTemplateGameMode, "RecalculateStats"))
	CustomGameEventManager:RegisterListener("useability", Dynamic_Wrap(CAddonTemplateGameMode, "UIUseAbility"))
	CustomGameEventManager:RegisterListener("getburstcooldown", Dynamic_Wrap(CAddonTemplateGameMode, "GetCourierBurstCooldown"))
	CustomGameEventManager:RegisterListener("getabilitybehavior", Dynamic_Wrap(CAddonTemplateGameMode, "GetAbilityBehavior"))
	GameRules:GetGameModeEntity():SetFreeCourierModeEnabled(true)
end
function CAddonTemplateGameMode:OnThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end
	return 1
end
function CAddonTemplateGameMode:UIUseAbility(keys)
	local behavior = tonumber(tostring(EntIndexToHScript(keys.unit):FindAbilityByName(keys.ability):GetBehavior()))
	local pos = Vector(keys.x,keys.y,keys.z)
	if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then
		ExecuteOrderFromTable({UnitIndex = keys.unit, OrderType = DOTA_UNIT_ORDER_CAST_POSITION, AbilityIndex = EntIndexToHScript(keys.unit):FindAbilityByName(keys.ability):entindex(), Position = pos, Queue = false})
		return
	end
	EntIndexToHScript(keys.unit):CastAbilityNoTarget(EntIndexToHScript(keys.unit):FindAbilityByName(keys.ability), keys.pid)
end
function CAddonTemplateGameMode:GetCourierBurstCooldown(keys)
	CustomNetTables:SetTableValue("courier_burst_cooldown", tostring(keys.unit), {cooldown = EntIndexToHScript(keys.unit):FindAbilityByName("courier_burst"):GetCooldownTimeRemaining()})
end
function CAddonTemplateGameMode:RecalculateStats(keys)
	local unit = EntIndexToHScript(keys.unit)
	local str = 0
	local strbonus = 0
	local agi = 0
	local agibonus = 0
	local int = 0
	local intbonus = 0
	local primaryattribute = -1
	if unit and not unit:IsNull() and unit:IsHero() then
		str = math.floor(unit:GetBaseStrength())
		strbonus = math.floor(unit:GetStrength()) - str
		agi = math.floor(unit:GetBaseAgility())
		agibonus = math.floor(unit:GetAgility()) - agi
		int = math.floor(unit:GetBaseIntellect())
		intbonus = math.floor(unit:GetIntellect()) - int
		primaryattribute = unit:GetPrimaryAttribute()
	end
	CustomNetTables:SetTableValue("stats", tostring(keys.unit), {str = str, strbonus = strbonus, agi = agi, agibonus = agibonus, int = int, intbonus = intbonus, att = primaryattribute})
end
function CAddonTemplateGameMode:GetAbilityBehavior(keys)
	local ability = EntIndexToHScript(keys.ability)
	local player = PlayerResource:GetPlayer(keys.player)
	local behavior = ability:GetBehaviorInt()
	if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then behavior = DOTA_UNIT_ORDER_CAST_POSITION
	elseif bit.band(behavior, DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) ~= 0 then behavior = DOTA_UNIT_ORDER_CAST_POSITION end
	CustomGameEventManager:Send_ServerToPlayer(player, "UseAbility", {behavior = behavior, ability = keys.ability, target = keys.target})
end
function CAddonTemplateGameMode:OnNPCSpawned(keys)
	local npc = EntIndexToHScript(keys.entindex)
	if npc:IsRealHero() and npc.spawned == nil then
		npc.spawned = true
		npc:AddAbility("attribute_bonus_datadriven")
		npc:FindAbilityByName("attribute_bonus_datadriven"):SetLevel(1)
		for i=0,15,1 do
			if npc:GetAbilityByIndex(i) ~= nil then
				if string.find(npc:GetAbilityByIndex(i):GetAbilityName(),"special_bonus") ~= nil then
					npc:RemoveAbility(npc:GetAbilityByIndex(i):GetAbilityName())
				end
			end
		end
	end
end