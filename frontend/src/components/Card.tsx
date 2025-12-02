import { ReactNode } from "react";
import "./card.css";

type CardProps = {
  title: string;
  children: ReactNode;
};

export const Card = ({ title, children }: CardProps) => (
  <div className="card">
    <h3>{title}</h3>
    <div className="card-body">{children}</div>
  </div>
);
