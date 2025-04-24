import { ComboboxProps, Theme } from '@fluentui/react-components';
import { IInputs } from './generated/ManifestTypes';

export interface IRecordCategory{
    title:string,
    key:string
    records: IRecord[],
    type:string
}

export interface IRecord {
    key:string,
    text:string,
    isAction?: boolean,
    type?:string
}

export interface ILookupToComboBoxProps extends ComboboxProps {
    viewId: string,
    entityName: string,
    isDisabled:boolean,
    context: ComponentFramework.Context<IInputs>,
    selectedId: string,
    parentRecordId : string | undefined,
    notifyOutputChanged: (value : ComponentFramework.LookupValue | undefined) => void,
}

export interface IMru{
    objectId:string,
    title:string
}
