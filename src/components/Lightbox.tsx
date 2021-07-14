import React from "react";
import Figure from "./Figure";

const Lightbox: React.FC<{ src: string; caption: string }> = ({
  src,
  caption,
}) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <Figure src={src} caption={caption} onClick={() => setOpen(true)} />
      {isOpen && (
        <Modal src={src} caption={caption} onClick={() => setOpen(false)} />
      )}
    </>
  );
};

export default Lightbox;

const Modal: React.FC<{
  src: string;
  caption: string;
  onClick: () => void;
}> = ({ src, caption, onClick }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity cursor-pointer"
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-90"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8  lg: my-0 sm:align-middle sm:w-full">
          <img className="mx-auto" src={src} alt={caption} />
        </div>
        {/* Add button to close in the top right. */}
      </div>
    </div>
  );
};
