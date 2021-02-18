const Figure: React.FC<{
  src: string;
  caption: string;
  onClick?: () => void;
}> = ({ src, caption, onClick }) => {
  return (
    <div className="flex justify-center flex-col items-center">
      <img
        onClick={onClick}
        className={onClick && "cursor-pointer"}
        style={{ marginBottom: 0, marginTop: 0 }}
        src={src}
        alt={caption}
      />
      <p
        className="text-gray-500 text-sm mx-auto"
        style={{ marginTop: "0.5rem" }}
      >
        {caption}
      </p>
    </div>
  );
};

export default Figure;
