import { useState, useEffect } from "react";

import * as wasm from "aes/pkg/aes";

const useWasm = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/wasm/aes_bg.wasm");
        const ab = await res.arrayBuffer();
        wasm.initSync(ab);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { wasm, isLoading, error };
};

export default useWasm;
