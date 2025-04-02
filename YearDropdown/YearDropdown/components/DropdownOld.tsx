import * as React from 'react';
import { Dropdown, IDropdownOption, IDropdownStyleProps, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { IRecordSelectorProps } from "./IRecordSelectorProps";

export const DropdownOld: React.FunctionComponent<IRecordSelectorProps> = props => {
    return (
    <Dropdown
        selectedKey={props.selectedValue}
        options={props.availableOptions}
        disabled={props.isDisabled}
        onChange={(e: any, option?: IDropdownOption) => {
            props.onChange(option);
        }}
        styles={dropdownStyles}
    />);
}

const colorFocus = "#a9a9a9";

export const dropdownStyles = (props: IDropdownStyleProps):Partial<IDropdownStyles> => ({    
    title: [{
      color: "black",
      display: "block",
      fontWeight: props.isOpen===true ? "400" : "600",
      fontStretch: "normal",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: props.isOpen===true ? "black" : "transparent",         
      backgroundColor : "transparent",             
      outline: "none",     
      outlineColor: "transparent",
      outlineOffset: "0",
      boxSizing: "border-box",             
      height: "33px",
      width: "100%",                             
      selectors: {
        ':hover': {
          borderColor: "black",
          borderWidth:"1px",
          fontWeight : props.disabled === true ? "600" : "400", 
          backgroundColor : props.disabled === true ? "#E2E2E2" : "transparent",
          boxShadow: "none"
        }                
      }
    }],   
    dropdown: [{
      outline: "none",
      textAlign:"left",
      border: "1px solid transparent",
      outlineColor: "transparent",
      outlineOffset: "0",
      boxShadow: "none",
      selectors:{
        ":focus:after": {
          outline: "none",
          //  border: "1px solid black",
          border: props.disabled===true ? "1px solid transparent" : `1px solid ${colorFocus}`,
          outlineColor: "transparent",
          boxShadow: "none"
        }
      }
    }],
    dropdownItem: [{
      display: "inline-flex",
      selectors: {
        ":hover": {
          color: "black"
        }
      }
    }],
    dropdownItemSelected: [{
      display: "inline-flex",
      selectors: {
        ":hover": {
          color: "black"
        }
      }
    }],
    caretDown :[{
      color: props.isOpen===true? colorFocus : "transparent"        
    }],
    caretDownWrapper: [{
      borderLeft: props.isOpen===true ? `1px solid ${colorFocus}` : "none",         
      paddingLeft: "7px"
    }]          
  });  
