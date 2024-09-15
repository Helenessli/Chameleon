import { useState, ChangeEventHandler, FormEvent } from "react";
import axios from "axios";

export const UploadFile = () => {
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewImgUrl, setPreviewimgUrl] = useState("");
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.target.files as FileList;
    setSelectedImage(file?.[0]);
    if (!file) {
      return;
    }
    try {
      const imgUrl = await fileToDataString(file?.[0]);
      setPreviewimgUrl(imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append("file", selectedImage);
        console.log(formData);
        const response = await axiosInstance
          .post("/upload-file", formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (100 * progressEvent.loaded) / progressEvent.total
                );
                setProgress(progress);
              }
            },
          })
          .then((response) => {
            console.log(response.data); // Log the response data
          })
          .catch((error) => {
            console.error("Error:", error); // Handle and log errors
          });
        setProgress(0);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="wrapper">
      {selectedImage && progress > 0 && (
        <div className="progress my-3">
          <div className="progress-bar progress-bar-info" role="progressbar">
            {progress}%
          </div>
        </div>
      )}
      {previewImgUrl && (
        <div
          className="image_wrapper"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img src={previewImgUrl} alt="image" style={{ width: "50vw" }} />
        </div>
      )}

      <form onSubmit={handleImageUpload}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button disabled={!selectedImage} type="submit">
          Upload image
        </button>
      </form>
    </div>
  );
};

const fileToDataString = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result as string);
  });
};

// POST image to backend API

// const headers: HeadersInit = {
//   "Content-Type": `multipart/form-data;`,
//   Accept: "multipart/form-data",
// };

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});
