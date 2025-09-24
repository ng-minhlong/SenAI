import { StaticImageData } from "next/image";

export interface FeatredCardProps {
  icon: StaticImageData;
  title: string;
  content: string;
  index: number;
}

export interface ButtonProps {
    styles?: string;
}

export interface FeedBackProps {
    content: string;
    title: string;
    name: string;
    img: string | any;
}

