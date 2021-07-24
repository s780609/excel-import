import "./App.css";
import { Upload, message, Button, Space, Table, Input, Spin } from "antd";
import "antd/dist/antd.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PreviewTable from "./components/previewTable";
import PreviewButton from "./components/previewButton";
import UploadButton from "./components/uploadButton";
import { Helmet } from 'react-helmet'

function App() {
  const entityName = useSelector((state) => state.entityName);

  const [loading, setLoading] = useState(false);

  return (
    <div className="App" style={{ margin: "20px" }}>
      <Helmet>
        <title>{entityName}</title>
      </Helmet>
      <h1>{`Import ${entityName} (.xlsx):`}</h1>
      <Spin tip="Uploading...." size="large" spinning={loading}>
        <UploadButton setLoading={setLoading}></UploadButton>
      </Spin>
      <br />
      <PreviewButton></PreviewButton>
      <PreviewTable></PreviewTable>
    </div>
  );
}

export default App;
