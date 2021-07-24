import lux from "./apiCaller";
import axios from "axios";

export const parseToApiData = async (
  { columns, data, entityNames, logicalNames, displayNames },
  parentEntityName,
  parentId,
  entityName,
  userId,
  viewId
) => {
  var dataToApi = {
    parentEntityName,
    parentId,
    entityName,
    userId,
    viewId,
    rows: [],
  };

  data.forEach((row, rowIndex) => {
    var rowData = [];
    logicalNames.forEach((logicalName, index) => {
      var fieldData = {};
      fieldData.EntityLogicalName = entityNames[index];
      fieldData.LogicalName = logicalName;
      fieldData.DisplayName = displayNames[index];
      fieldData.Value = row[index];
      rowData.push(fieldData);
    });

    // 檢查 id，沒有的話要給他一個空的ID
    // 因為如果原本沒有deatails的話會沒有ID那個column值
    // 不知道為甚麼 原本 肉希姆寫得不用這樣做
    var id = "";
    if (isGuid(row[0])) id = row[0];

    dataToApi.rows.push({
      id: id,
      fields: rowData,
      index: rowIndex,
    });
  });

  return dataToApi;
};

// 裡面可以改參數
export const callImportRecordApi = async (reqObj, isLocal = false) => {
  // local 測試用
  if (isLocal == true) {
    console.log("localhost:44313");
    var res = await axios.post(
      "http://localhost:44313/cmd/dataimport",
      reqObj
    );

    return res.data;
  } else {
    const webApiConnectorUrl = await lux.getAppSetting(
      "CrmWebApiConnectorUrl"
    );

    const callApiInfo = {
      requestUrl: `${webApiConnectorUrl}/cmd/dataimport`,
      requestMethod: "POST",
      requestBody: reqObj,
    };

    try {
      const res = await lux.crmWebApi(callApiInfo);
      console.log(res.response);

      return res.response;
      if (res.isSuccess !== true) {
        throw new Error(`${res}`);
      }
    } catch (error) {
      if (error.errorMessage) {
        console.log(error);
        alert(
          `${error.errorMessage} | ${error.errorDetails.ExceptionMessage ||
          JSON.stringify(error.errorDetails)
          }`
        );
      } else {
        console.log(error);
        alert(error);
      }
    }
  }
};

export const getParamsFromUrl = () => {
  var currentUrl = new URL(window.location.href);
  var parentEntityName = currentUrl.searchParams.get("parententity");
  var parentId = currentUrl.searchParams.get("parentid");
  var entity = currentUrl.searchParams.get("entity");
  var entityName = currentUrl.searchParams.get("entityName");
  var userId = currentUrl.searchParams.get("userid");
  var viewId = currentUrl.searchParams.get("viewid");
  if (entity == null) {
    alert("url param 'entity' not found.");
    throw "url param 'entity' not found.";
  }
  if (userId == null) {
    alert("url param 'userId' not found.");
    throw "url param 'userId' not found.";
  }
  if (viewId == null) {
    alert("url param 'viewId' not found.");
    throw "url param 'viewId' not found.";
  }

  return {
    parentEntityName,
    parentId,
    entity,
    entityName,
    userId,
    viewId,
  };
};

function isGuid(value) {
  var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
  var match = regex.exec(value);
  return match != null;
}
