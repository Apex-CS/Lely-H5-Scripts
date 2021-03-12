/**
 * H5 script created by Shashank Malali (Avaap)
 * This script is developed on PCS280/E to restrict users other than specific role from changing
 * the UpdateRule of Cost
 */
var PCS280_CostUpdateRule = (function () {
    function PCS280_CostUpdateRule(args) {
        this.controller = args.controller;
        this.log = args.log;
		this.myvalue="";
    }
	
    /**
    * Script initialization function.
    */
    PCS280_CostUpdateRule.Init = function (args) {
        new PCS280_CostUpdateRule(args).run();
    };
	
	PCS280_CostUpdateRule.prototype.checkChange = function(){
	var currentValue = ScriptUtil.GetFieldValue("WCUPRU");	
	//if(currentValue == "3"){
		ConfirmDialog.Show({
		header: "Lely: Unauthorized Value",
		message: "You do not have the authorization to change the update method. Please contact your controller if you need permission to change the update method.",
		//message: "The value is"+SessionCache.Get("MyValue"),
		dialogType: "Information"
		});
		ScriptUtil.SetFieldValue("WCUPRU","4");
	//}
	};
	
    PCS280_CostUpdateRule.prototype.run = function () {
		//SessionCache.Add("MyValue","test123");
		var _this = this;
		var Updaterule = this.controller.GetElement("WCUPRU");		 
		//$(Updaterule).attr("disabled",true);	
		$(Updaterule).change(this.checkChange);
	
    };
	
	return PCS280_CostUpdateRule;
}());
//# sourceMappingURL=PCS280_CostUpdateRule.js.map