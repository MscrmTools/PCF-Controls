import * as React from "react";
import { IRecordSelectorProps } from "./IRecordSelectorProps";
import { Dropdown, FluentProvider, IdPrefixProvider, Input, makeStyles, Option } from "@fluentui/react-components";

const _useStyles = makeStyles({
    root: {
        width: "100%",
    }   
});

export const DropdownNew: React.FC<IRecordSelectorProps> = (props) => {
    const selectString = "--Select--";
    const [placeholder, setPlaceholder] = React.useState<string>("---");
    const [dropdownIconVisible, setDropdownIconVisible] = React.useState<boolean>(false);
    
    const styles = _useStyles();
    const myTheme = props.isDisabled ? {
        ...props.theme,
        colorCompoundBrandStroke: props.theme?.colorNeutralStroke1,
        colorCompoundBrandStrokeHover: props.theme?.colorNeutralStroke1Hover,
        colorCompoundBrandStrokePressed: props.theme?.colorNeutralStroke1Pressed,
        colorCompoundBrandStrokeSelected: props.theme?.colorNeutralStroke1Selected,
        backgroundColor: props.theme?.colorNeutralBackground3,
        }
        :
        props.theme;

    return (
        <div className={styles.root}>
            <IdPrefixProvider value={"newDropdownControl"}>
                <FluentProvider theme={myTheme} className={styles.root}>
                {props.isDisabled?
                <Input
                    value={props.selectedValue.toString()}          
                    appearance='filled-darker'
                    className={styles.root}
                    readOnly={true}        
                    /> 
                :
                <Dropdown
                    appearance='filled-darker'
                    className={styles.root}
                    disabled={props.isDisabled}
                    value={props.selectedValue?.toString() ?? placeholder}
                    selectedOptions={props.selectedValue?.toString() ? [ props.selectedValue?.toString() ] : [ "" ]}
                    onMouseEnter={() => {
                        setPlaceholder(selectString);
                        setDropdownIconVisible(true);
                    }}
                    onMouseLeave={() => {
                        setPlaceholder("---");
                        setDropdownIconVisible(false);
                    }}
                    onBlur={() => {
                        setPlaceholder("---");
                        setDropdownIconVisible(false);
                    }}
                    onOptionSelect={(e, option) => {
                        if (!option?.optionValue) {
                            props.onChange(undefined);
                            return;
                        }

                        props.onChange(props.availableOptions.find(o => o.text === option.optionValue)!);
                    }}
                >
                {props.availableOptions.map(option => (
                    <Option
                        key={option.key}
                        value={option.text as string}
                        className={styles.root}
                    >
                        {option.text!}
                    </Option>
                ))}
                </Dropdown>
                }
                </FluentProvider>
            </IdPrefixProvider>
        </div>
    );
}