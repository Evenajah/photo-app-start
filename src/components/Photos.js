import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import FormPhoto from "./FormPhoto";
import httpClient from "../services/http-common";
import PhotoCard from "./PhotoCard";
import { debounce } from "lodash";

const Photos = () => {
  // ข้อมูลทั้งหมด
  const [photos, setPhotos] = useState([]);
  // Binding กับ dialog
  const [isShowDialog, setIsShowDialog] = useState(false);
  // โหมด add and edit
  const [mode, setMode] = useState("Add");
  // รอโหลด request จาก api
  const [loading, setLoading] = useState(false);
  // reference ถึง toast ในหน้าจอเรานะ
  const toast = useRef(null);
  // form state
  const [formPhoto, setFormPhoto] = useState({
    title: "",
    description: "",
    photos: [],
  });

  // คิวรี่ข้อมูลตอนแรกสุด
  useEffect(() => {
    GetAllPhoto();
  }, []);

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
      accept: () => {
        DeletePhoto(id);
      },
    });
  };

  //ลบข้อมูล
  const DeletePhoto = async (id) => {
    try {
      const request = await httpClient.delete("/photos/" + id);
      const response = await request;
      if (response.status === 200) {
        showAlert("Success", "success", "Delete Success");
        setIsShowDialog(false);
        GetAllPhoto();
      }
    } catch (error) {
      showAlert("Failed", "error", error.message);
    }
  };

  const EditPhotoClick = async (id) => {
    setMode("Edit");
    try {
      const request = await httpClient.get("photos/" + id);
      const response = await request;
      if (response.status === 200) {
        setIsShowDialog(true);
        setFormPhoto(response.data);
        console.log(response.data);
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
  };

  // ตัวแปรสร้าง photoCard
  const listPhoto =
    photos &&
    photos.map((photoItems) => {
      return (
        <div key={photoItems.id} className="p-col-12 p-md-6 p-lg-4">
          <PhotoCard
            onDeleteClick={confirmDelete}
            onEditClick={EditPhotoClick}
            photo={photoItems}
          />
        </div>
      );
    });

  //กดปุ่ม save จากหน้า form
  const SubmitPhoto = (formPhoto) => {
    switch (mode) {
      case "Add":
        AddPhoto(formPhoto);
        break;
      case "Edit":
        EditPhoto(formPhoto);
        break;
      default:
        break;
    }
  };

  //คิวรี่ข้อมูลครับ
  const GetAllPhoto = async () => {
    try {
      const request = await httpClient.get("/photos");
      const response = await request;
      if (response.status === 200) {
        console.log(response.data);
        setPhotos(response.data);
      }
    } catch (error) {
      showAlert("Failed", "error", error.message);
    }
  };

  //เพิ่มข้อมูลครับ
  const AddPhoto = async (formPhoto) => {
    try {
      const request = await httpClient.post("/photos", formPhoto);
      const response = await request;
      if (response.status === 201) {
        showAlert("Success", "success", "Insert Success");
        setIsShowDialog(false);
        GetAllPhoto();
      }
    } catch (error) {
      showAlert("Failed", "error", error.message);
    }
  };

  const EditPhoto = async (formPhoto) => {
    try {
      const request = await httpClient.put(
        `/photos/${formPhoto.id}`,
        formPhoto
      );
      const response = await request;
      if (response.status === 200) {
        showAlert("Success", "success", "Insert Success");
        setIsShowDialog(false);
        GetAllPhoto();
      }
    } catch (error) {
      showAlert("Failed", "error", error.message);
    }
  };

  //ค้นหาข้อมูล
  const SearchPhoto = debounce(async (e) => {
    try {
      const request = await httpClient.get(
        "/photos?searchText=" + e.target.value
      );
      const response = await request;
      if (response.status === 200) {
        console.log(response.data);
        setPhotos(response.data);
      }
    } catch (error) {
      showAlert("Failed", "error", error.message);
    }
  }, 500);

  //dialog โชว์ฟอร์ม
  const dialog = (
    <Dialog
      header={`${mode} Photo`}
      visible={isShowDialog}
      blockScroll={true}
      style={{ width: 1000 }}
      onHide={() => {
        setFormPhoto({});
        setIsShowDialog(false);
      }}
    >
      <div className="p-grid">
        <FormPhoto formEdit={formPhoto} onSaveClick={SubmitPhoto} />
      </div>
    </Dialog>
  );

  return (
    <div className="p-grid" style={{ marginTop: "200px" }}>
      <InputText
        placeholder="Search"
        className="width-full-grid search-input"
        onChange={(e) => {
          SearchPhoto(e);
        }}
      />

      {listPhoto}

      {dialog}

      <Toast ref={toast} position="bottom-right" />

      <Button
        onClick={() => {
          setMode("Add");
          setIsShowDialog(true);
        }}
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
