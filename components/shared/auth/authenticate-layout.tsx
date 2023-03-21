import { useScreen } from "../../../lib/hooks/useScreen";

export interface UserProps {
  user?: "expert" | "endUser" | "writer" | "staff";
  title?: string;
  subTitle?: JSX.Element | string;
  children: JSX.Element;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}
export function AuthenticateLayout({
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  ...props
}: UserProps) {
  const screenLg = useScreen("lg");
  return (
    <AuthenticateBackground>
      <div className="lg:-translate-y-1/2 lg:-translate-x-1/2 lg:w-full lg:transform lg:absolute lg:top-1/2 lg:left-1/2 lg:px-36">
        <div className="flex flex-col lg:justify-around lg:flex-row">
          <div className="mt-6 mb-5 lg:mb-0">
            <img
              src={`/assets/img/${
                props.user === "expert"
                  ? "expert-logo"
                  : props.user === "writer"
                  ? "writer-logo"
                  : props.user === "staff"
                  ? "staff-logo"
                  : props.user === "endUser"
                  ? "customer"
                  : ""
              }.png`}
              alt={`${props.user}-logo`}
              className={screenLg ? "" : "w-36 mx-auto"}
            />
            <p className="mt-4 text-base font-bold leading-4 tracking-wide text-center lg:mt-6 lg:text-right lg:text-2xl text-primary">
              Công nghệ xanh, Sống an lành
            </p>
          </div>
          <div className={`bg-white rounded ${className}`}>
            {props.title && (
              <h2
                className={`mt-5 mb-2 text-2xl font-extrabold text-center text-accent ${titleClassName}`}
              >
                {props.title}
              </h2>
            )}
            {props.subTitle && (
              <p
                className={`m-auto font-bold text-center lg:w-96  lg:text-base text-sm text-neutralGrey ${subtitleClassName}`}
              >
                {props.subTitle}
              </p>
            )}
            {props.children}
          </div>
        </div>
      </div>
    </AuthenticateBackground>
  );
}

export function AuthenticateBackground({ ...props }) {
  const screenLg = useScreen("lg");
  return (
    <div
      style={{ backgroundImage: screenLg ? "url(/assets/img/writer-login-background.png)" : "" }}
      className={`${
        screenLg
          ? "relative flex flex-col min-h-screen bg-center bg-no-repeat bg-cover"
          : "main-container mt-32"
      }`}
    >
      {props.children}
    </div>
  );
}
