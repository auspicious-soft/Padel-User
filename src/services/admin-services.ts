import { axiosInstance, getAxiosInstance, getAxiosInstanceFormData } from "@/config/axios";
import { AUTH_URLS } from "@/constants/apiUrls";

export const loginService = async (payload: any) => {
 return  await axiosInstance.post(`/api/auth/login`, {
    email: payload.email,
    password: payload.password,
  });
};

export const userLoginService = async (payload: { email: string; password: string }) => {
  return axiosInstance.post(
    "/api/user-login",
    {
      email: payload.email,
      password: payload.password,
    },
    {
      headers: {
        "x-user-type": "User",
      },
    }
  );
};

export const registerUserService = async (payload: {
  fullName: string;
  email: string;
  password: string;
  fcmToken?: string;
  deviceType?: "ANDROID" | "IOS" | "WEB";
}) => {
  return axiosInstance.post("/api/register", {
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    fcmToken: payload.fcmToken ?? "web-fcm-token",
    deviceType: payload.deviceType ?? "WEB",
  });
};

export const forgotPasswordService = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.FORGET_PASSWORD}`, payload, {
    headers: { "x-user-type": "User" },
  });
export const sendOtpService = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.VERIFY_OTP}`, payload, {
    headers: { "x-user-type": "User" },
  });
export const resetPassword = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.RESET_PASSWORD}`, payload, {
    headers: { "x-user-type": "User" },
  });
export const resendOtpService = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.RESEND_OTP}`, payload, {
    headers: { "x-user-type": "User" },
  });
export const logOutService = async (route: string) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post(route);
};


export const getDahboardData = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route);
}
export const getData = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route);
}
export const putData = async (route: string,payload?:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put(route,payload);
}
export const patchData = async (route: string,payload?:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.patch(route,payload);
}
export const deleteData = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.delete(route);
}
export const postData = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route,payload);
}

export const updateAdminDetails = async (route: string, payload:any) =>{
  const axiosInstance = await getAxiosInstance()
  return axiosInstance.patch(route, payload);
}
