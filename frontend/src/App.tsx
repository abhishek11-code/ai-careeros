import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

interface User {
  id: number;
  name: string;
  college: string;
  degree: string;
  graduationYear: number;
  targetRole: string;
  skills: string;
  github: string;
  linkedin: string;
}

interface RoadmapPhase {
  phase: number;
  title: string;
  durationWeeks: number;
  skills: string[];
  projects: string[];
  description: string;
}

interface AIRoadmap {
  targetRole: string;
  currentLevel: string;
  estimatedMonths: number;
  summary: string;
  phases: RoadmapPhase[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [aiRoadmap, setAiRoadmap] =
    useState<AIRoadmap | null>(null);

  const [roadmapLoading, setRoadmapLoading] =
    useState(false);

  const [roadmapError, setRoadmapError] =
    useState("");

  // =========================
  // AI ASSISTANT STATE
  // =========================

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([]);

  const [chatInput, setChatInput] =
    useState("");

  const [chatLoading, setChatLoading] =
    useState(false);

  const [chatError, setChatError] =
    useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    college: "",
    degree: "",
    graduationYear: 2028,
    targetRole: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    fetch("http://localhost:8080/api/users/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // =========================
  // MENU
  // =========================

  const menuItems = [
    "Dashboard",
    "Profile",
    "Roadmap",
    "Skills",
    "AI Assistant",
  ];

  // =========================
  // GENERATE AI ROADMAP
  // =========================

  const generateAIRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/ai/roadmap/1",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate AI roadmap"
        );
      }

      const data = await response.json();

      setAiRoadmap(data);
    } catch (error) {
      console.error(error);

      setRoadmapError(
        "Unable to generate your AI roadmap. Please try again."
      );
    } finally {
      setRoadmapLoading(false);
    }
  };

  // =========================
  // AI ASSISTANT
  // =========================

  const sendMessage = async (
    message?: string
  ) => {
    const question =
      message !== undefined
        ? message
        : chatInput.trim();

    if (!question || chatLoading) {
      return;
    }

    setChatInput("");
    setChatError("");

    setChatMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
      },
    ]);

    setChatLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/ai/chat/1",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: question,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to get AI response"
        );
      }

      const data = await response.text();

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data,
        },
      ]);
    } catch (error) {
      console.error(error);

      setChatError(
        "Unable to connect to the AI assistant. Make sure the backend is running."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatError("");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loading">
        Loading AI CareerOS...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading">
        Failed to load career profile.
      </div>
    );
  }

  // =========================
  // PROFILE PAGE
  // =========================

  if (activePage === "Profile") {
    const handleSaveProfile = async () => {
      setSaving(true);

      try {
        const response = await fetch(
          "http://localhost:8080/api/users/1",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editForm),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update profile"
          );
        }

        const updatedUser = await response.json();

        setUser(updatedUser);

        setAiRoadmap(null);

        setEditing(false);
      } catch (error) {
        console.error(error);
        alert("Failed to save profile.");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span>AI CareerOS</span>
          </div>

          <nav>
            {menuItems.map((item) => (
              <button
                key={item}
                className={`nav-item ${
                  activePage === item
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item)
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p>AI CareerOS</p>
            <span>
              Career Intelligence Platform
            </span>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">
                YOUR PROFILE
              </p>

              <h1>Career Profile</h1>

              <p className="subtitle">
                Your personal career information
                and goals.
              </p>
            </div>

            <div className="profile-circle">
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </header>

          <section className="profile-page-card">
            <div className="profile-avatar">
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {!editing ? (
              <>
                <h2>{user.name}</h2>

                <p className="profile-role">
                  {user.targetRole}
                </p>

                <div className="profile-details">
                  <div className="detail-item">
                    <span>College</span>
                    <strong>
                      {user.college}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Degree</span>
                    <strong>
                      {user.degree}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>
                      Graduation Year
                    </span>
                    <strong>
                      {user.graduationYear}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Target Role</span>
                    <strong>
                      {user.targetRole}
                    </strong>
                  </div>

                  <div className="detail-item full-width">
                    <span>Skills</span>
                    <strong>
                      {user.skills}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>GitHub</span>
                    <strong>
                      {user.github}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>LinkedIn</span>
                    <strong>
                      {user.linkedin}
                    </strong>
                  </div>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setEditForm({
                      name: user.name,
                      college: user.college,
                      degree: user.degree,
                      graduationYear:
                        user.graduationYear,
                      targetRole:
                        user.targetRole,
                      skills: user.skills,
                      github: user.github,
                      linkedin:
                        user.linkedin,
                    });

                    setEditing(true);
                  }}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <h2>Edit Profile</h2>

                <p className="profile-role">
                  Update your career information.
                </p>

                <div className="edit-form">
                  <div className="form-group">
                    <label>Name</label>

                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>College</label>

                    <input
                      value={editForm.college}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          college:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Degree</label>

                    <input
                      value={editForm.degree}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          degree:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Graduation Year
                    </label>

                    <input
                      type="number"
                      value={
                        editForm.graduationYear
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          graduationYear:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Role</label>

                    <input
                      value={
                        editForm.targetRole
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          targetRole:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Skills</label>

                    <input
                      value={editForm.skills}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          skills:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>GitHub</label>

                    <input
                      value={editForm.github}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          github:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>LinkedIn</label>

                    <input
                      value={editForm.linkedin}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          linkedin:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="edit-buttons">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setEditing(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={
                      handleSaveProfile
                    }
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  // =========================
  // ROADMAP PAGE
  // =========================

  if (activePage === "Roadmap") {
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span>AI CareerOS</span>
          </div>

          <nav>
            {menuItems.map((item) => (
              <button
                key={item}
                className={`nav-item ${
                  activePage === item
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item)
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p>AI CareerOS</p>
            <span>
              Career Intelligence Platform
            </span>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">
                YOUR CAREER JOURNEY
              </p>

              <h1>Career Roadmap</h1>

              <p className="subtitle">
                AI-powered roadmap personalized
                for your career.
              </p>
            </div>

            <div className="profile-circle">
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </header>

          <section className="roadmap-page-card">
            {!aiRoadmap &&
              !roadmapLoading &&
              !roadmapError && (
                <div className="ai-roadmap-start">
                  <p className="card-label">
                    AI CAREER INTELLIGENCE
                  </p>

                  <h2>
                    Generate Your
                    Personalized Roadmap
                  </h2>

                  <p>
                    AI CareerOS will analyze your
                    target role, current skills,
                    degree and graduation timeline
                    to create a personalized career
                    plan.
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      generateAIRoadmap
                    }
                  >
                    Generate AI Roadmap →
                  </button>
                </div>
              )}

            {roadmapLoading && (
              <div className="loading">
                <h2>
                  Generating your roadmap...
                </h2>

                <p>
                  AI is analyzing your skills
                  and career goal.
                </p>
              </div>
            )}

            {roadmapError && (
              <div className="loading">
                <h2>
                  Something went wrong
                </h2>

                <p>{roadmapError}</p>

                <button
                  className="primary-button"
                  onClick={
                    generateAIRoadmap
                  }
                >
                  Try Again
                </button>
              </div>
            )}

            {aiRoadmap &&
              !roadmapLoading && (
                <>
                  <div className="roadmap-page-header">
                    <div>
                      <p className="card-label">
                        TARGET ROLE
                      </p>

                      <h2>
                        {aiRoadmap.targetRole}
                      </h2>

                      <p className="subtitle">
                        {
                          aiRoadmap.currentLevel
                        }
                      </p>
                    </div>

                    <div className="progress-box">
                      <span>
                        Estimated Timeline
                      </span>

                      <strong>
                        {
                          aiRoadmap.estimatedMonths
                        }{" "}
                        months
                      </strong>
                    </div>
                  </div>

                  <div className="ai-roadmap-summary">
                    <p className="card-label">
                      AI ROADMAP SUMMARY
                    </p>

                    <p>
                      {aiRoadmap.summary}
                    </p>
                  </div>

                  <div className="roadmap-timeline">
                    {aiRoadmap.phases.map(
                      (phase) => (
                        <div
                          className="roadmap-step upcoming"
                          key={phase.phase}
                        >
                          <div className="roadmap-step-number">
                            {phase.phase}
                          </div>

                          <div className="roadmap-step-content">
                            <div>
                              <span className="step-status">
                                PHASE{" "}
                                {phase.phase}
                              </span>

                              <h3>
                                {phase.title}
                              </h3>

                              <p>
                                {
                                  phase.description
                                }
                              </p>

                              <p>
                                <strong>
                                  Duration:
                                </strong>{" "}
                                {
                                  phase.durationWeeks
                                }{" "}
                                weeks
                              </p>

                              <p>
                                <strong>
                                  Skills:
                                </strong>{" "}
                                {phase.skills.join(
                                  ", "
                                )}
                              </p>

                              <p>
                                <strong>
                                  Projects:
                                </strong>{" "}
                                {phase.projects.join(
                                  ", "
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    className="secondary-button"
                    onClick={
                      generateAIRoadmap
                    }
                  >
                    Regenerate Roadmap
                  </button>
                </>
              )}
          </section>
        </main>
      </div>
    );
  }

  // =========================
  // AI ASSISTANT PAGE
  // =========================

  if (activePage === "AI Assistant") {
    const suggestedQuestions = [
      "What should I learn next?",
      "How can I prepare for interviews?",
      "What projects should I build?",
      "Am I on track for my target role?",
    ];

    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span>AI CareerOS</span>
          </div>

          <nav>
            {menuItems.map((item) => (
              <button
                key={item}
                className={`nav-item ${
                  activePage === item
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item)
                }
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p>AI CareerOS</p>
            <span>
              Career Intelligence Platform
            </span>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">
                AI CAREER INTELLIGENCE
              </p>

              <h1>AI Career Assistant</h1>

              <p className="subtitle">
                Ask anything about your career,
                skills and roadmap.
              </p>
            </div>

            <div className="profile-circle">
              {user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </header>

          <section className="ai-chat-card">
            <div className="chat-header">
              <div>
                <p className="card-label">
                  PERSONALIZED AI
                </p>

                <h2>
                  CareerOS Assistant
                </h2>
              </div>

              {chatMessages.length > 0 && (
                <button
                  className="secondary-button"
                  onClick={clearChat}
                >
                  Clear Chat
                </button>
              )}
            </div>

            {chatMessages.length === 0 ? (
              <div className="chat-welcome">
                <div className="ai-avatar">
                  ✦
                </div>

                <h2>
                  Hi {user.name.split(" ")[0]} 👋
                </h2>

                <p>
                  I'm your AI career assistant.
                  I know your target role,
                  current skills and graduation
                  timeline, so I can give you
                  personalized career advice.
                </p>

                <div className="suggested-questions">
                  {suggestedQuestions.map(
                    (question) => (
                      <button
                        key={question}
                        onClick={() =>
                          sendMessage(question)
                        }
                      >
                        {question}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="chat-messages">
                {chatMessages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`chat-message ${
                        message.role
                      }`}
                    >
                      <div className="message-avatar">
                        {message.role ===
                        "assistant"
                          ? "✦"
                          : user.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()}
                      </div>

                      <div className="message-content">
    <ReactMarkdown>{message.content}</ReactMarkdown>
</div>
                    </div>
                  )
                )}

                {chatLoading && (
                  <div className="chat-message assistant">
                    <div className="message-avatar">
                      ✦
                    </div>

                    <div className="message-content typing">
                      AI is thinking...
                    </div>
                  </div>
                )}
              </div>
            )}

            {chatError && (
              <div className="chat-error">
                {chatError}
              </div>
            )}

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Ask your career assistant..."
                value={chatInput}
                disabled={chatLoading}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                className="ai-button"
                disabled={
                  chatLoading ||
                  !chatInput.trim()
                }
                onClick={() =>
                  sendMessage()
                }
              >
                {chatLoading
                  ? "Thinking..."
                  : "Send →"}
              </button>
            </div>

            <p className="chat-disclaimer">
              AI CareerOS uses your career profile
              to personalize its responses.
            </p>
          </section>
        </main>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  const skillCount = user.skills
    ? user.skills
        .split(",")
        .filter(
          (skill) => skill.trim()
        ).length
    : 0;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <span>AI CareerOS</span>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${
                activePage === item
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(item)
              }
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p>AI CareerOS</p>
          <span>
            Career Intelligence Platform
          </span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              CAREER DASHBOARD
            </p>

            <h1>
              Welcome back, {user.name} 👋
            </h1>

            <p className="subtitle">
              Build your career with AI-powered
              guidance.
            </p>
          </div>

          <div className="profile-circle">
            {user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Target Role</span>

            <strong>
              {user.targetRole}
            </strong>

            <small>
              Your current career goal
            </small>
          </div>

          <div className="stat-card">
            <span>Skills</span>

            <strong>{skillCount}</strong>

            <small>
              Skills currently tracked
            </small>
          </div>

          <div className="stat-card">
            <span>Graduation</span>

            <strong>
              {user.graduationYear}
            </strong>

            <small>
              Target graduation year
            </small>
          </div>

          <div className="stat-card">
            <span>Career Progress</span>

            <strong>10%</strong>

            <small>
              Keep building 🚀
            </small>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card large-card">
            <div className="card-header">
              <div>
                <p className="card-label">
                  YOUR JOURNEY
                </p>

                <h2>
                  Career Roadmap
                </h2>
              </div>

              <button
                className="view-button"
                onClick={() =>
                  setActivePage(
                    "Roadmap"
                  )
                }
              >
                View Roadmap
              </button>
            </div>

            {aiRoadmap ? (
              <div className="roadmap">
                {aiRoadmap.phases
                  .slice(0, 4)
                  .map((phase) => (
                    <div
                      className="roadmap-item"
                      key={phase.phase}
                    >
                      <div className="roadmap-number">
                        {phase.phase}
                      </div>

                      <div>
                        <strong>
                          {phase.title}
                        </strong>

                        <p>
                          {
                            phase.description
                          }
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="roadmap">
                <div className="roadmap-item">
                  <div className="roadmap-number">
                    AI
                  </div>

                  <div>
                    <strong>
                      Personalized Roadmap
                    </strong>

                    <p>
                      Generate your AI-powered
                      career roadmap.
                    </p>
                  </div>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    setActivePage(
                      "Roadmap"
                    )
                  }
                >
                  Generate Roadmap →
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-card">
            <p className="card-label">
              PROFILE
            </p>

            <h2>
              Career Profile
            </h2>

            <div className="profile-info">
              <div>
                <span>Name</span>

                <strong>
                  {user.name}
                </strong>
              </div>

              <div>
                <span>College</span>

                <strong>
                  {user.college}
                </strong>
              </div>

              <div>
                <span>Degree</span>

                <strong>
                  {user.degree}
                </strong>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage(
                  "Profile"
                )
              }
            >
              View Profile
            </button>
          </div>
        </section>

        <section className="ai-card">
          <div>
            <p className="card-label">
              AI CAREER ASSISTANT
            </p>

            <h2>
              Your next step is waiting.
            </h2>

            <p>
              Get personalized recommendations
              based on your target role, skills
              and career progress.
            </p>
          </div>

          <button
            className="ai-button"
            onClick={() =>
              setActivePage(
                "AI Assistant"
              )
            }
          >
            Open AI Assistant →
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;