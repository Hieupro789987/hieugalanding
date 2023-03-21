import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ClearExpertToken,
  ClearGlobalCustomerToken,
  ClearMemberToken,
  ClearStaffToken,
  ClearUserToken,
  ClearWriterToken,
  GetApp,
  GetExpertToken,
  GetGlobalCustomerToken,
  GetMemberToken,
  GetStaffToken,
  GetWriterToken,
  SetExpertToken,
  SetGlobalCustomerToken,
  SetMemberToken,
  SetStaffToken,
  SetUserToken,
  SetWriterToken,
} from "../graphql/auth.link";
import { User, UserService } from "../repo/user.repo";
import { v4 as uuidv4 } from "uuid";
import { firebase } from "../../lib/helpers/firebase";
import { Expert, ExpertService } from "../repo/expert/expert.repo";
import {
  GlobalCustomer,
  GlobalCustomerService,
} from "../repo/global-customer/global-customer.repo";
import { ReferralCustomerService } from "../repo/global-customer/referral-customer.repo";
import { GraphService } from "../repo/graph.repo";
import { Member, MemberService } from "../repo/member.repo";
import { Writer, WriterService } from "../repo/writer/writer.repo";
import { useToast } from "./toast-provider";
import { Staff, StaffService, STAFF_SCOPE } from "../repo/staff.repo";
import {
  ScopePermission,
  StaffPermission,
  STAFF_SCOPE_PERMISSIONS,
} from "../constants/staff-scopes.const";

export const AuthContext = createContext<
  Partial<{
    user: User;
    endUser: GlobalCustomer;
    setUser: (user: User) => void;
    login: (username: string, password: string) => Promise<any>;
    logout: () => Promise<any>;

    setUserRoleData: (roleName: string, roleData: any) => void;
    writer: Writer;
    expert: Expert;

    redirectToLogin: () => any;
    redirectToLoggedIn: () => any;

    updateExpertSelf: (data) => Promise<Expert>;
    member: Member;

    loginUser: (email: string, password: string) => Promise<any>;
    updatePasswordSelf: (oldPassword: string, newPassword: string) => Promise<any>;

    logoutUser: () => Promise<any>;
    loginMember: (username: string, password: string) => Promise<any>;
    logoutMember: () => Promise<any>;
    memberUpdateMe: (data) => Promise<Member>;

    staff: Staff;
    loginStaff: (memberCode: string, username: string, password: string) => Promise<any>;
    logoutStaff: () => Promise<any>;
    redirectToStaff: Function;
    redirectToStaffLogin: Function;
    staffUpdateMe: (data) => Promise<Staff>;
    staffPermission: (permission: StaffPermission) => ScopePermission;

    //Begin: Old Authentication's Code
    loginWriter: (username: string, password: string) => Promise<any>;
    logoutWriter: () => Promise<any>;
    redirectToWriter: Function;
    redirectToWriterLogin: Function;

    loginExpert: (username: string, password: string) => Promise<any>;
    logoutExpert: () => Promise<any>;
    redirectToExpert: Function;
    redirectToExpertLogin: Function;

    historyRouteGlobalCustomer: Function;
    redirectToGlobalCustomer: Function;
    globalCustomer: GlobalCustomer;
    setGlobalCustomer: Function;
    loginGlobalCustomerByPhone: (idToken: string) => Promise<any>;
    loginGlobalCustomerByPhoneAndPassword: (phone: string, password: string) => Promise<any>;
    logoutGlobalCustomer: () => Promise<any>;

    redirectToAdminLogin: Function;
    redirectToAdmin: Function;

    setExpert: Function;
    setWriter: Function;
    //Begin: Old Authentication's Code

    signInWithPhoneNumber: (phone: string) => Promise<void>;
    verifyPhoneMember: (phone: string) => Promise<string>;
    confirmResult: firebase.auth.ConfirmationResult;
    verifier: any;
    setWrapper: Function;
    convertPhone: (phone: string, prefix: string) => string;
  }>
>({});

export const PRE_LOGIN_PATHNAME = "pre-login-pathname";

export function AuthProvider(props) {
  // undefined = chưa authenticated, null = chưa đăng nhập
  const toast = useToast();
  const router = useRouter();
  const verifier = useRef<firebase.auth.RecaptchaVerifier>();
  const [user, setUser] = useState<User>(undefined);
  const [member, setMember] = useState<Member>(undefined);
  const [confirmResult, setConfirmResult] = useState<firebase.auth.ConfirmationResult>();
  const [wrapper, setWrapper] = useState<HTMLDivElement>();

  //Begin: Old Authentication's Code
  const [globalCustomer, setGlobalCustomer] = useState<GlobalCustomer>(undefined);

  const mode: "user" | "member" | "customer" | "writer" | "expert" | "staff" = useMemo(() => {
    const pathname = router.pathname;
    if (pathname == "/admin" || pathname.startsWith("/admin/")) {
      return "user";
    } else if (pathname == "/shop" || pathname.startsWith("/shop/")) {
      return "member";
    } else if (pathname == "/writer" || pathname.startsWith("/writer/")) {
      return "writer";
    } else if (pathname == "/expert" || pathname.startsWith("/expert/")) {
      return "expert";
    } else if (pathname == "/staff" || pathname.startsWith("/staff/")) {
      return "staff";
    } else {
      return "customer";
    }
  }, [router.pathname]);

  const loadExpert = async () => {
    let expertToken = GetExpertToken();
    if (expertToken) {
      if (expert === undefined) {
        try {
          let res = await GraphService.mutate({
            mutation: `
            expertLoginByToken {
                ${ExpertService.fullFragment}
              }
            `,
          });
          setExpert(res.data.g0);
        } catch (err) {
          ClearExpertToken();
          setExpert(null);
          throw err.message;
        }
      } else {
        return expert;
      }
    } else {
      ClearExpertToken();
      setExpert(null);
    }
  };

  const loadWriter = async () => {
    let writerToken = GetWriterToken();
    if (writerToken) {
      if (writer === undefined) {
        try {
          let res = await GraphService.query({
            query: `
              writerGetMe {
                ${WriterService.fullFragment}
              }
            `,
          });
          setWriter(res.data.g0);
        } catch (err) {
          ClearWriterToken();
          setWriter(null);
          throw err.message;
        }
      } else {
        return writer;
      }
    } else {
      ClearWriterToken();
      setWriter(null);
    }
  };

  const loadStaff = async () => {
    let staffToken = GetStaffToken();
    if (staffToken) {
      if (staff === undefined) {
        try {
          let res = await GraphService.query({
            query: `
              staffGetMe {
                ${StaffService.fullFragment}
              }
            `,
          });
          setStaff(res.data.g0);
        } catch (err) {
          ClearStaffToken();
          setStaff(null);
          throw err.message;
        }
      } else {
        return staff;
      }
    } else {
      ClearStaffToken();
      setStaff(null);
    }
  };

  const loadGlobalCustomer = async () => {
    let globalCustomerToken = GetGlobalCustomerToken();
    if (globalCustomerToken) {
      if (globalCustomer === undefined) {
        try {
          let res = await GraphService.query({
            query: `
              globalCustomerGetMe {
                ${GlobalCustomerService.fullFragment}
              }
            `,
            token: globalCustomerToken,
          });
          setGlobalCustomer(res.data.g0);
        } catch (err) {
          ClearGlobalCustomerToken();
          setGlobalCustomer(null);
          throw err.message;
        }
      } else {
        return globalCustomer;
      }
    } else {
      ClearGlobalCustomerToken();
      setGlobalCustomer(null);
    }
  };

  const loadUser = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        UserService.login(await user.getIdToken())
          .then((res) => {
            const { user, token } = res;
            let decodedToken = jwt_decode(token) as {
              exp: number;
              role: string;
            };
            if (Date.now() >= decodedToken.exp * 1000) {
              ClearUserToken();
              setUser(null);
              return;
            } else {
              SetUserToken(token);
              setUser(user);
            }
          })
          .catch((err) => {
            ClearUserToken();
            setUser(null);
          });
      } else {
        ClearUserToken();
        setUser(null);
      }
    });
  };

  const loadMember = async () => {
    let memberToken = GetMemberToken();
    if (memberToken) {
      if (member === undefined) {
        try {
          let res = await GraphService.query({
            query: `
              memberGetMe {
                ${MemberService.fullFragment}
              }
            `,
          });
          setMember(res.data.g0);
        } catch (err) {
          ClearMemberToken();
          setMember(null);
          throw err.message;
        }
      } else {
        return member;
      }
    } else {
      ClearMemberToken();
      setMember(null);
    }
  };

  useEffect(() => {
    switch (mode) {
      case "user": {
        loadUser();
        break;
      }
      case "member": {
        loadMember();
        break;
      }
      case "writer": {
        loadWriter();
        break;
      }
      case "expert": {
        loadExpert();
        break;
      }
      case "staff": {
        loadStaff();
        break;
      }
      case "customer": {
        loadGlobalCustomer();
        break;
      }
    }
  }, [mode]);

  useEffect(() => {
    if (globalCustomer) {
      // Record RefId to GlobalCustomer if RefId exist on localStorage
      const refId = GlobalCustomerService.getRefId();
      if (refId) {
        ReferralCustomerService.recordReferralCustomer(refId).then(console.log);
      }
    }
  }, [globalCustomer]);

  // Expert
  const [expert, setExpert] = useState<Expert>(undefined);

  const loginExpert = async (email: string, password: string) => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device-id", deviceId);
    }

    let deviceToken = "";
    try {
      const messaging = firebase.messaging();
      deviceToken = await messaging.getToken({ vapidKey: VAPID_KEY });
    } catch (err) {
      console.error(err);
    }

    try {
      let res = await GraphService.mutate({
        mutation: `
        expertLogin(email: "${email}", password: "${password}", deviceId: "${deviceId}", deviceToken: "${deviceToken}") {
            expert { ${ExpertService.fullFragment} } token
          }
        `,
      });
      SetExpertToken(res.data.g0.token);
      setExpert(res.data.g0.expert);
    } catch (err) {
      ClearExpertToken();
      setExpert(null);
      throw err.message;
    }
  };

  const logoutExpert = async () => {
    localStorage.removeItem("device-id");
    ClearExpertToken();
    setExpert(null);
    await ExpertService.clearStore();
  };

  const redirectToExpertLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/expert/login");
  };

  const redirectToExpert = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (expert) {
      if (pathname?.includes("/expert")) router.replace(pathname || "/expert");
      else router.replace("/expert");
    } else {
      router.replace("/");
    }
  };

  // Staff
  const [staff, setStaff] = useState<Staff>(undefined);

  const loginStaff = async (memberCode: string, username: string, password: string) => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device-id", deviceId);
    }

    let deviceToken = "";
    try {
      const messaging = firebase.messaging();
      deviceToken = await messaging.getToken({ vapidKey: VAPID_KEY });
    } catch (err) {
      console.error(err);
    }

    try {
      let res = await GraphService.mutate({
        mutation: `
        loginStaff(memberCode: "${memberCode}", username: "${username}", password: "${password}", deviceId: "${deviceId}", deviceToken: "${deviceToken}") {
            staff { ${StaffService.fullFragment} } token
          }
        `,
      });
      SetStaffToken(res.data.g0.token);
      setStaff(res.data.g0.staff);
    } catch (err) {
      ClearStaffToken();
      setStaff(null);
      throw err.message;
    }
  };

  const logoutStaff = async () => {
    localStorage.removeItem("device-id");
    ClearStaffToken();
    setStaff(null);
    await StaffService.clearStore();
  };

  const redirectToStaffLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/staff/login");
  };

  const redirectToStaff = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (staff) {
      if (pathname?.includes("/staff")) router.replace(pathname || "/staff");
      else router.replace("/staff");
    } else {
      router.replace("/");
    }
  };

  const staffUpdateMe = async (data) => {
    return StaffService.mutate({
      mutation: `
        staffUpdateMe(data: $data) {
          ${StaffService.fullFragment}
        }
      `,
      variablesParams: `($data: StaffUpdateMeInput!)`,
      options: {
        variables: {
          data,
        },
      },
    })
      .then((res) => {
        setStaff(res.data.g0);
        return res.data.g0;
      })
      .catch((err) => {
        throw err;
      });
  };

  const staffPermission = (permission: StaffPermission): ScopePermission => {
    let flag: ScopePermission = false;
    if (staff) {
      if (["WAREHOUSE", "ORDER"].every((i: STAFF_SCOPE) => staff.scopes.includes(i))) {
        flag = true;
      } else {
        for (let scope of staff.scopes) {
          const scopePermission: ScopePermission = STAFF_SCOPE_PERMISSIONS[scope][permission];
          flag = flag || scopePermission;
        }
      }
    } else if (member) {
      flag = true;
    }
    return flag;
  };

  //Writer
  const [writer, setWriter] = useState<Writer>(undefined);

  const loginWriter = async (email: string, password: string) => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device-id", deviceId);
    }

    let deviceToken = "";
    try {
      const messaging = firebase.messaging();
      deviceToken = await messaging.getToken({ vapidKey: VAPID_KEY });
    } catch (err) {
      console.error(err);
    }

    try {
      let res = await GraphService.mutate({
        mutation: `
        loginWriter(email: "${email}", password: "${password}", deviceId: "${deviceId}", deviceToken: "${deviceToken}") {
            writer { ${WriterService.fullFragment} } token
          }
        `,
      });
      SetWriterToken(res.data.g0.token);
      setWriter(res.data.g0.writer);
    } catch (err) {
      ClearWriterToken();
      setWriter(null);
      throw err.message;
    }
  };

  const logoutWriter = async () => {
    localStorage.removeItem("device-id");
    ClearWriterToken();
    setWriter(null);
    await WriterService.clearStore();
  };

  const redirectToWriterLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/writer/login");
  };

  const redirectToWriter = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (writer) {
      if (pathname?.includes("/writer")) router.replace(pathname || "/writer");
      else router.replace("/writer");
    } else {
      router.replace("/");
    }
  };

  //GlobalCustomer

  const loginGlobalCustomerByPhone = async (idToken: string) => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device-id", deviceId);
    }

    let deviceToken = "";
    try {
      const messaging = firebase.messaging();
      deviceToken = await messaging.getToken({ vapidKey: VAPID_KEY });
    } catch (err) {
      console.error(err);
    }

    try {
      let res = await GraphService.mutate({
        mutation: `
          loginGlobalCustomerByPhone(idToken: "${idToken}", deviceId: "${deviceId}", deviceToken: "${deviceToken}") {
            globalCustomer { ${GlobalCustomerService.fullFragment} } token
          }
        `,
      });
      SetGlobalCustomerToken(res.data.g0.token);
      setGlobalCustomer(res.data.g0.globalCustomer);
    } catch (err) {
      ClearGlobalCustomerToken();
      setGlobalCustomer(null);
      throw err.message;
    }
  };

  const historyRouteGlobalCustomer = () => {
    if (location.pathname.includes("/update-info")) return;
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
  };
  const redirectToGlobalCustomer = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (globalCustomer) {
      if (pathname?.includes("/")) router.replace(pathname || "/");
      else router.replace("/");
    } else {
      router.replace("/");
    }
  };

  const loginGlobalCustomerByPhoneAndPassword = async (phone: string, password: string) => {
    try {
      let res = await GraphService.mutate({
        mutation: `
        loginGlobalCustomerByPhoneAndPassword(phone: "${phone}", password: "${password}") {
            globalCustomer { ${GlobalCustomerService.fullFragment} } token
          }
        `,
      });
      SetGlobalCustomerToken(res.data.g0.token);
      setGlobalCustomer(res.data.g0.globalCustomer);
    } catch (err) {
      ClearGlobalCustomerToken();
      setGlobalCustomer(null);
      throw err.message;
    }
  };

  const logoutGlobalCustomer = async () => {
    router.replace("/");
    ClearGlobalCustomerToken();
    setGlobalCustomer(null);
    await GlobalCustomerService.clearStore();
  };

  const redirectToAdminLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, location.pathname);
    router.replace("/admin/login");
  };

  const redirectToAdmin = () => {
    let pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    if (user) {
      if (pathname?.includes("/admin")) router.replace(pathname || "/admin");
      else router.replace("/admin");
    } else {
      router.replace("/");
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const { user, token } = await UserService.login(await userCredential.user.getIdToken());
      SetUserToken(token);
      setUser(user);
    } catch (err) {
      console.error(err);
      ClearUserToken();
      setUser(null);
      let message = "";
      switch (err.code) {
        case "auth/user-not-found": {
          message = "Không tìm thấy người dùng";
          break;
        }
        case "auth/invalid-email": {
          message = "Email không hợp lệ";
          break;
        }
        case "auth/wrong-password": {
          message = "Sai mật khẩu";
          break;
        }
        default: {
          message = "Có lỗi xảy ra";
          break;
        }
      }
      throw new Error(message);
    }
  };

  const logoutUser = async () => {
    await firebase.auth().signOut();
    await UserService.clearStore();
  };

  const VAPID_KEY = `BKh34EjqetrcY6C1ZSSzbVXLlk0CZElMcjByujFcZUpgqbAQ8mAhWDl62g-EhsWx9_r7fz_jp91PikA9IVsUvgg`;

  //End: Old Authentication's Code

  // const writer = useMemo(() => {
  //   return getUserRoleData(userRoles, "writer");
  // }, [userRoles]);

  // const login = async (username: string, password: string) => {
  //   try {
  //     let parsedUsername = username.trim();
  //     if (parsedUsername.startsWith("0")) parsedUsername = "84" + parsedUsername.slice(1);
  //     if (!parsedUsername.startsWith("+")) parsedUsername = "+" + parsedUsername;

  //     const res = await UserService.login(parsedUsername, password.trim());
  //     setUser(res.user);
  //     setUserRoles(res.userRoles);
  //     SetUserToken(res.token);
  //   } catch (err) {
  //     toast.error("Đăng nhập thất bại", err.message);
  //   }
  // };

  // const loginByToken = async () => {
  //   try {
  //     const res = await UserService.loginByToken();
  //     setUser(res.user);
  //     setUserRoles(res.userRoles);
  //     console.log(res);
  //   } catch (err) {}
  // };

  const logout = async () => {
    ClearUserToken();
    setUser(null);
  };

  // const updatePassword = async (oldPassword: string, newPassword: string) => {
  //   try {
  //     await UserService.updatePassword(oldPassword, newPassword);
  //     return "Cập nhật mật khẩu thành công";
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(`Lỗi: ${err.message}`);
  //   }
  // };

  const redirectToLogin = () => {
    sessionStorage.setItem(PRE_LOGIN_PATHNAME, router.asPath);
    const app = GetApp();
    if (app.path) {
      router.push(`/${app.path}/login`);
    } else {
      router.push("/login");
    }
  };

  const redirectToLoggedIn = () => {
    const pathname = sessionStorage.getItem(PRE_LOGIN_PATHNAME);
    const app = GetApp();
    if (app.path) {
      if (pathname == `/${app.path}` || pathname?.startsWith(`/${app.path}/`)) {
        router.replace(pathname);
      } else {
        router.replace(`/${app.path}`);
      }
    } else {
      router.replace("/");
    }
  };

  function convertPhone(phone: string, prefix = "+84") {
    const txt = "" + phone;
    return prefix + txt.trim().replace(/^84/, "").replace(/^\+84/, "").replace(/^0/, "");
  }

  const appVerifier = () => {
    if (verifier.current && wrapper) {
      verifier.current.clear();
      wrapper.innerHTML = `<div id="recaptcha-container"></div>`;
    }

    verifier.current = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {},
      "expired-callback": () => {},
    });
  };

  const signInWithPhoneNumber = async (phone) => {
    appVerifier();
    const confirmResult = await firebase
      .auth()
      .signInWithPhoneNumber(convertPhone(phone), verifier.current);
    setConfirmResult(confirmResult);
  };
  const verifyPhoneMember = async (phone: string) => {
    appVerifier();
    var provider = new firebase.auth.PhoneAuthProvider();
    const idToken = await provider.verifyPhoneNumber(convertPhone(phone), verifier.current);
    return idToken;
  };

  const loginMember = async (username: string, password: string) => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device-id", deviceId);
    }

    let deviceToken = "";
    try {
      const messaging = firebase.messaging();
      deviceToken = await messaging.getToken({ vapidKey: VAPID_KEY });
    } catch (err) {
      console.error(err);
    }

    try {
      let res = await GraphService.mutate({
        mutation: `
          loginMemberByPassword(username: "${username}", password: "${password}", deviceId: "${deviceId}", deviceToken: "${deviceToken}") {
            member { ${MemberService.fullFragment} } token
          }
        `,
      });
      SetMemberToken(res.data.g0.token);
      setMember(res.data.g0.member);
    } catch (err) {
      ClearMemberToken();
      setMember(null);
      throw err.message;
    }
  };

  const logoutMember = async () => {
    sessionStorage.removeItem(`stepChecked${member.code}`);
    localStorage.removeItem("device-id");
    ClearMemberToken();
    setMember(null);
    await MemberService.clearStore();
  };

  const memberUpdateMe = async (data) => {
    return MemberService.mutate({
      mutation: `
        memberUpdateMe(data: $data) {
          ${MemberService.fullFragment}
        }
      `,
      variablesParams: `($data: UpdateMemberInput!)`,
      options: {
        variables: {
          data,
        },
      },
    })
      .then((res) => {
        setMember(res.data.g0);
        return res.data.g0;
      })
      .catch((err) => {
        throw err;
      });
  };

  // useEffect(() => {
  //   const token = GetUserToken();
  //   if (token) {
  //     let decodedToken = jwt_decode(token) as {
  //       exp: number;
  //       role: string;
  //     };
  //     if (Date.now() >= decodedToken.exp * 1000) {
  //       ClearUserToken();
  //       setUser(null);
  //       return;
  //     } else {
  //       loginByToken();
  //     }
  //   } else {
  //     setUser(null);
  //   }
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        // login,
        logout,
        // updatePasswordSelf,
        user,
        setUser,
        writer,
        member,
        expert,
        // globalCustomer,
        historyRouteGlobalCustomer,
        redirectToGlobalCustomer,
        globalCustomer,
        setGlobalCustomer,
        setExpert,
        setWriter,
        // loginUser,
        // logoutUser,
        loginMember,
        logoutMember,

        memberUpdateMe,
        // setGlobalCustomer,
        // globalCustomerUpdateMe,
        verifyPhoneMember,
        // loginWriter,
        // logoutWriter,
        // loginExpert,
        // logoutExpert,

        signInWithPhoneNumber,
        confirmResult,
        setWrapper,
        convertPhone,

        //Begin: Old Authentication's Code
        staff,
        loginStaff,
        logoutStaff,
        redirectToStaff,
        redirectToStaffLogin,
        staffUpdateMe,
        staffPermission,

        loginExpert,
        logoutExpert,
        redirectToExpert,
        redirectToExpertLogin,

        loginWriter,
        logoutWriter,
        redirectToWriter,
        redirectToWriterLogin,

        loginGlobalCustomerByPhone,
        loginGlobalCustomerByPhoneAndPassword,
        logoutGlobalCustomer,

        redirectToAdminLogin,
        redirectToAdmin,
        loginUser,
        logoutUser,

        redirectToLogin,
        redirectToLoggedIn,
        //End: Old Authentication's Code
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
