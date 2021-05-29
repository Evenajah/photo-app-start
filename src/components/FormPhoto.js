import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef, useState } from "react";

const FormPhoto = (props) => {
  //state enable ปุ่ม submit
  const [enableButton, setEnableButton] = useState(true);
  const [formPhoto, setFormPhoto] = useState({
    title: "",
    description: "",
    photos: [],
  });
  const fileUploadRef = useRef();

  //set formEdit
  useEffect(() => {}, [props.formEdit]);

  //validate
  useEffect(() => {}, [formPhoto]);

  const onTemplateSelect = (e) => {
    SetPhotoForm();
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  //แปลงไฟล์เป็น base64
  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  // promise รอแปลงเสร็จ
  const loadFile = () => {
    if (!fileUploadRef.current.files) {
      return;
    }
    const arrFile = fileUploadRef.current.state.files.map((item) =>
      blobToBase64(item)
    );

    return Promise.all(arrFile);
  };

  const SetPhotoForm = async () => {
    const filePhoto = await loadFile();
    setFormPhoto({ ...formPhoto, photos: await filePhoto });
  };

  const onClear = (e) => {
    setFormPhoto({ ...formPhoto, photos: [] });
  };

  return (
    <div className="p-col">
      <form>
        <FileUpload
          ref={fileUploadRef}
          accept="image/*"
          maxFileSize={1000000}
          onSelect={onTemplateSelect}
          onClear={onClear}
          mode="basic"
          chooseOptions={chooseOptions}
        />
        <div className="p-grid " style={{ marginTop: "20px" }}>
          <div className="p-col-12 p-col-align-center">
            <center>
              <img
                style={{
                  height: "400px",
                  alignContent: "center",
                }}
              />
            </center>
          </div>

          <div className="p-col-12">
            <InputText placeholder="Title" className="width-full-grid" />
          </div>
          <div className="p-col-12 width-full-grid">
            <InputTextarea
              placeholder="Description"
              rows={4}
              className="width-full-grid"
            />
          </div>
          <div className="p-col-12">
            <Button
              disabled={enableButton}
              label="Save"
              className="width-full-grid"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPhoto;
