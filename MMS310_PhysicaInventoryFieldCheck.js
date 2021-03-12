/**
H5 script created by Shashank Malali (Avaap)

 - The purpose of this H5 script is to prevent users from entering a physical quantity lower than the allocated quantity.
 - The default business logic of MMS310 allows the user to lower the inventory quantity even though items may already be allocated to existing orders.
 - Despite this confirmation warning, Lely has determined that for its business practices that the physical inventory should not be lower than the
   allocated quantity as this can lead to orders with the missing or wrong number of parts.
 */
 
var MMS310_PhysicaInventoryFieldCheck = /** @class */ (function () {
    function MMS310_PhysicaInventoryFieldCheck(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }
    /**
     * Script initialization function.
     */
    MMS310_PhysicaInventoryFieldCheck.Init = function (args) {
        new MMS310_PhysicaInventoryFieldCheck(args).run();
    };
    MMS310_PhysicaInventoryFieldCheck.prototype.run = function () {
        var _this = this;
        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    MMS310_PhysicaInventoryFieldCheck.prototype.onRequesting = function (args) {
        
		var prgMode=this.controller.GetMode();
		var PhyQty=ScriptUtil.GetFieldValue("WWSTQI"); 
		var AloQty=ScriptUtil.GetFieldValue("WWALQT");
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
		if((prgMode==="1" || prgMode==="2" || prgMode==="3")) {				 

				if (PhyQty < AloQty) {
						this.controller.ShowMessage("Physical qty is less than allocated qty");
						args.cancel = true;
					}
				 else{
					return;
				 }
			}
		}		
    };
    MMS310_PhysicaInventoryFieldCheck.prototype.onRequested = function (args) {
        this.log.Info("onRequested");
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    return MMS310_PhysicaInventoryFieldCheck;
}());
//# sourceMappingURL=MMS310_PhysicaInventoryFieldCheck.js.map