import * as React from 'react'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
  

  export interface IMessageProps {
    messageType? : MessageBarType;
    messageText? : string|null;
    showLink? : boolean;
    link?:string|undefined;
    linkText?:string|null;
  }

export interface IMessageState {
    messageType? : MessageBarType;
    messageText? : string|null;
    showLink? : boolean;
    link?:string|undefined;
    linkText?:string|null;
}

  export default class NotificationControl extends React.Component<IMessageState, IMessageProps>{
    constructor(props :IMessageProps){
      super(props);
      this.state = {
        showLink: this.props.showLink,
        link: this.props.link,
         messageText : this.props.messageText,
         messageType : this.props.messageType,
         linkText: this.props.linkText
      }
    }
      render(){
          let link;
          if(this.state.showLink){
            link =  <Link href={this.state.link} target="_blank">{this.state.linkText}</Link>
          }

          return(
              <MessageBar
                   messageBarType={this.state.messageType}
                   >
                  {this.state.messageText} {link}
       
              </MessageBar>

          );
      }
  }