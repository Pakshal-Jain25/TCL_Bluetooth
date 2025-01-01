export const urlConstants = {
  LOCAL: "IND",
  // LOCAL: "SA",
  // BASE_URL: "https://fe-slp.raseel.city/api/v1/tclfe/",
  BASE_URL: "http://14.143.154.122:9999/api/v1/tclfe/",
  SSL_CERTIFICATE_FINGERPRINT: "",
  API_SUFFIX: {
    AUTH: {
      LOGIN: "login",
      CSRF_TOKEN: "login/csrfToken",
      CHANGE_PASSWORD: "userservice/users/updatepasswordreq",
      LOGOUT: "logout",
      FORGOT_PASSWORD: "forgotrequest",
    },
    LIST_OF_INSTALLATION: {
      INSTALLED_LIST: "deviceservice/sync/installedList",
      // INSTALLED_LIST: "deviceservice/sync/installedList?fieldName=&status=Pass&page=0&size=20000"
    },
    SETTINGS: {
      GET_PROFILE_PICTURE: "deviceservice/images/",
      CHANGE_PASSWORD: "userservice/users/changepassword",
      UPLOAD_PROFILE_PICTURE: "deviceservice/images",
    },
    NEW_INSTALLATION: {
      PROPERTY: "deviceservice/property",
      PROJECTSYNC: "deviceservice/sync/new?page=0&size=20",
      SERIAL_NO: "deviceservice/devices/serialno",
      DEVICE_HISTORY: "deviceservice/devices/history/serialno",
      DEVICE_VERIFY: "deviceservice/devices/verify/serialno",
      LOCATION_CATEGORY: "deviceservice/reports/locationCategory",
      CATEGORY: "deviceservice/reports/category",
      POLE_NUMBER_DUPLICATE: "deviceservice/devices/poleno",
      LAMP_BRAND_NAME: "deviceservice/reports/lampBrandName",
      DEVICE_SYNC: "deviceservice/sync",
      DEVICE_REQUEST: "deviceservice/request",
      UPLOAD_SNAPS: "deviceservice/images/snaps",
      TEST_3: "deviceservice/request/test3",
      HISTORY: "deviceservice/devices/history/serialno?serialNo=",
    },
  },
} as const;
