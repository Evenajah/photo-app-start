import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PhotoCard = (props) => {
  //ตัวแปรรับค่าจาก props.photo
  const photoContent = props.photo;
  const header = photoContent.photos && (
    <center>
      <LazyLoadImage
        src={photoContent.photos}
        alt="Card"
        loading="lazy"
        effect="opacity"
        delayTime={1000}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        style={{ height: "450px", minWidth: "300px" }}
      />
    </center>
  );
  const footer = (
    <span>
      <Button
        label="Edit"
        icon="pi pi-pencil"
        onClick={() => {
          props.onEditClick(photoContent.id);
        }}
        style={{ marginRight: ".25em" }}
      />
      <Button
        label="Delete"
        icon="pi pi-times"
        className="p-button-secondary"
        onClick={() => {
          props.onDeleteClick(photoContent.id);
        }}
      />
    </span>
  );

  return (
    <>
      <Card footer={footer} header={header} className="card-photo p-shadow-3">
        {/* title */}
        {photoContent.title}
        <h1 style={{ fontFamily: "Mali", margin: "0px" }}></h1>
        <br />
        {/* description */}
        {photoContent.description}
      </Card>
    </>
  );
};

export default PhotoCard;
