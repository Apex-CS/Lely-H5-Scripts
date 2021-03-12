/**
 *  Purpose of the H5 script: On order position entry in OIS101, this script will check if an item is blocked
 *   for all or specific countries
 *   Created by Avaap
**/
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
var OIS101B_OrderEntryItemCheck = /** @class */ (function () {
    function OIS101B_OrderEntryItemCheck(args) {
        this.ORTP = "";
        this.ORTK = "";
        this.CSCD = "";
        this.TXID = "";
        this.fromDate = "";
        this.toDate = "";
        this.Category = "";
        this.Scope = "";
        this.lanGB = "";
        this.lanOther = "";
        //private day:Number=0;
        this.validDate = true;
        this.Company = "";
        this.langCode = "";
        this.file = "MITMAS00";
        this.allEventsComplete = "";
        this.firstTime = true;
        this.controller = args.controller;
        this.log = args.log;
        this.log.Info("in constructor");
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
    OIS101B_OrderEntryItemCheck.Init = function (args) {
        new OIS101B_OrderEntryItemCheck(args).run();
        //this.log.Info("In init");
    };
    OIS101B_OrderEntryItemCheck.prototype.run = function () {
        this.log.Info("In run" + this.firstTime);
        var userContext = ScriptUtil.GetUserContext();
        this.Company = userContext.CurrentCompany; //get user's current company
        this.langCode = userContext.CurrentLanguage;
        this.log.Info("comp" + this.Company);
        this.log.Info("lang" + this.langCode);
        var OrdType = this.controller.GetValue("OAORTP"); //get Order type from B panel.
        var COnumber = this.controller.GetValue("OAORNO"); //get the Co number from B panel  
        this.callAPI1(this.Company, OrdType, COnumber, "1");
        this.attachEvents(this.controller);
    };
    OIS101B_OrderEntryItemCheck.prototype.getOIS010LstOrderTypes = function (Company, OrdType) {
        this.log.Info("callMI");
        var _this = this;
        return new Promise(function (resolve) {
            var request = {
                url: '/M3/m3api-rest/v2/execute/OIS010MI/LstOrderTypes/',
                method: "GET",
                record: {
                    CONO: Company,
                    ORTP: OrdType
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                var result = response.data.results[0].records;
                _this.ORTP = result[0].ORTP;
                _this.ORTK = result[0].ORTK;
                _this.log.Info("OIS010 Response " + result[0].ORTP);
                _this.log.Info("OIS010 Response " + result[0].ORTK);
                if (null != _this.ORTP) {
                    resolve(_this.ORTP);
                }
                else {
                    resolve(null);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    ;
    OIS101B_OrderEntryItemCheck.prototype.callAPI = function (Company, FILE, TXID, langCode, Itemno) {
        return __awaiter(this, void 0, void 0, function () {
            var now, day, month, year, day1, month1, currentdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // this.allEventsComplete = "false";
                    return [4 /*yield*/, this.CRS980MIgetTextID(FILE, Company, Itemno)];
                    case 1:
                        // this.allEventsComplete = "false";
                        _a.sent();
                        if (!(this.TXID != "" && this.TXID != "0")) return [3 /*break*/, 3];
                        this.log.Info("IfcallAPI" + this.TXID);
                        return [4 /*yield*/, this.CRS980MISelTextBlock(Company, TXID, langCode)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        now = new Date();
                        day = now.getDate();
                        month = now.getMonth() + 1;
                        year = now.getFullYear();
                        day1 = "";
                        month1 = "";
                        if (day < 10) {
                            day1 = ('0' + day);
                        }
                        else {
                            day1 = "" + day;
                        }
                        if (month < 10) {
                            month1 = ('0' + month);
                        }
                        else {
                            month1 = "" + month;
                        }
                        currentdate = year + "" + month1 + "" + day1;
                        this.log.Info("errorcurrentdate" + currentdate);
                        //"From" date set and current date < from date => false!
                        if (this.fromDate > "0" &&
                            (this.fromDate > currentdate)) {
                            this.validDate = false;
                        }
                        else {
                            //"To" date set and current date > to date => false !
                            if (this.toDate > "0" && (this.toDate < currentdate)) {
                                this.validDate = false;
                            }
                        }
                        //return validDate;
                        this.log.Info("second enter");
                        this.firstTime = false;
                        this.controller.PressKey("ENTER");
                        return [2 /*return*/];
                }
            });
        });
    };
    OIS101B_OrderEntryItemCheck.prototype.callAPI1 = function (Company, OrdType, OrdNum, Addtype) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.Info("IfcallAPI1");
                        return [4 /*yield*/, this.getOIS010LstOrderTypes(Company, OrdType)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.OIS100MIGetAddress(Company, OrdNum, Addtype)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OIS101B_OrderEntryItemCheck.prototype.OIS100MIGetAddress = function (Company, OrdNum, Addtype) {
        this.log.Info("callMI1");
        var _this = this;
        return new Promise(function (resolve) {
            var request = {
                url: '/M3/m3api-rest/v2/execute/OIS100MI/GetAddress/',
                method: "GET",
                record: {
                    CONO: Company,
                    ORNO: OrdNum,
                    ADRT: Addtype
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                var result = response.data.results[0].records;
                _this.CSCD = result[0].CSCD;
                _this.log.Info("OIS100MI Response " + result[0].CSCD);
                if (null != _this.CSCD) {
                    resolve(_this.CSCD);
                }
                else {
                    resolve(null);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    ;
    OIS101B_OrderEntryItemCheck.prototype.CRS980MIgetTextID = function (file, Company, Item) {
        var _this = this;
        this.log.Info("callMI2");
        this.log.Info("" + file + Company + Item);
        return new Promise(function (resolve) {
            var request = {
                url: '/M3/m3api-rest/v2/execute/CRS980MI/GetTextID/',
                method: "GET",
                record: {
                    FILE: file,
                    KV01: Company,
                    KV02: Item
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                _this.log.Info("response" + response);
                var result = response.data.results[0].records;
                _this.log.Info("result" + result[0].TXID);
                if (result != null && result != undefined)
                    _this.TXID = result[0].TXID;
                if (null != _this.TXID) {
                    resolve(_this.TXID);
                }
                else {
                    resolve(null);
                }
            }).catch(function (response) {
                //_this.log.Error(response);
                _this.log.Error(response.message);
            });
        });
    };
    OIS101B_OrderEntryItemCheck.prototype.CRS980MISelTextBlock = function (Company, txid, langCode) {
        this.log.Info("CallMI3");
        var _this = this;
        return new Promise(function (resolve) {
            var request = {
                url: '/M3/m3api-rest/v2/execute/CRS980MI/SltTxtBlock/',
                method: "GET",
                record: {
                    CONO: Company,
                    TXID: _this.TXID,
                    DIVI: "",
                    TXVR: "ORDMSG",
                    TFIL: "MSYTXH00",
                    LNCD: ""
                }
            };
            _this.log.Info("TXID" + _this.TXID);
            _this.log.Info("Company" + Company);
            _this.ionApiService.execute(request).then(function (response) {
                if (response != null) {
                    if (response.data != null && response.data != undefined) {
                        if (response.data.results != null && response.data.results != undefined) {
                            var result = response.data.results[0].records;
                            _this.lanGB = "";
                            _this.lanOther = "";
                            for (var i = 0; i < result.length; i++) {
                                if (i == 0) {
                                    _this.fromDate = result[i].TX60;
                                    _this.fromDate = _this.fromDate.substring(11, 19);
                                }
                                if (i == 1) {
                                    _this.toDate = result[i].TX60;
                                    _this.toDate = _this.toDate.substring(9, 17);
                                }
                                if (i == 2) {
                                    _this.Category = result[i].TX60;
                                    _this.Category = _this.Category.substring(5);
                                }
                                if (i == 3) {
                                    _this.Scope = result[i].TX60;
                                    _this.Scope = _this.Scope.substring(7);
                                }
                                if (result[i].TX60.includes("GB") && !result[i].TX60.includes("<scope>")) {
                                    _this.lanGB += result[i].TX60;
                                }
                                if (result[i].TX60.includes(langCode) && !result[i].TX60.includes("<scope>")) {
                                    _this.lanOther += result[i].TX60;
                                }
                            }
                            _this.log.Info("Elements found: " + _this.fromDate);
                            _this.log.Info("Elements found: " + _this.lanGB);
                            _this.log.Info("Elements found: " + _this.lanOther);
                            if (null != _this.fromDate) {
                                resolve(_this.fromDate);
                            }
                            else {
                                resolve(null);
                            }
                        }
                    }
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    OIS101B_OrderEntryItemCheck.prototype.attachEvents = function (controller) {
        var _this_1 = this;
        this.unsubscribeRequesting = controller.Requesting.On(function (e) {
            //Get enter event		
            if (e.commandType === "KEY" && e.commandValue === "ENTER" && _this_1.controller.GetPanelName() == "OIA101BC") {
                if (_this_1.firstTime) {
                    var Itemno = ScriptUtil.GetFieldValue("WBITNO");
                    _this_1.log.Info(_this_1.Company + _this_1.file + _this_1.TXID + Itemno);
                    _this_1.callAPI(_this_1.Company, _this_1.file, _this_1.TXID, _this_1.langCode, Itemno);
                    _this_1.log.Info("post calculation");
                    _this_1.firstTime = false;
                    e.cancel = true;
                    return;
                }
                if (_this_1.ORTK === "2") {
                    _this_1.log.Info("If1");
                    _this_1.controller.ShowMessage("Order Category is not allowed");
                    _this_1.firstTime = true;
                    e.cancel = true;
                    _this_1.detachEvents();
                }
                else if (_this_1.CSCD === "") {
                    _this_1.log.Info("elseif1");
                    _this_1.controller.ShowMessage("Country is not set");
                    _this_1.firstTime = true;
                    e.cancel = true;
                    _this_1.detachEvents();
                }
                else if ((_this_1.Scope.includes("ALL") || _this_1.Scope.includes(_this_1.CSCD)) && (_this_1.lanOther != "")
                    && (_this_1.validDate)) {
                    _this_1.log.Info("elseif2");
                    ConfirmDialog.Show({
                        header: "Lely: Order Line Validation",
                        message: "For this item an item text exists in Language:" + _this_1.langCode + "\r\n" + _this_1.lanOther.replaceAll("<txt>[" + _this_1.langCode + "]", "") + "," + "\nContact master data to complete the information",
                        dialogType: "Information"
                    });
                    _this_1.firstTime = true;
                    if (_this_1.Category === "0") {
                        _this_1.log.Info("catif1");
                        e.cancel = false;
                    }
                    else {
                        e.cancel = true;
                        _this_1.log.Info("catelse1");
                    }
                    _this_1.detachEvents();
                }
                else if ((_this_1.Scope.includes("ALL") || _this_1.Scope.includes(_this_1.CSCD)) && (_this_1.lanGB != "")
                    && (_this_1.validDate)) {
                    _this_1.log.Info("elseif3");
                    // this.controller.ShowMessage("No Error");
                    ConfirmDialog.Show({
                        header: "Lely: Order Line Validation",
                        message: "For this item an item text exists in Language GB:" + +"\r\n" + _this_1.lanGB.replaceAll("<txt>[GB]", "") + "," + "\nContact master data to complete the information",
                        dialogType: "Information"
                    });
                    _this_1.firstTime = true;
                    if (_this_1.Category === "0") {
                        e.cancel = false;
                        _this_1.log.Info("catif2");
                    }
                    else {
                        e.cancel = true;
                        _this_1.log.Info("catelse2");
                    }
                    _this_1.detachEvents();
                }
            }
            else {
                _this_1.log.Info("Detach Events");
                _this_1.detachEvents();
            }
        });
    };
    OIS101B_OrderEntryItemCheck.prototype.detachEvents = function () {
        this.unsubscribeRequesting();
    };
    return OIS101B_OrderEntryItemCheck;
}());
//# sourceMappingURL=OIS101B_OrderEntryItemCheck.js.map