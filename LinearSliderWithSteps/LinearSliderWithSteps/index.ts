import { timingSafeEqual } from "crypto";
import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class LinearSliderWithSteps implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Value of the field is stored and used inside the control 
	private _value: number;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;

	// label element created as part of this control
	private labelElement: HTMLLabelElement;

	// input element that is used to create the range slider
	private inputElement: HTMLInputElement;

	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;

	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
	
	// Event Handelr 'refreshData' reference
	private _refreshData: EventListenerOrEventListenerObject;
	
/**
 * Empty constructor.
 */
constructor() {

}
	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		let id = Math.random().toString().split('.')[1];
		
		this._context = context;
		this._container = document.createElement("div");
		this._container.style.textAlign = context.parameters.labelPosition.raw;
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.refreshData.bind(this);


		// creating HTML elements for the input type range and binding it to the function which refreshes the control data
		this.inputElement = document.createElement("input");
		this.inputElement.setAttribute("type","range");
		this.inputElement.addEventListener("input",this._refreshData);

		if(context.mode.isControlDisabled){
			this.inputElement.setAttribute("disabled","disabled");
		}

		//setting the max and min values for the control.
		this.inputElement.setAttribute("min",context.parameters.min.raw?.toString()??"0");
		this.inputElement.setAttribute("max",context.parameters.max.raw?.toString()??"100");
		this.inputElement.setAttribute("step",context.parameters.step.raw?.toString()??"1");
		this.inputElement.setAttribute("class","linearslider");
		this.inputElement.setAttribute("id","linearrangeinput-" + id);

		if(context.parameters.color && context.parameters.color.raw)
		{
			if(navigator.userAgent.indexOf("Chrome") >= 0){
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-webkit-slider-runnable-track", "{background-color:"+context.parameters.color.raw+" !important;}");
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-webkit-slider-thumb", "{background-color:"+context.parameters.color.raw+" !important;}");
			}
			else if(navigator.userAgent.indexOf("Firefox") >= 0){
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-moz-range-track", "{background-color:"+context.parameters.color.raw+" !important;}");
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-moz-range-thumb", "{background-color:"+context.parameters.color.raw+" !important;}");
			}
			else if(navigator.userAgent.indexOf("Edge") >= 0)
			{
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-ms-track", "{background-color:"+context.parameters.color.raw+" !important;}");
				this.createStyleRule(".LinerSliderWithSteps-" + id + "::-ms-thumb", "{background-color:"+context.parameters.color.raw+" !important;}");
			}
			this.inputElement.setAttribute("class","linearslider LinerSliderWithSteps-" + id);
		}
		else{
			this.inputElement.setAttribute("class","linearslider");
		}
		
		// creating a HTML label element that shows the value that is set on the linear range control
		this.labelElement = document.createElement("label");
		this.labelElement.setAttribute("class", "TS_LinearRangeLabel");
		this.labelElement.setAttribute("id","lrclabel-" + id);

		// retrieving the latest value from the control and setting it to the HTMl elements.
		this._value = context.parameters.controlValue.raw!;
		this.inputElement.setAttribute("value",context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : context.parameters.min.raw?.toString()??"0");
		this.labelElement.innerHTML = ((context.parameters.labelPrefix.raw ?? "") + " " + context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : context.parameters.min.raw?.toString()??0 + " " + (context.parameters.labelSuffix.raw ?? "")) ?? "";

		// appending the HTML elements to the control's HTML container element.
		this._container.appendChild(this.inputElement);
		this._container.appendChild(this.labelElement);
		container.appendChild(this._container);
	}

	private createStyleRule(name:string,content:string){
		let styleSheet = this.GetStyleSheet();
		if(styleSheet != null){
			// @ts-ignore
			let index = styleSheet.insertRule(name + " " + content);
		}
	}

	private GetStyleSheet() {
		for(var i=0; i<document.styleSheets.length; i++) {
		  var sheet = document.styleSheets[i];
		  if(sheet.href && sheet.href.endsWith("LinearSliderWithSteps.css")) {
			return sheet;
		  }
		}
		return null;
	  }

	
	/**
	 * Updates the values to the internal value variable we are storing and also updates the html label that displays the value
	 * @param evt : The "Input Properties" containing the parameters, control metadata and interface functions
	 */
	public refreshData(evt: Event) : void
	{
		this._value = (this.inputElement.value as any)as number;
		this.labelElement.innerHTML =((this._context.parameters.labelPrefix.raw ?? "") + " " + this.inputElement.value + " " + (this._context.parameters.labelSuffix.raw ?? "")) ?? "";
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(context.mode.isControlDisabled){
			this.inputElement.setAttribute("disabled","disabled");
		}else{
			this.inputElement.removeAttribute("disabled");
		}

		// storing the latest context from the control.
		this._value = context.parameters.controlValue.raw!;
		this._context = context;
		this.inputElement.setAttribute("value",context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
		this.labelElement.innerHTML = ((this._context.parameters.labelPrefix.raw ?? "") + " " + this.inputElement.value + " " + (this._context.parameters.labelSuffix.raw ?? "")) ?? "";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			controlValue : this._value
		};
	}

	/** 
	  * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy()
	{
		this.inputElement.removeEventListener("input", this._refreshData);
	}
}