import {
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";

const Callout: React.FC<{ type: "info" | "warn" | "danger" }> = ({
  type,
  children,
}) => {
  let bgColor: string = null;
  let borderColor: string = null;
  let iconColor: string = null;
  let icon: ReactElement = null;

  switch (type) {
    case "info":
      bgColor = "bg-blue-100 dark:bg-blue-800";
      borderColor = "border-blue-500 dark:border-blue-400";
      iconColor = "text-blue-500 dark:text-blue-400";
      icon = <FontAwesomeIcon icon={faInfoCircle} size="lg" />;
      break;
    case "warn":
      bgColor = "bg-yellow-100 dark:bg-yellow-800";
      borderColor = "border-yellow-500 dark:border-yellow-400";
      iconColor = "text-yellow-500 dark:text-yellow-300";
      icon = <FontAwesomeIcon icon={faExclamationCircle} size="lg" />;
      break;
    case "danger":
      bgColor = "bg-red-100 dark:bg-red-800";
      borderColor = "border-red-500 dark:border-red-400";
      iconColor = "text-red-500 dark:text-red-400";
      icon = <FontAwesomeIcon icon={faTimesCircle} size="lg" />;
      break;
  }

  return (
    <div className={"flex px-4 py-2 border-l-4 " + bgColor + " " + borderColor}>
      <div className={"mr-3 mt-5 " + iconColor}>{icon}</div>
      <div className="dark:text-gray-300">{children}</div>
    </div>
  );
};

export default Callout;
