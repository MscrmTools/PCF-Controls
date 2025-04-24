import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { IMessageProps, NotificationControl } from "./NotificationControl";
import { MessageBarIntent, Theme, webLightTheme } from "@fluentui/react-components";
export class SimpleNotification
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  /**
   * Empty constructor.
   */
  constructor() {
    // Empty
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    // Add code to initialize control if necessary
    context.mode.trackContainerResize(true);
    
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    const props: IMessageProps = {
      messageType: "info",
      messageText: context.parameters.message.raw ?? "",
      showLink: context.parameters.showLink.raw === "Yes",
      link: context.parameters.link.raw,
      linkText: context.parameters.linkText.raw,
      theme: (context.fluentDesignLanguage?.tokenTheme ?? webLightTheme) as Theme,
      title: context.parameters.title.raw ?? "",
      isMultiline : context.parameters.isMultiLine.raw === "Yes",
    };

    switch (context.parameters.messageType.raw) {
      case "Blocked":
      case "Error":
        props.messageType = "error";
        break;

      default:
      case "Info":
        props.messageType = "info";
        break;
      case "Warning":
      case "SeverWarning":
        props.messageType = "warning";
        break;
      case "Success":
        props.messageType = "success";
        break;
    }

    return React.createElement(NotificationControl, props);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
