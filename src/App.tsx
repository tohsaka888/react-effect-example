import { useEffect, useRef, useState } from "react";
import "./App.css";
import { baseUrl } from "./config/baseUrl";

function App() {
  const [key, setKey] = useState<string>("");
  const [imgUrl, setImageUrl] = useState<string>("");
  const [qrStatus, setQrStatus] = useState<string>("");
  const intervalRef = useRef<number>();
  useEffect(() => {
    const createKey = async () => {
      const res = await fetch(`${baseUrl}/login/qr/key`);
      const data = await res.json();
      setKey(data.data.unikey);
    };
    createKey();
  }, []);
  useEffect(() => {
    const createQrImage = async () => {
      const res = await fetch(
        `${baseUrl}/login/qr/create?key=${key}&qrimg=true`
      );
      const data = await res.json();
      setImageUrl(data.data.qrimg);
    };
    if (key) {
      createQrImage();
    }
  }, [key]);
  useEffect(() => {
    const checkQrStatus = async () => {
      const res = await fetch(
        `${baseUrl}/login/qr/check?key=${key}&qrimg=true`
      );
      const data = await res.json();
      if (data.code !== 801 && data.code !== 802) {
        window.clearInterval(intervalRef.current);
      }
      setQrStatus(data.message);
    };
    if (key) {
      intervalRef.current = window.setInterval(checkQrStatus, 3000);
    }
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [key]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={imgUrl} alt={imgUrl} />
        <div>{qrStatus}</div>
      </header>
    </div>
  );
}

export default App;
