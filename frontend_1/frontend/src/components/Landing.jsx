import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from './ParticleBackground';
import ThreeDBloodDrop from './ThreeDBloodDrop';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'inventory_2',
      title: 'End-to-End Sample Tracking',
      desc: 'Chain of custody at every step. From collection to storage, full audit trails and real-time status updates.',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'smart_toy',
      title: 'AI-Powered Diagnostics',
      desc: 'Advanced ML models for preliminary risk assessment, anomaly detection, and diagnostic support.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'insights',
      title: 'Real-Time Analytics',
      desc: 'Customizable dashboards, automated reports, and predictive insights for data-driven decisions.',
      gradient: 'from-cyan-500 to-teal-600'
    },
    {
      icon: 'shield_with_heart',
      title: 'Enterprise-Grade Security',
      desc: 'HIPAA, GDPR, and CLIA compliant. End-to-end encryption, role-based access, and full audit logs.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: 'integration_instructions',
      title: 'Seamless Integration',
      desc: 'API-first architecture that connects with your existing LIS, EHR, and billing systems.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: 'support_agent',
      title: '24/7 Expert Support',
      desc: 'Dedicated clinical and technical support team to ensure your lab runs smoothly around the clock.',
      gradient: 'from-violet-500 to-fuchsia-600'
    }
  ];

  const stats = [
    { value: '2.5M+', label: 'Tests Analyzed', icon: 'biotech' },
    { value: '1,200+', label: 'Healthcare Partners', icon: 'groups' },
    { value: '99.99%', label: 'Uptime SLA', icon: 'timer' },
    { value: '98.5%', label: 'User Satisfaction', icon: 'sentiment_satisfied' }
  ];

  const testimonials = [
    {
      quote: "BloodLab Elite reduced our sample processing time by 65% and eliminated manual errors entirely. It's transformed our lab operations.",
      author: "Dr. Sarah Chen",
      role: "Laboratory Director",
      organization: "City General Hospital"
    },
    {
      quote: "The AI diagnostic assistant is incredible - it catches anomalies that we sometimes miss. Our patient outcomes have improved dramatically.",
      author: "Dr. Michael Rodriguez",
      role: "Chief Pathologist",
      organization: "Medical Research Center"
    },
    {
      quote: "Implementation was seamless, training was minimal, and the ROI was immediate. This is the gold standard for lab management software.",
      author: "Dr. Emily Watson",
      role: "Clinical Informatics Lead",
      organization: "University Medical Center"
    }
  ];

  const trustLogos = [
    { name: "HealthTech Alliance", icon: "verified" },
    { name: "Clinical Standards Board", icon: "medical_services" },
    { name: "Data Security Institute", icon: "security" },
    { name: "Global Health Initiative", icon: "public_health" },
    { name: "Innovation Lab Network", icon: "lightbulb" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small clinics and labs",
      price: "$199",
      period: "/month",
      features: [
        "Up to 5 users",
        "1,000 samples/month",
        "Basic analytics",
        "Email support",
        "Standard integrations",
        "Mobile access"
      ],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Professional",
      description: "Ideal for growing healthcare facilities",
      price: "$499",
      period: "/month",
      features: [
        "Up to 25 users",
        "10,000 samples/month",
        "Advanced analytics & AI",
        "Priority support",
        "Full API access",
        "Custom workflows",
        "Multi-location support"
      ],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Enterprise",
      description: "For large hospitals and healthcare networks",
      price: "Custom",
      period: "",
      features: [
        "Unlimited users",
        "Unlimited samples",
        "Enterprise AI suite",
        "24/7 dedicated support",
        "On-premise deployment",
        "Custom integrations",
        "Dedicated account manager",
        "Training & onboarding"
      ],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <div className="landing-page">
      <ParticleBackground />
      
      {/* Hero Section */}
      <motion.section 
        id="hero"
        className="landing-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-badge"
          >
            <span className="material-icons badge-icon">rocket_launch</span>
            Trusted by 1,200+ healthcare institutions
          </motion.div>
          
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            Clinical Laboratory <br />
            <span className="gradient-text">Intelligence Platform</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-description"
          >
            The next-generation solution for modern clinical laboratories. 
            Streamline workflows, accelerate diagnostics, and elevate patient care with AI-powered intelligence.
          </motion.p>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-actions"
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn primary-btn btn-large">
                <span className="material-icons">dashboard</span>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn primary-btn btn-large">
                  <span className="material-icons">person_add</span>
                  Request a Demo
                </Link>
                <button className="btn secondary-btn btn-large">
                  <span className="material-icons">play_circle</span>
                  Watch Video
                </button>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="hero-trust"
          >
            <p className="trust-text">Trusted by leading institutions worldwide</p>
            <div className="trust-logos">
              {trustLogos.map((logo, idx) => (
                <div key={idx} className="trust-logo">
                  <span className="material-icons">{logo.icon}</span>
                  <span>{logo.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero-visual"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="visual-wrapper">
            <ThreeDBloodDrop />
            <div className="floating-card card-1">
              <span className="material-icons">check_circle</span>
              <p>Sample Verified</p>
            </div>
            <div className="floating-card card-2">
              <span className="material-icons">insights</span>
              <p>Report Generated</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="landing-stats"
        id="stats"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              <div className="stat-icon">
                <span className="material-icons">{stat.icon}</span>
              </div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="landing-features" id="features">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="features-section-header"
        >
          <span className="features-badge">
            <span className="material-icons">tune</span>
            Powerful Features
          </span>
          <h2>Everything you need for modern lab operations</h2>
          <p>Comprehensive tools designed specifically for clinical laboratories and diagnostic centers</p>
        </motion.div>
        
        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
            >
              <div className={`feature-icon ${feature.gradient}`}>
                <span className="material-icons">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing-testimonials" id="testimonials">
        <div className="testimonials-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="testimonials-header"
          >
            <span className="testimonials-badge">
              <span className="material-icons">format_quote</span>
              Trusted by Experts
            </span>
            <h2>Healthcare professionals love BloodLab Elite</h2>
            <p>See what our users have to say about transforming their laboratory operations</p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="testimonial-card glass-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-icons star">star</span>
                  ))}
                </div>
                <p className="quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="avatar">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}, {testimonial.organization}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="landing-pricing" id="pricing">
        <div className="pricing-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pricing-header"
          >
            <span className="pricing-badge">
              <span className="material-icons">price_check</span>
              Simple, Transparent Pricing
            </span>
            <h2>Choose the perfect plan for your lab</h2>
            <p>Scale your solution as your needs grow - no hidden fees, no surprises</p>
          </motion.div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`pricing-card glass-card ${plan.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
              >
                {plan.featured && (
                  <div className="featured-badge">Most Popular</div>
                )}
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  {plan.period && <span className="period">{plan.period}</span>}
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx}>
                      <span className="material-icons check-icon">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className={`btn ${plan.featured ? 'primary-btn' : 'secondary-btn'} btn-large`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section
        className="landing-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="cta-badge">
              <span className="material-icons">event_available</span>
              Book a personalized demo
            </span>
            <h2>Ready to transform your laboratory?</h2>
            <p>Join thousands of labs already using BloodLab Elite to deliver faster, more accurate patient care</p>
            <div className="cta-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn primary-btn btn-large">
                  Enter Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn primary-btn btn-large">
                    Get Started Today
                  </Link>
                  <a href="#" className="btn secondary-btn btn-large">
                    <span className="material-icons">schedule</span>
                    Schedule a Call
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <span className="material-icons">bloodtype</span>
              <h3>BloodLab Elite</h3>
              <p>Clinical Laboratory Intelligence Platform</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#">Integrations</a></li>
                  <li><a href="#">API</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Press</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Security</a></li>
                  <li><a href="#">Status</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                  <li><a href="#">HIPAA</a></li>
                  <li><a href="#">GDPR</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 BloodLab Elite. All rights reserved. Made with ❤️ for clinical excellence.</p>
            <div className="footer-social">
              <a href="#" className="social-icon"><span className="material-icons">alternate_email</span></a>
              <a href="#" className="social-icon"><span className="material-icons">account_circle</span></a>
              <a href="#" className="social-icon"><span className="material-icons">description</span></a>
              <a href="#" className="social-icon"><span className="material-icons">videocam</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
