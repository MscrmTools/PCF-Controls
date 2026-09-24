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
import { ILookupToComboBoxProps, IMru, IRecord, IRecordCategory } from "./Interfaces";
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

const EMPTY_KEY = "---";

const normalizeId = (id: string | undefined | null): string =>
  (id ?? "").replace(/[{}]/g, "").toLowerCase();

export interface IILookupToComboBoxState{
  categories : IRecordCategory[],
  entityIdFieldName: string,
  entityNameFieldName: string,
  entityDisplayName: string,
  selectedKey: string,
  selectedText: string,
  newlyCreatedId: string | undefined,
}

export const LookupCombobox = (props: ILookupToComboBoxProps): JSX.Element => {
  const initialText = props.selectedId !== EMPTY_KEY ? props.selectedName ?? "" : EMPTY_KEY;
  const [state, setState] = React.useState({
    categories: [] as IRecordCategory[],
    entityIdFieldName: "",
    entityNameFieldName: "",
    entityDisplayName: "",
    selectedKey: props.selectedId,
    selectedText: initialText,
    newlyCreatedId: undefined,
  } as IILookupToComboBoxState);
  const [query, setQuery] = React.useState<string>(initialText);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  // Latest selection, readable from async callbacks without stale closures
  const selectionRef = React.useRef({ key: props.selectedId, text: initialText });
  // Used to discard responses of outdated record requests
  const requestIdRef = React.useRef(0);

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
  }, [state.entityIdFieldName, state.newlyCreatedId, props.parentRecordId]);

  React.useEffect(() => {
    displayRecords(state.categories, props.selectedId, props.selectedName);
  }, [props.selectedId]);

  const retrieveMetadata = () => {
    if (!props.entityName) {
      return;
    }
    // getEntityMetadata may be unavailable or throw synchronously (e.g. in the form designer)
    let metadataPromise: Promise<ComponentFramework.PropertyHelper.EntityMetadata>;
    try {
      metadataPromise = props.context.utils.getEntityMetadata(props.entityName);
    } catch (error) {
      console.log("LookupToPicklist: unable to retrieve metadata", error);
      return;
    }
    metadataPromise
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
    let mrus: IMru[] = [];
    let isMruDisabled = true;
    try {
      // @ts-expect-error getRecentItems is not part of the typed API
      mrus = (props.context.parameters.lookup.getRecentItems?.() ?? []) as IMru[];
      // @ts-expect-error getLookupConfiguration is not part of the typed API
      isMruDisabled = props.context.parameters.lookup.getLookupConfiguration?.()?.isMruDisabled !== false;
    } catch (error) {
      console.log("LookupToPicklist: unable to retrieve recent items", error);
    }
    if (!Array.isArray(mrus) || mrus.length === 0 || isMruDisabled) {
      return;
    }

    // When the list is filtered by a parent record, recent items outside
    // of that filter must not be selectable
    const restrictToRecords = !!props.parentRecordId;

    const mruOptions = [] as IRecord[];
    const maxSize = props.context.parameters.mruSize?.raw ?? 999;
    for (const mru of mrus) {
      if (mruOptions.length >= maxSize) {
        break;
      }
      const id = normalizeId(mru.objectId);
      const record = records.find((o) => o.key === id);
      if (restrictToRecords && !record) {
        continue;
      }
      mruOptions.push({
        key: id + "_mru",
        text: record?.text ?? mru.title,
      });
    }

    if (mruOptions.length > 0) {
      categories.push({
        title: props.context.resources.getString("recentItems"),
        key: "mrus",
        type: "mrus",
        records: mruOptions,
      });
    }
  };

  const setFavorites = (categories: IRecordCategory[], records: IRecord[]) => {
    const raw = props.context.parameters.favorites.raw;
    if (!raw) {
      return;
    }

    let favorites: string[];
    try {
      favorites = JSON.parse(raw) as string[];
    } catch (error) {
      console.log("LookupToPicklist: favorites parameter is not a valid JSON array", error);
      return;
    }
    if (!Array.isArray(favorites)) {
      return;
    }

    const favoritesOptions = [] as IRecord[];
    for (const favorite of favorites) {
      const favOption = records.find((o) => o.key === normalizeId(favorite));
      if (favOption) {
        favoritesOptions.push({
          key: favOption.key + "_fav",
          text: favOption.text,
        });
      }
    }

    if (favoritesOptions.length > 0) {
      categories.push({
        title: props.context.resources.getString("favorites"),
        key: "favorites",
        type: "favorites",
        records: favoritesOptions,
      });
    }
  };

  const sortRecords = (records: IRecord[]) => {
    records.sort((n1, n2) =>
      n1.text.localeCompare(n2.text, undefined, { sensitivity: "base" })
    );
  };

  const setActions = (categories: IRecordCategory[]) => {
    categories.push({
      title: props.context.resources.getString("actions"),
      type: "actions",
      key: "actions",
      records: [
        {
          key: "new",
          text:
            props.context.resources.getString("AddNew_Display_Key") +
            " " +
            state.entityDisplayName,
          isAction: true,
        },
      ],
    });
  };

  const buildFetchXml = (fetchXml: string): string => {
    const xmlDoc = new DOMParser().parseFromString(fetchXml, "text/xml");
    const entityNode = xmlDoc.getElementsByTagName("entity")[0];
    if (!entityNode || xmlDoc.getElementsByTagName("parsererror").length > 0) {
      return fetchXml;
    }

    // Make sure the columns used to display the options are retrieved
    const children = Array.from(entityNode.children);
    if (!children.some((n) => n.tagName === "all-attributes")) {
      const attributes = children
        .filter((n) => n.tagName === "attribute")
        .map((n) => n.getAttribute("name"));
      for (const name of [state.entityIdFieldName, state.entityNameFieldName]) {
        if (name && !attributes.includes(name)) {
          const attributeNode = xmlDoc.createElement("attribute");
          attributeNode.setAttribute("name", name);
          entityNode.appendChild(attributeNode);
        }
      }
    }

    const parentId = props.parentRecordId;
    const targetColumn = props.context.parameters.dependantLookupTargetColumn?.raw?.trim() ?? "";
    const attributeName = targetColumn !== ""
      ? targetColumn
      : props.context.parameters.dependantLookup?.attributes?.LogicalName;

    if (parentId && attributeName) {
      // A dedicated filter at entity level is combined (AND) with the
      // view filters, whatever their type (and / or)
      const filterNode = xmlDoc.createElement("filter");
      filterNode.setAttribute("type", "and");
      const conditionNode = xmlDoc.createElement("condition");
      conditionNode.setAttribute("attribute", attributeName);
      conditionNode.setAttribute("operator", "eq");
      conditionNode.setAttribute("value", parentId);
      filterNode.appendChild(conditionNode);
      entityNode.appendChild(filterNode);
    }

    return new XMLSerializer().serializeToString(xmlDoc);
  };

  const retrieveRecords = () => {

    if(!state.entityIdFieldName){
      return;
    }

    const requestId = ++requestIdRef.current;

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

    // webAPI may be unavailable or throw synchronously (e.g. in the form designer)
    let viewPromise: Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
    try {
      viewPromise = props.context.webAPI.retrieveMultipleRecords("savedquery", filter);
    } catch (error) {
      console.log("LookupToPicklist: unable to retrieve records", error);
      return;
    }

    viewPromise
      .then((result) => {
        const view = result.entities[0];
        if (!view) {
          throw new Error(`LookupToPicklist: no view found for table ${props.entityName}`);
        }

        const xml = buildFetchXml(view.fetchxml as string);

        return props.context.webAPI.retrieveMultipleRecords(
          view.returnedtypecode as string,
          "?fetchXml=" + encodeURIComponent(xml)
        );
      })
      .then((result) => {
        if (requestId !== requestIdRef.current) {
          // A newer request has been sent in the meantime
          return null;
        }

        const mask = props.context.parameters.attributemask.raw;
        const localizedEntityFieldName = mask
          ? mask.replace("{lcid}", props.context.userSettings.languageId.toString())
          : "";

        const availableOptions: IRecord[] = result.entities.map((r) => {
          return {
            key: normalizeId(r[state.entityIdFieldName] as string),
            text: (r[localizedEntityFieldName] ??
              r[state.entityNameFieldName] ??
              "Display Name is not available") as string,
          };
        });

        if (props.context.parameters.sortByName.raw === "1") {
          sortRecords(availableOptions);
        }

        availableOptions.splice(0, 0, { key: EMPTY_KEY, text: EMPTY_KEY });

        const categories = [] as IRecordCategory[];
        setMrus(categories, availableOptions);
        setFavorites(categories, availableOptions);
        categories.push({
          title: state.entityDisplayName,
          key: "records",
          type: "records",
          records: availableOptions,
        });
        if (props.context.parameters.addNew.raw === "1") {
          setActions(categories);
        }

        displayRecords(categories, selectionRef.current.key, selectionRef.current.text);

        return null;
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  };

  const displayRecords = (categories : IRecordCategory[], selectedKey: string, fallbackText?: string) => {
    const records = categories.find((c) => c.type === "records")?.records ?? [];
    const selectedOption = records.find((o) => o.key === selectedKey);

    // The selected record may be absent from the list (inactive, filtered out
    // by the view...): keep it selected and display its known name
    const key = selectedKey || EMPTY_KEY;
    const text = selectedOption?.text ?? (key !== EMPTY_KEY ? fallbackText : undefined) ?? EMPTY_KEY;

    selectionRef.current = { key, text };
    setQuery(text);
    setIsSearching(false);
    setState((prevState) => {
      return {
        ...prevState,
        categories: categories,
        selectedKey: key,
        selectedText: text,
      };
    });
  }

  const updateSelectedItem = (
    selectedId: string | undefined,
    selectedText: string | undefined
  ) => {
    const key = selectedId ? normalizeId(selectedId) : EMPTY_KEY;
    const text = selectedText ?? EMPTY_KEY;
    selectionRef.current = { key, text };
    setState((prevState) => ({
      ...prevState,
      selectedKey: key,
      selectedText: text,
    }));
    setIsSearching(false);
    setQuery(text);
  };

  const handleOptionSelect = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    if (data.optionValue === "new") {
      // Restore the current selection while the quick create form is open
      setIsSearching(false);
      setQuery(state.selectedText);
      props.context.navigation
        .openForm({
          entityName: props.entityName,
          useQuickCreateForm: true,
          windowPosition: 2,
        })
        .then((result) => {
          const created = result.savedEntityReference?.[0];
          if (!created) {
            // Quick create form was cancelled
            return null;
          }
          props.notifyOutputChanged(created);
          updateSelectedItem(created.id, created.name);

          setState((prevState => ({
            ...prevState,
            newlyCreatedId: normalizeId(created.id)
          })));

          return null;
        })
        .catch((error: Error) => {
          console.log(error.message);
        });
    } else if (!data.optionValue || data.optionValue === EMPTY_KEY) {
      props.notifyOutputChanged(undefined);
      updateSelectedItem(EMPTY_KEY, EMPTY_KEY);
    } else {
      const newValue = {
        id: data.optionValue.replace(/_(mru|fav)$/, ""),
        name: data.optionText,
        entityType: props.entityName,
      };
      props.notifyOutputChanged(newValue);
      updateSelectedItem(newValue.id, newValue.name);
    }
  };

  const matchesQuery = (record: IRecord) =>
    !isSearching || record.text.toLowerCase().includes(query.toLowerCase());

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
            placeholder={EMPTY_KEY}
            onChange={(ev) => {
              setQuery(ev.target.value);
              setIsSearching(true);
            }}
            onOpenChange={(ev, data) => {
              if (!data.open && isSearching) {
                // Discard an unfinished search and show the selected value again
                setIsSearching(false);
                setQuery(state.selectedText);
              }
            }}
            onOptionSelect={handleOptionSelect}
            selectedOptions={[state.selectedKey]}
            value={query}
            className={styles.root}
            appearance="filled-darker"
          >
            {state.categories.length === 1
              ? state.categories[0].records
                  .filter(matchesQuery)
                  .map((record) => (
                    <Option
                      key={record.key}
                      text={record.text}
                      value={record.key}
                      className={styles.root}
                    >
                      {record.text}
                    </Option>
                  ))
              : state.categories.map((category) => (
                  <OptionGroup
                    label={category.title}
                    key={category.key}
                    className={styles.root}
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
                        .filter((r) => category.type !== "records" || matchesQuery(r))
                        .map((record) => (
                          <Option
                            key={record.key}
                            text={record.text}
                            value={record.key}
                            className={styles.root}
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
