import * as React from 'react'
import {Stack} from '@fluentui/react/lib/Stack';
import {IBaseButtonProps, IBaseButtonState, IButtonStyles, PrimaryButton} from '@fluentui/react/lib/Button';
import { IIconProps } from '@fluentui/react';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button/IconButton/IconButton';

export interface IButtonControlProps extends IBaseButtonProps{
    hoverBackgroundColor:string,
    hoverBorderColor:string,
    hoverColor:string,
    checkedBackgroundColor:string,
    checkedBorderColor:string,
    checkedColor:string,
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
      color:this.props.style?.color ?? "#FFFFFF",
      width:this.props.style?.width
    },
    rootHovered:{
      backgroundColor:this.props.hoverBackgroundColor ?? "#106EBE",
      borderColor:this.props.hoverBorderColor ?? "#106EBE",
      color:this.props.hoverColor ?? "#FFFFFF",
      width:this.props.style?.width
    },
    rootPressed:{
      backgroundColor:this.props.checkedBackgroundColor ?? "#0078d4",
      borderColor:this.props.checkedBorderColor ?? "#0078d4",
      color:this.props.checkedColor ?? "#FFFFFF",
      width:this.props.style?.width
    }
  }

  icon : IIconProps = {iconName : this.props.iconName ?? ""};

    render(){
      if(this.props.text?.trim().length ?? 0 > 0)
        return(
          <Stack horizontal>
            <PrimaryButton iconProps={this.icon} styles={this.styles} text={this.props.text} disabled={this.props.disabled} onClick={this.props.onClick}/>
          </Stack>
        );
        else return(

          <Stack horizontal>
            <IconButton iconProps={this.icon} styles={this.styles} disabled={this.props.disabled} onClick={this.props.onClick}/>
          </Stack>
        );
    }
}

