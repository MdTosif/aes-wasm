"use client";

import { useEffect, useState } from "react";

import * as wasm from "aes/pkg/aes";

export default function Home() {
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [enc, setEnc] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<{
    url?: string;
    filename?: string;
  }>({
    url: undefined,
    filename: undefined,
  });

  useEffect(() => {
    fetch("/wasm/aes_bg.wasm").then(async (res) => {
      const ab = await res.arrayBuffer();
      wasm.initSync(ab);
    });
  }, []);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      file.name;
      const reader = new FileReader();
      reader.onload = () => {
        // encrypting
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        setFileBytes(bytes);
        let enc = wasm.encrypt("0123456789abcdef", "0123456789ab", bytes);

        setEnc(enc);

        // deacrypting
        let dec = wasm.decrypt("0123456789abcdef", "0123456789ab", enc);
        const blob = new Blob([dec], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        setDownloadUrl((e) => ({ url, filename: file.name }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="border-black rounded-lg">
      <input type="file" onChange={handleFileInputChange} />
      {fileBytes && (
        <div>
          <h3>File Bytes:</h3>
          <pre>{fileBytes.join(", ")}</pre>
        </div>
      )}
      {enc && (
        <div>
          <h3>File Bytes:</h3>
          <pre>{enc.join(", ")}</pre>
        </div>
      )}
      {downloadUrl && (
        <a href={downloadUrl.url} download={"enc_" + downloadUrl.filename}>
          Click here to download
        </a>
      )}
    </div>
  );
}
