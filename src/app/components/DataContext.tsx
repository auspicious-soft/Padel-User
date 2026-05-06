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

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataEmail, setDataEmail] = useState("");
  const [token, setToken] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpPurpose, setOtpPurpose] = useState<"FORGOT_PASSWORD" | "VERIFY_EMAIL" | "">("");
  return (
    <DataContext.Provider
      value={{
        dataEmail,
        setDataEmail,
        token,
        setToken,
        otpToken,
        setOtpToken,
        otpPurpose,
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
