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
  useEffect(() => {
    // เปลี่ยนค่าฟอร์มตาม photocard ที่ click เข้ามา
    setFormPhoto({ ...props.formEdit[0] });
  }, [props.formEdit]);

  //validate
  useEffect(() => {
    if (formPhoto.title && formPhoto.description) {
      setEnableButton(false);
    } else {
      setEnableButton(true);
    }
  }, [formPhoto]);

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

  const Submit = (e) => {
    e.preventDefault();
    props.onSaveClick(formPhoto);
  };

  return (
    <div className="p-col">
      <form
        onSubmit={(e) => {
          Submit(e);
        }}
      >
        <FileUpload
          ref={fileUploadRef}
          // ชนิดไฟล์ที่รับ
          accept="image/*"
          // ขนาดไฟล์ที่รับ
          maxFileSize={1000000}
          // event เวลาเลือกไฟล์
          onSelect={onTemplateSelect}
          // event เคลียร์ไฟล์
          onClear={onClear}
          mode="basic"
          chooseOptions={chooseOptions}
        />
        <div className="p-grid " style={{ marginTop: "20px" }}>
          <div className="p-col-12 p-col-align-center">
            <center>
              <img
                src={formPhoto.photos}
                style={{
                  height: "400px",
                  alignContent: "center",
                }}
              />
            </center>
          </div>

          <div className="p-col-12">
            <InputText
              value={formPhoto.title}
              onChange={(e) => {
                setFormPhoto({ ...formPhoto, title: e.target.value });
              }}
              placeholder="Title"
              className="width-full-grid"
            />
          </div>
          <div className="p-col-12 width-full-grid">
            <InputTextarea
              placeholder="Description"
              rows={4}
              value={formPhoto.description}
              onChange={(e) => {
                setFormPhoto({ ...formPhoto, description: e.target.value });
              }}
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
