import * as React from 'react'
import {Stack} from '@fluentui/react/lib/Stack';
import {IBaseButtonProps, IBaseButtonState, IButtonStyles, PrimaryButton} from '@fluentui/react/lib/Button';
import { IIconProps } from '@fluentui/react';

export interface IButtonControlProps extends IBaseButtonProps{
    hoverBackgroundColor:string,
    hoverBorderColor:string,
    hoverColor:string,
    iconName:string | null
  }

export default class ButtonControl extends React.Component<IButtonControlProps, IBaseButtonState>{
  constructor(props :IButtonControlProps){
    super(props);
  }
  styles : IButtonStyles ={
    root:{
      backgroundColor:this.props.style?.backgroundColor ?? "#0078d4",
      borderColor:this.props.style?.borderColor ?? "#0078d4",
      color:this.props.style?.color ?? "#FFFFFF"
    },
    rootHovered:{
      backgroundColor:this.props.hoverBackgroundColor ?? "#106EBE",
      borderColor:this.props.hoverBorderColor ?? "#106EBE",
      color:this.props.hoverColor ?? "#FFFFFF"
    }
  }

  icon : IIconProps = {iconName : this.props.iconName ?? ""};

    render(){
        return(
          <Stack horizontal>
            <PrimaryButton iconProps={this.icon} styles={this.styles} text={this.props.text} disabled={this.props.disabled} onClick={this.props.onClick}/>
          </Stack>
        );
    }
}

