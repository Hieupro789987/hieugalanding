import { orderBy } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Geocode from "react-geocode";
import { GOOGLE_MAPS_API_KEY } from "../constants/google.const";
import { ClearCustomerToken, GetAnonymousToken, SetCustomerToken } from "../graphql/auth.link";
import { Customer, CustomerService } from "../repo/customer.repo";
import { GlobalCustomerService } from "../repo/global-customer/global-customer.repo";
import { NotificationService } from "../repo/notification.repo";
import { ShopBranch, ShopBranchService } from "../repo/shop-branch.repo";
import { AnalyticConfig } from "../repo/shop-config.repo";
import { Shop, ShopService } from "../repo/shop.repo";
import { useAuth } from "./auth-provider";
import { useLocation } from "./location-provider";
import { useToast } from "./toast-provider";

export const CUSTOMER_LOGIN_PATHNAME = "customer-login-pathname";
export const ShopContext = createContext<
  Partial<{
    shopCode: string;
    shop: Shop;
    customer: Customer;
    setCustomer: (val: Customer) => any;
    loginCustomer: (phone: string, name?: string) => any;
    loginCustomerOTP: (phone: string, name: string, otp: string) => any;
    logoutCustomer: Function;
    shopBranches: ShopBranch[];
    selectedBranch: ShopBranch;
    setSelectedBranch: Function;
    getCustomer: Function;
    redirectToCustomerLogin: Function;
    analyticConfig: AnalyticConfig;
    notificationCount: number;
    loadNotificationCount: () => Promise<any>;
  }>
>({});
export function ShopProvider({ code, ...props }: { code: string } & ReactProps) {
  const router = useRouter();
  let [shop, setShop] = useState<Shop>();
  let [customer, setCustomer] = useState<Customer>();
  let [shopBranches, setShopBranches] = useState<ShopBranch[]>([]);
  let [selectedBranch, setSelectedBranch] = useState<ShopBranch>();
  const hasCheckCustomer = useMemo(() => customer !== undefined, [customer]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { userLocation, setUserLocation } = useLocation();
  const { globalCustomer } = useAuth();
  const loadNotificationCount = async () => {
    if (globalCustomer === undefined || !shop) return;
    if (globalCustomer) {
      await NotificationService.getAll({
        query: {
          limit: 0,
          filter: {
            seen: false,
          },
        },
        fragment: "id",
      }).then((res) => {
        setNotificationCount(res.data.length);
      });
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [globalCustomer, code]);

  const loadCustomer = async () => {
    if (globalCustomer === undefined) return;
    setCustomer(undefined);
    if (globalCustomer) {
      GlobalCustomerService.getCustomerToken(code)
        .then((res) => {
          SetCustomerToken(res.token, code);
          setCustomer(res.customer);
        })
        .catch((err) => {
          console.error(err);
          ClearCustomerToken(code);
          setCustomer(null);
        });
    } else if (globalCustomer === null) {
      ClearCustomerToken(code);
      setCustomer(null);
    }
  };

  let [analyticConfig] = useState<AnalyticConfig>();
  const toast = useToast();

  async function loadShop() {
    const anonymousToken = GetAnonymousToken(code);
    if (!anonymousToken) await ShopService.loginAnonymous(code);

    try {
      console.log("load shop");
      await ShopService.getShopData().then((res) => {
        if (res.activated) {
          setShop(res);
        } else {
          toast.warn("Cửa hàng đang tạm đóng cửa");
          router.replace(location.origin);
        }
      });
      loadNotificationCount();
    } catch (err) {
      toast.warn("Không thể lấy thông tin cửa hàng. " + err.message);
    }
  }

  // async function loadCustomer(customerToken) {
  //   if (!customerToken) {
  //     let userPhone = localStorage.getItem("userPhone");
  //     let customerName = localStorage.getItem("customerName");
  //     if (userPhone && customerName && !shop.config.smsOtp) {
  //       let customerData = await CustomerService.loginCustomerByPhone(userPhone, customerName);
  //       if (customerData) {
  //         SetCustomerToken(customerData.token, code);
  //         setCustomer(customerData.customer);
  //       } else {
  //         setCustomer(null);
  //       }
  //     } else {
  //       setCustomer(null);
  //     }
  //   } else {
  //     let decodedToken = jwt_decode(customerToken) as {
  //       exp: number;
  //       role: string;
  //       customer: Customer;
  //     };
  //     if (Date.now() >= decodedToken.exp * 1000) {
  //       ClearCustomerToken(code);
  //       setCustomer(null);
  //       return false;
  //     } else {
  //       await getCustomer();
  //     }
  //   }
  // }

  async function getCustomer() {
    let res = await CustomerService.getCustomer();
    if (res) {
      setCustomer(res);
    } else {
      setCustomer(null);
    }
  }

  function loadBrand(coords?: { fullAddress: string; lng: number; lat: number }) {
    ShopBranchService.getAll({
      fragment: `${ShopBranchService.fullFragment} ${
        coords ? `distance(lat:${coords.lat}, lng:${coords.lng})` : ""
      } `,
      cache: false,
    }).then((res) => {
      let branches = orderBy(res.data, (o) => o.distance);
      setShopBranches(branches);
      let nearest = branches.findIndex((item) => item.isOpen);
      if (nearest) {
        selectedBranch = branches[nearest];
      } else {
        selectedBranch = branches[0];
      }
      setSelectedBranch(selectedBranch);
    });
  }

  async function loginCustomer(phone: string, name?: string) {
    if (phone) {
      localStorage.setItem("customerName", name);
      let customerData = await CustomerService.loginCustomerByPhone(phone, name);
      if (customerData) {
        SetCustomerToken(customerData.token, code);
        setCustomer(cloneDeep(customerData.customer));
        toast.success("Đăng nhập thành công!");
        closeLogin();
        localStorage.setItem("userPhone", customerData.customer.phone);
        return true;
      } else {
        setCustomer(null);
        return false;
      }
    } else {
      setCustomer(null);
      return false;
    }
  }

  async function loginCustomerOTP(phone: string, name: string, otp: string) {
    if (phone && otp) {
      localStorage.setItem("customerName", name);
      let customerData = await CustomerService.loginCustomerByPhone(phone, name, otp);
      if (customerData) {
        SetCustomerToken(customerData.token, code);
        setCustomer(cloneDeep(customerData.customer));
        toast.success("Đăng nhập thành công!");
        closeLogin();
        localStorage.setItem("userPhone", customerData.customer.phone);
        return true;
      } else {
        setCustomer(null);
        return false;
      }
    } else {
      setCustomer(null);
      return false;
    }
  }
  function logoutCustomer() {
    ClearCustomerToken(code);
    localStorage.removeItem("userPhone");
    localStorage.removeItem("customerName");
    setCustomer(null);
    if (router.pathname !== "/") {
      router.replace(`/store/${code}`);
    }
  }

  // let [deferredPrompt, setDeferredPrompt] = useState<Event>();
  // const checkInstallation = () => {
  //   console.log("CHECK INSTALLATION");
  //   window.addEventListener("beforeinstallprompt", (e) => {
  //     // Prevent the mini-infobar from appearing on mobile
  //     e.preventDefault();
  //     // Stash the event so it can be triggered later.
  //     console.log(`'beforeinstallprompt' event is firing.`);
  //     deferredPrompt = e;
  //     setDeferredPrompt(e);
  //     console.log("ehrerererer", e);
  //     // Update UI notify the user they can install the PWA
  //     // showInstallPromotion();
  //     console.log(`'beforeinstallprompt' event was fired.`);
  //   });
  // };

  // const installApp = () => {
  //   // Hide the app provided install promotion
  //   // hideInstallPromotion();
  //   // Show the install prompt
  //   deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   deferredPrompt.userChoice.then((choiceResult) => {
  //     if (choiceResult.outcome === "accepted") {
  //       console.log("User accepted the install prompt");
  //     } else {
  //       console.log("User dismissed the install prompt");
  //     }
  //   });
  // };

  useEffect(() => {
    Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
    Geocode.setLanguage("vi");
    Geocode.setRegion("vn");
  }, []);

  useEffect(() => {
    if (hasCheckCustomer) {
      if (code) {
        loadShop();
      } else {
        setShop(null);
      }
      return () => {
        setShop(null);
      };
    }
  }, [code, hasCheckCustomer]);

  useEffect(() => {
    if (!shop) return;
    if (userLocation !== undefined) {
      if (userLocation) {
        loadBrand(userLocation);
      } else {
        loadBrand();
      }
    }
  }, [userLocation, shop]);

  useEffect(() => {
    if (!shop) return;
    if (customer) {
      updateCustomerAll();
      if (!userLocation && customer.fullAddress && customer.latitude && customer.longitude) {
        setUserLocation({
          fullAddress: customer.fullAddress,
          lat: customer.latitude,
          lng: customer.longitude,
        });
      }
    } else {
      setNotificationCount(0);
    }
  }, [customer, shop]);

  async function updatePresenter() {
    const colCode = sessionStorage.getItem(code + "colCode");
    if (colCode) {
      let res = await CustomerService.updatePresenter(colCode);
      sessionStorage.removeItem(code + "colCode");
    }
  }

  async function updateCustomerPSID() {
    const psid = sessionStorage.getItem(code + "psid");
    if (psid) {
      await CustomerService.updateCustomerPSID(psid);
      sessionStorage.removeItem(code + "psid");
    }
  }
  async function updateCustomerFollowerId() {
    const followerId = sessionStorage.getItem(code + "followerId");
    if (followerId) {
      await CustomerService.updateCustomerFollowerId(followerId);
      sessionStorage.removeItem(code + "followerId");
    }
  }
  async function updateCustomerAll() {
    let tasks = [];
    tasks.push(updatePresenter());
    tasks.push(updateCustomerPSID());
    tasks.push(updateCustomerFollowerId());
    await Promise.all(tasks);
  }

  function closeLogin() {
    let path = sessionStorage.getItem(CUSTOMER_LOGIN_PATHNAME);
    sessionStorage.removeItem(CUSTOMER_LOGIN_PATHNAME);

    if (path && path.includes(`/store/${code}/collaborator`) && !shop.config.collaborator)
      path = `${code}`;
    if (path && path.includes(`/store/${code}/order`)) path = `/store/${code}/order`;

    if (path) {
      router.push(path);
    } else {
      router.push(`/store/${code}`);
    }
  }

  const redirectToCustomerLogin = () => {
    sessionStorage.setItem(CUSTOMER_LOGIN_PATHNAME, location.pathname);
    router.push("/login");
  };

  return (
    <ShopContext.Provider
      value={{
        shopCode: code,
        shop,
        customer,
        setCustomer,
        loginCustomer,
        loginCustomerOTP,
        logoutCustomer,
        shopBranches,
        selectedBranch,
        setSelectedBranch,
        getCustomer,
        redirectToCustomerLogin,
        analyticConfig,
        notificationCount,
        loadNotificationCount,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
}

export const useShopContext = () => useContext(ShopContext);
