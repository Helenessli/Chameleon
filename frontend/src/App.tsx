import { useRef, useState } from "react";
import { WebsiteRender } from "./components/WebsiteRender/WebsiteRender";
import { Response } from "./components/WebsiteRender/types";
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

const response: Response = {"ui":{"root":{"element":{"type":"Container","children":[{"element":{"type":"Text","value":"shopify","marginTopRem":null,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":1}},{"element":{"type":"Text","value":"Start free trial","marginTopRem":null,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Container","children":[{"element":{"type":"Text","value":"Log in","marginTopRem":null,"marginRightRem":null,"marginBottomRem":1,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Text","value":"Continue to Shopify","marginTopRem":null,"marginRightRem":null,"marginBottomRem":1,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Button","text":"Log in to your Shopify Account","marginTopRem":null,"marginRightRem":null,"marginBottomRem":2,"marginLeftRem":null,"paddingTopRem":1,"paddingRightRem":1,"paddingBottomRem":1,"paddingLeftRem":1}},{"element":{"type":"Text","value":"Don't have a Shopify account? Start free trial","marginTopRem":null,"marginRightRem":null,"marginBottomRem":1,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Container","children":[{"element":{"type":"Text","value":"Help","marginTopRem":null,"marginRightRem":3,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Text","value":"Privacy","marginTopRem":null,"marginRightRem":3,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}},{"element":{"type":"Text","value":"Terms","marginTopRem":null,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}}],"direction":"row","justify":"start","align":"center","borderWidthPx":null,"marginTopRem":null,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":null,"paddingRightRem":null,"paddingBottomRem":null,"paddingLeftRem":null}}],"direction":"col","justify":"center","align":"center","borderWidthPx":0,"marginTopRem":2,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":3,"paddingRightRem":3,"paddingBottomRem":3,"paddingLeftRem":3}}],"direction":"col","justify":"start","align":"stretch","borderWidthPx":null,"marginTopRem":null,"marginRightRem":null,"marginBottomRem":null,"marginLeftRem":null,"paddingTopRem":3,"paddingRightRem":3,"paddingBottomRem":3,"paddingLeftRem":3}}}}

function App() {
  const [uiElement, setUiElement] = useState(response.ui.root);
  const [allText, setAllText] = useState("");
  const [textPrompt, setTextPrompt] = useState<string>(""); 
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [curImage, setCurImage] = useState<File>();
  const UploadFile = ({setCurImage}) => {
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
        setLoading(true);
        const formData = new FormData();
        if (selectedImage) {
          formData.append("text", "");
          formData.append("file", selectedImage);
          const response = await axiosInstance.post("/upload-file", formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (100 * progressEvent.loaded) / progressEvent.total
                );
                setProgress(progress);
              }
            },
          });
          setProgress(0);
          setCurImage(selectedImage);
          setUiElement(response.data.ui.root);
          console.log(response);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
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
          <img src={previewImgUrl} alt="image" style={{ height: "350px", width: 'auto'}} />
        </div>
      )}
      <div className="wrapper" style={{
              position: "absolute",       
              top: "80%",                 
             
      }}>
        {selectedImage && progress > 0 && (
          <div className="progress my-3">
            <div className="progress-bar progress-bar-info" role="progressbar">
              {progress}%
            </div>
          </div>
        )}
     

        <form style = {{marginLeft: "500px"}} onSubmit={handleImageUpload}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button disabled={!selectedImage} type="submit" style={{background: "linear-gradient(90deg, #F2F7B6, #EAFCBE, #B9F0DB)", padding: "6px 20px", borderRadius: "8px", border: "1px solid #83D3A0", position: 'absolute', fontFamily: 'Istok Web'}}>
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
      setLoading(true);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      const formData = new FormData();
      formData.append("text", allText.concat(textPrompt));
      formData.append("file", curImage);
      console.log(textPrompt);
      const response = await axiosInstance.post("/upload-file", formData);
      setUiElement(response.data.ui.root);
      console.log(response);
      setAllText(allText.concat(textPrompt).concat("\\n"))
      setTextPrompt(""); 
      setLoading(false);
    }
  };

  return (
    
    <>
      <img
        src={logo}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', marginLeft: '430px'}}  
      />
      <img
        src={leftdecor}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', left: '0', top: '0', transform: 'scale(0.8)', transformOrigin: 'top left'}}  
      />
      <img
        src={rightdecor}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', right: '0', bottom: '0', transform: 'scale(0.8)', transformOrigin: 'bottom right'}}  
      />

      <h1 style={{ color: 'black', fontFamily: 'Istok Web, sans-serif', fontSize: '90px',  marginLeft: '550px', marginTop: '50px' }}>Chameleon</h1>
      {isUploadPage ? <UploadFile setCurImage={setCurImage}/> : <WebsiteRender uiElement={uiElement} />}
      {loading && (<div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>)}
     
      <Button
        style = {{background: "linear-gradient(90deg, #F9D7B7, #F2F7B6)", color: "black", bottom: 10, left: 10, border: "1px solid #F9B8A3", fontFamily: 'Istok Web', position: 'absolute'}} onClick={() => setIsUploadPage(!isUploadPage)}>
        Change Page
      </Button>
      <Input value={textPrompt} style={{position: "fixed", bottom: 10, right: 10, width: 300}} onChange={(e) => setTextPrompt(e.target.value)}
        onKeyDown={handleKeyDown} placeholder="Add more prompt changes" />
    </>
  );
}

export default App;
