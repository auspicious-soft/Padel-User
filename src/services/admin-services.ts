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

export const getUserProfileService = async () => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get("/api/user/profile", {
    headers: { "x-user-type": "User" },
  });
};

export const updateUserProfileService = async (payload: { fullName: string }) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.patch("/api/user/profile", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const deleteUserProfileService = async () => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.delete("/api/user/delete-profile", {
    headers: { "x-user-type": "User" },
  });
};

export const changeUserPasswordService = async (payload: { oldPassword: string; newPassword: string }) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post("/api/user/change-password", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const userLogoutService = async (payload: { fcmToken?: string; deviceType: "ANDROID" | "IOS" | "WEB" }) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post("/api/user/logout", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserSettingsContentService = async (type: "privacyPolicy" | "termsAndCondition") => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get(`/api/user/settings?type=${type}`, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserMembershipsService = async () => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get("/api/user/membership", {
    headers: { "x-user-type": "User" },
  });
};

export const purchaseUserMembershipService = async (payload: { membershipId: string }) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post("/api/user/purchase", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserProductsService = async (payload: { venueId: string; search?: string }) => {
  const axiosInstance = await getAxiosInstance();
  const query = new URLSearchParams({
    venueId: payload.venueId,
    ...(payload.search ? { search: payload.search } : {}),
  }).toString();
  return axiosInstance.get(`/api/user/products?${query}`, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserProductByIdService = async (payload: { productId: string; venueId: string }) => {
  const axiosInstance = await getAxiosInstance();
  const query = new URLSearchParams(payload).toString();
  return axiosInstance.get(`/api/user/productById?${query}`, {
    headers: { "x-user-type": "User" },
  });
};

export const buyUserProductService = async (payload: {
  productId: string;
  venueId: string;
  productSize: string;
  quantity: number;
}) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post("/api/user/buy-product", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const getProductReviewsService = async (productId: string) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get(`/api/user/reviews?productId=${productId}`, {
    headers: { "x-user-type": "User" },
  });
};

export const postProductReviewService = async (payload: {
  productId: string;
  star: number;
  reviewDescription: string;
}) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post("/api/user/reviews", payload, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserTransactionsService = async (type: "product" | "booking") => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get(`/api/user/transaction?type=${type}`, {
    headers: { "x-user-type": "User" },
  });
};

export const getUserVenuesService = async () => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.get("/api/user/venues", {
    headers: { "x-user-type": "User" },
  });
};
