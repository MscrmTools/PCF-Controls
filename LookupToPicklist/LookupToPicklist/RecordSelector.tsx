import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyleProps, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { Icon } from '@fluentui/react/lib/Icon';

export interface IRecordSelectorProps {
    selectedRecordId: string | undefined;
    availableOptions: IDropdownOption[];
    isDisabled: boolean;
    onChange: (selectedOption?: IDropdownOption) => void;
}

export const RecordSelector: React.FunctionComponent<IRecordSelectorProps> = props => {
    return (
    <Dropdown
        selectedKey={props.selectedRecordId}
        options={props.availableOptions}
        disabled={props.isDisabled}
        onChange={(e: any, option?: IDropdownOption) => {
            props.onChange(option);
        }}
        styles={DropdownStyle}
        onRenderOption={(option): JSX.Element=>{
            if(option?.data && option.data.isMenu && option.data.icon){
                return (
                    <div>
                            <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                            <span style={italicStyle}>{option?.text}</span>
                    </div>
                );
                }
                else{
                    return (
                        <div><span>{option?.text}</span>
                        </div>
                    );
                }
        }}
    />);
}
const iconStyles = { marginRight: '8px' };
const italicStyle = { fontStyle: 'italic', align:'right' };

export const DropdownStyle = (props: IDropdownStyleProps): Partial<IDropdownStyles> => ({
  ...(props.disabled ? {
      root: {
          width: "100%"
      },
      title: {
          color: "rgb(50, 49, 48)",
          borderColor: "transparent",
          backgroundColor: "transparent",
          fontWeight: 600,
          ":hover": {
              backgroundColor: "rgb(226, 226, 226)"
          }
      },
      caretDown: {
          color: "transparent"
      }
  }: {
      root: {
          width: "100%"
      },
      title: {
          borderColor: "transparent",
          fontWeight: 600,
          ":hover": {
              borderColor: "rgb(96, 94, 92)",
              fontWeight: 400
          }
      },
      caretDown: {
          color: "transparent",
          ":hover": {
              color: "rgb(96, 94, 92)"
          }
      },
      dropdown: {
          ":focus:after": {
              borderColor: "transparent"
          }
      }
  })
});