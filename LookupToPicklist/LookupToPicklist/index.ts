import { IInputs, IOutputs } from './generated/ManifestTypes'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { RecordSelector } from './RecordSelector'
import { DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown'

export class LookupToPicklist implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private container: HTMLDivElement;
	private notifyOutputChanged: () => void;
	private entityName: string;
	private entityIdFieldName: string;
	private entityNameFieldName: string;
	private entityDisplayName: string;
	private viewId: string;
	private availableOptions: IDropdownOption[];
	private actionOptions: IDropdownOption[];
	private currentValue?: ComponentFramework.LookupValue[];

	constructor() {
	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		this._context = context;
		this.container = container
		this.notifyOutputChanged = notifyOutputChanged

		this.entityName = context.parameters.lookup.getTargetEntityType()
		this.viewId = context.parameters.lookup.getViewId();
		var self = this;

		context.utils.getEntityMetadata(this.entityName).then(metadata => {
						
			self.entityIdFieldName = metadata.PrimaryIdAttribute
			self.entityNameFieldName = metadata.PrimaryNameAttribute
			self.entityDisplayName = metadata.DisplayName;
			
			// Add items to add a new record
			self.actionOptions = new Array<IDropdownOption>();
			self.actionOptions.push({
				key:"divider",
				text:"",
				itemType: DropdownMenuItemType.Divider
			});
			self.actionOptions.push({
				key:"new",
				text:context.resources.getString("AddNew_Display_Key") + " " + self.entityDisplayName,
				itemType: DropdownMenuItemType.Normal,
				data:{icon:"Add", isMenu:true}
			});

			self.retrieveRecords();
		})
	}

	private retrieveRecords(){
		var thisCtrl = this;
	
		thisCtrl._context.webAPI.retrieveRecord('savedquery', this.viewId, "?$select=fetchxml,returnedtypecode").then(view =>{
			thisCtrl._context.webAPI.retrieveMultipleRecords(view.returnedtypecode, '?fetchXml=' + view.fetchxml).then(result => {
				thisCtrl.availableOptions = result.entities.map(r => {
					let localizedEntityFieldName = ''
					let mask = thisCtrl._context.parameters.attributemask.raw

					if(mask){
						localizedEntityFieldName = mask.replace('{lcid}', thisCtrl._context.userSettings.languageId.toString())
					}

					return {
						key: r[thisCtrl.entityIdFieldName],
						text: (r[localizedEntityFieldName] ? r[localizedEntityFieldName] : r[thisCtrl.entityNameFieldName]) ?? 'Display Name is not available'
					}
				});
			
				this.renderControl(thisCtrl._context)
			})
		})
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {
		var thisCtrl = this;
		const recordId = context.parameters.lookup.raw != null && context.parameters.lookup.raw.length > 0 
		? context.parameters.lookup.raw[0].id 
		: '---'

		if(context.parameters.sortByName.raw === "1"){
			this.availableOptions = this.availableOptions.sort((n1,n2) => {
				if (n1.text > n2.text) {
					return 1;
				}
			
				if (n1.text < n2.text) {
					return -1;
				}
			
				return 0;
			})
		}
		
		let options = [{key: '---', text:'---'},...this.availableOptions];
		if(thisCtrl._context.parameters.addNew.raw === "1")
		{
			// If rights to read and create entity
			if(thisCtrl._context.utils.hasEntityPrivilege(thisCtrl.entityName, 1, 0)
			&& thisCtrl._context.utils.hasEntityPrivilege(thisCtrl.entityName, 2, 0)){
				options.push(...thisCtrl.actionOptions);
			}
		}

		const recordSelector = React.createElement(RecordSelector, {
			selectedRecordId: recordId,
			availableOptions:  options,
			isDisabled: context.mode.isControlDisabled,
			onChange: (selectedOption?: IDropdownOption) => {
				if(selectedOption?.key === "new"){
					context.navigation.openForm({
						entityName : this.entityName,
						useQuickCreateForm: true,
						windowPosition: 2
					}).then(()=>{
						thisCtrl.retrieveRecords();
					});
				}
				else if (typeof selectedOption === 'undefined' || selectedOption.key === '---') {
					this.currentValue = undefined
				} else {
					this.currentValue = [{
						id: <string>selectedOption.key,
						name: selectedOption.text,
						entityType: this.entityName
					}]
				}

				this.notifyOutputChanged();
			}
		})

		ReactDom.render(recordSelector, this.container);
	}

	public getOutputs(): IOutputs {
		return {
			lookup: this.currentValue
		}
	}

	public destroy(): void {
		ReactDom.unmountComponentAtNode(this.container)
	}
}
