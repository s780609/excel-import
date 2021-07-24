import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, message, Button, Space, Table, Input, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReadExcel from "../features/readExcel";
import {
  parseToApiData,
  getParamsFromUrl,
  callImportRecordApi,
} from "../features/dataProcessing";
import "./uploadButton.css";

const UploadButton = ({ setLoading }) => {
  const dispatch = useDispatch();

  const parentEntityName = useSelector((state) => state.parentEntityName);
  const parentId = useSelector((state) => state.parentId);
  const entity = useSelector((state) => state.entity);
  const entityName = useSelector((state) => state.entityName);
  const userId = useSelector((state) => state.userId);
  const viewId = useSelector((state) => state.viewId);

  const stateFileList = useSelector((state) => state.fileList);
  const stateColumns = useSelector(state => state.columns)
  const stateData = useSelector((state) => state.data);

  const props = {
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    beforeUpload: (file, fileList) => {
      dispatch({ type: "file", file: file });
      dispatch({ type: "fileList", fileList: fileList });
      dispatch({ type: "data", data: [] })
      message.success("please preview file");
      return false;
    },
    maxCount: 1,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove(file) {
      dispatch({ type: "fileList", fileList: [] });
      return true;
    },
    className: "upload-list-inline",
    showUploadList: true,
  };

  const handleUpload = async () => {
    if (stateFileList[0] == undefined) {
      message.warning("please select a file");
      return;
    }

    if (stateData.length == 0) {
      console.log(stateData);
      message.warning("click preview button to confirm data");
      return;
    }

    try {
      var columnAndData = await ReadExcel(stateFileList);

      var dataToApi = await parseToApiData(
        columnAndData,
        parentEntityName,
        parentId,
        entity,
        userId,
        viewId
      );
 
      setLoading(true);

      // send data to api
      var { Results } = await callImportRecordApi(dataToApi);
      Results.forEach((result) => {
        var row = stateData.find((x) => x.rowIndex == result.RowIndex);
        row.ImportStatus =
          result.WriteToCrmResult != null
            ? result.WriteToCrmResult
            : result.Messages[0];
        stateData[row.rowIndex] = row;
      });

      // set data import status
      dispatch({ type: "data", data: stateData });

      if (Results[0] != undefined && Results[0].WriteToCrmResult != null) {
        var importStatusColumn = stateColumns.find(x => x.key == "ImportStatus");
        importStatusColumn.render = (text) => {
          return <h3 style={{ color: "green" }}>{text}</h3>
        }
        stateColumns[0] = importStatusColumn;
        dispatch({ type: "columns", columns: stateColumns })
      }

      // clear file and file list
      dispatch({ type: "file", file: null });
      dispatch({ type: "fileList", fileList: [] });

      setLoading(false);
    } catch (error) {
      message.error(
        `error message: ${error}` + " | contact administrator",
        3000
      );
    }
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        style={{ marginTop: 16 }}
        onClick={handleUpload}
        disabled={stateData.length == 0 || stateFileList == 0}
      >
        Import
      </Button>
    </>
  );
};

export default UploadButton;
