import { setContext } from "apollo-link-context";
import { rot13 } from "../helpers/encoder";

// export function SetUserToken(token: string) {
//   localStorage.setItem(`${GetAppKey()}-token`, token);
// }

// export function ClearUserToken() {
//   localStorage.removeItem(`${GetAppKey()}-token`);
// }

// export function GetUserToken() {
//   return localStorage.getItem(`${GetAppKey()}-token`) || "";
// }

export type AppName = "ADMIN" | "SHOP" | "WRITER" | "EXPERT" | "USER" | "STAFF";
export const APPS: {
  name: AppName;
  path: string;
  role: string;
}[] = [
  {
    name: "ADMIN",
    path: "admin",
    role: "admin",
  },
  {
    name: "SHOP",
    path: "shop",
    role: "shop",
  },
  {
    name: "WRITER",
    path: "writer",
    role: "writer",
  },
  {
    name: "EXPERT",
    path: "expert",
    role: "expert",
  },
  {
    name: "STAFF",
    path: "staff",
    role: "staff",
  },
  {
    name: "USER",
    path: "",
    role: "endUser",
  },
];

export const APP_KEYS = APPS.map((app) => app.name).reduce(
  (keys, name) => ({ ...keys, [name]: rot13(name) }),
  {}
);

export function GetApp() {
  const pathname = typeof window !== "undefined" ? location.pathname : "";
  for (const app of APPS) {
    if (app.path) {
      if (pathname == `/${app.path}` || pathname.startsWith(`/${app.path}/`)) {
        return app;
      } else {
        continue;
      }
    } else {
      return app;
    }
  }
}

export function GetAppKey() {
  return APP_KEYS[GetApp().name];
}

export function GetCurrentToken() {
  let token = GetUserToken();
  return token;
}

const app = GetApp();
const appKey = GetAppKey();
// Comment New Authentication's Code
// export const AuthLink = setContext((_, { headers, ...ctx }) => {
//   // get the authentication token from local storage if it exists
//   return new Promise((resolve) => {
//     let token = ctx?.token || GetCurrentToken();
//     let roleId = ctx?.roleId || sessionStorage.getItem(app.role);
//     const context = {
//       headers: {
//         ...headers,
//         "x-role": JSON.parse(roleId),
//         "x-app": appKey,
//         ...(token && token !== "undefined"
//           ? {
//               "x-token": token,
//             }
//           : {}),
//       },
//     };
//     // return the headers to the context so httpLink can read them
//     resolve(context);
//   });
// });

//Begin: Old Authentication's Code
export function SetUserToken(token: string, storage = localStorage) {
  storage.setItem("user-token", token);
}

export function ClearUserToken() {
  localStorage.removeItem("user-token");
}

export function GetUserToken() {
  return localStorage.getItem("user-token") || "";
}
export function SetMemberToken(token: string, storage = localStorage) {
  storage.setItem("member-token", token);
}

export function ClearMemberToken() {
  localStorage.removeItem("member-token");
}

export function GetMemberToken() {
  return localStorage.getItem("member-token") || "";
}

export function SetExpertToken(token: string, storage = localStorage) {
  storage.setItem("expert-token", token);
}

export function ClearExpertToken() {
  localStorage.removeItem("expert-token");
}

export function GetExpertToken() {
  return localStorage.getItem("expert-token") || "";
}

export function SetWriterToken(token: string, storage = localStorage) {
  storage.setItem("writer-token", token);
}

export function ClearWriterToken() {
  localStorage.removeItem("writer-token");
}

export function GetWriterToken() {
  return localStorage.getItem("writer-token") || "";
}

export function SetStaffToken(token: string, storage = localStorage) {
  storage.setItem("staff-token", token);
}

export function ClearStaffToken() {
  localStorage.removeItem("staff-token");
}

export function GetStaffToken() {
  return localStorage.getItem("staff-token") || "";
}

export function SetGlobalCustomerToken(token: string, storage = localStorage) {
  storage.setItem("global-customer-token", token);
}

export function ClearGlobalCustomerToken() {
  localStorage.removeItem("global-customer-token");
}

export function GetGlobalCustomerToken() {
  return localStorage.getItem("global-customer-token") || "";
}
export function SetCustomerToken(token: string, shopCode: string) {
  localStorage.setItem((shopCode ? `${shopCode}-` : ``) + "customer-token", token);
}

export function GetCustomerToken(shopCode: string) {
  return localStorage.getItem((shopCode ? `${shopCode}-` : ``) + "customer-token") || "";
}

export function ClearCustomerToken(shopCode: string) {
  localStorage.removeItem((shopCode ? `${shopCode}-` : ``) + "customer-token");
}

export function GetAnonymousToken(shopCode: string) {
  return sessionStorage.getItem((shopCode ? `${shopCode}-` : ``) + "anonymous-token") || "";
}

export function ClearAnonymousToken(shopCode: string) {
  localStorage.removeItem((shopCode ? `${shopCode}-` : ``) + "anonymous-token");
}

export function SetAnonymousToken(token: string, shopCode: string) {
  sessionStorage.setItem((shopCode ? `${shopCode}-` : ``) + "anonymous-token", token);
}

export function GetIP() {
  return localStorage.getItem("user-ip") || "";
}

export function SetIP(ip: string) {
  return localStorage.setItem("user-ip", ip);
}

export function getCurrentToken() {
  let token;
  const pathname = location.pathname;

  const shopCode = sessionStorage.getItem("shopCode");
  const anonymousToken = GetAnonymousToken(shopCode);
  const globalCustomerToken = GetGlobalCustomerToken();
  if (pathname == "/shop" || pathname.startsWith("/shop/")) {
    token = GetMemberToken();
  } else if (pathname == "/admin" || pathname.startsWith("/admin/")) {
    token = GetUserToken();
  } else if (pathname == "/profile" || pathname.startsWith("/profile/")) {
    token = GetGlobalCustomerToken();
  } else if (pathname == "/writer" || pathname.startsWith("/writer/")) {
    token = GetWriterToken();
  } else if (pathname == "/expert" || pathname.startsWith("/expert/")) {
    token = GetExpertToken();
  } else if (pathname == "/staff" || pathname.startsWith("/staff/")) {
    token = GetStaffToken();
  } else if (pathname == "/store" || pathname.startsWith("/store/")) {
    const customerToken = GetCustomerToken(shopCode);
    token = customerToken || anonymousToken || globalCustomerToken;
  } else {
    token = globalCustomerToken;
  }
  return token;
}

export const AuthLink = setContext((_, { headers, ...ctx }) => {
  // get the authentication token from local storage if it exists

  return new Promise((resolve) => {
    let token;
    switch (ctx?.token) {
      case "member": {
        token = GetMemberToken();
        break;
      }
      case "user": {
        token = GetUserToken();
        break;
      }
      case "writer": {
        token = GetWriterToken();
        break;
      }
      case "expert": {
        token = GetExpertToken();
        break;
      }
      case "staff": {
        token = GetStaffToken();
        break;
      }
      case "customer": {
        const shopCode = sessionStorage.getItem("shopCode");
        token = GetCustomerToken(shopCode);
        break;
      }
      case "anonymous": {
        const shopCode = sessionStorage.getItem("shopCode");
        token = GetAnonymousToken(shopCode);
        break;
      }
      case "global-customer": {
        token = GetGlobalCustomerToken();
        break;
      }
      default:
        token = ctx?.token || getCurrentToken();
    }
    const ip = GetIP();
    const context = {
      headers: {
        ...headers,
        ...(token && token !== "undefined"
          ? {
              "x-token": token,
            }
          : {}),
        ...(ip && ip !== "undefined"
          ? {
              "x-forwarded-for": ip,
            }
          : {}),
      },
    };
    // return the headers to the context so httpLink can read them
    resolve(context);
  });
});

//End: Old Authentication's Code
