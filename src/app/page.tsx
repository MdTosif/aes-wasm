"use client";

import { useState } from "react";
import { Encryption } from "./encryption/page";
import { Decryption } from "./decryption/page";

export default function Home() {
  const [tab, setTab] = useState<"encrypt" | "decrypt">("encrypt");
  const onClickHandler = (tab: "encrypt" | "decrypt") => {
    setTab(tab);
  };
  return (
    <div className=" mx-auto my-3 lg:w-1/2">
      <div
        role="tablist"
        className="tabs tabs-lifted shadow-lg border-base-300 border-2 rounded-box p-0 bg-primary-content"
      >
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-2xl p-3 font-serif font-bold bg-primary-content "
          aria-label="Encrypt"
          checked={tab == "encrypt"}
          onChange={() => {
            onClickHandler("encrypt");
          }}
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <Encryption />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab text-2xl p-3 font-serif font-bold bg-primary-content"
          aria-label="Decrypt"
          checked={tab == "decrypt"}
          onChange={() => {
            onClickHandler("decrypt");
          }}
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <Decryption />
        </div>
      </div>
    </div>
  );
}
