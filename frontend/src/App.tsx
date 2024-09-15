import ReactDOMServer from "react-dom/server";
import { useRef, useState } from "react";
import { WebsiteRender } from "./components/WebsiteRender/WebsiteRender";
import { Button } from "./components/ui/button";
import logo from "./resources/logo.png";
import leftdecor from "./resources/leftdecor.png";
import rightdecor from "./resources/rightdecor.png";

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
  const [loading, setLoading] = useState<boolean>(false);

  const [curImage, setCurImage] = useState<File>();
  const UploadFile = ({ setCurImage }) => {
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
        setLoading(true);
        const formData = new FormData();
        if (selectedImage) {
          formData.append("text", "");
          formData.append("file", selectedImage);
          console.log(formData);
          let response;
          try {
            response = await axiosInstance.post("/upload-file", formData);
          } finally {
            setLoading(false);
          }
          setCurImage(selectedImage);
          setUiElement(response.data.ui.root);
          console.log(response);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    return (
      <>
        <div
          className="wrapper"
          style={{
            position: "absolute",
            top: "30%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleImageUpload}>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button
              disabled={!selectedImage}
              type="submit"
              style={{
                background: "linear-gradient(90deg, #F2F7B6, #EAFCBE, #B9F0DB)",
                padding: "6px 20px",
                borderRadius: "8px",
                border: "1px solid #83D3A0",
                fontFamily: "Istok Web",
              }}
            >
              Upload
            </button>
          </form>
        </div>
        <br />
        <br />
        {previewImgUrl && (
          <div
            className="image_wrapper"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={previewImgUrl}
              alt="image"
              style={{
                height: "55vh",
                width: "auto",
                maxWidth: "60vw",
                overflow: "hidden",
                border: "1px solid green",
              }}
            />
          </div>
        )}
      </>
    );
  };
  const [isUploadPage, setIsUploadPage] = useState(true);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", allText.concat(textPrompt));
      formData.append("file", curImage);
      console.log(textPrompt);
      const response = await axiosInstance.post("/upload-file", formData);
      setUiElement(response.data.ui.root);
      console.log(response);
      setAllText(allText.concat(textPrompt).concat("\\n"));
      setTextPrompt("");
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <img
        src={leftdecor}
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          transform: "scale(0.8)",
          transformOrigin: "top left",
        }}
      />
      <img
        src={rightdecor}
        style={{
          position: "fixed",
          right: "0",
          bottom: "0",
          transform: "scale(0.8)",
          transformOrigin: "bottom right",
        }}
      />
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          marginTop: "20px",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <img src={logo} />
        <h1
          style={{
            color: "black",
            fontFamily: "Istok Web, sans-serif",
            fontSize: "90px",
          }}
        >
          Chameleon
        </h1>
      </div>
      {isUploadPage && (
        <div
          className="wrapper"
          style={{
            position: "absolute",
            top: "22%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>
            Transform Your Design Ideas into Stunning Websites—No Coding
            Required!
          </span>
        </div>
      )}
      <Input
        value={textPrompt}
        style={{
          width: 800,
          backgroundColor: "white",
          marginLeft: "auto",
          marginRight: "auto",
          visibility: isUploadPage || uiElement == null ? "hidden" : "visible",
          marginBottom: "10px",
        }}
        onChange={(e) => setTextPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Customize your results"
      />
      {isUploadPage ? (
        <UploadFile setCurImage={setCurImage} />
      ) : (
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            borderRadius: "20px",
            padding: "15px",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          {uiElement == null ? (
            <span>
              There's nothing here yet! Try uploading a file and then check
              back.
            </span>
          ) : (
            <WebsiteRender uiElement={uiElement} />
          )}
        </div>
      )}
      <div
        style={{
          position: "fixed",
          top: "calc(50% - 32px)",
          left: "calc(50% - 32px)",
        }}
      >
        {loading && (
          <div className="lds-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
      <Button
        disabled={loading}
        style={{
          background: "linear-gradient(90deg, #F9D7B7, #F2F7B6)",
          width: "80px",
          color: "black",
          position: "absolute",
          bottom: 20,
          left: 10,
          border: "1px solid #F9B8A3",
          fontFamily: "Istok Web",
        }}
        onClick={() => setIsUploadPage(!isUploadPage)}
      >
        {isUploadPage ? "Results" : "Upload"}
      </Button>
      {!isUploadPage && uiElement != null && (
        <Button
          style={{ position: "absolute", bottom: 20, left: "40%" }}
          onClick={() => {
            navigator.clipboard.writeText(
              ReactDOMServer.renderToStaticMarkup(WebsiteRender({ uiElement }))
            );
            alert("Copied HTML Code");
          }}
        >
          Download code
        </Button>
      )}
      {!isUploadPage && uiElement != null && (
        <Button
          style={{ position: "absolute", bottom: 20, left: "calc(50% - 12px)" }}
          onClick={() => {
            navigator.clipboard.writeText(
              ReactDOMServer.renderToStaticMarkup(WebsiteRender({ uiElement }))
            );
            window.open(
              "https://admin.shopify.com/store/quickstart-ffb29062/apps/test-app-10377/app/additional",
              "_blank"
            );
          }}
        >
          Export to Shopify Page
        </Button>
      )}
    </>
  );
}

export default App;
