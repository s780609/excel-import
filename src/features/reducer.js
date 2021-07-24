import { getParamsFromUrl } from "./dataProcessing";

var { parentEntityName, parentId, entity, entityName, userId, viewId } =
  getParamsFromUrl();

const initialState = {
  parentEntityName: parentEntityName,
  parentId: parentId,
  entity: entity,
  entityName: entityName,
  userId: userId,
  viewId: viewId,
  file: undefined,
  fileList: [],
  columns: [],
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "parentEntityName":
      return { ...state, parentEntityName: action.parentEntityName };
    case "parentId":
      return { ...state, parentId: action.parentId };
    case "entity":
      return { ...state, entity: action.entity };
    case "entityName":
      return { ...state, entityName: action.entityName };
    case "userId":
      return { ...state, userId: action.userId };
    case "viewId":
      return { ...state, viewId: action.viewId };
    case "file":
      return { ...state, file: action.file };
    case "fileList":
      return { ...state, fileList: action.fileList };
    case "columns":
      return { ...state, columns: action.columns };
    case "data":
      return { ...state, data: action.data };
    default:
      return { ...state };
  }
};
