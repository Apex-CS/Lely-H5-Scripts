/**
* H5 Script
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Retrieves the Invoice stored at ISP link
 *
 */
var DisplayInvoiceISP_H5script = /** @class */ (function () {
    function DisplayInvoiceISP_H5script(args) {
        this.Company = "";
        this.Division = "";
        this.docId = "";
        this.Payee = "";
        this.Supplier = "";
        //private  SupplierInvNo:any="";;
        this.pexi = "";
        this.controller = args.controller;
        this.log = args.log;
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
    DisplayInvoiceISP_H5script.Init = function (args) {
        new DisplayInvoiceISP_H5script(args).run();
    };
    DisplayInvoiceISP_H5script.prototype.run = function () {
        if (this.controller.GetProgramName() === "APS200") {
            this.log.Info("this is APS200");
            //return;
        }
        var userContext = ScriptUtil.GetUserContext();
        this.Company = userContext.CurrentCompany; //get user's current company
        this.Division = userContext.CurrentDivision;
        this.Payee = ScriptUtil.GetFieldValue("WWSPYN");
        this.Supplier = ScriptUtil.GetFieldValue("WWSUNO");
        var SupplierInvNo = ListControl.ListView.GetValueByColumnIndex(0);
        var InvYear = ListControl.ListView.GetValueByColumnIndex(11);
        this.log.Info("CMPDIV" + this.Company + this.Division);
        this.log.Info("payee" + this.Payee);
        this.log.Info("supplier" + this.Supplier);
        this.log.Info("Supp&year" + SupplierInvNo + InvYear);
        this.log.Info("cONT" + this.controller);
        this.callAPI1(this.Company, this.Division, this.Payee, this.Supplier, SupplierInvNo, InvYear);
        // this.addButton();        
    };
    DisplayInvoiceISP_H5script.prototype.callAPI1 = function (Company, Division, Payee, Supplier, SupplierInvNo, InvYear) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.Info("IfcallAPI1");
                        return [4 /*yield*/, this.getGetInvInfoAPS251MI(Company, Division, Payee, Supplier, SupplierInvNo, InvYear)];
                    case 1:
                        _a.sent();
                        this.taketoISPlink();
                        return [2 /*return*/];
                }
            });
        });
    };
    DisplayInvoiceISP_H5script.prototype.getGetInvInfoAPS251MI = function (Company, Division, Payee, Supplier, SupplierInvNo, InvYear) {
        var _this = this;
        this.log.Info("callMI");
        return new Promise(function (resolve) {
            // var request
            //const request: IonApiRequest= 
            var request = {
                url: '/M3/m3api-rest/v2/execute/APS251MI/GetInvInfo/',
                method: "GET",
                record: {
                    CONO: Company,
                    DIVI: Division,
                    SPYN: Payee,
                    SUNO: Supplier,
                    SINO: SupplierInvNo,
                    INYR: InvYear,
                    PEXN: "499"
                }
            };
            //const  myRequest = new MIRequest();
            //myRequest.program = "APS251MI"; 
            //  myRequest.transaction = "GetInvInfo";
            //Fields that should be returned by the transaction 
            //    myRequest.outputFields = ["PEXI"]; 
            //Input to the transaction 
            /*        myRequest.record = {
                     CONO: Company,
                     DIVI: Division,
                     SPYN: Payee,
                     SUNO: Supplier,
                     SINO: SupplierInvNo,
                     INYR: InvYear,
                     PEXN: "499"   };   */
            _this.ionApiService.execute(request).then(function (response) {
                _this.log.Info("response", response.data);
                _this.log.Info("response+" + response.data);
                // var result = response.item['PEXI'];
                var result = response.data.results[0].records[0].PEXI;
                _this.log.Info("result", result);
                _this.log.Info("result+" + result);
                if (result != null && result != undefined)
                    _this.pexi = result;
                if (null != _this.pexi) {
                    resolve(_this.pexi);
                }
                else {
                    resolve(null);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
                // _this.log.Error(response.errorMessage);
            });
        });
    };
    DisplayInvoiceISP_H5script.prototype.taketoISPlink = function () {
        this.log.Info("take to the isp link");
        var uri = "https://lely3.isp-online.net/ISPInvoiceServlets_TEST/FileServeHTML?get&pVersion=0045&contRep=A7&docId=" + this.pexi;
        this.log.Info("link" + uri);
        ScriptUtil.Launch(uri);
    };
    return DisplayInvoiceISP_H5script;
}());
//# sourceMappingURL=DisplayInvoiceISP_H5script.js.map