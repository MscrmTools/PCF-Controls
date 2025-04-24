import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class DateAsCheckbox implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _checkboxid:string;
	private _labelid:string;
	private _options:Array<object>;
	private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		const id = Math.random().toString().split('.')[1];
		this._checkboxid = id + "-c";
		this._labelid = id + "-l";
		// @ts-expect-error not exposed by the framework
		this._options = context.parameters.DateAttribute.attributes.Options;
		this._notifyOutputChanged = notifyOutputChanged;

		const subContainer = <HTMLDivElement>document.createElement("div");
		subContainer.className = "dac-container";
		container.appendChild(subContainer);
		
		const lblContainer = document.createElement("label");
		lblContainer.setAttribute("class", "dac-container-switch");
		subContainer.appendChild(lblContainer);

		

		const chk = document.createElement("input");
		chk.id = this._checkboxid;
		chk.setAttribute("type", "checkbox");
		chk.addEventListener("change", this.changefunction);

		if (context.mode.isControlDisabled) {
			chk.setAttribute("disabled", "disabled");
		}

		const toggle = document.createElement("span");
		
		lblContainer.appendChild(chk);
		lblContainer.appendChild(toggle);

		if(context.parameters.offColor && context.parameters.offColor.raw)
		{
			this.createStyleRule(".dac-slider-" + this._checkboxid, "{background-color:"+context.parameters.offColor.raw+" !important;border:solid 2px " + context.parameters.offColor.raw + " !important;}");
		}

		if(context.parameters.onColor && context.parameters.onColor.raw)
		{
			this.createStyleRule("input:checked + .dac-slider-" + this._checkboxid, "{background-color:"+context.parameters.onColor.raw+" !important;border:solid 2px " + context.parameters.onColor.raw + " !important;}");
		}

		if(context.parameters.switchColor && context.parameters.switchColor.raw){
			this.createStyleRule(".dac-slider-" + this._checkboxid + "::before", "{background-color:"+context.parameters.switchColor.raw+" !important;}");
		}

		if(context.parameters.layout && context.parameters.layout.raw === "Square"){
			toggle.setAttribute("class","dac-slider-default dac-slider-" + this._checkboxid);
		}
		else{
			toggle.setAttribute("class","dac-slider-default dac-slider-" + this._checkboxid + " dac-round");
		}
	}
	private changefunction(){
		this._notifyOutputChanged();
	}

	private createStyleRule(name:string,content:string){
		const styleSheet = this.GetStyleSheet();
		if(styleSheet != null){
			styleSheet.insertRule(name + " " + content);
		}
	}

	
	private GetStyleSheet() {
		for(let i=0; i<document.styleSheets.length; i++) {
		  const sheet = document.styleSheets[i];
		  if(sheet.href && sheet.href.endsWith("CustomSwitch.css")) {
			return sheet;
		  }
		}
		return null;
	  }



	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(context.parameters.DateAttribute){
			(<HTMLInputElement>document.getElementById(this._checkboxid)).checked = context.parameters.DateAttribute.raw != null && context.parameters.DateAttribute.raw != undefined ;
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		let date : Date | undefined;
		date = new Date();
		if((<HTMLInputElement>document.getElementById(this._checkboxid)).checked === false){
			date = undefined;
		}

		return {
			DateAttribute : date
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}