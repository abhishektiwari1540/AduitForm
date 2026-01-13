import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '4rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem',
          letterSpacing: '-0.025em'
        }}>
          Audit Management System
        </h1>
        <p style={{
          color: '#4b5563',
          fontSize: '1.25rem',
          maxWidth: '48rem',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Streamline your audit processes with powerful tools for compliance and quality assurance
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '72rem'
      }}>
        {/* Audit Interface Card */}
        {/* <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          borderLeft: '4px solid #3b82f6',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Audit Interface
          </h3>
          <p style={{
            color: '#4b5563',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Conduct audits with an intuitive interface featuring real-time scoring, progress tracking, and interactive controls.
          </p>
          <Link
            to="/audit-front"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Start Audit
          </Link>
        </div> */}

        {/* Audit Editor Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          borderLeft: '4px solid #8b5cf6',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Audit Editor
          </h3>
          <p style={{
            color: '#4b5563',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Manage and edit audit checklists with the legacy editor. Comprehensive tools for audit structure management.
          </p>
          <Link
            to="/audit-editor"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            Open Editor
          </Link>
        </div>

        {/* Question Editor Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          borderLeft: '4px solid #10b981',
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Question Editor
          </h3>
          <p style={{
            color: '#4b5563',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Advanced question management with full features. Create, edit, and organize audit questions efficiently.
          </p>
          <Link
            to="/audit-question-editor"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Manage Questions
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: '4rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.75rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '56rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          System Features
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>
              <span style={{
                color: '#2563eb',
                fontWeight: 'bold'
              }}>✓</span>
            </div>
            <div>
              <h4 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>Real-time Scoring</h4>
              <p style={{
                color: '#4b5563',
                fontSize: '0.875rem'
              }}>Instant calculation of audit scores and percentages</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              backgroundColor: '#dcfce7',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>
              <span style={{
                color: '#059669',
                fontWeight: 'bold'
              }}>✓</span>
            </div>
            <div>
              <h4 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>Mobile Responsive</h4>
              <p style={{
                color: '#4b5563',
                fontSize: '0.875rem'
              }}>Works seamlessly on desktop, tablet, and mobile devices</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              backgroundColor: '#f3e8ff',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>
              <span style={{
                color: '#7c3aed',
                fontWeight: 'bold'
              }}>✓</span>
            </div>
            <div>
              <h4 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>Progress Tracking</h4>
              <p style={{
                color: '#4b5563',
                fontSize: '0.875rem'
              }}>Monitor audit completion with visual indicators</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              backgroundColor: '#ffedd5',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>
              <span style={{
                color: '#ea580c',
                fontWeight: 'bold'
              }}>✓</span>
            </div>
            <div>
              <h4 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>Data Export</h4>
              <p style={{
                color: '#4b5563',
                fontSize: '0.875rem'
              }}>Export audit results in multiple formats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Add a footer */}
      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem',
        borderTop: '1px solid #e5e7eb',
        width: '100%',
        maxWidth: '72rem'
      }}>
        <p>Audit Management System © {new Date().getFullYear()} | All rights reserved</p>
      </div>
    </div>
  );
}