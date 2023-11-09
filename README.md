# PCF-Controls
Controls using PowerApps Components Framework

[NN Checkboxes](#nn-checkboxes)

[Custom Switch](#custom-switch)

[Date as checkbox](#date-as-checkbox)

[Simple Notification](#simple-notification)

[Action Button](#action-button)

[Linear Slider with steps](#linear-slider-with-steps)

[Year Dropdown](#year-dropdown)

[Lookup as Dropdown](#lookup-as-dropdown)

## NN Checkboxes

[Download](https://github.com/MscrmTools/PCF-Controls/releases/)

### Purpose
The purpose of this control is to allow user to associate/disassociate records for a many-to-many relationship displaying all possible records as checkboxes or toggle switches

![Vidéo](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/video.gif?raw=true)

### Samples
||Checkboxes|Switches|
|--|--|--|
|No color / Not grouped|![Sample2](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample2.png?raw=true)|![Sample1](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample1.png?raw=true)|
|Records Color / Not grouped|![Sample5](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample5.png?raw=true)|![Sample6](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample6.png?raw=true)|
|No color / Grouped|![Sample3](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample3.png?raw=true)|![Sample9](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample9.png?raw=true)|
|Records color / Grouped |![Sample4](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample4.png?raw=true)|![Sample7](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample7.png?raw=true)|
|Group color / Grouped|![Sample10](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample10.png?raw=true)|![Sample8](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Sample8.png?raw=true)|

### Configuration

This is the list of parameters that can be set on the control

|Parameter|Description|Required|Bound to an attribute|
|---------|-----------|:----:|:---:|
|**DataSet/Label**|Attribute to use as label for the checkbox|X|X|
|**DataSet/Background color**|Attribute to use as background color||X|
|**DataSet/Color**|Attribute to use as forecolor||X|
|**DataSet/Group by**|Attribute used to group records. *If used, this attribute must be the first attribute used to sort the view used by this control*||X|
|**DataSet/Filter attribute**|Filter attribute for related records. *If used, this attribute must be of the same type as the control parameter Filter attribute *||X|
|**DataSet/Tooltip**|Attribute used to display a tooltip on the checkbox or the switch. *If used, this attribute must be present on the view used to display records*||X|
|**Filter attribute**|Filter attribute for related records. *If used, this attribute must be of the same type as the control parameter DataSet/Filter attribute *||X|
|**Relationship**|Schema name of the relationship. *required only if multiple many-to-many relationship exist for both related entities*|?||
|**Columns**|Number of columns to display checkboxes|X||
|**Layout**|Choose the layout for the rendering|X||
|**Switch Off color**|Default background color when the switch is Off. *This parameter is overriden by the parameter **Background color***||X|
|**Switch On color**|Default background color when the switch is On. *This parameter is overriden by the parameter **Background color***||X|
|**Allow to select a category**|Indicates if links must be added for each category to select/unselect all records|X||
|**Allow to select a category**|Indicates if links must be added for each category to select/unselect all records|X||
|**Display Search**|Indicates if a search bar must be displayed|||

⚠️Even if Lookup.Simple type of column can be selected for filter, do not use it until it is supported by Microsoft and the bug that breaks dataset content is fixed.

⚠️When using filter feature, the control won't disassociate related records that don't fit with the selected filter. It's your responsability to disassociate these records.

## Custom Switch

[Download](https://github.com/MscrmTools/PCF-Controls/releases/)

### Purpose
The purpose of this control is to allow user to add switch for Two Options attribute and apply the color and shape they want to fit with the color of the company.

### Samples

![Screenshot](https://github.com/MscrmTools/PCF-Controls/blob/master/CustomSwitch/screenshots/capture.png?raw=true)

### Configuration

This is the list of parameters that can be set on the control

|Parameter|Description|Required|Bound to an attribute|
|---------|-----------|:----:|:---:|
|**Attribute**|The attribute to display as a switch|X|X|
|**Off color**|Color used for the switch background when the value is Off|||
|**On color**|Color used for the switch background when the value is On|||
|**Switch color**|Color used for the switch|||
|**Layout**|Square or Round|X||
|**Display label**|Indicates if selected option label must be displayed next to the switch||

## Date as checkbox

### Purpose
As mentioned by MVP Gus Gonzalez in [this 2 minutes Tuesday video](https://www.youtube.com/watch?v=cuQIIAQPHbk), Two Options attribute could be replaced with Datetime attribute for some business needs. This PCF allows to transform a date time attribute in custom switch to keep the behavior of a checkbox while storing value as the current date time.

### Samples
![Screenshot](https://github.com/MscrmTools/PCF-Controls/raw/master/DateAsCheckbox/screenshots/dateAsCheckbox.gif?raw=true)

### Configuration
See documentation of [Custom Switch](#custom-switch). This is the same.

## Simple Notification

### Purpose
Allows to display a notification or an helpful message to the user in a section. This should avoid to create static web resource to display information.

### Samples
![Screenshot](https://github.com/MscrmTools/PCF-Controls/raw/master/ReactNotifier/screenshots/SimpleNotification.png?raw=true)

### Configuration

|Parameter|Description|Required|Bound to an attribute|
|---------|-----------|:----:|:---:|
|**Attribute**|The attribute to use to display the control|X|X|
|**Notification type**|Type of notification|X||
|**Message**|Message to display|X||
|**Display a link?**|Indicates if an hypertext link must be added at the end of the message|||
|**Link text**|Text to be used for the link|||
|**Link**|Url to navigate to when clicking on the link||

## Action Button

### Purpose
Allows to display a button to perform an action. To allow developer to do anything they want from the form, this button simply copies the text of the action button or its identifier (see configuration) on the bound string attribute. If the bound attribute is a datetime, the current date is set as the attribute value. The developer needs to add an onChange event to this string or datetime attribute, check for the value of the attribute (can be the text or id of the action button for string attribute, current datetime for datetime attribute) and perform the action needed.

### Samples
![image](https://user-images.githubusercontent.com/10774317/151808531-afd6b96f-d11e-4cc8-80a7-ff204ec20274.png)


Sample script to be implemented to execute an action when the button is clicked
```
function onChange(context){
  let attribute = context.getEventSource();
  let value = attribute.getValue();
  if(value === "Run this!"){
    Xrm.Navigation.openAlertDialog({text: "Action button has been triggered!"});
  }
  // Clear the value and avoid to submit data
  attribute.setValue(null);
  attribute.setSubmitMode("never");
}
```

### Configuration

|Parameter|Description|Required|Bound to an attribute|Additional info|
|---------|-----------|:----:|:---:|------|
|**Attribute**|The attribute to use to display the control|X|X|| 
|**ActionText**|Text of the action button|||Can be a static string or a json object with language id like {"1033":"Run this!","1036":"Exécute ça!"}|
|**Button identifier**|An identifier of your choice for the button||||
|**Send Identifier**|Indicates if the identifier or the label should be sent when clicking on the button||||
|**Always enable button**|Indicates if button should be always enabled even when control or form is disabled||||
|**Background color**|Background color for default display||||
|**Border color**|Border color for default display||||
|**Color**|Text color for default display||||
|**Background color (hovered)**|Background color when the mouse hovers the button||||
|**Border color (hovered)**|Border color when the mouse hovers the button||||
|**Color (hovered)**|Text color when the mouse hovers the button||||
|**Background color (pressed)**|Background color when the mouse clicks on the button||||
|**Border color (pressed)**|Border color when the mouse clicks on the button||||
|**Color (pressed)**|Text color when the mouse clicks on the button||||
|**Icon**|Icon to use on the action button|||[Available icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons#available-icons)|
|**Tooltip**|Displays a tooltip above the button||||
|**Width**|Width of the button. |||Can be in pixel or percentage|

## Linear Slider with steps

### Purpose
Displays a linear slider that can be configured to allow only specific step. This control can also be configured to change the color of the slider, specify minimum and maximum values, and add text before and/or after the selected value.
This control is an adaptation of the [TSLinearInputControl](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/sample-controls/linear-input-control) sample from Microsoft

### Samples

Slider with blue color, minimum 0, maximum 100, step by 5, prefix "Percentage: " and suffix " %" 

![image](https://user-images.githubusercontent.com/10774317/116671071-d0549e00-a9a0-11eb-92d3-66825d1115ff.png)



### Configuration

|Parameter|Description|Required|Bound to an attribute|Additional info|
|---------|-----------|:----:|:---:|------|
|**Attribute**|The attribute to use to display the control|X|X|| 
|**Minimum**|Minimum value for the slider control|X|||
|**Maximum**|Maximum value for the slider control|X|||
|**Step**|Step for the slider control|X|||
|**Color**|Color of the slider||||
|**Label prefix**|Define a text to be inserted before the value of the column||||
|**Label suffix**|Define a text to be added after the value of the column||||
|**Label position**|Position of the label under the slider|X||Left, Center or Right|


## Year Dropdown

[Download](https://github.com/MscrmTools/PCF-Controls/releases/)

### Purpose
The purpose of this control is to allow user to select a year in a dropdown and store the result in a DateTime, Whole number or Single line of text column.

### Samples

![Screenshot](https://github.com/MscrmTools/PCF-Controls/blob/master/YearDropdown/screenshots/YearDropdown.gif?raw=true)

### Configuration

This is the list of parameters that can be set on the control

|Parameter|Description|Required|Bound to an attribute|
|---------|-----------|:----:|:---:|
|**Target column**|The column bound to this control|X|X|
|**Years before**|The number of years to add in the dropdown prior of current year|||
|**Years after**|The number of years to add in the dropdown after of current year|||
|**Default month**|Default month to generate the date when the target column is of type Date|||
|**Default day**|Default day to generate the date when the target column is of type Date|||

## Lookup as Dropdown

[Download](https://github.com/MscrmTools/PCF-Controls/releases/)

### Purpose
The purpose of this control is to display a Dropdown that allows to select records from an entity. Records displayed are the ones returned by the view configured for the Lookup column.

This control has the following features:
- Localized label (optional) : If the table targeted has columns for specific language, the control can show the label for the user selected language. For example, if the targeted table has columns new_name1033 (for US English), new_name1036 (for French) and you configure the control to have a mask set to new_name{lcid}, the control will now what label to display if the user has set his language to US English or French.
![ltd](https://user-images.githubusercontent.com/10774317/207603166-1147b99c-2911-4013-b1a5-cc5d7f0468f5.gif)

- Most recently used items (optional) : Allows to display a specific number of recent items. This feature is handled by the lookup column configuration (which is technically unsupported, ie. not exposed by the PCF SDK). The PCF configuration can be used to limit the number of items to display

![image](https://user-images.githubusercontent.com/10774317/208404328-55be891b-d354-4d2f-8bac-7f953ab6e3b5.png)

- Favorites (optional) : Allows to display some items first because they are the ones generally most used. Unique identifiers of items must be configured as a JSON array in the PCF 

![image](https://user-images.githubusercontent.com/10774317/208404977-3048a540-dbbe-4d50-be95-0937fd89f4cd.png)

- Create new record (optional) : You can configure the control so that it shows a "Add new" option to open a new form for the targeted table. It also requires that the user has at least basic privileges for Create and Read on the targeted table.
![LookupToDropdown](https://user-images.githubusercontent.com/10774317/207386540-fefab6c1-f744-4e2c-b6ed-a01a6105ce9e.gif)

- Lookup filtering (optional) : If the lookup is filtered by another lookup (and both targeted tables are in a 1N relationship), you can filter records available in the second dropdown, based on the first dropdown selected record.
![ltd_filter](https://user-images.githubusercontent.com/10774317/207603990-ca9ab428-c8d5-4923-8aeb-cc1980290a15.gif)

### Configuration

This is the list of parameters that can be set on the control

|Parameter|Description|Required|Bound to an attribute|
|---------|-----------|:----:|:---:|
|**Lookup column**|The column bound to this control|X|X|
|**Filtering column**|Set the Lookup column to use to filter this control. Must be the same Lookup than the one defined in this control filter configuration|||
|**Display mask**|The mask to find the localized column on the targeted table. Use {lcid} as a language token in the mask. It will be replace by the user language code|||
|**Sort by display name**|Indicates if options must be sorted|X||
|**Add new**|Indicates if "Add new" item must be added in the dropdown|X||
|**Display Search bar**|Indicates if a search bar must be added on top of the dropdown|||
|**Favorites**|List of records unique identifiers to show as favorites|||
|**Number of recent items**|Indicates the number of recent items to display|||
