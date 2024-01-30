import Image from "next/image";
import Replicate from "./component/replicate";
import ImageCreator from "./component/ImageCreator";

export default function Home() {
  return (
    <section className="py-24">
      <div className="container">
        <ImageCreator />
        {/* <Replicate /> */}
      </div>
    </section>
  );
}
