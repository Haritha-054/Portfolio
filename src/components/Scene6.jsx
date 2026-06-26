import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import project screenshots
import bhoomiaiImg from '../assets/bhoomiai.png';
import dockidoImg from '../assets/dockido.png';
import novaImg from '../assets/nova.png';
import plantDetectorImg from '../assets/plant_disease_detector.png';

// Import certification/hackathon certificates
import althonCertImg from '../assets/althon_cert.png';
import aimlInternshipImg from '../assets/aiml_internship.png';
import oracleCertImg from '../assets/oracle_cert.png';
import postgresqlCertImg from '../assets/postgresql_cert.png';
import pythonCertImg from '../assets/python_cert.png';
import genaiInternshipImg from '../assets/genai_internship.png';
import cloudComputingCertImg from '../assets/cloud_computing_cert.png';
import softwareEngineeringCertImg from '../assets/software_engineering_cert.png';
import sparkathonCertImg from '../assets/sparkathon_cert.png';
import pythonEssentialsCertImg from '../assets/python_essentials_cert.jpg';
import udemyCertImg from '../assets/udemy_cert.jpg';
import viswamAiInternshipImg from '../assets/viswam_ai_internship.jpg';
import edunetInternshipImg from '../assets/edunet_internship.jpg';
import cEssentialsCertImg from '../assets/c_essentials_cert.jpg';
import smartathonCertImg from '../assets/smartathon_cert.png';
import algorithmAliensCertImg from '../assets/algorithm_aliens_cert.png';
import cbitWomenCertImg from '../assets/cbit_women_cert.jpg';
import csiFusionCertImg from '../assets/csi_fusion_cert.png';
import sihFinalistCertImg from '../assets/sih_finalist_cert.png';

gsap.registerPlugin(ScrollTrigger);

export default function Scene6() {
  const sectionRef = useRef(null);
  const detailContentRef = useRef(null);

  const projects = [
    {
      id: "proj-1",
      name: "Career Genome",
      desc: "Developed an AI-powered career intelligence platform that analyzes resumes and GitHub repositories to generate a Skill Genome, Career Readiness Index, and Opportunity Fit Scores, along with mock interviews and core concept quizzes. Awarded 1st place at the CBIT Sudhee Hackathon 2026.",
      tech: ["React.js", "TailwindCSS", "Three.js", "Flask", "MongoDB"],
      link: "https://github.com/Haritha-054",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathonwin-sudheecbit-aiproject-activity-7429195211697754112-bxl8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      id: "proj-2",
      name: "BhoomiAI",
      desc: "AI-Driven Land & Soil Intelligence Platform. Addressed lack of accessible land/soil insights for agriculture planning. Built an AI platform providing predictive analytics, land insights, and decision support through interactive dashboards.",
      tech: ["React.js", "Python", "Flask"],
      link: "https://github.com/Haritha-054/BhoomiAI",
      image: bhoomiaiImg,
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_smartathon26-festronix25-bhoomiai-activity-7423760794137542656-usXW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      id: "proj-3",
      name: "Oilwise",
      desc: "AI-Driven Used Oil Management Platform. Tackled improper disposal of used cooking oil causing environmental hazards. Developed a digital system to track, classify, and promote responsible oil recycling with analytics and reporting.",
      tech: ["React.js", "Node.js", "Supabase"],
      link: "https://github.com/Haritha-054/Oilwise_SIH25269",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_excited-to-share-my-experience-of-participating-activity-7404898857660256256-KYH3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0"
    },
    {
      id: "proj-4",
      name: "NOVA - CSI Student Body Website",
      desc: "Developed an interactive website for the CSI student body used by 100+ students, improving event visibility and engagement.",
      tech: ["HTML", "CSS", "React.js", "Node.js"],
      link: "https://www.thenova.club/",
      image: novaImg,
      outputLink: "https://www.thenova.club/"
    },
    {
      id: "proj-5",
      name: "Dockido",
      desc: "Built a responsive website offering child health info (ages 0–12) including symptoms, precautions, tips, and vaccination schedules. Included sections for healthcare, diet plans, and medications for newborns and pregnant women.",
      tech: ["Html", "CSS", "React.js", "Node.js", "MySQL"],
      link: "https://github.com/Haritha-054/Dockido",
      image: dockidoImg,
      outputLink: "https://github.com/Haritha-054/Dockido"
    },
    {
      id: "proj-6",
      name: "AI Plant Disease Detector",
      desc: "Built a web application that detects plant diseases from user-uploaded images using a TensorFlow.js model. Integrated an OpenAI-powered chatbot to provide disease info, remedies, and preventive care via a responsive MERN stack interface.",
      tech: ["TensorFlow.js", "React.js", "OpenAI API"],
      link: "https://github.com/Haritha-054/Plant-Disease-Detector",
      image: plantDetectorImg,
      outputLink: "https://github.com/Haritha-054/Plant-Disease-Detector"
    }
  ];

  const internships = [
    {
      id: "int-1",
      name: "AWS AI/ML Virtual Internship",
      desc: "Completed a virtual internship on AI/ML using AWS services, gaining hands-on experience with Amazon SageMaker, computer vision, NLP, and cloud-based model deployment. Organized by AICTE and EduSkills.",
      tech: ["AWS SageMaker", "Computer Vision", "NLP", "Model Deployment"],
      link: null,
      outputLink: null,
      image: aimlInternshipImg
    },
    {
      id: "int-2",
      name: "Edunet AI Azure Internship",
      desc: "Completed a 4-week virtual internship on Machine Learning with Microsoft Azure, gaining hands-on experience with cloud-based ML tools and workflows. Organized by Edunet Foundation in collaboration with Microsoft and AICTE.",
      tech: ["Microsoft Azure", "Machine Learning", "Cloud Workflows", "AICTE / Edunet"],
      link: null,
      outputLink: null,
      image: edunetInternshipImg
    },
    {
      id: "int-3",
      name: "AWS Gen AI Virtual Internship",
      desc: "Completed an 8-week Gen AI Virtual Internship organized by AICTE, Ministry of Education, and EduSkills, with curriculum provided by AWS Academy. Gained hands-on experience in generative AI architectures, large language models, prompt engineering, and cloud applications, achieving an Outstanding (O) grade.",
      tech: ["Generative AI", "AWS Academy", "LLMs", "EduSkills"],
      link: null,
      outputLink: null,
      image: genaiInternshipImg
    },
    {
      id: "int-4",
      name: "Viswam AI Summer of AI Internship",
      desc: "Participated in the 4-week Summer of AI Internship conducted by VISWAM.AI in collaboration with Meta, Swecha Telangana, and IIIT Hyderabad. Developed impactful technology solutions addressing real-world challenges of the Global South.",
      tech: ["Artificial Intelligence", "VISWAM.AI", "Meta / Swecha", "IIIT Hyderabad"],
      link: "https://code.swecha.org/haritha_reddy",
      outputLink: null,
      image: viswamAiInternshipImg
    }
  ];

  const certifications = [
    {
      id: "cert-1",
      name: "Python 3.4.3 Training",
      desc: "Completed python programming certification. Organized by Spoken Tutorial Project, IIT Bombay, in partnership with Cisco Networking Academy.",
      tech: ["Python 3.4.3", "IIT Bombay", "Cisco Academy"],
      link: "https://spoken-tutorial.org/",
      outputLink: null,
      image: pythonCertImg
    },
    {
      id: "cert-2",
      name: "Programming Essentials in C",
      desc: "Completed the CLA: Programming Essentials in C course administered by Cisco Networking Academy, gaining foundation skills in C programming, algorithm design, syntax, and coding practices.",
      tech: ["C Language", "Cisco Academy", "C++ Institute", "CLA"],
      link: "https://www.netacad.com/",
      outputLink: null,
      image: cEssentialsCertImg
    },
    {
      id: "cert-3",
      name: "Database Programming with SQL",
      desc: "Completed training on database programming, SQL queries, relational schema design, and transactional queries. Organized by Oracle Academy.",
      tech: ["SQL", "Database Design", "Oracle Academy"],
      link: "https://academy.oracle.com/",
      outputLink: null,
      image: oracleCertImg
    },
    {
      id: "cert-4",
      name: "Complete Web Development Bootcamp",
      desc: "Completed full-stack software development training covering HTML, CSS, Javascript, Node.js, React, and MongoDB database integration.",
      tech: ["React.js", "Node.js", "Full-Stack Dev"],
      link: "https://www.udemy.com/",
      outputLink: null,
      image: udemyCertImg
    },
    {
      id: "cert-5",
      name: "RDBMS PostgreSQL Training",
      desc: "Successfully completed the RDBMS PostgreSQL test organized at MVSR Engineering College with course material provided by the Spoken Tutorial Project, IIT Bombay. Scored 95.00% in the examination.",
      tech: ["PostgreSQL", "RDBMS", "IIT Bombay"],
      link: "https://spoken-tutorial.org/",
      outputLink: null,
      image: postgresqlCertImg
    },
    {
      id: "cert-6",
      name: "Introduction to Cloud Computing",
      desc: "Completed the Introduction to Cloud Computing course offered by Infosys Springboard, covering core cloud concepts, deployment models, architecture, and cloud service providers.",
      tech: ["Cloud Computing", "Infosys Springboard", "Cloud Infrastructure"],
      link: "https://verify.onwingspan.com",
      outputLink: null,
      image: cloudComputingCertImg
    },
    {
      id: "cert-7",
      name: "CS302: Software Engineering",
      desc: "Earned the CS302: Software Engineering certification from Saylor Academy, demonstrating proficiency in software development lifecycles, requirements analysis, system design, testing methodologies, and software project management.",
      tech: ["Software Engineering", "Saylor Academy", "SDLC", "System Design"],
      link: "https://www.saylor.org/",
      outputLink: null,
      image: softwareEngineeringCertImg
    },
    {
      id: "cert-8",
      name: "PCAP: Programming Essentials in Python",
      desc: "Earned the PCAP: Programming Essentials in Python credential from Cisco Networking Academy and OpenEDG Python Institute. Covered core concepts of computer programming, control flow, functions, OOP paradigms, and standard library functions.",
      tech: ["Python", "Cisco Academy", "OpenEDG", "PCAP"],
      link: "https://www.pythoninstitute.org/",
      outputLink: null,
      image: pythonEssentialsCertImg
    }
  ];

  const hackathons = [
    {
      id: "hack-1",
      name: "Smart India Hackathon (SIH) 2025",
      desc: "Selected among top national finalist teams for OilWise, an AI-powered sustainability and crop advisory platform. Organized by the Ministry of Education, Govt of India.",
      tech: ["AI Sustainability", "National Finalist", "SIH 2025"],
      link: "https://github.com/Haritha-054/Oilwise_SIH25269",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_excited-to-share-my-experience-of-participating-activity-7404898857660256256-KYH3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      badge: "Finalist",
      image: sihFinalistCertImg
    },
    {
      id: "hack-2",
      name: "Sudhee CBIT Hackathon 2026",
      desc: "Secured 1st Place and a cash reward of ₹12,000 for developing an innovative AI-based solution under competitive evaluation. Organized by Chaitanya Bharathi Institute of Technology.",
      tech: ["1st Place Winner", "AI Project", "CBIT Hyderabad"],
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathonwin-sudheecbit-aiproject-activity-7429195211697754112-bxl8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathonwin-sudheecbit-aiproject-activity-7429195211697754112-bxl8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      badge: "Winner"
    },
    {
      id: "hack-3",
      name: "Smartathon '26 (Festronix)",
      desc: "Secured 1st Position (Winner) in the national-level Smartathon '26 event organized during Festronix-25 at Vardhaman College of Engineering, developing the AI-driven land intelligence platform BhoomiAI.",
      tech: ["1st Place Winner", "BhoomiAI", "Vardhaman College"],
      link: "https://github.com/Haritha-054/BhoomiAI",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_smartathon26-festronix25-bhoomiai-activity-7423760794137542656-usXW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      badge: "Winner",
      image: smartathonCertImg
    },
    {
      id: "hack-4",
      name: "Algorithm Aliens Hackathon 2026",
      desc: "Recognized for unique solution approach at the Aethronix 2026 Hackathon organized by Algorithm Aliens Private Limited. Awarded for creative thinking, innovative problem-solving, and distinctive approach during the 16th–17th May event.",
      tech: ["Aethronix Hackathon", "Winner", "Algorithm Aliens"],
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathon-techastra-innovation-activity-7462870889798418433-2XSo?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_hackathon-techastra-innovation-activity-7462870889798418433-2XSo?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      badge: "Winner",
      image: algorithmAliensCertImg
    },
    {
      id: "hack-5",
      name: "CBIT Women Ideathon 1.0",
      desc: "Selected as national finalist for the CBIT Women Ideathon 1.0, presenting innovative tech solutions. Organized by Chaitanya Bharathi Institute of Technology.",
      tech: ["National Finalist", "Women Ideathon", "CBIT Hyderabad"],
      link: "https://www.linkedin.com/posts/dondeti-haritha-reddy_womenideathon-cbit-sudhee2026-activity-7434179641344716800--Vck?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      outputLink: "https://www.linkedin.com/posts/dondeti-haritha-reddy_womenideathon-cbit-sudhee2026-activity-7434179641344716800--Vck?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCVWoBnIRpg8I0VU34t0-G54cWhHOP2k0",
      image: cbitWomenCertImg
    },
    {
      id: "hack-6",
      name: "Walmart Sparkathon 2025",
      desc: "Designed and built an AI-powered smart box recommender and container verification tool using image classification. Participated as a collegiate competitor.",
      tech: ["Image Classification", "Smart Box Dev", "Participant"],
      link: "https://github.com/Haritha-054",
      outputLink: null,
      image: sparkathonCertImg
    },
    {
      id: "hack-7",
      name: "Althon 2025",
      desc: "Selected as a finalist at the Althon 2025 hackathon, competing with high-performance AI solutions.",
      tech: ["Finalist", "Althon 2025", "VCE Hyderabad"],
      link: "https://github.com/Haritha-054",
      outputLink: null,
      badge: "Finalist",
      image: althonCertImg
    },
    {
      id: "hack-8",
      name: "CSI Fusion 2025",
      desc: "Showcased innovative web technologies and competed in technical contests at CSI Fusion 2025, the annual national student convention organized by the Computer Society of India student branch at MVSR Engineering College.",
      tech: ["Web Development", "CSI Student Convention", "MVSREC"],
      link: "https://github.com/Haritha-054",
      outputLink: null,
      image: csiFusionCertImg
    }
  ];

  const [activeTab, setActiveTab] = useState("projects");
  
  // Get active list based on activeTab
  const getActiveList = () => {
    switch (activeTab) {
      case "internships":
        return internships;
      case "certifications":
        return certifications;
      case "hackathons":
        return hackathons;
      case "projects":
      default:
        return projects;
    }
  };

  const activeList = getActiveList();

  const [activeProject, setActiveProject] = useState(projects[0]);
  const [isLocked, setIsLocked] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Handle Tab Change: updates activeTab, resets locking, and picks the first item in the list
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsLocked(false);
    
    let defaultItem;
    if (tab === "internships") defaultItem = internships[0];
    else if (tab === "certifications") defaultItem = certifications[0];
    else if (tab === "hackathons") defaultItem = hackathons[0];
    else defaultItem = projects[0];
    
    setActiveProject(defaultItem);
  };

  const handleMouseEnter = (item) => {
    if (isLocked) return;
    setActiveProject(item);
  };

  const handleCardClick = (item) => {
    if (activeProject.id === item.id && isLocked) {
      setIsLocked(false);
    } else {
      setActiveProject(item);
      setIsLocked(true);
    }
  };

  useEffect(() => {
    if (!detailContentRef.current) return;
    
    // Smooth stagger fade-in and slide up of elements inside the details block
    gsap.fromTo(detailContentRef.current.children,
      { opacity: 0, y: 15 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.08, 
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }, [activeProject, isLocked]);

  return (
    <>
    <section id="scene-6" className="s6-section" ref={sectionRef}>
      {/* LEFT PANEL: Project / Item Details */}
      <div className="s6-details-panel">
        <div className="s6-details-header">
          <div className="s6-header-chapter">CHAPTER 04</div>
          <h2 className="s6-header-title">THE WORK.</h2>
        </div>

        <div className="s6-active-content" ref={detailContentRef}>
          <div className="s6-active-title-container">
            <h3 className="s6-active-title">{activeProject.name}</h3>
            {activeProject.badge && (
              <span className={`s6-detail-badge-tag ${activeProject.badge.toLowerCase()}`}>
                {activeProject.badge === 'Winner' ? '🏆 Winner' : '🏅 Finalist'}
              </span>
            )}
          </div>
          
          <p className="s6-active-desc">{activeProject.desc}</p>
          
          <div className="s6-tech-pills s6-active-tech">
            {activeProject.tech.map((t, idx) => (
              <span key={idx} className="s6-pill">{t}</span>
            ))}
          </div>

          <div className="s6-lock-instruction">
            {isLocked ? (
              <span>📌 Details Locked. Click another item to switch.</span>
            ) : (
              <span>💡 Click any card to freeze details & access links.</span>
            )}
          </div>

          <div className="s6-active-footer">
            {activeProject.link && (
              <a 
                href={activeProject.link} 
                className="s6-view-link-btn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {activeProject.link.includes('github.com') ? 'View Code' : 'Visit Website'}
              </a>
            )}
            {activeProject.outputLink && (
              <a 
                href={activeProject.outputLink} 
                className="s6-view-output-btn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Output
              </a>
            )}
            {activeProject.image && (
              <button
                className="s6-view-cert-btn"
                onClick={() => setLightboxImg(activeProject.image)}
              >
                🔍 View Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Category Tabs & Compact Grid */}
      <div className="s6-grid-panel">
        <div className="s6-right-container">
          {/* Tabs Navigation */}
          <div className="s6-tabs-nav">
            {["projects", "internships", "certifications", "hackathons"].map((tab) => (
              <button 
                key={tab} 
                className={`s6-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid Layout of Items */}
          <div className="s6-compact-grid">
            {activeList.map((item) => (
              <div 
                key={item.id} 
                className={`s6-compact-card ${activeProject.id === item.id ? 'active' : ''} ${isLocked && activeProject.id === item.id ? 'locked' : ''}`}
                onMouseEnter={() => handleMouseEnter(item)}
                onClick={() => handleCardClick(item)}
              >
                {item.badge && (
                  <div className={`s6-card-badge-tag ${item.badge.toLowerCase()}`}>
                    <span>{item.badge === 'Winner' ? '🏆 Winner' : '🏅 Finalist'}</span>
                  </div>
                )}
                {isLocked && activeProject.id === item.id && (
                  <div className="s6-card-lock-badge">
                    <span>SELECTED</span>
                  </div>
                )}
                <div className="s6-card-img-container">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="s6-card-img-fit" 
                    />
                  ) : (
                    <div className="s6-card-dashed-placeholder">
                      <div className="s6-placeholder-icon">
                        {activeTab === 'internships' ? '💼' :
                         activeTab === 'certifications' ? '🎓' : '🏆'}
                      </div>
                    </div>
                  )}
                </div>
                <div className="s6-card-overlay-label">
                  <span className="s6-overlay-name">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* Certificate Lightbox Modal */}
      {lightboxImg && (
        <div className="s6-lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="s6-lightbox-container" onClick={e => e.stopPropagation()}>
            <button className="s6-lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Full Certificate" className="s6-lightbox-img" />
          </div>
        </div>
      )}
    </>
  );
}
