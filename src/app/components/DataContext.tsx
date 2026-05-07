"use client";
import React, { createContext, useContext, useState } from "react";

type DataContextType = {
  dataEmail: string;
  setDataEmail: (dataEmail: string) => void;
  token: string;
  setToken: (token: string) => void;
  otpToken: string;
  setOtpToken: (otpToken: string) => void;
  otpPurpose: "FORGOT_PASSWORD" | "VERIFY_EMAIL" | "";
  setOtpPurpose: (otpPurpose: "FORGOT_PASSWORD" | "VERIFY_EMAIL" | "") => void;
};


const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DATA_EMAIL: "auth.dataEmail",
  CHANGE_PASSWORD_TOKEN: "auth.changePasswordToken",
  OTP_TOKEN: "auth.otpToken",
  OTP_PURPOSE: "auth.otpPurpose",
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataEmailState, setDataEmailState] = useState("");
  const [tokenState, setTokenState] = useState("");
  const [otpTokenState, setOtpTokenState] = useState("");
  const [otpPurposeState, setOtpPurposeState] = useState<"FORGOT_PASSWORD" | "VERIFY_EMAIL" | "">("");

  const setDataEmail = (dataEmail: string) => {
    setDataEmailState(dataEmail);
    if (typeof window !== "undefined") {
      if (dataEmail) localStorage.setItem(STORAGE_KEYS.DATA_EMAIL, dataEmail);
      else localStorage.removeItem(STORAGE_KEYS.DATA_EMAIL);
    }
  };

  const setToken = (token: string) => {
    setTokenState(token);
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem(STORAGE_KEYS.CHANGE_PASSWORD_TOKEN, token);
      else localStorage.removeItem(STORAGE_KEYS.CHANGE_PASSWORD_TOKEN);
    }
  };

  const setOtpToken = (otpToken: string) => {
    setOtpTokenState(otpToken);
    if (typeof window !== "undefined") {
      if (otpToken) localStorage.setItem(STORAGE_KEYS.OTP_TOKEN, otpToken);
      else localStorage.removeItem(STORAGE_KEYS.OTP_TOKEN);
    }
  };

  const setOtpPurpose = (otpPurpose: "FORGOT_PASSWORD" | "VERIFY_EMAIL" | "") => {
    setOtpPurposeState(otpPurpose);
    if (typeof window !== "undefined") {
      if (otpPurpose) localStorage.setItem(STORAGE_KEYS.OTP_PURPOSE, otpPurpose);
      else localStorage.removeItem(STORAGE_KEYS.OTP_PURPOSE);
    }
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storedEmail = localStorage.getItem(STORAGE_KEYS.DATA_EMAIL) ?? "";
    const storedChangePasswordToken = localStorage.getItem(STORAGE_KEYS.CHANGE_PASSWORD_TOKEN) ?? "";
    const storedOtpToken = localStorage.getItem(STORAGE_KEYS.OTP_TOKEN) ?? "";
    const storedOtpPurpose = (localStorage.getItem(STORAGE_KEYS.OTP_PURPOSE) ?? "") as "FORGOT_PASSWORD" | "VERIFY_EMAIL" | "";

    if (storedEmail) setDataEmailState(storedEmail);
    if (storedChangePasswordToken) setTokenState(storedChangePasswordToken);
    if (storedOtpToken) setOtpTokenState(storedOtpToken);
    if (storedOtpPurpose) setOtpPurposeState(storedOtpPurpose);
  }, []);

  return (
    <DataContext.Provider
      value={{
        dataEmail: dataEmailState,
        setDataEmail,
        token: tokenState,
        setToken,
        otpToken: otpTokenState,
        setOtpToken,
        otpPurpose: otpPurposeState,
        setOtpPurpose,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDataContext must be used within DataProvider");
  return context;
};
