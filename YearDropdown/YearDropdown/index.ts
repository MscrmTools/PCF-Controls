import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import React = require("react");
import ReactDom = require("react-dom");
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { RecordSelector } from "./RecordSelector";

export class YearDropdown implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _context : ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;
	private notifyOutputChanged: () => void;
	private availableOptions: IDropdownOption[];
	private currentValue?: number;
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
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        var currentYear = new Date().getFullYear();

        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this.availableOptions = new Array();
        this._context = context;
        

        for(let i=(context.parameters.yearsBefore?.raw ?? 5);i>0; i--){
            this.availableOptions.push({key:currentYear-i, text:(currentYear-i).toString()});
        }

        this.availableOptions.push({key:currentYear, text:currentYear.toString()});

        for(let i=1;i<=(context.parameters.yearsAfter?.raw ?? 5); i++){
            this.availableOptions.push({key:currentYear+i, text:(currentYear+i).toString()});
        }

        this.renderControl(context);
    }

    private renderControl(context: ComponentFramework.Context<IInputs>) {
        let currentValue:number;
        if(this._context.parameters.targetColumn.type === "Whole.None" ){
            currentValue = context.parameters.targetColumn != null && context.parameters.targetColumn.raw != null && context.parameters.targetColumn.raw.toString() != 0
            ? context.parameters.targetColumn.raw
            : -1
        }
        else if(this._context.parameters.targetColumn.type === "SingleLine.Text"){
            currentValue = context.parameters.targetColumn != null && context.parameters.targetColumn.raw != null && context.parameters.targetColumn.raw.toString() != "" && !isNaN(context.parameters.targetColumn.raw)
            ? parseInt(context.parameters.targetColumn.raw)
            : -1
        }
        else{
            currentValue = context.parameters.targetColumn != null && context.parameters.targetColumn.raw != null ?
            (<Date>context.parameters.targetColumn.raw).getFullYear()
            : -1
        } 

		const recordSelector = React.createElement(RecordSelector, {
			selectedValue: currentValue,
			availableOptions:  [{key: -1, text:'---'},...this.availableOptions],
			isDisabled: context.mode.isControlDisabled,
			onChange: (selectedOption?: IDropdownOption) => {
				if (typeof selectedOption === 'undefined' || selectedOption.key === -1) {
					this.currentValue = undefined
				} else {
					this.currentValue = <number>selectedOption.key
				}

				this.notifyOutputChanged();
			}
		})

		ReactDom.render(recordSelector, this.container);
	}


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this.renderControl(context);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        if(this.currentValue === -1 || this.currentValue === undefined){
            return {targetColumn:null}
        }

        let year = this.currentValue ?? null;

        if(this._context.parameters.targetColumn.type === "Whole.None"){
            return {
                targetColumn: year
            };
            
        }
        if(this._context.parameters.targetColumn.type === "SingleLine.Text"){
            return {
                targetColumn: year?.toString()
            };
            
        }
        else{
            return {
                targetColumn: new Date(year, (this._context.parameters.dateDefaultMonth?.raw ?? 1) - 1, this._context.parameters.dateDefaultDay?.raw ?? 1)
            };
        }
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        ReactDom.unmountComponentAtNode(this.container)
    }
}
