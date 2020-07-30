import {IInputs, IOutputs} from "./generated/ManifestTypes";
import NotificationControl from "./NotificationControl";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MessageBarType } from "office-ui-fabric-react/lib/components/MessageBar/MessageBar.types";


export class SimpleNotification implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container:HTMLDivElement;
	private _ctrl:NotificationControl;
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
		this._container = container;
	}

	private renderControl(context: ComponentFramework.Context<IInputs>){
		
		let props = {
			messageType : MessageBarType.info,
			messageText : context.parameters.message.raw,
			showLink : context.parameters.showLink.raw === "Yes",
			link:context.parameters.link?.raw || undefined,
			linkText:context.parameters.linkText?.raw
		};

		switch(context.parameters.messageType.raw){
			case "Blocked":
				props.messageType = MessageBarType.blocked;
				break;
			case "Error":
				props.messageType = MessageBarType.error;
				break;
			default:
			case "Info":
				props.messageType = MessageBarType.info;
				break;
			case "SeverWarning":
				props.messageType = MessageBarType.severeWarning;
				break;
			case "Success":
				props.messageType = MessageBarType.success;
				break;
			case "Warning":
				props.messageType = MessageBarType.warning;
				break;
		}
		
		if(this._ctrl){
			this._ctrl.setState(props);
		}
		else{
		this._ctrl = ReactDOM.render(React.createElement(NotificationControl, props), this._container);
		}
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
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this._container);
	}
}