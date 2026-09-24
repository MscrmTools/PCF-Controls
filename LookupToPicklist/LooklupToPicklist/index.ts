import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { LookupCombobox } from "./LookupCombobox";
import * as React from "react";

const normalizeId = (id: string | undefined | null): string | undefined =>
	id ? id.replace(/[{}]/g, "").toLowerCase() : undefined;

export class LookupToPicklist implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
	private entityName: string;
	private viewId: string;
	private currentValue?: ComponentFramework.LookupValue[];
	private parentId: string | undefined;
	private clearedByParentChange = false;
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
        this.notifyOutputChanged = notifyOutputChanged;
		// These APIs are not always available (e.g. in the form designer)
		try {
			this.entityName = context.parameters.lookup.getTargetEntityType();
		} catch (error) {
			console.log("LookupToPicklist: unable to get the target table", error);
		}
		const lookupMetadata = context.parameters.lookup.attributes as ComponentFramework.PropertyHelper.FieldPropertyMetadata.LookupMetadata | undefined;
		this.entityName ??= lookupMetadata?.Targets?.[0] ?? "";
		try {
			this.viewId = context.parameters.lookup.getViewId();
		} catch (error) {
			console.log("LookupToPicklist: unable to get the lookup view", error);
			this.viewId = "";
		}
		// Remember the initial parent so loading the form doesn't clear the value
		this.parentId = normalizeId(context.parameters.dependantLookup?.raw?.[0]?.id);
    }

    private renderControl(context: ComponentFramework.Context<IInputs>) : React.ReactElement {
		const lookupValue = this.clearedByParentChange ? undefined : context.parameters.lookup.raw?.[0];

		const recordId = normalizeId(lookupValue?.id) ?? "---";

		return React.createElement(LookupCombobox, {
			context: context,
			selectedId: recordId,
			selectedName: lookupValue?.name,
			viewId: this.viewId,
			entityName: this.entityName,
			isDisabled: context.mode.isControlDisabled,
			notifyOutputChanged: this.notifyChange.bind(this),
			parentRecordId: this.parentId,
		});
	}

	public notifyChange(value : ComponentFramework.LookupValue | undefined) : void {
		this.clearedByParentChange = false;
		this.currentValue = value? [value] : undefined;
		this.notifyOutputChanged();
	}

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
		const newParentId = normalizeId(context.parameters.dependantLookup?.raw?.[0]?.id);
		if (newParentId !== this.parentId) {
			this.parentId = newParentId;
			// The current value may not belong to the new parent: clear it,
			// but only when there is something to clear to avoid dirtying the form
			if ((context.parameters.lookup.raw?.length ?? 0) > 0) {
				this.clearedByParentChange = true;
				this.currentValue = undefined;
				this.notifyOutputChanged();
			}
		}
		else if (this.clearedByParentChange && !(context.parameters.lookup.raw?.length)) {
			// The platform has applied the cleared value
			this.clearedByParentChange = false;
		}

		return this.renderControl(context);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
			lookup: this.currentValue,
		 };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
