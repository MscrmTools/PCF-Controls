import * as React from 'react'
import {Stack} from 'office-ui-fabric-react/lib/components/Stack';
import {PrimaryButton} from 'office-ui-fabric-react/lib/components/Button';

export interface IButtonProps {
    text: string,
    onClick: () => void
    disabled: boolean,
  }

export interface IButtonState {
  text: string,
  onClick: () => void
  disabled: boolean,

}

export default class ButtonControl extends React.Component<IButtonProps, IButtonState>{
  constructor(props :IButtonProps){
    super(props);
    this.state = {
      text:props.text,
      onClick: props.onClick,
      disabled: props.disabled
    }
  }
    render(){
        return(
          <Stack horizontal>
            <PrimaryButton text={this.state.text} disabled={this.state.disabled} onClick={this.state.onClick}/>
          </Stack>
                
        );
    }
}