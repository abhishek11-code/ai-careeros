import { useEffect, useState } from "react";
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

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const menuItems = [
    "Dashboard",
    "Profile",
    "Roadmap",
    "Skills",
    "AI Assistant",
  ];

  if (loading) {
    return <div className="loading">Loading AI CareerOS...</div>;
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
          throw new Error("Failed to update profile");
        }

        const updatedUser = await response.json();

        setUser(updatedUser);
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
                  activePage === item ? "active" : ""
                }`}
                onClick={() => setActivePage(item)}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p>AI CareerOS</p>
            <span>Career Intelligence Platform</span>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">YOUR PROFILE</p>
              <h1>Career Profile</h1>
              <p className="subtitle">
                Your personal career information and goals.
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
                    <strong>{user.college}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Degree</span>
                    <strong>{user.degree}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Graduation Year</span>
                    <strong>{user.graduationYear}</strong>
                  </div>

                  <div className="detail-item">
                    <span>Target Role</span>
                    <strong>{user.targetRole}</strong>
                  </div>

                  <div className="detail-item full-width">
                    <span>Skills</span>
                    <strong>{user.skills}</strong>
                  </div>

                  <div className="detail-item">
                    <span>GitHub</span>
                    <strong>{user.github}</strong>
                  </div>

                  <div className="detail-item">
                    <span>LinkedIn</span>
                    <strong>{user.linkedin}</strong>
                  </div>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setEditForm({
                      name: user.name,
                      college: user.college,
                      degree: user.degree,
                      graduationYear: user.graduationYear,
                      targetRole: user.targetRole,
                      skills: user.skills,
                      github: user.github,
                      linkedin: user.linkedin,
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
                          college: e.target.value,
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
                          degree: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input
                      type="number"
                      value={editForm.graduationYear}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          graduationYear: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Role</label>
                    <input
                      value={editForm.targetRole}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          targetRole: e.target.value,
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
                          skills: e.target.value,
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
                          github: e.target.value,
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
                          linkedin: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="edit-buttons">
                  <button
                    className="secondary-button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
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
    const roadmapSteps = [
      {
        number: 1,
        title: "Build Foundation",
        description:
          "Java, programming fundamentals and Git",
        status: "completed",
      },
      {
        number: 2,
        title: "Master DSA",
        description:
          "Data structures, algorithms and problem solving",
        status: "current",
      },
      {
        number: 3,
        title: "Full-Stack Development",
        description:
          "Spring Boot, React and databases",
        status: "upcoming",
      },
      {
        number: 4,
        title: "AI & Career Preparation",
        description:
          "AI projects, resume and interview preparation",
        status: "upcoming",
      },
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
                  activePage === item ? "active" : ""
                }`}
                onClick={() => setActivePage(item)}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p>AI CareerOS</p>
            <span>Career Intelligence Platform</span>
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
                Follow your personalized path toward your target role.
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
            <div className="roadmap-page-header">
              <div>
                <p className="card-label">
                  TARGET ROLE
                </p>

                <h2>{user.targetRole}</h2>
              </div>

              <div className="progress-box">
                <span>Overall Progress</span>
                <strong>25%</strong>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <div className="roadmap-timeline">
              {roadmapSteps.map((step) => (
                <div
                  className={`roadmap-step ${step.status}`}
                  key={step.number}
                >
                  <div className="roadmap-step-number">
                    {step.status === "completed"
                      ? "✓"
                      : step.number}
                  </div>

                  <div className="roadmap-step-content">
                    <div>
                      <span className="step-status">
                        {step.status === "completed"
                          ? "COMPLETED"
                          : step.status === "current"
                          ? "CURRENT"
                          : "UPCOMING"}
                      </span>

                      <h3>{step.title}</h3>

                      <p>{step.description}</p>
                    </div>

                    {step.status === "current" && (
                      <button className="roadmap-action">
                        Continue →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // =========================
  // DASHBOARD PAGE
  // =========================

  const skillCount = user.skills
    ? user.skills
        .split(",")
        .filter((skill) => skill.trim())
        .length
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
                activePage === item ? "active" : ""
              }`}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p>AI CareerOS</p>
          <span>Career Intelligence Platform</span>
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
              Build your career with AI-powered guidance.
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
            <strong>{user.targetRole}</strong>
            <small>Your current career goal</small>
          </div>

          <div className="stat-card">
            <span>Skills</span>
            <strong>{skillCount}</strong>
            <small>Skills currently tracked</small>
          </div>

          <div className="stat-card">
            <span>Graduation</span>
            <strong>{user.graduationYear}</strong>
            <small>Target graduation year</small>
          </div>

          <div className="stat-card">
            <span>Career Progress</span>
            <strong>10%</strong>
            <small>Keep building 🚀</small>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card large-card">
            <div className="card-header">
              <div>
                <p className="card-label">
                  YOUR JOURNEY
                </p>

                <h2>Career Roadmap</h2>
              </div>

              <button
                className="view-button"
                onClick={() =>
                  setActivePage("Roadmap")
                }
              >
                View Roadmap
              </button>
            </div>

            <div className="roadmap">
              <div className="roadmap-item completed">
                <div className="roadmap-number">
                  ✓
                </div>

                <div>
                  <strong>
                    Build Foundation
                  </strong>

                  <p>
                    Java, programming fundamentals and Git
                  </p>
                </div>
              </div>

              <div className="roadmap-item current">
                <div className="roadmap-number">
                  2
                </div>

                <div>
                  <strong>
                    Master DSA
                  </strong>

                  <p>
                    Data structures, algorithms and problem solving
                  </p>
                </div>
              </div>

              <div className="roadmap-item">
                <div className="roadmap-number">
                  3
                </div>

                <div>
                  <strong>
                    Full-Stack Development
                  </strong>

                  <p>
                    Spring Boot, React and databases
                  </p>
                </div>
              </div>

              <div className="roadmap-item">
                <div className="roadmap-number">
                  4
                </div>

                <div>
                  <strong>
                    AI & Career Preparation
                  </strong>

                  <p>
                    AI projects, resume and interview preparation
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <p className="card-label">
              PROFILE
            </p>

            <h2>Career Profile</h2>

            <div className="profile-info">
              <div>
                <span>Name</span>
                <strong>{user.name}</strong>
              </div>

              <div>
                <span>College</span>
                <strong>{user.college}</strong>
              </div>

              <div>
                <span>Degree</span>
                <strong>{user.degree}</strong>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage("Profile")
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
              Get personalized recommendations based on your target role,
              skills and career progress.
            </p>
          </div>

          <button
            className="ai-button"
            onClick={() =>
              setActivePage("AI Assistant")
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