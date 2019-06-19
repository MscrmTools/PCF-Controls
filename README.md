# PCF-Controls
Controls using PowerApps Components Framework

## NN Checkboxes
### Purpose
The purpose of this control is to allow user to associate/disassociate records for a many-to-many relationship displaying all possible records as checkboxes.

![Vidéo](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/video.gif?raw=true)

### Configuration
![Configuration](https://github.com/MscrmTools/PCF-Controls/blob/master/NNCheckboxes/Screenshots/Configuration.png?raw=true)

Due to current limitation of PowerApps Components Framework for dataset, multiple properties need to be set
1. Display attribute (Champ d'affichage) : Attribute in the subgrid view that is used for checkbox label
2. Parent entity logical name (Nom logique de l'entité parente) : Logical name of the current form entity 
3. Relationship schema name (Nom de schéma de la relation) : Schema name (case is important) of the many-to-many relationship
