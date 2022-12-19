import { IInputs, IOutputs } from './generated/ManifestTypes'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { SearchableDropdown } from './SearchableDropdown'

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
	private newlyCreatedId: string|null;
	private parentId: string|null;

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
	
		let filter = "";
		if(this.viewId){
			filter = "?$top=1&$select=fetchxml,returnedtypecode&$filter=savedqueryid eq " + this.viewId;
		}
		else{
			filter = "?$top=1&$select=fetchxml,returnedtypecode&$filter=returnedtypecode eq '" + this.entityName + "' and querytype eq 64";
		}

		thisCtrl._context.webAPI.retrieveMultipleRecords('savedquery',filter).then(result =>{
			let view =result.entities[0]; 
			var xml = view.fetchxml;
			if(thisCtrl._context.parameters.dependantLookup && thisCtrl._context.parameters.dependantLookup.raw && thisCtrl._context.parameters.dependantLookup.raw.length > 0){
				var dependentId = thisCtrl._context.parameters.dependantLookup.raw[0].id;
				var attributeName = thisCtrl._context.parameters.dependantLookup.attributes?.LogicalName ?? "";

				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(xml, "text/xml");

				var entityNode = xmlDoc.getElementsByTagName("entity")[0];
				var filterNodes = entityNode.getElementsByTagName("filter");
				var filterNode;
				if(filterNodes.length == 0){
					filterNode = xmlDoc.createElement("filter");
					entityNode.appendChild(filterNode);
				}
				else{
					filterNode = filterNodes[0];
				}

				// adding condition
				let conditionNode = xmlDoc.createElement("condition");
				conditionNode.setAttribute("attribute", attributeName);
				conditionNode.setAttribute("operator", "eq");
				conditionNode.setAttribute("value", dependentId);
				filterNode.appendChild(conditionNode);

				xml = xmlDoc.documentElement.outerHTML;
			}

			thisCtrl._context.webAPI.retrieveMultipleRecords(view.returnedtypecode, '?fetchXml=' + xml).then(result => {
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
		if(context.updatedProperties.includes("dependantLookup")){
			let newParentId = context.parameters.dependantLookup.raw.length > 0 ? context.parameters.dependantLookup.raw[0].id : null;
			if(newParentId !== this.parentId){
				this.parentId = newParentId;
				this.currentValue = undefined;
				this.notifyOutputChanged();
				this.retrieveRecords();
			}
		}
		else if(context.updatedProperties.includes("lookup")){
			this.renderControl(context);
		}
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {
		var thisCtrl = this;
		let recordId = context.parameters.lookup.raw != null && context.parameters.lookup.raw.length > 0 
		? context.parameters.lookup.raw[0].id 
		: '---'

		if(thisCtrl.newlyCreatedId){
			recordId = thisCtrl.newlyCreatedId;
			thisCtrl.newlyCreatedId = null;
		}

		if(context.parameters.sortByName.raw === "1"){
			this.availableOptions = this.availableOptions.sort((n1,n2) => {
				if (n1.text.toLowerCase() > n2.text.toLowerCase()) {
					return 1;
				}
			
				if (n1.text.toLowerCase() < n2.text.toLowerCase()) {
					return -1;
				}
			
				return 0;
			})
		}

		let searchOptions = thisCtrl._context.parameters.addSearch.raw === "1" ? [ 
			{ key: 'FilterHeader', text: '-', itemType: DropdownMenuItemType.Header, data:{label: thisCtrl._context.resources.getString("searchPlaceHolder")} },
			{ key: 'divider_filterHeader', text: '-', itemType: DropdownMenuItemType.Divider }
		] : [];
		
		let mruOptions = [];
		// @ts-ignore
		let mrus = thisCtrl._context.parameters.lookup.getRecentItems();
		// @ts-ignore
		if(mrus?.length > 0 && context.parameters.lookup.getLookupConfiguration().isMruDisabled === false){
			let maxSize = thisCtrl._context.parameters.mruSize?.raw ?? 999;

			mruOptions.push({key:"mru", text:thisCtrl._context.resources.getString("recentItems"), itemType: DropdownMenuItemType.Header},{ key: 'mru_divider1', text: '-', itemType: DropdownMenuItemType.Divider });
			for(let i=0;i< mrus.length && i < maxSize; i++){
				mruOptions.push({key: mrus[i].objectId+"_mru", text:this.availableOptions.find(o => o.key===mrus[i].objectId)?.text ?? mrus[i].title, itemType: DropdownMenuItemType.Normal, data:{isMru:true}});
			}

			mruOptions.push({ key: 'mru_divider2', text: '-', itemType: DropdownMenuItemType.Divider });
		}

		let favoritesOptions = [];
		if(thisCtrl._context.parameters.favorites.raw !== null && thisCtrl._context.parameters.favorites.raw.length > 0){
			favoritesOptions.push({key:"favorite", text:thisCtrl._context.resources.getString("favorites"), itemType: DropdownMenuItemType.Header},{ key: 'mru_divider4', text: '-', itemType: DropdownMenuItemType.Divider });
			let favorites = <Array<String>>JSON.parse(thisCtrl._context.parameters.favorites.raw);

			for(let i of favorites){
				let favOption = this.availableOptions.find(o => o.key===i);
				if(favOption){
					favoritesOptions.push({key: i +"_fav", text:favOption.text, itemType: DropdownMenuItemType.Normal, data:{isFavorite:true}});
				}
			}

			favoritesOptions.push({ key: 'mru_divider5', text: '-', itemType: DropdownMenuItemType.Divider });
		}

		if(favoritesOptions.length > 0){
			favoritesOptions.push({ key: 'records_header', text: thisCtrl.entityDisplayName, itemType: DropdownMenuItemType.Header });
			favoritesOptions.push({ key: 'mru_divider3', text: '-', itemType: DropdownMenuItemType.Divider });
		}
		else if(mruOptions.length > 0){
			mruOptions.push({ key: 'records_header', text: thisCtrl.entityDisplayName, itemType: DropdownMenuItemType.Header });
			mruOptions.push({ key: 'mru_divider3', text: '-', itemType: DropdownMenuItemType.Divider });
		}

		let options = [...searchOptions,...mruOptions,...favoritesOptions,{key: '---', text:'---'},...this.availableOptions];
		if(thisCtrl._context.parameters.addNew.raw === "1")
		{
			// If rights to read and create entity
			if(thisCtrl._context.utils.hasEntityPrivilege(thisCtrl.entityName, 1, 0)
			&& thisCtrl._context.utils.hasEntityPrivilege(thisCtrl.entityName, 2, 0)){
				options.push(...thisCtrl.actionOptions);
			}
		}

		const recordSelector = React.createElement(SearchableDropdown, {
			selectedKey: recordId,
			options:  options,
			isDisabled: context.mode.isControlDisabled,
			onChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
				if(option?.key === "new"){
					context.navigation.openForm({
						entityName : this.entityName,
						useQuickCreateForm: true,
						windowPosition: 2
					}).then((result)=>{
						if(result.savedEntityReference?.length > 0){
							thisCtrl.newlyCreatedId = result.savedEntityReference[0].id.replace('{','').replace('}','').toLowerCase();
						}
						thisCtrl.retrieveRecords();
					});
				}
				else if (typeof option === 'undefined' || option.key === '---') {
					this.currentValue = undefined

					this.notifyOutputChanged();
				} else {
					option.selected = true;
					this.currentValue = [{
						id: (<string>option.key).split('_mru')[0].split('_fav')[0],
						name: option.text,
						entityType: this.entityName
					}];

					this.notifyOutputChanged();
				}
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
