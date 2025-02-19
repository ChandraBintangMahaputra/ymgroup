
interface SectionProps {
    className?: string;
  id?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: boolean;
  children: React.ReactNode;
}
const Section: React.FC<SectionProps> = ({
  className,
  id,
  crosses,
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`
      relative 
      ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-14  ${crosses ? "" : ""}`
      } 
      ${className || ""}`}
    >
      {children}

      {/* {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 ${
              crossesOffset && crossesOffset
            } pointer-events-none lg:block xl:left-10 right-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )} */}
    </div>
  );
};

export default Section;
