import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "./AppContext";
import "./components-css/Carousel.css";

export default function Carousel() {
  const { courses } = useContext(AppContext);
  const [index, setIndex] = useState(0);
  const carousel = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (index < courses.length) {
          carousel.current.scrollLeft += 1100;
          return prev + 1;
        } else {
          carousel.current.scrollLeft -= 1100 * courses.length;
          return 0;
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [index, courses.length]);
  return (
    <>
      <div className="carousel-track" ref={carousel}>
        {courses.length > 0 &&
          courses.map((value, index) => {
            if (value.isFeatured) {
              return (
                <div key={index} className="carousel-item">
                  <img src={value.thumbnail} alt="" width={1100} height={500} />
                </div>
              );
            }
          })}
      </div>
    </>
  );
}
