import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Volume2, CheckCircle2, Shuffle, GripVertical } from "lucide-react";

const LESSONS = [
  {
    id: "black-swan",
    title: "Bài 1: Black Swan",
    text: [
      "A Black Swan Incident is a concept by Nassim Nicholas Taleb.",
      "It refers to a rare and unpredictable event that has a very big impact.",
      "There are 3 main characteristics.",
      "First, it is unexpected and very unlikely to happen.",
      "Second, it has extreme consequences that can affect the whole world.",
      "Third, after it happens, people often think it was predictable, but actually it was not.",
      "Black Swan events can be negative or positive.",
      "For example, the September 11 attacks and the Global Financial Crisis are negative examples.",
      "On the other hand, the rise of the Internet is a positive example.",
      "In short, a Black Swan is something rare, unpredictable, and very powerful."
    ]
  },
  {
    id: "risk",
    title: "Bài 2: Attitude toward Risk",
    text: [
      "Personally, I consider myself risk-averse in most situations.",
      "I prefer stability, safety, and making well-thought decisions instead of taking blind chances.",
      "I don't like unnecessary risks because they may bring unexpected losses or pressure.",
      "But that doesn't mean I refuse all risks.",
      "When a risk is calculated, controllable, and may lead to clear progress, I'm willing to take it carefully.",
      "In short, I value security more than excitement, so I'm cautious and risk-averse by nature."
    ]
  },
  {
    id: "startup",
    title: "Bài 3: Startup Fields",
    text: [
      "In my opinion, medical devices are one of the most promising fields for international trade startups.",
      "There are several reasons.",
      "First, the whole world is paying more attention to health, especially with aging populations.",
      "Demand for medical equipment keeps growing.",
      "Second, China has a complete supply chain and high-quality products at competitive prices, which are very popular in overseas markets.",
      "Third, this industry has relatively high barriers, so there is less brutal price competition.",
      "One specific example is a startup focusing on basic medical devices for emerging markets.",
      "It exports portable monitors, diagnostic equipment and home medical devices to countries in Southeast Asia and Africa.",
      "The founder used professional knowledge in international trade, such as market research, customs clearance, international logistics and foreign certification applications.",
      "In short, medical device trade is stable, profitable and has great potential."
    ]
  }
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function splitSentence(sentence) {
  const words = sentence.split(" ");
  if (words.length <= 6) return [sentence];
  if (words.length <= 10) {
    const cut = Math.floor(words.length / 2);
    return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
  }
  const cut1 = Math.max(3, Math.floor(words.length / 3));
  const cut2 = Math.max(cut1 + 2, Math.floor((2 * words.length) / 3));
  return [
    words.slice(0, cut1).join(" "),
    words.slice(cut1, cut2).join(" "),
    words.slice(cut2).join(" ")
  ];
}

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[“”"',.!?;:()]/g, "")
    .trim();
}

function tokenize(sentence) {
  return sentence.split(/(\s+)/).filter((t) => t.length > 0);
}

function compareText(expected, actual) {
  const expectedWords = expected.trim().split(/\s+/);
  const actualWords = actual.trim().split(/\s+/);
  const maxLen = Math.max(expectedWords.length, actualWords.length);
  const out = [];
  let correct = 0;

  for (let i = 0; i < maxLen; i += 1) {
    const e = expectedWords[i] ?? "";
    const a = actualWords[i] ?? "";
    const ok = normalizeWord(e) === normalizeWord(a) && e !== "";
    if (ok) correct += 1;
    out.push({ expected: e, actual: a, ok });
  }

  return {
    percent: expectedWords.length ? Math.round((correct / expectedWords.length) * 100) : 0,
    parts: out
  };
}

function reorder(list, fromIndex, toIndex) {
  const arr = [...list];
  const [moved] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, moved);
  return arr;
}

function buildBlankQuestions(sentences) {
  return sentences.map((sentence, sentenceIndex) => {
    const tokens = tokenize(sentence);
    const candidates = tokens
      .map((token, index) => ({ token, index }))
      .filter(({ token }) => /[A-Za-z]/.test(token) && normalizeWord(token).length >= 4);

    const blankCount = Math.min(5, Math.max(3, Math.floor(candidates.length / 3)));
    const picked = shuffle(candidates).slice(0, blankCount).map((x) => x.index);
    const pickedSet = new Set(picked);

    const parts = tokens.map((token, idx) => ({
      type: pickedSet.has(idx) ? "blank" : "text",
      text: token,
      answer: token,
      sentenceIndex,
      blankId: `${sentenceIndex}-${idx}`
    }));

    return {
      sentence,
      sentenceIndex,
      parts
    };
  });
}

function App() {
  const [lessonId, setLessonId] = useState(LESSONS[0].id);
  const [page, setPage] = useState("order");

  const lesson = useMemo(
    () => LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0],
    [lessonId]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-[1.3fr_1fr]"
        >
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">NGHÉ HỌC TIẾNG ANH</CardTitle>
              <p className="text-sm text-slate-600">
                Có 3 trò chơi: sắp xếp thứ tự, điền từ còn thiếu, và nghe chép chính tả. Mỗi mục em đều có thể reset, sắp xếp lại thứ tự random, chấm điểm và chỉ ra chỗ đúng/sai.
              </p>
            </CardHeader>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Chọn bài</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {LESSONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLessonId(item.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    item.id === lessonId
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <Card className="rounded-3xl border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <Tabs value={page} onValueChange={setPage} className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-100 p-1">
                <TabsTrigger value="order" className="rounded-2xl">1. Sắp xếp thứ tự</TabsTrigger>
                <TabsTrigger value="fill" className="rounded-2xl">2. Điền từ còn thiếu</TabsTrigger>
                <TabsTrigger value="listen" className="rounded-2xl">3. Nghe và chép</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {page === "order" && <OrderingPage lesson={lesson} />}
        {page === "fill" && <FillBlanksPage lesson={lesson} />}
        {page === "listen" && <DictationPage lesson={lesson} />}
      </div>
    </div>
  );
}

function OrderingPage({ lesson }) {
  const buildPieces = () => {
    const pieces = lesson.text.flatMap((sentence, sentenceIndex) =>
      splitSentence(sentence).map((piece, pieceIndex) => ({
        id: `${sentenceIndex}-${pieceIndex}-${piece}`,
        sentenceIndex,
        pieceIndex,
        text: piece
      }))
    );
    return shuffle(pieces);
  };

  const [pieces, setPieces] = useState(buildPieces());
  const [dragIndex, setDragIndex] = useState(null);
  const [score, setScore] = useState(null);
  const [checkedMap, setCheckedMap] = useState({});

  useEffect(() => {
    setPieces(buildPieces());
    setScore(null);
    setCheckedMap({});
  }, [lesson.id]);

  const checkAnswer = () => {
    let correct = 0;
    const map = {};
    pieces.forEach((p, i) => {
      const expectedOrder = lesson.text
        .slice(0, p.sentenceIndex)
        .reduce((acc, s) => acc + splitSentence(s).length, 0) + p.pieceIndex;
      const ok = i === expectedOrder;
      map[p.id] = ok;
      if (ok) correct += 1;
    });
    setCheckedMap(map);
    setScore(Math.round((correct / pieces.length) * 100));
  };

  const resetRandom = () => {
    setPieces(buildPieces());
    setScore(null);
    setCheckedMap({});
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3 text-xl">
            <span>{lesson.title}</span>
            <span className="text-sm font-normal text-slate-500">
              Kéo các thẻ ngắn và chèn vào đúng vị trí trong đoạn văn
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
            <div className="mb-3 text-sm text-slate-500">Thứ tự hiện tại</div>
            <div className="flex flex-wrap gap-3">
              {pieces.map((piece, index) => (
                <motion.div
                  key={piece.id}
                  layout
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex === null || dragIndex === index) return;
                    setPieces((prev) => reorder(prev, dragIndex, index));
                    setDragIndex(null);
                  }}
                  className={`inline-flex max-w-full cursor-move items-center gap-2 rounded-2xl border px-4 py-3 text-sm leading-6 shadow-sm transition ${
                    score === null
                      ? "bg-white hover:bg-slate-100"
                      : checkedMap[piece.id]
                      ? "border-blue-400 bg-blue-100 text-blue-900 ring-2 ring-blue-300"
                      : "border-red-500 bg-red-100 text-red-900 ring-2 ring-red-300"
                  }`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{piece.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Điều khiển</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button className="rounded-2xl" onClick={checkAnswer}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Kiểm tra
            </Button>
            <Button variant="secondary" className="rounded-2xl" onClick={resetRandom}>
              <Shuffle className="mr-2 h-4 w-4" />
              Random lại
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={resetRandom}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Điểm</div>
            <div className="mt-1 text-4xl font-bold">{score === null ? "--" : `${score}%`}</div>
          </div>
          <div className="text-sm leading-6 text-slate-600">
            Thẻ đúng sẽ hiện màu xanh dương. Thẻ sai sẽ hiện màu đỏ đậm.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FillBlanksPage({ lesson }) {
  const buildQuestions = () => buildBlankQuestions(lesson.text);
  const [questions, setQuestions] = useState(buildQuestions());
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState({});
  const [revealedSentences, setRevealedSentences] = useState({});

  useEffect(() => {
    setQuestions(buildQuestions());
    setAnswers({});
    setChecked(false);
    setScore(null);
    setResults({});
    setRevealedSentences({});
  }, [lesson.id]);

  const handleCheck = () => {
    let total = 0;
    let correct = 0;
    const nextResults = {};

    questions.forEach((q) => {
      q.parts.forEach((part) => {
        if (part.type === "blank") {
          total += 1;
          const user = answers[part.blankId] ?? "";
          const ok = normalizeWord(user) === normalizeWord(part.answer);
          if (ok) correct += 1;
          nextResults[part.blankId] = ok;
        }
      });
    });

    setResults(nextResults);
    setChecked(true);
    setScore(total ? Math.round((correct / total) * 100) : 0);
  };

  const resetRandom = () => {
    setQuestions(buildQuestions());
    setAnswers({});
    setChecked(false);
    setScore(null);
    setResults({});
    setRevealedSentences({});
  };

  const toggleRevealSentence = (sentenceIndex) => {
    setRevealedSentences((prev) => ({ ...prev, [sentenceIndex]: !prev[sentenceIndex] }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {questions.map((q, i) => (
            <div key={q.sentenceIndex} className="rounded-2xl bg-slate-50 p-4 leading-8">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-500">Câu {i + 1}</div>
                <Button variant="secondary" className="rounded-2xl" onClick={() => toggleRevealSentence(q.sentenceIndex)}>
                  {revealedSentences[q.sentenceIndex] ? "Ẩn đáp án" : "Hiện đáp án"}
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {q.parts.map((part, idx) => {
                  if (part.type === "text") {
                    return (
                      <span key={idx} className="text-slate-800">
                        {part.text}
                      </span>
                    );
                  }
                  const ok = results[part.blankId];
                  return (
                    <Input
                      key={part.blankId}
                      value={answers[part.blankId] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [part.blankId]: e.target.value }))}
                      className={`inline-block h-10 w-32 rounded-xl ${
                        !checked
                          ? "bg-white"
                          : ok
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                      }`}
                      placeholder="..."
                    />
                  );
                })}
              </div>
              {revealedSentences[q.sentenceIndex] && (
                <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-slate-800">
                  <div className="mb-1 font-medium text-blue-900">Đáp án đầy đủ</div>
                  <div>{q.sentence}</div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Điều khiển</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button className="rounded-2xl" onClick={handleCheck}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Kiểm tra
            </Button>
            <Button variant="secondary" className="rounded-2xl" onClick={resetRandom}>
              <Shuffle className="mr-2 h-4 w-4" />
              Random chỗ trống
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={resetRandom}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Điểm</div>
            <div className="mt-1 text-4xl font-bold">{score === null ? "--" : `${score}%`}</div>
          </div>
          <div className="text-sm leading-6 text-slate-600">
            Ô đúng sẽ chuyển xanh. Ô sai sẽ chuyển đỏ ngay tại vị trí sai. Mỗi câu em có thể ấn để hiện hoặc ẩn đáp án đầy đủ.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DictationPage({ lesson }) {
  const [speed, setSpeed] = useState([0.9]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [results, setResults] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  useEffect(() => {
    setAnswers({});
    setScore(null);
    setResults({});
    setRevealedAnswers({});
  }, [lesson.id]);

  const speak = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Trình duyệt này chưa hỗ trợ phát âm.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = speed[0];
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  };

  const check = () => {
    const next = {};
    let total = 0;
    let sum = 0;
    lesson.text.forEach((sentence, index) => {
      const cmp = compareText(sentence, answers[index] ?? "");
      next[index] = cmp;
      total += 1;
      sum += cmp.percent;
    });
    setResults(next);
    setScore(total ? Math.round(sum / total) : 0);
  };

  const reset = () => {
    setAnswers({});
    setScore(null);
    setResults({});
    setRevealedAnswers({});
  };

  const toggleReveal = (index) => {
    setRevealedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {lesson.text.map((sentence, index) => {
            const result = results[index];
            return (
              <div key={index} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-slate-500">Câu {index + 1}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="rounded-2xl" onClick={() => speak(sentence)}>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Phát câu này
                    </Button>
                    <Button variant="secondary" className="rounded-2xl" onClick={() => toggleReveal(index)}>
                      {revealedAnswers[index] ? "Ẩn đáp án" : "Hiện đáp án"}
                    </Button>
                  </div>
                </div>
                <textarea
                  value={answers[index] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:border-slate-400"
                  placeholder="Nghe và chép lại câu ở đây..."
                />
                {revealedAnswers[index] && (
                  <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-slate-800">
                    <div className="mb-1 font-medium text-blue-900">Đáp án đầy đủ</div>
                    <div>{sentence}</div>
                  </div>
                )}
                {result && (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 text-sm font-medium text-slate-600">Đối chiếu</div>
                    <div className="flex flex-wrap gap-2 leading-8">
                      {result.parts.map((part, i) => (
                        <span
                          key={i}
                          className={`rounded-lg px-2 py-1 text-sm ${
                            part.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                          title={part.ok ? "Đúng" : `Đúng phải là: ${part.expected || "(trống)"}`}
                        >
                          {part.actual || "∅"}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">Câu này đúng {result.percent}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Điều khiển</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-3 text-sm text-slate-600">Tốc độ đọc: {speed[0].toFixed(1)}x</div>
            <Slider value={speed} onValueChange={setSpeed} min={0.3} max={1.2} step={0.1} />
          </div>
          <div className="grid gap-3">
            <Button className="rounded-2xl" onClick={check}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Kiểm tra
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Điểm trung bình</div>
            <div className="mt-1 text-4xl font-bold">{score === null ? "--" : `${score}%`}</div>
          </div>
          <div className="text-sm leading-6 text-slate-600">
            Mỗi câu có nút phát riêng để em nghe và chép lại với tốc độ nói tùy chỉnh bằng thanh trượt. Sau khi kiểm tra, từ đúng hiện xanh, từ sai hiện đỏ. Bé có thể ấn nút để hiện đáp án đầy đủ của từng câu.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;