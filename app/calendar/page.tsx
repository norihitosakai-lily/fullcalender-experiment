import { MyCalendar } from "@/components/MyCalendar";
import { notoSansJP, notoSansMono } from "@/font-config/fonts";
import dayjsTokyo from "@/lib/dayjsTokyo";
import Link from "next/link";
import type { FunctionComponent } from "react";

const fetchDummyICalendar = async () => {
  try {
    const file = Bun.file("public/dummy/dummy.ics");
    const content = await file.text();
    return content;
  } catch (error) {
    console.error("iCalendarファイルの読み込みに失敗しました:", error);
    return null;
  }
};

const CalendarPage: FunctionComponent = async () => {
  const iCalendarData = await fetchDummyICalendar();
  const today = dayjsTokyo.tz().format();
  return (
    <>
      <h1 className="font-bold text-8xl">カレンダー</h1>
      {iCalendarData ? (
        <>
          <MyCalendar ics={iCalendarData} today={today} />
          {/* <pre className={`${notoSansMono.variable} ${notoSansJP.variable}`}>{iCalendarData}</pre> */}
        </>
      ) : (
        <p>カレンダーの読み込みに失敗しました。</p>
      )}
      <Link href="/" className="text-blue-500 underline">
        ホームへ戻る
      </Link>
    </>
  );
};
export default CalendarPage;
