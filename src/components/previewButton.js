import React from "react";
import ReactDOM from "react-dom";
import { Upload, message, Button, Space, Table, Input, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import ReadExcel from "../features/readExcel";

function PreviewButton() {
  const dispatch = useDispatch();

  const stateFileList = useSelector((state) => state.fileList);

  const handlePreview = async () => {
    if (stateFileList[0] == undefined) {
      message.warning("please select a file");
      return;
    }

    try {
      var columnAndData = await ReadExcel(stateFileList);

      var data = [];
      var columns = [
        // 需要 第一個 column 來表示狀態
        {
          key: "ImportStatus",
          dataIndex: "ImportStatus",
          title: "ImportStatus",
          render: (text) => {
            if (text == "Updated" || text == "Created") {
              return <h3 style={{ color: "green" }}>{text}</h3>;
            } else {
              return <h3 style={{ color: "red" }}>{text}</h3>;
            }
          },
        },
      ];

      columnAndData.columns.forEach((element) => {
        var columnObj = {
          ...element,
          key: element.title,
          dataIndex: element.title,
        };
        columns = [...columns, columnObj];
      });

      data = mapTableData(columnAndData);

      dispatch({ type: "columns", columns: columns });
      dispatch({ type: "data", data: data });

      message.success("confirmed data, click the import button please");
    } catch (error) {
      message.error(
        `error message: ${error}` + " | contact administrator",
        3000
      );
    }
  };

  function mapTableData(columnAndData) {
    var data = [];

    for (let i = 0; i < columnAndData.data.length; i++) {
      const dataRow = columnAndData.data[i];
      var dataObj = { key: i };

      for (let j = 0; j < columnAndData.columns.length; j++) {
        const column = columnAndData.columns[j];
        const cell = round(dataRow[j]);

        if (j == 0 && columnAndData.columns[j] != undefined) {
          dataObj["ImportStatus"] = "---";
          dataObj[column.title] = cell;
        } else if (column == undefined) {
          dataObj["ImportStatus"] = "---";
        } else {
          dataObj[column.title] = cell;
        }

        dataObj["rowIndex"] = i;
      }

      data = [...data, dataObj];
    }

    return data;
  }

  function round(cell) {
    if (cell != null) {
      if (typeof cell === 'string' || cell instanceof String) {
        cell = cell.replace(/,/g, "");
      }

      if (!isNaN(Number(cell))) {
        cell = Math.round((Number(cell) + Number.EPSILON) * 10000) / 10000;
        cell = putThousandsSeparators(cell);
      }
    }

    return cell;
  }

  const putThousandsSeparators = function (value, sep) {
    if (sep == null) {
      sep = ',';
    }
    // check if it needs formatting
    if (value.toString() === value.toLocaleString()) {
      // split decimals
      var parts = value.toString().split('.')
      // format whole numbers
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
      // put them back together
      value = parts[1] ? parts.join('.') : parts[0];
    } else {
      value = value.toLocaleString();
    }
    return value;
  };

  return (
    <Space>
      <Button
        style={{ marginTop: "10px" }}
        onClick={handlePreview}
        disabled={stateFileList.length == 0}
      >
        Preview
      </Button>
      <span id="statusspan"> * Choose a .xlsx file to import </span>
    </Space>
  );
}

export default PreviewButton;
