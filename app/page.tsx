import Link from "next/link";
import type { FunctionComponent } from "react";

const Home: FunctionComponent = () => {
  return (
    <>
      <h1 className="font-bold text-8xl">FullCalendar実験</h1>
      <Link href="/calendar" className="text-blue-500 underline">カレンダーページへ</Link>
    </>
  );
};
export default Home;
