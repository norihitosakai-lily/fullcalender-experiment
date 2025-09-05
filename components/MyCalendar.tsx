"use client";

import { MyModal } from "@/components/MyModal";
import dayjsTokyo from "@/lib/dayjsTokyo";
import type { MyCalendarProps } from "@/types/types";
import type { EventInput } from "@fullcalendar/core";
import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import dayListPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import IcalExpander from "ical-expander";
import { PlusCircle, X } from "lucide-react";
import { type FunctionComponent, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";

export const MyCalendar: FunctionComponent<MyCalendarProps> = ({
  ics,
  today,
  className
}) => {
  const fullCalendarRef = useRef<FullCalendar | null>(null);
  const [calendarView, setCalendarView] = useState<"dayGridMonth" | "listDay">(
    "dayGridMonth"
  );
  const [clickedDate, setClickedDate] = useState(today);

  const handleViewListDayOfClickedDate = (arg: DateClickArg) => {
    if (calendarView === "listDay") {
      return;
    }
    const _calendarView = "listDay";
    setCalendarView((_) => _calendarView);
    const _clickedDate = dayjsTokyo.tz(arg.dateStr).format();
    setClickedDate((_) => _clickedDate);
    fullCalendarRef.current?.getApi()?.changeView(_calendarView, _clickedDate);
  };

  const handleViewDayGridMonth = () => {
    if (calendarView === "dayGridMonth") {
      return;
    }
    const _calendarView = "dayGridMonth";
    setCalendarView((_) => _calendarView);
    fullCalendarRef.current?.getApi()?.changeView(_calendarView, clickedDate);
  };

  const handleSetClickedDateToday = () => {
    setClickedDate((_) => today);
    fullCalendarRef.current?.getApi()?.changeView(calendarView, clickedDate);
  };

  const expander = useMemo(() => {
    return new IcalExpander({ ics, maxIterations: 2000 });
  }, [ics]);

  return (
    <div className={className}>
      {calendarView === "listDay" && (
        <MyModal
          TriggerButton={Button}
          triggerButtonChildren={<PlusCircle color="black" size={120} className="flex content-end" />}
          content="ここに予定登録フォームが入るよ"
          CloseButton={Button}
          closeButtonChildren={<X color="black" size={120} />}
        />
      )}
      <FullCalendar
        ref={fullCalendarRef}
        locales={allLocales}
        locale="ja"
        plugins={[interactionPlugin, dayGridPlugin, dayListPlugin]}
        initialView="dayGridMonth"
        height="auto"
        timeZone="Asia/Tokyo"
        weekNumberCalculation="ISO"
        headerToolbar={{
          left: "prev viewToday",
          center: `title${
            calendarView === "listDay" ? ",viewDayGridMonth" : ""
          }`,
          right: "next",
        }}
        views={{
          listDay: {
            eventTimeFormat: {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            },
          },
        }}
        customButtons={{
          viewDayGridMonth: {
            text: "月表示に戻る",
            click: handleViewDayGridMonth,
          },
          viewToday: {
            text: "今日",
            click: handleSetClickedDateToday,
          },
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        // 表示範囲ごとにイベントを返す
        events={(fetchInfo, success, failure) => {
          try {
            // ical-expanderはDateを受け取り、範囲内の
            // 1) 単発イベント(events)
            // 2) 繰り返しの各インスタンス(occurrences)
            // を返す
            const { events, occurrences } = expander.between(
              fetchInfo.start,
              fetchInfo.end
            );

            // 単発イベントのマッピング
            const singles: EventInput[] = events.map((event) => ({
              id: event.uid,
              title: event.summary ?? "(no title)",
              start: event.startDate.toJSDate(),
              end: event.endDate?.toJSDate(),
              allDay: !!event.startDate.isDate,
              extendedProps: {
                location: event.location,
                organizer: event.organizer,
                uid: event.uid,
              },
            }));

            // 繰り返しインスタンスのマッピング
            const recurrences: EventInput[] = occurrences.map((occurrence) => {
              const event = occurrence.item; // ICAL.Event
              const start = occurrence.startDate.toJSDate();
              const end = occurrence.endDate?.toJSDate();

              return {
                // 各インスタンスが一意になるようにuid+開始時刻で生成
                id: `${event.uid}_${occurrence.startDate.toUnixTime()}`,
                title: event.summary ?? "(no title)",
                start,
                end,
                allDay: !!occurrence.startDate.isDate,
                extendedProps: {
                  location: event.location,
                  organizer: event.organizer,
                  uid: event.uid,
                  recurrenceId: occurrence.recurrenceId?.toString(),
                },
              };
            });

            success([...singles, ...recurrences]);
          } catch (error) {
            failure(error as Error);
          }
        }}
        dateClick={handleViewListDayOfClickedDate}
      />
    </div>
  );
};
