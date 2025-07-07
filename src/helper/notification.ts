import { notification } from "antd";

type NotificationType = "success" | "error" | "info" | "warning";

export const Notification = (
  type: NotificationType,
  message: string,
  description?: any // har qanday narsa bo‘lishi mumkin
) => {
  let descText = "";

  if (typeof description === "string") {
    descText = description;
  } else if (typeof description === "object") {
    // eng chuqur xabarni olish harakat qilamiz
    descText =
      description?.message?.response?.message ||
      description?.response?.message ||
      description?.message ||
      JSON.stringify(description); // oxirgi chora
  } else {
    descText = String(description);
  }

  notification[type]({
    message,
    description: descText,
    placement: "topRight",
    duration: 3,
  });
};
