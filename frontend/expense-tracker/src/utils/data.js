import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
  } from "react-icons/lu";
  
  export const SIDE_MENU_DATA = [
    {
      id: "01",
      label: "Главная",
      icon: LuLayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "02",
      label: "Доходы",
      icon: LuWalletMinimal,
      path: "/income",
    },
    {
      id: "03",
      label: "Расходы",
      icon: LuHandCoins,
      path: "/expense",  // Исправлено с paths на path
    },
    {
      id: "06",
      label: "Выйти",
      icon: LuLogOut,
      path: "logout",
    },
  ];