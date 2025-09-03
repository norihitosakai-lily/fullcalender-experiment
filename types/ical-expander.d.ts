declare module "ical-expander" {
  import * as ICAL from "ical.js";

  /** コンストラクタに渡すオプション */
  export interface IcalExpanderOptions {
    /** ICS文字列 */
    ics: string;
    /**
     * 各RRULEに対する最大反復回数。
     * 省略・null の場合は1000、0は無制限（注意）。
     */
    maxIterations?: number | null;
    /**
     * 開始/終了日時が不正なイベントをスキップするか
     * （デフォルトfalse）
     */
    skipInvalidDates?: boolean;
  }

  /** ical.jsのOccurrenceDetails相当 */
  export interface OccurrenceDetails {
    /** この出現のRECURRENCE-ID */
    recurrenceId: ICAL.Time;
    /** 元の（または例外の）イベント */
    item: ICAL.Event;
    /** 出現の開始 */
    startDate: ICAL.Time;
    /** 出現の終了 */
    endDate: ICAL.Time;
  }

  /** between()/before()/after()/all()の戻り値 */
  export interface ExpandResult {
    /** 非繰り返しイベント、または例外（RECURRENCE-ID付き） */
    events: ICAL.Event[];
    /** 繰り返しイベントから展開された出現 */
    occurrences: OccurrenceDetails[];
  }

  /**
   * ICSをパースし、EXDATE/RECURRENCE-ID/RRULEを考慮して
   * イベントと出現を範囲展開するユーティリティ
   */
  class IcalExpander {
    constructor(opts: IcalExpanderOptions);

    /** 解析済みjCalデータ */
    readonly jCalData: ICAL.jCalComponent;
    /** ルートComponent（VCALENDAR） */
    readonly component: ICAL.Component;
    /** VEVENT一覧（例外含む） */
    readonly events: ICAL.Event[];

    /** 範囲（after〜before）にかかるイベント/出現を返す */
    between(after?: Date, before?: Date): ExpandResult;
    /** beforeのみ指定のエイリアス */
    before(before: Date): ExpandResult;
    /** afterのみ指定のエイリアス */
    after(after: Date): ExpandResult;
    /** 全件（maxIterationsに注意） */
    all(): ExpandResult;

    /** 実際の設定値 */
    readonly maxIterations: number;
    readonly skipInvalidDates: boolean;
  }

  // CommonJS 既定エクスポート
  export = IcalExpander;
}
