import * as React from "react";

import {
  MessageBar,
  Link,
  FluentProvider,
  IdPrefixProvider,
  makeStyles,
  MessageBarBody,
  MessageBarTitle,
  Theme,
  MessageBarIntent,
} from "@fluentui/react-components";

export interface IMessageProps {
  messageType?: MessageBarIntent | undefined;
  messageText?: string | null;
  showLink?: boolean;
  link?: string | null;
  linkText?: string | null;
  theme: Theme;
  title: string | null;
  isMultiline?: boolean;
}

const _useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export const NotificationControl: React.FC<IMessageProps> = (props) => {
  const styles = _useStyles();
  return (
    <IdPrefixProvider value={"newDropdownControl"}>
      <FluentProvider theme={props.theme} className={styles.root}>
        <MessageBar intent={props.messageType} shape="rounded" layout={props.isMultiline ? "multiline" : "singleline"}>
          <MessageBarBody>
            {(props.title ? <MessageBarTitle>{props.title}</MessageBarTitle> :<></>)}
            {props.messageText}
            {" "}
            {(props.link? <Link href={props.link} target="_blank">{props.linkText}</Link> : <></>)}
          </MessageBarBody>
        </MessageBar>
      </FluentProvider>
    </IdPrefixProvider>
  );
};
