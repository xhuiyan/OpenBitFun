import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { classNames } from "../../internal/classNames";
import { Icon } from "../Icon";
import styles from "./Empty.module.css";

export type EmptyMediaSize = "sm" | "md" | "lg";

export interface EmptyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  actions?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  image?: ReactNode;
  imageSize?: EmptyMediaSize;
  title?: ReactNode;
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty({
  actions,
  children,
  className,
  description,
  icon,
  image,
  imageSize = "md",
  style,
  title,
  ...props
}, ref) {
  const media = icon ?? image ?? <Icon name="folder" />;
  const footer = actions ?? children;

  return (
    <div
      {...props}
      className={classNames(styles.root, className)}
      data-openbitfun-component="empty"
      ref={ref}
      style={style}
     data-starmate-component="empty" >
      <div
        className={styles.media}
        data-openbitfun-icon-slot="true"
        data-openbitfun-part="media"
        data-size={imageSize}
       data-starmate-icon-slot="true" data-starmate-part="media" >
        {media}
      </div>
      {title !== undefined && title !== null && (
        <div className={styles.title} data-openbitfun-part="title" data-starmate-part="title" >{title}</div>
      )}
      {description !== undefined && description !== null && (
        <div className={styles.description} data-openbitfun-part="description" data-starmate-part="description" >{description}</div>
      )}
      {footer !== undefined && footer !== null && (
        <div className={styles.actions} data-openbitfun-part="actions" data-starmate-part="actions" >{footer}</div>
      )}
    </div>
  );
});
