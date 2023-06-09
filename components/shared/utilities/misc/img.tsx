import { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { compressImage } from "../../../../lib/helpers/image";
import { ImageDialog } from "../dialog/image-dialog";

const defaultImage = "/assets/default/default.png";
const defaultAvatar = "/assets/default/avatar.png";

export interface ImgProps extends ReactProps {
  src?: string;
  alt?: string;
  contain?: boolean;
  avatar?: boolean;
  rounded?: boolean;
  ratio169?: boolean;
  percent?: number;
  once?: boolean;
  checkerboard?: boolean;
  onClick?: (e) => any;
  showImageOnClick?: boolean;
  imageClassName?: string;
  default?: string;
  compress?: number;
  border?: boolean;
  lazyload?: boolean;
  overflow?: boolean;
  noImage?: boolean;
  scrollContainer?: any;
}

export function Img({
  src,
  alt = "",
  className = "",
  style = {},
  imageClassName = "",
  once = true,
  lazyload = true,
  overflow = false,
  scrollContainer,
  ...props
}: ImgProps) {
  const [image, setImage] = useState(src);
  const [error, setError] = useState(false);
  const [showImage, setShowImage] = useState("");

  const onImageError = () => {
    if (error) return;
    if (props.default) setImage(props.default);
    else if (props.avatar) setImage(defaultAvatar);
    else setImage(defaultImage);
    setError(true);
  };

  useEffect(() => {
    if (src) {
      if (props.compress) {
        setImage(compressImage(src, props.compress));
      } else {
        setImage(src);
      }
      setError(false);
    } else {
      onImageError();
    }
  }, [src]);

  const onClick = (e) => {
    if (props.showImageOnClick) {
      e.stopPropagation();
      setShowImage(src);
    } else if (props.onClick) {
      e.stopPropagation();
      props.onClick(e);
    }
  };

  const Wrapper: any = lazyload ? LazyLoad : "div";

  return (
    <Wrapper
      className={`${props.checkerboard ? "bg-checkerboard" : ""} ${className}`}
      {...(lazyload ? { once, overflow } : {})}
      {...(scrollContainer && lazyload ? { scrollContainer } : {})}
      style={{ ...style }}
    >
      <div
        className={`image-wrapper ${
          props.rounded ? "rounded" : props.avatar ? "rounded-full" : "rounded-inherit"
        } ${props.contain ? "contain" : ""} ${
          props.showImageOnClick || props.onClick ? "cursor-pointer" : ""
        }`}
        style={{
          ...(props.percent || props.ratio169
            ? { paddingTop: props.ratio169 ? "56.25%" : props.percent + "%" }
            : {}),
        }}
      >
        {!props.noImage && (
          <img
            className={`rounded-inherit ${imageClassName}`}
            src={image}
            onError={onImageError}
            alt={alt}
            onClick={onClick}
          />
        )}
        {props.children}
      </div>
      {props.showImageOnClick && (
        <ImageDialog isOpen={!!showImage} image={showImage} onClose={() => setShowImage("")} />
      )}
    </Wrapper>
  );
}
