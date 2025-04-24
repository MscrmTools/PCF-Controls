import * as React from "react";

import {
  Combobox,
  Label,
  OptionGroup,
  Option,
  makeStyles,
  SelectionEvents,
  OptionOnSelectData,
  FluentProvider,
  Theme,
  Input,
} from "@fluentui/react-components";
import { ILookupToComboBoxProps, IRecord, IRecordCategory } from "./Interfaces";
import {
  StarRegular,
  ClockRegular,
  AddRegular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
});

export interface IILookupToComboBoxState{
  categories : IRecordCategory[],
  entityIdFieldName: string,
  entityNameFieldName: string,
  entityDisplayName: string,
  selectedKey: string,
  selectedText: string,
  newlyCreatedId: string | undefined,
  parentRecordId : string | undefined,
}

export const LookupCombobox = (props: ILookupToComboBoxProps): JSX.Element => {
  const [state, setState] = React.useState({
    categories: [] as IRecordCategory[],
    entityIdFieldName: "",
    entityNameFieldName: "",
    entityDisplayName: "",
    selectedKey: props.selectedId,
    selectedText: "",
    newlyCreatedId: undefined,
    parentRecordId : props.parentRecordId,
  } as IILookupToComboBoxState);
  const [query, setQuery] = React.useState<string>("");
  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  let availableOptions : IRecord[] = [];

  const styles = useStyles();
  const currentTheme = props.context.fluentDesignLanguage?.tokenTheme as Theme;
  const myTheme = props.isDisabled
    ? {
        ...currentTheme,
        colorCompoundBrandStroke: currentTheme?.colorNeutralStroke1,
        colorCompoundBrandStrokeHover: currentTheme?.colorNeutralStroke1Hover,
        colorCompoundBrandStrokePressed:
          currentTheme?.colorNeutralStroke1Pressed,
        colorCompoundBrandStrokeSelected:
          currentTheme?.colorNeutralStroke1Selected,
      }
    : currentTheme;

  React.useEffect(() => {
    retrieveMetadata();
  },[]);
 
  React.useEffect(() => {
    retrieveRecords();
  }, [state.entityIdFieldName, state.newlyCreatedId]);

  React.useEffect(() => {
    retrieveRecords();
  }, [props.parentRecordId]);

  React.useEffect(() => {
    displayRecords(state.categories, props.selectedId);
 }, [props.selectedId]);

 React.useEffect(() => {
  displayRecords(state.categories, state.selectedKey);
}, [state.selectedKey]);

  const retrieveMetadata = () => {
    props.context.utils
      .getEntityMetadata(props.entityName)
      .then((metadata) => {
        setState((prevState) => {
          return {
            ...prevState,
            entityIdFieldName: metadata.PrimaryIdAttribute as string,
            entityNameFieldName: metadata.PrimaryNameAttribute as string,
            entityDisplayName: metadata.DisplayName as string,
          };
        });
        return null;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setMrus = (categories: IRecordCategory[], records: IRecord[]) => {
    // @ts-expect-error toto
    const mrus = props.context.parameters.lookup.getRecentItems() as IMru[];
    if (
      mrus.length > 0 &&
      // @ts-expect-error toto
      props.context.parameters.lookup.getLookupConfiguration().isMruDisabled ===
        false
    ) {
      let mruCategory = categories.find((c) => c.key === "mrus");
      if (!mruCategory) {
        mruCategory = {
          title: props.context.resources.getString("recentItems"),
          key: "mrus",
          type: "mrus",
          records: [],
        };
        categories.push(mruCategory);
      }

      const mruOptions = [] as IRecord[];
      const maxSize = props.context.parameters.mruSize?.raw ?? 999;
      for (let i = 0; i < mrus.length && i < maxSize; i++) {
        mruOptions.push({
          key: mrus[i].objectId + "_mru",
          text:
            records.find((o) => o.key === mrus[i].objectId)?.text ??
            (mrus[i].title as string),
        });
      }

      mruCategory.records = mruOptions.map((mru) => {
        return {
          key: mru.key,
          text: records.find((o) => o.key === mru.key)?.text ?? mru.text,
        };
      });
    }
  };

  const setFavorites = (categories: IRecordCategory[], records: IRecord[]) => {
    const hasFavorites =
      props.context.parameters.favorites.raw !== null &&
      props.context.parameters.favorites.raw.length > 0;
    if (hasFavorites) {
      const favorites = JSON.parse(
        props.context.parameters.favorites.raw ?? ""
      ) as string[];

      const favoritesOptions = [];
      for (const i of favorites) {
        const favOption = records.find((o) => o.key === i);
        if (favOption) {
          favoritesOptions.push({
            key: favOption.key + "_fav",
            text: favOption.text,
          });
        }
      }

      let favoritesCategory = categories.find((c) => c.key === "favorites");
      if (!favoritesCategory) {
        favoritesCategory = {
          title: props.context.resources.getString("favorites"),
          key: "favorites",
          type: "favorites",
          records: [],
        };
        categories.push(favoritesCategory);
      }

      favoritesCategory.records = favoritesOptions.map((favOption) => {
        return {
          key: favOption.key,
          text:
            records.find((o) => o.key === favOption.key)?.text ??
            favOption.text,
        };
      });
    }
  };

  const setRecords = (categories: IRecordCategory[], records: IRecord[]) => {
    const category = categories.find((c) => c.key === "records");
    if (!category) {
      categories.push({
        title: state.entityDisplayName,
        key: "records",
        type: "records",
        records: records,
      });
    } else {
      category.title = state.entityDisplayName;
      category.records = records;
    }
  };

  const sortRecords = (records: IRecord[]) => {
    records = records.sort((n1, n2) => {
      if (n1.text.toLowerCase() > n2.text.toLowerCase()) {
        return 1;
      }

      if (n1.text.toLowerCase() < n2.text.toLowerCase()) {
        return -1;
      }

      return 0;
    });
  };

  const setActions = (categories: IRecordCategory[]) => {
    let actionsCategory = categories.find((c) => c.key === "actions");
    if (!actionsCategory) {
      actionsCategory = {
        title: "Actions",
        type: "actions",
        key: "actions",
        records: [],
      };

      categories.push(actionsCategory);
    }

    let newAction = actionsCategory.records.find((r) => r.key === "new");
    if (!newAction) {
      newAction = {
        key: "new",
        text:
          props.context.resources.getString("AddNew_Display_Key") +
          " " +
          state.entityDisplayName,
        isAction: true,
      };

      actionsCategory.records.push(newAction);
    }
  };

  const retrieveRecords = () => {

    if(!(state.entityDisplayName?.length > 0)){
      return;
    }

    let filter = "";
    if (props.viewId) {
      filter =
        "?$top=1&$select=fetchxml,returnedtypecode&$filter=savedqueryid eq " +
        props.viewId;
    } else {
      filter =
        "?$top=1&$select=fetchxml,returnedtypecode&$filter=returnedtypecode eq '" +
        props.entityName +
        "' and querytype eq 64";
    }

    props.context.webAPI
      .retrieveMultipleRecords("savedquery", filter)
      .then((result) => {
        const view = result.entities[0];
        let xml = view.fetchxml as string;
        if (props.context.parameters.dependantLookup?.raw?.length > 0) {
          const dependentId =
            props.context.parameters.dependantLookup.raw[0].id;
          const attributeName =
            props.context.parameters.dependantLookup.attributes?.LogicalName ??
            "";

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xml, "text/xml");

          const entityNode = xmlDoc.getElementsByTagName("entity")[0];
          const filterNodes = entityNode.getElementsByTagName("filter");
          let filterNode;
          if (filterNodes.length == 0) {
            filterNode = xmlDoc.createElement("filter");
            entityNode.appendChild(filterNode);
          } else {
            filterNode = filterNodes[0];
          }

          // adding condition
          const conditionNode = xmlDoc.createElement("condition");
          conditionNode.setAttribute("attribute", attributeName);
          conditionNode.setAttribute("operator", "eq");
          conditionNode.setAttribute("value", dependentId);
          filterNode.appendChild(conditionNode);

          xml = xmlDoc.documentElement.outerHTML;
        }

        props.context.webAPI
          .retrieveMultipleRecords(
            view.returnedtypecode as string,
            "?fetchXml=" + xml
          )
          .then((result) => {
            availableOptions = result.entities.map((r) => {
              let localizedEntityFieldName = "";
              const mask = props.context.parameters.attributemask.raw;

              if (mask) {
                localizedEntityFieldName = mask.replace(
                  "{lcid}",
                  props.context.userSettings.languageId.toString()
                );
              }

              return {
                key: r[state.entityIdFieldName] as string,
                text: (r[localizedEntityFieldName] ??
                  r[state.entityNameFieldName] ??
                  "Display Name is not available") as string,
              };
            });

            if (props.context.parameters.sortByName.raw === "1") {
              sortRecords(availableOptions);
            }

            availableOptions.splice(0, 0, { key: "---", text: "---" });

            const categories = [] as IRecordCategory[];
            setMrus(categories, availableOptions);
            setFavorites(categories, availableOptions);
            setRecords(categories, availableOptions);
            if (props.context.parameters.addNew.raw === "1") {
              setActions(categories);
            }

            displayRecords(categories, props.selectedId);

            return null;
          })
          .catch((error) => {
            console.log(error.message);
          });

        return null;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const displayRecords = (categories : IRecordCategory[], selectedKey: string) => {

    availableOptions = availableOptions.length > 0 ? availableOptions : state.categories.find((c) => c.type === "records")?.records ?? []

    if(availableOptions.length === 0){
      return;}

    const selectedOption = availableOptions.find(
      (o) => o.key === selectedKey
    );

    setQuery(selectedOption?.text ?? "---");
    setState((prevState) => {
      return {
        ...prevState,
        categories: categories,
        selectedKey: selectedOption?.key ?? "---",
        selectedText: selectedOption?.text ?? "---",
      };
    });
  }

  const updateSelectedItem = (
    selectedId: string | undefined,
    selectedText: string | undefined
  ) => {
    setState((prevState) => ({
      ...prevState,
      selectedKey: selectedId?.replace(/[{}]/g,"").toLowerCase() ?? "---",
      selectedText: selectedText ?? "---",
    }));
    setIsSearching(false);
    setQuery(selectedText ?? "");
  };

  const handleOptionSelect = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    if (data.optionValue === "new") {
      props.context.navigation
        .openForm({
          entityName: props.entityName,
          useQuickCreateForm: true,
          windowPosition: 2,
        })
        .then((result) => {
          props.notifyOutputChanged(result.savedEntityReference[0]);
          updateSelectedItem(
            result.savedEntityReference[0].id,
            result.savedEntityReference[0].name
          );

          setState((prevState => ({
            ...prevState,
            newlyCreatedId: result.savedEntityReference[0].id.toLowerCase().replace(/[{}]/g,"")
          })));

          return null;
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (data.optionValue === "---") {
      props.notifyOutputChanged(undefined);
      updateSelectedItem("---", "---");
    } else {
      const newValue = {
        id: (data.optionValue ?? "").split("_mru")[0].split("_fav")[0],
        name: data.optionText,
        entityType: props.entityName,
      };
      props.notifyOutputChanged(newValue);
      updateSelectedItem(newValue.id, newValue.name);
    }
  };

  return (
    <div className={styles.root}>
      <FluentProvider theme={myTheme} className={styles.root}>
        {props.isDisabled ? (
          <Input
            value={state.selectedText}
            appearance="filled-darker"
            className={styles.root}
            readOnly={props.isDisabled}
          />
        ) : (
          <Combobox
            {...props}
            placeholder="---"
            onChange={(ev) => {
              setQuery(ev.target.value);
              setIsSearching(true);
            }}
            onOptionSelect={handleOptionSelect}
            selectedOptions={[state.selectedKey]}
            value={query}
            className={styles.root}
            appearance="filled-darker"
          >
            {state.categories.length === 1
              ? state.categories[0].records
                  .filter(
                    (r) =>
                      (isSearching &&
                        r.text.toLowerCase().includes(query.toLowerCase())) ||
                      !isSearching
                  )
                  .map((record) => (
                    <Option
                      key={record.key}
                      text={record.text}
                      value={record.key}
                      className="{styles.root}"
                    >
                      {record.text}
                    </Option>
                  ))
              : state.categories.map((category) => (
                  <OptionGroup
                    label={category.title}
                    key={category.key}
                    className="{styles.root}"
                  >
                    <div
                      style={
                        category.key === "records"
                          ? {
                              maxHeight: "300px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }
                          : {}
                      }
                    >
                      {category.records
                        .filter(
                          (r) =>
                            (isSearching &&
                              r.text
                                .toLowerCase()
                                .includes(query.toLowerCase()) &&
                              category.type === "records") ||
                            !isSearching ||
                            category.type != "records"
                        )
                        .map((record) => (
                          <Option
                            key={record.key}
                            text={record.text}
                            value={record.key}
                            className="{styles.root}"
                          >
                            {category.type === "mrus" && <ClockRegular />}
                            {category.type === "favorites" && <StarRegular />}
                            {record.isAction && record.key === "new" && (
                              <AddRegular />
                            )}
                            <Label>{record.text}</Label>
                          </Option>
                        ))}
                    </div>
                  </OptionGroup>
                ))}
          </Combobox>
        )}
      </FluentProvider>
    </div>
  );
};
