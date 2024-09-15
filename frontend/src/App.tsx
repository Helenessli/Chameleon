import { useRef, useState } from "react";
import { WebsiteRender } from "./components/WebsiteRender/WebsiteRender";
import { Button } from "./components/ui/button";
import logo from './resources/logo.png';
import leftdecor from './resources/leftdecor.png';
import rightdecor from './resources/rightdecor.png';

import { ChangeEventHandler, FormEvent } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";

const fileToDataString = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result as string);
  });
};

// POST image to backend API
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

function App() {
  const [uiElement, setUiElement] = useState(null);
  const [allText, setAllText] = useState("");
  const [textPrompt, setTextPrompt] = useState<string>(""); 
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  const [curImage, setCurImage] = useState<File>();
  const UploadFile = ({setCurImage}) => {
    const [selectedImage, setSelectedImage] = useState<File>();
    const [previewImgUrl, setPreviewimgUrl] = useState("");

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
          formData.append("text", "");
          formData.append("file", selectedImage);
          console.log(formData);
          setIsRetrieving(true);
          let response;
          try {
            response = await axiosInstance.post("/upload-file", formData)
          } finally {
            setIsRetrieving(false);
          }
          setCurImage(selectedImage);
          setUiElement(response.data.ui.root);
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
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img src={previewImgUrl} alt="image" style={{ height: "500px", width: 'auto'}} />
        </div>
      )}
      <div className="wrapper" style={{
              position: "absolute",
              top: "80%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
      }}>
        <form onSubmit={handleImageUpload}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button disabled={!selectedImage} type="submit" style={{background: "linear-gradient(90deg, #F2F7B6, #EAFCBE, #B9F0DB)", padding: "6px 20px", borderRadius: "8px", border: "1px solid #83D3A0", fontFamily: 'Istok Web'}}>
            Upload
          </button>
        </form>
      </div>
      </>
    );
  };
  const [isUploadPage, setIsUploadPage] = useState(true);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const formData = new FormData();
      formData.append("text", allText.concat(textPrompt));
      formData.append("file", curImage);
      console.log(textPrompt);
      const response = await axiosInstance.post("/upload-file", formData);
      setUiElement(response.data.ui.root);
      console.log(response);
      setAllText(allText.concat(textPrompt).concat("\\n"))
      setTextPrompt(""); 
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <img
        src={leftdecor}  
        style={{ position: 'fixed', left: '0', top: '0', transform: 'scale(0.8)', transformOrigin: 'top left'}}  
      />
      <img
        src={rightdecor}  
        style={{ position: 'fixed', right: '0', bottom: '0', transform: 'scale(0.8)', transformOrigin: 'bottom right'}}  
      />
      <div style={{marginLeft: "auto", marginRight: "auto", display: "flex", marginTop: "50px", justifyContent: "center", gap: "20px", marginBottom: "30px"}}>
        <img src={logo}/>
        <h1 style={{ color: 'black', fontFamily: 'Istok Web, sans-serif', fontSize: '90px'}}>Chameleon</h1>
      </div>
      {isUploadPage ? <UploadFile setCurImage={setCurImage}/> : (
        <div style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: "20px", padding: "15px", width: "70%", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          {uiElement == null ? <span>There's nothing here yet! Try uploading a file and then check back.</span> : <WebsiteRender uiElement={uiElement} />}
        </div>
      )}
      <Button
        disabled={isRetrieving}
        style = {{background: "linear-gradient(90deg, #F9D7B7, #F2F7B6)", color: "black", position: "fixed", bottom: 10, left: 10, border: "1px solid #F9B8A3", fontFamily: 'Istok Web'}} onClick={() => setIsUploadPage(!isUploadPage)}>
        Change Page
      </Button>
      <Input value={textPrompt} style={{position: "fixed", bottom: 10, right: 10, width: 300}} onChange={(e) => setTextPrompt(e.target.value)}
        onKeyDown={handleKeyDown} placeholder="Add more prompt changes" />
    </>
  );
}

export default App;
