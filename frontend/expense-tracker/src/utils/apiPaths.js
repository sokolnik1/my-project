export const BASE_URL = "http://localhost:8000/api/v1";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER_INFO: "/auth/getUser",
    BUDGET_LIMITS: "/auth/budget-limits",
    UPLOAD_IMAGE: "/auth/upload-image",
  },
  DASHBOARD: {
  GET_DATA: "/api/v1/dashboard",
},
  INCOME: {
    ADD_INCOME: "/income/add",
    GET_ALL_INCOME: "/income/get",
    DELETE_INCOME: (incomeId) => `/income/${incomeId}`,
    DOWNLOAD_INCOME: "/income/downloadexcel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/expense/add",
    GET_ALL_EXPENSE: "/expense/get",
    DELETE_EXPENSE: (expenseId) => `/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: "/expense/downloadexcel",
  },
};
