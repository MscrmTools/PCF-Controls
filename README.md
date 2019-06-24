# PCF-Controls
Controls using PowerApps Components Framework

## NN Checkboxes

[Download](https://github.com/MscrmTools/PCF-Controls/releases/)

### Purpose
The purpose of this control is to allow user to associate/disassociate records for a many-to-many relationship displaying all possible records as checkboxes.

![Vidéo](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/video.gif?raw=true)

New in version 1.1
- You can choose the number of columns to render
- Relationship schema name is not mandatory if only one many-to-many relationship exists for the entities
- Records can be rendered with background color and forecolor if the entity has corresponding attributes
- Records can be grouped by an attribute (text, optionset or booleans)

![Update1.1](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/ColorAndGroups.png?raw=true)

### Configuration

This is the list of parameters that can be set on the control

* **Display attribute** : Attribute to use as label for the checkbox (required / bound to an attribute)
* **Relationship schema name** : Schema name of the relationship (required only if multiple many-to-many relationship exist for both related entities)
* **Parent entity logical name** : Logical name of the current form entity (required)
* **Background color** : Attribute to use as background color (optional / bound to an attribute)
* **Color** : Attribute to use as forecolor (optional / bound to an attribute)
* **Number of columns** : Number of columns to display checkboxes (required)
* **Grouping Attribute** : Attribute used to group records (optional / bound to an attribute)

### Known issues
* Subgrid properties must be set to display as many lines as there is records to display
* This control displays all records from the related entity, even if selected view for the subgrid has a filter
