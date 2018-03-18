sap.ui.jsview("zpprem001b.Main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zpprem001b.Main
	*/ 
	getControllerName : function() {
		return "zpprem001b.Main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zpprem001b.Main
	*/ 
	createContent : function(oController) {

		oPanel = new sap.m.Panel("Panel1", { 
			class : "sapUiResponsiveMargin",
			width : "auto" });
		
		oSearch = new sap.m.SearchField("storageUnitSearch", {
			value : "{local>/storageUnit}",
			width : "300px",
			class : "sapUiSmallMargin",
			maxLength : 20,
			placeholder : "{i18n>STORAGE_UNIT}",
			search : oController.onSearch
		});
		
		oPanel.addContent(oSearch);
		
		return new sap.m.Page({
			title: "{i18n>PUC_TITLE}",
			content: [ oPanel ]
		});
	}

});