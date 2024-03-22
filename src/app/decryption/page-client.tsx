"use client";

import { useState } from "react";

import { BsArrowDownSquare, BsKeyFill } from "react-icons/bs";
import { GrSecure } from "react-icons/gr";
import useWasm from "aes/hooks/wasm";

export default function Decryption() {
  const { wasm, isLoading, error } = useWasm();

  const [downloadUrl, setDownloadUrl] = useState<
    {
      url?: string;
      filename?: string;
    }[]
  >([]);

  const [encKeys, setEncKeys] = useState<{ nonce: string; key: string }>({
    key: "1234567890abcdef",
    nonce: "0123456789ab",
  });
  const [err, setErr] = useState<string | undefined>();

  const handleFileInputChange = (file: FileList | null) => {
    if (err) return;
    if (file && file[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        // encrypting
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let enc = wasm.decrypt(encKeys.key, encKeys.nonce, bytes);
        const blob = new Blob([enc], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        setDownloadUrl((e) => [...e, { url, filename: file[0].name }]);
      };
      reader.readAsArrayBuffer(file[0]);
    }
  };

  return (
    <div className="card mx-auto">
      <div className="card-body">
        <h2 className="card-title">Decrypt the file</h2>
        {err && <p className="text-error"> {err}</p>}
        <label className="input input-bordered flex items-center gap-2">
          <BsKeyFill />
          <input
            type="text"
            className="grow"
            placeholder="Key"
            value={encKeys.key}
            onChange={(ev) => {
              let val = ev.target.value;
              if (val.length !== 16) {
                setErr("key should 16 chars");
              } else {
                setErr(undefined);
              }
              setEncKeys((e) => ({ ...e, key: val.slice(0, 16) }));
            }}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <GrSecure />
          <input
            type="text"
            className="grow"
            placeholder="Nonce"
            value={encKeys.nonce}
            onChange={(ev) => {
              let val = ev.target.value;
              if (val.length !== 12) {
                setErr("nonce should 12 chars");
              } else {
                setErr(undefined);
              }
              setEncKeys((e) => ({ ...e, nonce: val.slice(0, 12) }));
            }}
          />
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full"
          onChange={(e) => handleFileInputChange(e.target.files)}
        />
        {downloadUrl.length > 0 && <p>Output Files after the process:</p>}
        {downloadUrl &&
          downloadUrl.map((e, idx) => (
            <a
              className="btn btn-outline btn-secondary"
              key={`${e.filename}+${idx}`}
              href={e.url}
              download={"enc_" + e.filename}
            >
              {"enc_" + e.filename}
              <BsArrowDownSquare className="text-xl fill-secondary" />
            </a>
          ))}
      </div>
      {/* <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure> */}
    </div>
  );
}
