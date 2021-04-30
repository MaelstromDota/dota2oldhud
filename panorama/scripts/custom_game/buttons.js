function UseGlyph() {
    GameEvents.SendCustomGameEventToServer("useglyph", {team: Entities.GetTeamNumber(Players.GetLocalPlayerPortraitUnit())})
}