import Image from "next/image";
import Replicate from "./component/replicate";

export default function Home() {
  return (
    <section className="py-24">
      <div className="container">
        <Replicate />
      </div>
    </section>
  );
}
