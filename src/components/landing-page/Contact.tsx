import Heading from "../ui/Heading";
import Section from "./Section";

export const Contact = () => {
  return (
    <Section id="contact" crosses>
      <div className="container lg:px-6 xl:px-8 relative">
        <Heading title="Contact" />

        <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center gap-y-12 lg:gap-0">
          <div className="flex flex-col items-center justify-center">
            <h5 className="h5 text-gray-900 mb-3 font-bold">Muhammad Chandra</h5>
            <div className="mt-3 flex flex-col justify-center items-center gap-4">
              <FirstContactDetail>0895394753906</FirstContactDetail>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h5 className="h5 text-gray-900 mb-3 font-bold">Muhammad Renaldi</h5>

            <div className="mt-3 flex flex-col justify-center items-center gap-4">
              <FirstContactDetail>089669986114</FirstContactDetail>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export const FirstContactDetail = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-phone text-[#111827]"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
      <p className="text-[#111827] font-semibold">{children}</p>
    </div>
  );
};

export const SecondContactDetail = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <svg
        width="24"
        height="24"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_358_204)">
          <path
            d="M25.989 12.274C34.652 12.359 40.079 11.82 40.812 21.422H51.376C51.376 6.54699 38.403 4.54199 25.714 4.54199C13.024 4.54199 0.052002 6.54699 0.052002 21.422H10.534C11.345 11.637 17.398 12.19 25.989 12.274Z"
            fill="#111827"
          />
          <path
            d="M5.291 26.204C7.864 26.204 10.005 26.358 10.481 23.827C10.545 23.483 10.582 23.093 10.582 22.642H10.46H0C0 26.407 2.369 26.204 5.291 26.204Z"
            fill="#111827"
          />
          <path
            d="M40.88 22.642H40.781C40.781 23.096 40.82 23.487 40.893 23.827C41.395 26.161 43.533 26.016 46.097 26.016C49.033 26.016 51.413 26.209 51.413 22.642H40.88Z"
            fill="#111827"
          />
          <path
            d="M35.719 20.078V18.582C35.719 17.913 34.948 17.871 33.996 17.871H32.441C31.49 17.871 30.719 17.913 30.719 18.582V19.871V20.871H19.719V19.871V18.582C19.719 17.913 18.948 17.871 17.997 17.871H16.441C15.49 17.871 14.719 17.913 14.719 18.582V20.078V21.384C12.213 23.988 4.013 35.073 3.715 36.415L3.719 45.37C3.719 46.197 4.392 46.87 5.219 46.87H45.219C46.046 46.87 46.719 46.197 46.719 45.37V36.37C46.424 35.067 38.226 23.987 35.719 21.383V20.078ZM19.177 37.62C18.372 37.62 17.719 36.968 17.719 36.162C17.719 35.356 18.372 34.704 19.177 34.704C19.982 34.704 20.635 35.356 20.635 36.162C20.635 36.968 19.982 37.62 19.177 37.62ZM19.177 32.62C18.372 32.62 17.719 31.968 17.719 31.162C17.719 30.356 18.372 29.704 19.177 29.704C19.982 29.704 20.635 30.356 20.635 31.162C20.635 31.968 19.982 32.62 19.177 32.62ZM19.177 27.621C18.372 27.621 17.719 26.969 17.719 26.163C17.719 25.358 18.372 24.705 19.177 24.705C19.982 24.705 20.635 25.358 20.635 26.163C20.635 26.969 19.982 27.621 19.177 27.621ZM25.177 37.62C24.372 37.62 23.719 36.968 23.719 36.162C23.719 35.356 24.372 34.704 25.177 34.704C25.983 34.704 26.635 35.356 26.635 36.162C26.635 36.968 25.983 37.62 25.177 37.62ZM25.177 32.62C24.372 32.62 23.719 31.968 23.719 31.162C23.719 30.356 24.372 29.704 25.177 29.704C25.983 29.704 26.635 30.356 26.635 31.162C26.635 31.968 25.983 32.62 25.177 32.62ZM25.177 27.621C24.372 27.621 23.719 26.969 23.719 26.163C23.719 25.358 24.372 24.705 25.177 24.705C25.983 24.705 26.635 25.358 26.635 26.163C26.635 26.969 25.983 27.621 25.177 27.621ZM31.177 37.62C30.371 37.62 29.719 36.968 29.719 36.162C29.719 35.356 30.371 34.704 31.177 34.704C31.983 34.704 32.635 35.356 32.635 36.162C32.635 36.968 31.983 37.62 31.177 37.62ZM31.177 32.62C30.371 32.62 29.719 31.968 29.719 31.162C29.719 30.356 30.371 29.704 31.177 29.704C31.983 29.704 32.635 30.356 32.635 31.162C32.635 31.968 31.983 32.62 31.177 32.62ZM31.177 27.621C30.371 27.621 29.719 26.969 29.719 26.163C29.719 25.358 30.371 24.705 31.177 24.705C31.983 24.705 32.635 25.358 32.635 26.163C32.635 26.969 31.983 27.621 31.177 27.621Z"
            fill="#111827"
          />
        </g>
        <defs>
          <clipPath id="clip0_358_204">
            <rect width="51.413" height="51.413" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <p className="text-[#111827] font-semibold">{children}</p>
    </div>
  );
};
