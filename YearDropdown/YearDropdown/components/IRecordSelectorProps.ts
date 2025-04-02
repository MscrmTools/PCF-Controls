import { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Theme } from "@fluentui/react-components";

export interface IRecordSelectorProps {
    selectedValue: string | number;
    availableOptions: IDropdownOption[];
    isDisabled: boolean;
    onChange: (selectedOption?: IDropdownOption) => void;
    theme?: Theme
}