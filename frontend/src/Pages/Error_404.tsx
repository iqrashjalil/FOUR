import { LazyLoadImage } from "react-lazy-load-image-component";
import Error from "../Assets/404.webp";
const Error_404 = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LazyLoadImage src={Error} />
    </div>
  );
};

export default Error_404;
