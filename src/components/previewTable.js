import React from "react";
import ReactDOM from "react-dom";
import { Upload, message, Button, Space, Table, Input, Spin } from "antd";
import { useSelector } from "react-redux";
import "./previewTable.css";

function PreviewTable() {
  const stateColumns = useSelector((state) => state.columns);
  const stateData = useSelector((state) => state.data);

  return (
    <>
      <div id="tableContainer" style={{ marginTop: "20px" }}>
        <h3>Preview:</h3>
        <Table
          columns={stateColumns}
          dataSource={stateData}
          pagination={{ position: ["topLeft"] }}
          columnWidth={"1px"}
        ></Table>
      </div>
    </>
  );
}

export default PreviewTable;
