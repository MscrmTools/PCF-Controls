import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyleProps, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { IRecordSelectorProps } from "./IRecordSelectorProps";
import { DropdownOld } from './DropdownOld';
import { DropdownNew } from './DropdownNew';


export const RecordSelector: React.FunctionComponent<IRecordSelectorProps> = props => {
  if (!props.theme) { 
  return (
    <DropdownOld
        selectedValue={props.selectedValue}
        availableOptions={props.availableOptions}
        isDisabled={props.isDisabled}
        onChange={(e: any, option?: IDropdownOption) => {
            props.onChange(option);
        }}
        
    />);
      }

      return (
        <DropdownNew
          theme={props.theme}
          isDisabled={props.isDisabled}
          selectedValue={props.selectedValue}
          availableOptions={props.availableOptions}
          onChange={props.onChange}
        />);
}

