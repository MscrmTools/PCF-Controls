import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyleProps, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { Icon } from '@fluentui/react/lib/Icon';
import { SearchBox } from '@fluentui/react/lib/SearchBox';

export const SearchableDropdown: React.FunctionComponent<IDropdownProps> = props => {
    const [searchText, setSearchText] = React.useState<string>('');
   
    return (
    <Dropdown
        {...props}
        styles={DropdownStyle}
        onDismiss={() => setSearchText('')}
        selectedKey = {props.selectedKey}
        options={[
            ...props.options.map(option => !option.disabled && option.text.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || ["divider","new","FilterHeader","divider_filterHeader","mru","mru_divider1","mru_divider2","mru_divider3","records_header","favorite","mru_divider4","mru_divider5"].includes(option.key?.toString())?
              option : { ...option, hidden: true }
            ),
          ]}
        onRenderOption={(option): JSX.Element=>{
            if(option?.data && option.data.isMenu && option.data.icon){
                return (
                    <div>
                            <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
                            <span style={italicStyle}>{option?.text}</span>
                    </div>
                );
            }
            else  if(option?.data && option.data.isMru){
                return (
                    <div>
                            <Icon style={iconStyles} iconName="Clock" aria-hidden="true" title={option.data.icon} />
                            <span>{option?.text}</span>
                    </div>
                );
            }
            else  if(option?.data && option.data.isFavorite){
                return (
                    <div>
                            <Icon style={iconStyles} iconName="FavoriteStar" aria-hidden="true" title={option.data.icon} />
                            <span>{option?.text}</span>
                    </div>
                );
            }
            else{

                if(option?.itemType === DropdownMenuItemType.Header && option.key === "FilterHeader") {
                    return(
                        <SearchBox onChange={(ev, newValue) => setSearchText(newValue ?? "")} underlined={true} placeholder={option.data.label} />
                    );
                }
                else{
                    return (
                        <div><span>{option?.text}</span>
                        </div>
                    );
                }
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
      },
      dropdownItems: {
        selectors: {
          "@media(min-width: 640px)": {
            maxHeight: 400
          }
        }
      }
  })
});