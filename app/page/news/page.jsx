"use client";

import Nothing from "@/app/components/Nothing";
import NoNewsImg from "@/public/assets/nonews.png";

export default function News() {
  return (
    <Nothing
      Alt="No news"
      NothingImage={NoNewsImg}
      Text={"No news available"}
    />
  );
}
