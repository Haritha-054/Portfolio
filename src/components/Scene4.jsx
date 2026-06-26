import React from 'react';

export default function Scene4() {
  const row1Data = [
    {
      name: "Smartathon",
      date: "JAN 2024",
      pos: "RUNNER-UP",
      reward: "VCE Hyderabad",
      isWinner: true,
      rotate: -3,
      cx: 35,
      cy: 52,
      img: "/smartathon.jpg",
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_smartathon26-festronix25-bhoomiai-activity-7423760794137542656-usXW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      name: "CBIT Hackathon Sudhee",
      date: "FEB 2026",
      pos: "1ST PLACE",
      reward: "₹12,000",
      isWinner: true,
      rotate: 3,
      cx: 65,
      cy: 52,
      img: "/sudhee_cbit.jpg",
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathonwin-sudheecbit-aiproject-activity-7429195211697754112-bxl8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      imgStyle: { objectFit: "contain", backgroundColor: "#0c0a06" }
    }
  ];

  const row2Data = [
    {
      name: "Smart India Hackathon",
      date: "DEC 2023",
      pos: "FINALIST",
      reward: "MoE, Govt of India",
      isWinner: false,
      rotate: -2,
      cx: 12,
      cy: 37,
      img: "/sih.jpg",
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_excited-to-share-my-experience-of-participating-activity-7404898857660256256-KYH3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      name: "Women Ideathon 1.0",
      date: "FEB 2026",
      pos: "FINALIST",
      reward: "CBIT Hyderabad",
      isWinner: false,
      rotate: 1,
      cx: 32,
      cy: 48,
      img: "/women_ideathon.jpg",
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_womenideathon-cbit-sudhee2026-activity-7434179641344716800--Vck?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      name: "Cognizant Technoverse",
      date: "APR 2026",
      pos: "PRE-FINALIST",
      reward: "RECOGNITION",
      isWinner: false,
      rotate: -1,
      cx: 52,
      cy: 51,
      img: "/technoverse.png"
    },
    {
      name: "GSSoC '26 Contributor",
      date: "MAY 2026",
      pos: "RISING STAR",
      reward: "GSSoC 2026",
      isWinner: true,
      rotate: -2,
      cx: 72,
      cy: 46,
      img: "/gsoc.jpg"
    },
    {
      name: "Aethronix Hackathon",
      date: "MAY 2026",
      pos: "FINALIST",
      reward: "Internship",
      isWinner: true,
      rotate: 4,
      cx: 92,
      cy: 33,
      img: "/algorithm_aliens.png",
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathon-techastra-innovation-activity-7462870889798418433-2XSo?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    }
  ];

  const renderCard = (card, i, forceGoldPos = false) => {
    return (
      <div
        key={i}
        className="s4-card-wrapper"
        style={{
          left: `${card.cx}%`,
          top: `${card.cy}%`,
          transform: `translate(-50%, -15px) rotate(${card.rotate}deg)`
        }}
      >
        {/* Clip attaching to the thread */}
        <div className="s4-clip"></div>

        {/* Winner Badge Protruding Behind, sits above clip */}
        {card.isWinner && (
          <div className="s4-winner-tab">
            <span>🏆 WINNER</span>
          </div>
        )}

        <div className="s4-hang-card">
          {card.link ? (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="s4-card-photo clickable-photo"
              title="Click to view LinkedIn post"
            >
              <img src={card.img} alt={card.name} style={card.imgStyle || {}} />
              <div className="s4-card-date">{card.date}</div>
            </a>
          ) : (
            <div className="s4-card-photo">
              <img src={card.img} alt={card.name} style={card.imgStyle || {}} />
              <div className="s4-card-date">{card.date}</div>
            </div>
          )}

          <div className="s4-card-info">
            <h4 className="s4-card-name">{card.name}</h4>
            <div className={`s4-card-pos ${card.isWinner || forceGoldPos ? 'gold' : ''}`}>{card.pos}</div>
            <div className="s4-card-reward">{card.reward}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="scene-4" className="s4-hanging-section">

      {/* Background stars/particles */}
      <div className="s4-starfield"></div>

      <div className="s4-layout-container">

        {/* TOP HALF: Header on left, Thread 1 on right */}
        <div className="s4-top-half">
          <div className="s4-header-area">
            <div className="s4-eyebrow">ACHIEVEMENTS</div>
            <h2 className="s4-title">
              <span className="white">MILESTONES</span><br />
              <span className="gold">THAT MATTER</span>
            </h2>
            <p className="s4-subtitle">
              Every challenge. Every late night.<br />
              Every milestone that shaped my journey.
            </p>
          </div>

          <div className="s4-thread-row s4-thread-right">
            <svg className="s4-thread-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Thread Path */}
              <path
                d="M 5,35 Q 52.5,75 100,30"
                className="s4-thread-path"
              />
              {/* Glowing fairy lights */}
              <circle cx="12" cy="40" r="1.5" className="s4-fairy-light" />
              <circle cx="25" cy="48" r="2.0" className="s4-fairy-light" />
              <circle cx="52.5" cy="54" r="1.2" className="s4-fairy-light" />
              <circle cx="80" cy="45" r="1.8" className="s4-fairy-light" />
              <circle cx="95" cy="35" r="1.5" className="s4-fairy-light" />
            </svg>
            {row1Data.map((c, i) => renderCard(c, i, false))}
          </div>
        </div>

        {/* BOTTOM HALF: Thread 2 full width below */}
        <div className="s4-bottom-half">
          <div className="s4-thread-row s4-thread-full">
            <svg className="s4-thread-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Thread Path */}
              <path
                d="M -5,20 Q 50,85 110,15"
                className="s4-thread-path"
              />
              {/* Glowing fairy lights */}
              <circle cx="10" cy="35" r="1.5" className="s4-fairy-light" />
              <circle cx="30" cy="47" r="2.0" className="s4-fairy-light" />
              <circle cx="50" cy="51" r="1.2" className="s4-fairy-light" />
              <circle cx="70" cy="47" r="1.8" className="s4-fairy-light" />
              <circle cx="90" cy="35" r="1.5" className="s4-fairy-light" />
            </svg>
            {row2Data.map((c, i) => renderCard(c, i, true))}
          </div>
        </div>

      </div>

      {/* Footer / Outro */}
      <div className="s4-footer">
        <svg className="s4-arrow-svg" viewBox="0 0 100 50">
          <path d="M 10 10 Q 50 40, 90 20" fill="none" stroke="rgba(255,215,0,0.5)" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="90,20 85,15 88,25" fill="rgba(255,215,0,0.5)" />
        </svg>
        <div className="s4-footer-text">Many more to come... ✨</div>
      </div>

    </section>
  );
}
