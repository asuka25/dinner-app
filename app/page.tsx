
"use client";

import { useEffect, useState } from "react";

type Status = "EAT" | "LESS" | "NOT_EAT" | null;

const members = ["パパ", "ママ", "ゆうと"];

const statusInfo = {
  EAT: { icon: "⭕", label: "食べる" },
  LESS: { icon: "▲", label: "少なめ" },
  NOT_EAT: { icon: "✕", label: "いらない" },
};

function getDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Home() {
  const [screen, setScreen] = useState<"join" | "home">("join");
  const [isCreate, setIsCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const dates = today
    ? Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
      })
  : [];

  const [answers, setAnswers] = useState<Record<string, Status>>({});

  const [userList, setUserList] = useState(members);

  const [currentUser, setCurrentUser] = useState("パパ");

  function joinGroup() {
    if (!password.trim() || !memberName.trim()) {
      alert("合言葉と名前を入力してください");
      return;
    }
    setCurrentUser(memberName);
    setUserList((prev) =>
      prev.includes(memberName) ? prev : [...prev, memberName]
    );
    setScreen("home");
  }

  function createGroup() {
    if (!groupName.trim() || !memberName.trim()) {
      alert("グループ名と名前を入力してください");
      return;
    }
    setCurrentUser(memberName);
    setUserList([memberName]);
    setScreen("home");
  }

  function saveAnswer(status: Status) {
    if (!selectedDate) return;
    const key = `${getDateKey(selectedDate)}_${currentUser}`;
    setAnswers((prev) => ({ ...prev, [key]: status }));
    setSelectedDate(null);
  }

  function getAnswer(date: Date, member: string): Status {
    return answers[`${getDateKey(date)}_${member}`] ?? null;
  }

  function countStatus(date: Date, status: Status) {
    return userList.filter(
      (member) => getAnswer(date, member) === status
    ).length;
  }

  const dateLabel = (date: Date) =>
    `${date.getMonth() + 1}/${date.getDate()}`;

  const weekday = (date: Date) =>
    ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  if (screen === "join") {
    return (
      <main className="app-shell">
        <section className="join-screen">
          <div className="brand">🍽 Dinner App</div>
          <div className="join-content">
            <p className="eyebrow">家族の連絡を、もっと簡単に。</p>
            <h1>
              今日の夜ご飯の
              <br />
              予定は？
            </h1>
            <p className="description">
              「今日晩ご飯いる？」の会話は、
              <br />
              もうおしまい。
            </p>

            <div className="join-form">
              {isCreate ? (
                <>
                  <label>グループ名</label>
                  <input
                    placeholder="例：進藤家"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <label>家族の合言葉</label>
                  <input
                    placeholder="合言葉を入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              <label>あなたの名前</label>
              <input
                placeholder="例：パパ"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />

              <button
                className="primary-button"
                onClick={isCreate ? createGroup : joinGroup}
              >
                {isCreate ? "グループを作成する" : "グループに入る"}
              </button>

              <button
                className="text-button"
                onClick={() => setIsCreate(!isCreate)}
              >
                {isCreate
                  ? "合言葉を持っている方はこちら"
                  : "はじめての方は、新しくグループを作る"}
              </button>
            </div>
          </div>
          <p className="footer-note">Simple dinner communication</p>
        </section>
      </main>
    );
  }

  if (!today) {
  return (
    <main className="app-shell">
      <p style={{ padding: "30px", textAlign: "center" }}>
        読み込み中...
      </p>
    </main>
  );
}

  return (
    <main className="app-shell">
      <header className="top-header">
        <div>
          <div className="brand">🍽 Dinner App</div>
          <p className="group-label">{groupName || "家族の晩ご飯"}</p>
        </div>
        <div className="avatar">{currentUser.slice(0, 1)}</div>
      </header>

      <section className="dashboard">
        <div className="heading-row">
          <div>
            <p className="eyebrow">THIS WEEK</p>
            <h1>今週の晩ご飯</h1>
          </div>
          <span className="week-label">
            {dateLabel(dates[0])} 〜 {dateLabel(dates[6])}
          </span>
        </div>

        <div className="summary-card">
          <p>今日の晩ご飯</p>
          <div className="summary-items">
            <div><strong>⭕ {countStatus(today, "EAT")}</strong><span>食べる</span></div>
            <div><strong>▲ {countStatus(today, "LESS")}</strong><span>少なめ</span></div>
            <div><strong>✕ {countStatus(today, "NOT_EAT")}</strong><span>不要</span></div>
          </div>
          <p className="unanswered">
            未入力 {userList.filter((m) => !getAnswer(today, m)).length}人
          </p>
        </div>

        <div className="member-heading">
          <h2>家族の予定</h2>
          <span>{userList.length}人のグループ</span>
        </div>

        <div className="week-list">
          {dates.map((date) => {
            const isToday = getDateKey(date) === getDateKey(today);
            const unanswered = userList.filter(
              (m) => !getAnswer(date, m)
            ).length;

            return (
              <article className={`day-card ${isToday ? "today" : ""}`} key={getDateKey(date)}>
                <div className="day-title">
                  <div>
                    <strong>{dateLabel(date)}</strong>
                    <span>{isToday ? "今日" : `${weekday(date)}曜日`}</span>
                  </div>
                  {isToday && <span className="today-tag">TODAY</span>}
                </div>

                <div className="member-status">
                  {userList.map((member) => {
                    const status = getAnswer(date, member);
                    return (
                      <button
                        className="member-item"
                        key={member}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="status-icon">
                          {status ? statusInfo[status].icon : "－"}
                        </span>
                        <span>{member}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="day-bottom">
                  <span>⭕ {countStatus(date, "EAT")}人</span>
                  <span>▲ {countStatus(date, "LESS")}人</span>
                  <span>✕ {countStatus(date, "NOT_EAT")}人</span>
                  <span className="pending">
                    未入力 {unanswered}人
                  </span>
                </div>

                <button
                  className="day-action"
                  onClick={() => setSelectedDate(date)}
                >
                  この日の予定を入力する →
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {selectedDate && (
        <div className="modal-backdrop" onClick={() => setSelectedDate(null)}>
          <section className="answer-modal" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">DINNER STATUS</p>
            <h2>{dateLabel(selectedDate)}（{weekday(selectedDate)}）の晩ご飯</h2>
            <p className="question">{currentUser}は食べる？</p>

            {(["EAT", "LESS", "NOT_EAT"] as const).map((status) => (
              <button
                key={status}
                className={`choice-button ${status.toLowerCase()}`}
                onClick={() => saveAnswer(status)}
              >
                <span>{statusInfo[status].icon}</span>
                {statusInfo[status].label}
                {getAnswer(selectedDate, currentUser) === status && " ✓"}
              </button>
            ))}

            <button
              className="cancel-button"
              onClick={() => setSelectedDate(null)}
            >
              キャンセル
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
