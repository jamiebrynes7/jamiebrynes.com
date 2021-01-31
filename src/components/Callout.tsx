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
      bgColor = "bg-blue-100";
      borderColor = "border-blue-500";
      iconColor = "text-blue-900";
      icon = <InfoIcon />;
      break;
    case "warn":
      bgColor = "bg-yellow-100";
      borderColor = "border-yellow-500";
      iconColor = "text-yellow-900";
      icon = <WarningIcon />;
      break;
    case "danger":
      bgColor = "bg-red-100";
      borderColor = "border-red-500";
      iconColor = "text-red-900";
      icon = <DangerIcon />;
      break;
  }

  return (
    <div
      className={
        "flex px-4 py-2 rounded-lg border " + bgColor + " " + borderColor
      }
    >
      <div className={"mr-3 mt-5 " + iconColor}>
        <svg
          width="24px"
          height="24px"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
        <InfoIcon />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Callout;

const InfoIcon: React.FC<{}> = () => {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  );
};

const WarningIcon: React.FC<{}> = () => {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  );
};

const DangerIcon: React.FC<{}> = () => {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
    />
  );
};
