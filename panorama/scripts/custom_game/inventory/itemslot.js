let DragDropChek = false
let a, b
var ItemPanel = (function () {
    function ItemPanel(parent, slot) {
        this.keybind = "";
        this.slot = slot;
        this.panel = $.CreatePanel("Panel", parent, "");
        this.panel.BLoadLayoutSnippet("itemSlot");
        this.panel.SetPanelEvent("onmouseover", this.onMouseOver.bind(this));
        this.panel.SetPanelEvent("onmouseout", this.onMouseOut.bind(this));
        this.panel.SetPanelEvent("oncontextmenu", this.onRightClick.bind(this));
		this.panel.SetPanelEvent("onactivate", this.onLeftClick.bind(this));
        $.RegisterEventHandler("DragStart", this.panel, this.onDragStart.bind(this));
        $.RegisterEventHandler("DragEnd", this.panel, this.onDragEnd.bind(this));
        $.RegisterEventHandler("DragDrop", this.panel, this.onDragDrop.bind(this));
        this.update();
    }
    ItemPanel.prototype.onMouseOver = function () {
        if (this.item == -1)
        return;
        $.DispatchEvent("DOTAShowAbilityInventoryItemTooltip", this.panel, this.unit, this.slot);
    };
    ItemPanel.prototype.onMouseOut = function () {
        $.DispatchEvent("DOTAHideAbilityTooltip", this.panel);
    };
    ItemPanel.prototype.onRightClick = function () {
        var panel = $.CreatePanel("ContextMenuScript", this.panel, "");
        panel.AddClass("ContextMenu_NoArrow");
        panel.AddClass("ContextMenu_NoBorder");
        panel.GetContentsPanel().BLoadLayout("file://{resources}/layout/custom_game/inventory/itemslot_contextmenu.xml", false, false);
        panel.GetContentsPanel().SetHasClass("NotInShop", !Items.IsPurchasable(this.item));
        panel.GetContentsPanel().SetHasClass("Unsellable", !Items.IsSellable(this.item));
        panel.GetContentsPanel().SetHasClass("UnDisassemblable", !Items.IsDisassemblable(this.item));
        panel.GetContentsPanel().SetHasClass("UnAlertable", !Items.IsAlertableItem(this.item));
        panel.GetContentsPanel().SetHasClass("NotInStash", this.slot < 6);
        panel.GetContentsPanel().SetHasClass("UnStashable", !Items.IsDroppable(this.item) || !Entities.IsInRangeOfShop(this.unit, 0, true));
        panel.GetContentsPanel().SetAttributeInt("itemID", this.item);
    };
	ItemPanel.prototype.onLeftClick = function () {
        if (GameUI.IsAltDown()) {Abilities.PingAbility(this.item);} else {Abilities.ExecuteAbility(this.item, this.unit, false);};
    };
    ItemPanel.prototype.onDragStart = function (panelID, dragCallbacks) {
        DragDropChek = false
        if (this.item == -1) {return true;}
        var panel = $.CreatePanel("Image", this.panel, "dragImage");
        panel.SetAttributeInt("itemID", this.item);
        panel.SetAttributeInt("unitID", this.unit);
        panel.SetImage("s2r://panorama/images/items/" + Items.GetAbilityTextureSF(this.item) + ".png");
        dragCallbacks.displayPanel = panel;
        dragCallbacks.offsetX = 0;
        dragCallbacks.offsetY = 0;
        return true;
    };
    ItemPanel.prototype.onDragDrop = function (panelID, draggedPanel) {
        DragDropChek = true
        Game.PrepareUnitOrders({OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM, TargetIndex: this.slot, AbilityIndex: draggedPanel.GetAttributeInt("itemID", -1)});
        return true;
    };
    ItemPanel.prototype.onDragEnd = function (panelID, draggedPanel) {
        var isSwapping = draggedPanel.GetAttributeInt("swapping", 0);
        if (!isSwapping) {
            if (!DragDropChek) {
                var itemID = draggedPanel.GetAttributeInt("itemID", -1);
                var unitID = draggedPanel.GetAttributeInt("unitID", -1);
                Game.DropItemAtCursor(unitID, itemID);
            }
        }
        draggedPanel.DeleteAsync(0);
        return true;
    };
    ItemPanel.prototype.update = function () {
        this.unit = Players.GetQueryUnit(Players.GetLocalPlayer());
        if (this.unit === -1) {this.unit = Players.GetLocalPlayerPortraitUnit();}
        this.item = Entities.GetItemInSlot(this.unit, this.slot);
        this.itemName = Abilities.GetAbilityName(this.item);
        if (this.keybind == "") {
            this.keybind = Abilities.GetKeybind(this.item);
            this.panel.FindChildTraverse("hotkey").text = this.keybind;
        }
        this.panel.SetHasClass("Muted", Entities.IsMuted(this.unit));
        this.panel.SetHasClass("Primary", Items.ShouldDisplayCharges(this.item));
        this.panel.SetHasClass("Secondary", Items.ShowSecondaryCharges(this.item));
        if (this.item == -1) {this.panel.RemoveClass("Active");} else {this.panel.SetHasClass("Active", !Abilities.IsPassive(this.item));}
        if (Abilities.GetToggleState(this.item) || !Items.ShowSecondaryCharges(this.item)) {
            this.panel.FindChildTraverse("primary").text = Items.GetDisplayedCharges(this.item).toString();
            this.panel.FindChildTraverse("secondary").text = Items.GetSecondaryCharges(this.item).toString();
        }
        else {
            this.panel.FindChildTraverse("secondary").text = Items.GetDisplayedCharges(this.item).toString();
            this.panel.FindChildTraverse("primary").text = Items.GetSecondaryCharges(this.item).toString();
        }
        var itemImage = this.panel.FindChildTraverse("bg");
        itemImage.SetImage("s2r://panorama/images/items/" + ((this.item == -1) ? "emptyitembg" : Items.GetAbilityTextureSF(this.item)) + ".png");
        $.Schedule(1/30, this.update.bind(this))
    };
    return ItemPanel;
}());