CAddonTemplateGameMode = CAddonTemplateGameMode or class({})
function Precache(context)
end
function Activate()
	GameRules.AddonTemplate = CAddonTemplateGameMode()
	GameRules.AddonTemplate:InitGameMode()
end
function CAddonTemplateGameMode:InitGameMode()
	GameRules:GetGameModeEntity():SetThink( "OnThink", self, "GlobalThink", 2 )
	ListenToGameEvent('npc_spawned', Dynamic_Wrap(self, 'OnNPCSpawned'), self)
	CustomGameEventManager:RegisterListener("recalulatestats", Dynamic_Wrap(self, "RecalculateStats"))
	CustomGameEventManager:RegisterListener("useability", Dynamic_Wrap(self, "UIUseAbility"))
	CustomGameEventManager:RegisterListener("getburstcooldown", Dynamic_Wrap(self, "GetCourierBurstCooldown"))
	CustomGameEventManager:RegisterListener("getabilitybehavior", Dynamic_Wrap(self, "GetAbilityBehavior"))
	CustomGameEventManager:RegisterListener("getitemstate", Dynamic_Wrap(self, "GetItemState"))
	GameRules:GetGameModeEntity():SetExecuteOrderFilter(Dynamic_Wrap(self, "OrderFilter"), self)
	GameRules:GetGameModeEntity():SetFreeCourierModeEnabled(true)
end
function CAddonTemplateGameMode:OnThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end
	return 1
end
function CAddonTemplateGameMode:GetItemState(keys)
	CustomNetTables:SetTableValue("itemstate", tostring(keys.item), {})
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
	local strperlvl = 0
	local agi = 0
	local agibonus = 0
	local agiperlvl = 0
	local int = 0
	local intbonus = 0
	local intperlvl = 0
	local primaryattribute = -1
	if unit and not unit:IsNull() and unit:IsHero() then
		str = math.floor(unit:GetBaseStrength())
		strbonus = math.floor(unit:GetStrength()) - str
		strperlvl = unit:GetStrengthGain()
		agi = math.floor(unit:GetBaseAgility())
		agibonus = math.floor(unit:GetAgility()) - agi
		agiperlvl = unit:GetAgilityGain()
		int = math.floor(unit:GetBaseIntellect())
		intbonus = math.floor(unit:GetIntellect()) - int
		intperlvl = unit:GetIntellectGain()
		primaryattribute = unit:GetPrimaryAttribute()
	end
	CustomNetTables:SetTableValue("stats", tostring(keys.unit), {str = str, strbonus = strbonus, strperlvl = strperlvl, agi = agi, agibonus = agibonus, agiperlvl = agiperlvl, int = int, intbonus = intbonus, intperlvl = intperlvl, att = primaryattribute})
end
function CAddonTemplateGameMode:GetAbilityBehavior(keys)
	local ability = EntIndexToHScript(keys.ability)
	local player = PlayerResource:GetPlayer(keys.player)
	local behavior = ability:GetBehaviorInt()
	if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then behavior = DOTA_UNIT_ORDER_CAST_POSITION
	elseif bit.band(behavior, DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) ~= 0 then behavior = DOTA_ABILITY_BEHAVIOR_UNIT_TARGET end
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
function CAddonTemplateGameMode:OrderFilter(keys)
	local units = keys["units"]
	local unit
	if units["0"] then unit = EntIndexToHScript(units["0"]) else return nil end
	if unit == nil then return end
	if keys.queue == 1 then return true end
	local target = keys.entindex_target ~= 0 and EntIndexToHScript(keys.entindex_target) or nil
	local ability = keys.entindex_ability ~= 0 and EntIndexToHScript(keys.entindex_ability) or nil
	if unit ~= nil and ability ~= nil and unit:IsRealHero() and ability:GetAbilityName() ~= "attribute_bonus_datadriven" and unit:GetPlayerID() ~= nil then
		if keys.order_type == DOTA_UNIT_ORDER_CAST_POSITION and keys.position_x ~= nil and keys.position_y ~= nil and keys.position_z ~= nil then
			CustomGameEventManager:Send_ServerToPlayer(PlayerResource:GetPlayer(unit:GetPlayerID()), "abilityorder", {order_type = keys.order_type, ability = ability:entindex(), x = keys.position_x, y = keys.position_y, z = keys.position_z})
		end
		if keys.order_type == DOTA_UNIT_ORDER_CAST_TARGET and target ~= nil then
			CustomGameEventManager:Send_ServerToPlayer(PlayerResource:GetPlayer(unit:GetPlayerID()), "abilityorder", {order_type = keys.order_type, ability = ability:entindex(), target = target:entindex()})
		end
	end
	return true
end