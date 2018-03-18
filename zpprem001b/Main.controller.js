sap.ui.controller("zpprem001b.Main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zpprem001b.Main
*/
	onInit: function() {

		//Create an Application Context to store global data
		sap.ui.getCore().AppContext = new Object();
		
		sap.ui.getCore().AppContext.appInstance = sap.ui.getCore().byId("app");
		
		//Create the Model to Load Data from NW Gateway OData service
		var sServiceUrl = "/sap/opu/odata/SAP/ZPPREM001B_SRV/";
		sap.ui.getCore().AppContext.oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);
		
		//Bind the model to Core
		sap.ui.getCore().setModel(sap.ui.getCore().AppContext.oModel);
		
		//Create a Local Model to use for the input data
		sap.ui.getCore().AppContext.oLocalModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().AppContext.oLocalModel.setData(
				{	
					storageUnit : null
				});

		//Bind the model to Core under the name of local
		sap.ui.getCore().setModel(sap.ui.getCore().AppContext.oLocalModel, "local");
		
		//Create the resource bundle model for the translatable texts
		var sLangu = sap.ui.getCore().getConfiguration().getLanguage();
		console.log("The language is: " + sLangu);
		
		if(!sLangu){
			sLangu = "en";
		}

		this.oLangu = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "translations/translation.properties", 
			bundleLocale : sLangu
		});
		
		sap.ui.getCore().setModel(this.oLangu, "i18n");

		//Get reference to the i18n model in the app context
		sap.ui.getCore().AppContext.i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();

		//Create a NumberFormat to display the quant fields
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		sap.ui.getCore().AppContext.oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			decimals: 3,
			minFractionDigits: 3,
			maxFractionDigits: 3,
			groupingEnabled: true,
			groupingSeparator: ".",
			decimalSeparator: ","
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zpprem001b.Main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zpprem001b.Main
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zpprem001b.Main
*/
//	onExit: function() {
//
//	}

	/**
	 * Search the storage unit in the back end to find the correct Production Order
	 */
	onSearch : function(oEvent){

		jQuery.sap.require("sap.m.MessageBox");

		var _appContext = sap.ui.getCore().AppContext;
		
		_appContext.sLenum = oEvent.getSource().getValue();
		_appContext.sPath = "/ULCSSet(Bname='',Lenum='" + _appContext.sLenum + "')";

		//Create a loading indicator for the async call
		if(!_appContext.dataLoaderBusyIndicator){
			_appContext.dataLoaderBusyIndicator = new sap.m.BusyDialog("dataLoaderBusyIndicator", {
                showCancelButton: false,
                title: "{i18n>WAITING}",
                text: "{i18n>WAITING_CONFIRMATION}" });
		}

		_appContext.dataLoaderBusyIndicator.open();
				
		//Search in the back end for that StorageUnit
		sap.ui.getCore().AppContext.oModel.read(_appContext.sPath, null, [], true,
				
				//the operation was successful
				function(oData, oResponse){
					_appContext.dataLoaderBusyIndicator.close();
					if(!oData.Plnum){
						var sErrorMessage = _appContext.i18n.getText("MESSAGE_PLNUM_NOT_FOUND");
						sap.m.MessageBox.error(sErrorMessage, { } );
					} else {
						_appContext.sPlnum = oData.Plnum;
						_appContext.plannedQuant = oData.Gsmngf;
						_appContext.appInstance.to("OrderDetail");
					}
				},
				
				//an error occurred
				function(oError){
					_appContext.dataLoaderBusyIndicator.close();
					sap.m.MessageBox.error(oError, { } );
				});
	}
			
});