import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);

  const show = useCallback((msg, duration = 2500) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(""), duration);
  }, []);

  return { message, show };
}
