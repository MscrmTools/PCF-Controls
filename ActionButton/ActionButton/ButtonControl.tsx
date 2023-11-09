import * as React from 'react'
import { Stack } from '@fluentui/react/lib/Stack';
import { IBaseButtonProps, IBaseButtonState, IButtonStyles, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { IIconProps } from '@fluentui/react';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

export interface IButtonControlProps extends IBaseButtonProps {
  hoverBackgroundColor: string,
  hoverBorderColor: string,
  hoverColor: string,
  checkedBackgroundColor: string,
  checkedBorderColor: string,
  checkedColor: string,
  iconName: string | null,
  toolTip: string | undefined,
}

export default class ButtonControl extends React.Component<IButtonControlProps, IBaseButtonState>{
  constructor(props: IButtonControlProps) {
    super(props);
  }
  styles: IButtonStyles = {
    root: {
      backgroundColor: this.props.style?.backgroundColor ?? "#0078d4",
      borderColor: this.props.style?.borderColor ?? "#0078d4",
      color: this.props.style?.color ?? "#FFFFFF",
      width: this.props.style?.width
    },
    rootHovered: {
      backgroundColor: this.props.hoverBackgroundColor ?? "#106EBE",
      borderColor: this.props.hoverBorderColor ?? "#106EBE",
      color: this.props.hoverColor ?? "#FFFFFF",
      width: this.props.style?.width
    },
    rootPressed: {
      backgroundColor: this.props.checkedBackgroundColor ?? "#0078d4",
      borderColor: this.props.checkedBorderColor ?? "#0078d4",
      color: this.props.checkedColor ?? "#FFFFFF",
      width: this.props.style?.width
    }
  }

  icon: IIconProps = { iconName: this.props.iconName ?? "" };

  render() {
    const toolTipId = `tooltip_${this.props.iconName}`;

    return (
      <Stack horizontal>
        {this.props.text?.trim().length ? (
          <TooltipHost content={this.props.toolTip} id={toolTipId}>
            <PrimaryButton
              iconProps={this.icon}
              styles={this.styles}
              text={this.props.text}
              disabled={this.props.disabled}
              onClick={this.props.onClick}
              aria-describedby={toolTipId}
            />
          </TooltipHost>
        ) : (
          <TooltipHost content={this.props.toolTip} id={toolTipId}>
            <IconButton
              iconProps={this.icon}
              styles={this.styles}
              disabled={this.props.disabled}
              onClick={this.props.onClick}
              aria-describedby={toolTipId}
            />
          </TooltipHost>
        )}
      </Stack>
    );
  }
}

