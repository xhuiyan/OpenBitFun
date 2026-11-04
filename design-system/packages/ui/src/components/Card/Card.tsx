import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { classNames } from "../../internal/classNames";
import styles from "./Card.module.css";

export type CardAppearance = "neutral" | "raised" | "subtle";
export type CardGap = "none" | "sm" | "md" | "lg";
export type CardPadding = "none" | "sm" | "md";
export type CardRadius = "none" | "sm" | "md" | "lg";
export type CardAlignment = "start" | "center";
export type CardContentAlignment = "start" | "center" | "end";
export type CardBodyAlignment = CardContentAlignment | "stretch";
export type CardFooterAlignment = "start" | "center" | "end" | "between";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  appearance?: CardAppearance;
  clip?: boolean;
  gap?: CardGap;
  padding?: CardPadding;
  radius?: CardRadius;
}

export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  actions?: ReactNode;
  align?: CardAlignment;
  contentAlign?: CardContentAlignment;
  description?: ReactNode;
  leading?: ReactNode;
  padding?: CardPadding;
  title?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  align?: CardBodyAlignment;
  padding?: CardPadding;
}

export type CardMediaProps = HTMLAttributes<HTMLDivElement>;

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  align?: CardFooterAlignment;
  padding?: CardPadding;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
  appearance = "subtle",
  children,
  className,
  clip = false,
  gap = "none",
  padding = "none",
  radius = "md",
  ...props
}, ref) {
  return (
    <div
      {...props}
      className={classNames(styles.root, className)}
      data-appearance={appearance}
      data-openbitfun-component="card"
      data-clip={clip ? "true" : "false"}
      data-gap={gap}
      data-padding={padding}
      data-radius={radius}
      ref={ref}
     data-starmate-component="card" >
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({
    actions,
    align = "start",
    children,
    className,
    contentAlign = "start",
    description,
    leading,
    padding = "none",
    title,
    ...props
  }, ref) {
    return (
      <div
        {...props}
        className={classNames(styles.header, className)}
        data-align={align}
        data-openbitfun-part="header"
        data-content-align={contentAlign}
        data-padding={padding}
        ref={ref}
       data-starmate-part="header" >
        {leading !== undefined && leading !== null && (
          <div className={styles.leading} data-openbitfun-part="leading" data-starmate-part="leading" >{leading}</div>
        )}
        <div
          className={styles.headerContent}
          data-align={contentAlign}
          data-openbitfun-part="header-content"
         data-starmate-part="header-content" >
          {title !== undefined && title !== null && (
            <div className={styles.title} data-openbitfun-part="title" data-starmate-part="title" >{title}</div>
          )}
          {description !== undefined && description !== null && (
            <div className={styles.description} data-openbitfun-part="description" data-starmate-part="description" >
              {description}
            </div>
          )}
          {children}
        </div>
        {actions !== undefined && actions !== null && (
          <div className={styles.actions} data-openbitfun-part="actions" data-starmate-part="actions" >{actions}</div>
        )}
      </div>
    );
  },
);

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ align = "stretch", children, className, padding = "none", ...props }, ref) {
    return (
      <div
        {...props}
        className={classNames(styles.body, className)}
        data-align={align}
        data-openbitfun-part="body"
        data-padding={padding}
        ref={ref}
       data-starmate-part="body" >
        {children}
      </div>
    );
  },
);

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia({ children, className, ...props }, ref) {
    return (
      <div
        {...props}
        className={classNames(styles.media, className)}
        data-openbitfun-part="media"
        ref={ref}
       data-starmate-part="media" >
        {children}
      </div>
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({
    align = "end",
    children,
    className,
    padding = "none",
    ...props
  }, ref) {
    return (
      <div
        {...props}
        className={classNames(styles.footer, className)}
        data-align={align}
        data-openbitfun-part="footer"
        data-padding={padding}
        ref={ref}
       data-starmate-part="footer" >
        {children}
      </div>
    );
  },
);
