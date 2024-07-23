import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MyDateRangePicker, { IDateRangePickerProps } from "./MyDateRangePicker";
import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class DateRangerPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private theContext: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    private startDate:Date | null;
    private endDate:Date | null;
    private container:HTMLDivElement;
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
        this.notifyOutputChanged = notifyOutputChanged;
        this.theContext = context;
        this.container = container;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        const props: IDateRangePickerProps = { 
            startDate:context.parameters.StartDate.raw,
            endDate:context.parameters.EndDate.raw,
            enabled:!context.mode.isControlDisabled,
            placeholder: context.parameters.PlaceHolder.raw ?? "Select a date range",
            character : context.parameters.LinkCharacter.raw ?? " ~ ",
            dateFormat : context.parameters.DateFormat.raw ?? "yyyy-MM-dd",
            useOneCalendar: context.parameters.ShowOneCalendar.raw === "1",
            useWeeksNumber: context.parameters.ShowWeeksNumber.raw === "1",
            calendarCallback:this.calendarCallback
        };
        var control = React.createElement(
            MyDateRangePicker, props
        );

        ReactDOM.render(control, this.container);

    }

    private calendarCallback = (startDate:Date | null, endDate:Date | null)=>{
        this.startDate = startDate;
        this.endDate = endDate;
        this.notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            StartDate:this.startDate ?? undefined,
            EndDate:this.endDate ?? undefined
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
