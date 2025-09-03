"use client";

import type { EventInput } from "@fullcalendar/core";
import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dynamic from "next/dynamic";
import { type FunctionComponent, useMemo } from "react";

// FullCalendarはブラウザAPIに依存するため、SSR無効の動的importが安全
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

import type { MyCalendarProps } from "@/types/types";
import IcalExpander from "ical-expander";

export const MyCalendar: FunctionComponent<MyCalendarProps> = ({ ics }) => {
  const expander = useMemo(() => {
    return new IcalExpander({ ics, maxIterations: 2000 });
  }, [ics]);

  return (
    <FullCalendar
      locales={allLocales}
      locale="ja"
      plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      height="auto"
      timeZone="Asia/Tokyo"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
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
            const ev = occurrence.item; // ICAL.Event
            const start = occurrence.startDate.toJSDate();
            const end = occurrence.endDate?.toJSDate();

            return {
              // 各インスタンスが一意になるようにuid+開始時刻で生成
              id: `${ev.uid}_${occurrence.startDate.toUnixTime()}`,
              title: ev.summary ?? "(no title)",
              start,
              end,
              allDay: !!occurrence.startDate.isDate,
              extendedProps: {
                location: ev.location,
                organizer: ev.organizer,
                uid: ev.uid,
                recurrenceId: occurrence.recurrenceId?.toString(),
              },
            };
          });

          success([...singles, ...recurrences]);
        } catch (error) {
          failure(error as Error);
        }
      }}
    />
  );
};
