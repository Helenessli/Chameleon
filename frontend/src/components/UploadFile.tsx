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
    <>
    {previewImgUrl && (
        <div
          className="image_wrapper"
          style={{display: "flex", justifyContent: "center", position: 'relative' }}
        >
          <img src={previewImgUrl} alt="image" style={{ width: 'auto', height: '360px', borderRadius: '8px', zIndex: 1000}}
          />
        </div>
      )}
    <div style={{
      position: "absolute",       
      top: "80%",                 
      left: "35%"          
    }}className="wrapper">
      {selectedImage && progress > 0 && (
        <div className="progress my-3">
          <div className="progress-bar progress-bar-info" role="progressbar">
            {progress}%
          </div>
        </div>
      )}
      

      <form 
      onSubmit={handleImageUpload}
      >
        <input
        type="file" onChange={handleFileChange} accept="image/*" />
        <button style={{background: "linear-gradient(90deg, #F2F7B6, #EAFCBE, #B9F0DB)", padding: "6px 20px", borderRadius: "8px", border: "1px solid #83D3A0", position: 'absolute', fontFamily: 'Istok Web'}}
        disabled={!selectedImage} type="submit">
          Upload
        </button>
      </form>
    </div>
    </>
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
