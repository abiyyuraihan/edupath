import { FaArrowUp, FaRobot, FaUser, FaGraduationCap } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import React from "react";

const CareerPlanner = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [age, setAge] = useState("");
  const [career, setCareer] = useState("");
  const [history, setHistory] = useState([
    {
      role: "model",
      parts:
        "Selamat datang di EduPath AI! Saya akan membantu Anda merencanakan perjalanan pendidikan menuju cita-cita Anda. Silakan isi informasi yang diperlukan untuk memulai.",
    },
  ]);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(null);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const messagesEndRef = useRef(null);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const popularCareers = [
    "Dokter",
    "Programmer",
    "Pengusaha",
    "Guru",
    "Pilot",
    "Chef",
    "Arsitek",
    "Designer",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  useEffect(() => {
    if (!chat) {
      setChat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 1000,
          },
        })
      );
    }
  }, [chat, model]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!age || !career) return;

    setShowForm(false);
    const prompt = `Saya berusia ${age} tahun dan bercita-cita menjadi ${career}`;
    await startChat(prompt);
  };

  const startChat = async (prompt) => {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: prompt,
      },
      {
        role: "model",
        parts: "Sedang menyusun rencana pembelajaran...",
      },
    ]);
    setInput("");

    try {
      const systemPrompt = `Kamu adalah EduPath AI, asisten pendidikan profesional yang ahli dalam merancang jalur pembelajaran berdasarkan usia dan cita-cita.

Berikan rencana pembelajaran yang terstruktur dengan format Markdown berikut:

# Selamat datang di Perencanaan Karir ${career}! 🎯

## Gambaran Umum
[Berikan gambaran singkat tentang karir dan mengapa usia saat ini adalah waktu yang tepat]

## 1. Roadmap Pendidikan 📚
### Jalur Pendidikan Formal
- Point 1
- Point 2

### Timeline dan Durasi
- Tahap 1: [timeline]
- Tahap 2: [timeline]

### Gelar dan Sertifikasi
- Gelar 1
- Sertifikasi 1

## 2. Fokus Pembelajaran 🎯
### Mata Pelajaran Utama
- Pelajaran 1
- Pelajaran 2

### Keterampilan Teknis
- Skill 1
- Skill 2

### Soft Skills
- Soft skill 1
- Soft skill 2

## 3. Aktivitas Pendukung 🌟
### Kegiatan Ekstrakurikuler
- Aktivitas 1
- Aktivitas 2

### Program Magang
- Program 1
- Program 2

## 4. Tips dan Rekomendasi 💡
- Tip 1
- Tip 2

## Langkah Selanjutnya
[Berikan saran konkret tentang apa yang bisa dilakukan segera]

---
Silakan tanyakan hal spesifik yang ingin kamu ketahui lebih lanjut!`;

      await chat.sendMessage(systemPrompt);
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: text,
        });
        return newHistory;
      });
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Maaf, terjadi kesalahan. Mohon coba lagi nanti.",
        });
        return newHistory;
      });
    }
    setLoading(false);
  };

  const handleFollowUpQuestion = async () => {
    if (!input.trim()) return;
    await startChat(input);
  };

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFollowUpQuestion();
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col items-center text-gray-200 font-sans p-8">
      <div className="w-full bg-gray-950 shadow-md p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGraduationCap className="text-5xl text-indigo-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              EduPath AI
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Temukan jalur pembelajaran yang tepat untuk mencapai cita-citamu
            dengan bantuan AI yang dipersonalisasi sesuai usia dan tujuan
            karirmu.
          </p>
        </div>

        {/* Input Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-12 bg-gray-800 p-8 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Usia Kamu
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Masukkan usia..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Cita-cita
                </label>
                <input
                  type="text"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Masukkan cita-cita..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-3 text-sm font-medium">
                  Pilihan Populer
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularCareers.map((career) => (
                    <button
                      key={career}
                      type="button"
                      onClick={() => setCareer(career)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      {career}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl font-medium transition-all transform hover:scale-[1.02]"
              >
                Mulai Perencanaan
              </button>
            </form>
          </div>
        )}

        {/* Chat Interface */}
        <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-[600px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.role === "model" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      item.role === "model" ? "bg-gray-700" : "bg-indigo-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.role === "model" ? (
                        <>
                          <FaRobot className="text-indigo-400" />
                          <span className="font-medium text-indigo-400">
                            EduPath AI
                          </span>
                        </>
                      ) : (
                        <>
                          <FaUser className="text-purple-400" />
                          <span className="font-medium text-purple-400">
                            Kamu
                          </span>
                        </>
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <Markdown>{item.parts}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-750 border-t border-gray-700">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanyakan detail lebih lanjut..."
                  className="flex-1 px-4 py-3 bg-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  rows={1}
                />
                <button
                  onClick={handleFollowUpQuestion}
                  disabled={loading}
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaArrowUp />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPlanner;
