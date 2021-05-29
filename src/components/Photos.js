import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import Loader from "react-loader-spinner";
import FormPhoto from "./FormPhoto";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [mode, setMode] = useState("Add");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  //แสดงแจ้งเตือน
  const showAlert = (message, status, detail) => {
    toast.current.show({
      severity: status,
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  // คอนเฟิมว่าจะลบนะ
  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {},
    });
  };

  const listPhoto =
    photos &&
    photos.map((photoItems) => {
      return <div key={photoItems.id} className="p-col-12 p-md-6 p-lg-4"></div>;
    });

  const dialog = (
    <Dialog
      header={`${mode} Photo`}
      visible={isShowDialog}
      blockScroll={true}
      style={{ width: 1000 }}
      onHide={() => {
        setIsShowDialog(false);
      }}
    >
      <div className="p-grid">
        <FormPhoto />
      </div>
    </Dialog>
  );

  return (
    <div className="p-grid" style={{ marginTop: "200px" }}>
      <InputText
        placeholder="Search"
        className="width-full-grid search-input"
      />
      {listPhoto}

      {dialog}

      <Toast ref={toast} position="bottom-right" />

      <Button
        onClick={() => setIsShowDialog(true)}
        label="Add"
        icon="pi pi-plus"
        className="btn-add-photo"
      />

      <Loader
        type="Puff"
        className="spinner"
        color="#00BFFF"
        height={100}
        width={100}
        visible={loading}
      />
    </div>
  );
};

export default Photos;
