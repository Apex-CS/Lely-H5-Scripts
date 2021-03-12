/**
 * H5 script created by Avaap
 * This script is developed for PPS201/I to make Cost center field mandatory for the user on the I panel.
 * So when a user press enter with blank cost center field it should throw an warning message
 */

var PPS201I_MandatoryFields_H5script = (function () {
	    function PPS201I_MandatoryFields_H5script(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
		if (ScriptUtil.version >= 2.0) {
            this.ionApiService = IonApiService;
            this.miService = MIService;
            this.log.Info("ifversion>=2.0");
        }
        else {
            this.ionApiService = IonApiService.Current;
            this.miService = MIService.Current;
            this.log.Info("elseversion<2.0");
        }
		
    }

    /**
     * Script initialization function.
     */
    PPS201I_MandatoryFields_H5script.Init = function (args) {
		 new PPS201I_MandatoryFields_H5script(args).run();
    };
	var checkOrderTypes = "P2P,P2Q"; // Action to be done for these order types
	var purchaseOrder = '';
	var orderType = '';
	var costCenter = '';
	var orty = '';
	
	PPS201I_MandatoryFields_H5script.prototype.run = function () {
		console.log("Script:Initial Function");
		var _this = this;
		var userContext = ScriptUtil.GetUserContext();
		Company = userContext.CurrentCompany; 
		purchaseOrder = this.controller.GetValue("IAPUNO");
		console.log("Script:purchaseOrder",purchaseOrder);		
		_this.callMI();		
		        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
             _this.onRequesting(e);						 
        });
		
        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };

	PPS201I_MandatoryFields_H5script.prototype.callMI = function () {
		console.log("Script:ExecuteGetHead");
        var _this = this;
/*         var apiRequest = new MIRequest();
		apiRequest.program = "PPS200MI";
        apiRequest.transaction = "GetHead";
		console.log("Script:CallMI-> Company",Company);
		console.log("Script:CallMI-> purchaseOrder",purchaseOrder);
		apiRequest.record = { CONO: Company, PUNO: purchaseOrder };
		//Fields that should be returned by the transaction
        apiRequest.outputFields = ['ORTY'];
        MIService.Current.executeRequest(apiRequest).then(function (response) {
			console.log("Script:MIResponse",response);
            //Read results here
			orderType = response.item['ORTY'];
            //_this.onRequesting(e);
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
        }); */
		    return new Promise(function (resolve) {
            var request = {
                url: '/M3/m3api-rest/v2/execute/PPS200MI/GetHead/',
                method: "GET",
                record: {
                    CONO: Company,
                    PUNO: purchaseOrder
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                _this.log.Info("response", response.data);
                _this.log.Info("response+" + response.data);
                
                var orderType = response.data.results[0].records[0].ORTY;
                _this.log.Info("result", orderType);
                _this.log.Info("result+" + orderType);
                if (orderType != null && orderType != undefined)
                    orty = orderType;
                if (null != orty) {
                    resolve(orty);
                }
                else {
                    resolve(null);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });

    };
	
	PPS201I_MandatoryFields_H5script.prototype.onRequesting = function (args) {
        console.log("Script:onrequesting");
		var _this = this;		
		var prgMode=this.controller.GetMode();				 			
        if ((args.commandType === "KEY" && args.commandValue === "ENTER")) {	
			_this.log.Info("Script:COrrect orderType",orty);
			if (orty === "P2P" || orty === "P2Q") {
				costCenter = this.controller.GetValue("WBCOCE");
				console.log("Script:Cost Center",costCenter);
				if(costCenter === "" || costCenter === null){
					this.controller.ShowMessage("Mandatory: Enter Cost Center to proceed.");	
					args.cancel = true;
				} else {
					return;
				}
			} else {
				return;
			}
		}
	};

    PPS201I_MandatoryFields_H5script.prototype.onRequested = function (args) {
        this.log.Info("Script:onRequested");
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
	
    return PPS201I_MandatoryFields_H5script;
}());

	
	
