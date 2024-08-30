

interface TagLineProps {
    className?: string; 
    children?: string;
}

const TagLine: React.FC<TagLineProps> = ({ className, children }) => {
  return (
    <div className={`tagline flex items-center ${className || ""}`}>
      <div className="mx-3 text-n-3">{children}</div>
    </div>
  );
};

export default TagLine;
