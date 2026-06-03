// visitorId will be optional for LPS request in a near future, so this file will be removed soon
import { useEffect, useState } from "react";
import { getCookie } from "../helpers/cookies.native";

async function setVidFromCookie(setVid: (value: string | null) => void) {
  try {
    const value = await getCookie("vid");
    setVid(value);
  } catch (err) {
    console.error(err);
  }
}

export function useResolveVisitorId(): string | null {
  const [vid, setVid] = useState<string | null>(null);

  useEffect(() => {
    setVidFromCookie(setVid);
  }, []);

  return vid;
}
