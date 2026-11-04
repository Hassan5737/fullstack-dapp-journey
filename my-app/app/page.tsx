import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/counter";

export default function Home() {
  return (

    <>

    <div>
      Hello DApp

    </div>
     

    <Link href="/about">
    <button style={{cursor: "pointer"}}> About us </button>
    </Link>
    <Counter />
    </>
  );
}
