'use client';

import { useState } from 'react';
import styles from './page.module.css';

const USAGE_OPTIONS = [
  'Hero Background',
  'Product/Service Card Image',
  'Icon',
  'Blog Main Image',
  'Social Media Post',
  'Other'
];

const DIMENSION_OPTIONS = [
  'Full screen (16:9)',
  'Square (1:1)',
  'Rectangle (4:3)',
  'Vertical (9:16)'
];

export default function Home() {
  const [usage, setUsage] = useState(USAGE_OPTIONS[0]);
  const [dimension, setDimension] = useState(DIMENSION_OPTIONS[0]);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usage,
          dimension,
          subject,
          additionalDetails: details,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({ imageUrl: data.imageUrl, prompt: data.prompt });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Brand Image Generator
          </h1>
          <p className={styles.subtitle}>
            Generate on-brand website assets aligned with our Style Guide.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Card 1: Configuration */}
          <section className={styles.card}>
            <h2 className={styles.cardHeader}>
              <span className={styles.stepNumber}>1</span>
              Configuration
            </h2>

            <form onSubmit={handleGenerate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Usage Context
                </label>
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  className={styles.select}
                >
                  {USAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Dimensions
                </label>
                <select
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value)}
                  className={styles.select}
                >
                  {DIMENSION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., 'Modern optimization dashboard'"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Additional Details (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Lighting, specific elements..."
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.button}
              >
                {loading ? 'Generating...' : 'Generate Asset'}
              </button>
            </form>
          </section>

          {/* Card 2: Image Result */}
          <section className={styles.card}>
            <h2 className={styles.cardHeader}>
              <span className={styles.stepNumber}>2</span>
              Visual Output
            </h2>

            <div className={styles.resultContainer}>
              {result?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.imageUrl}
                  alt={subject}
                  className={styles.imageResult}
                />
              ) : (
                <div className={styles.placeholder}>
                  {!loading && (
                    <>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, marginBottom: '1rem' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <p>Generated image will appear here.</p>
                    </>
                  )}
                  {loading && (
                    <>
                      <div className={styles.spinner}></div>
                      <p style={{ color: 'var(--primary)' }}>Constructing & Rendering...</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Card 3: Exact Prompt */}
          <section className={styles.card}>
            <h2 className={styles.cardHeader}>
              <span className={styles.stepNumber}>3</span>
              Prompt Data
            </h2>

            <div className={styles.promptContainer}>
              {result?.prompt ? (
                <pre className={styles.promptText}>
                  {result.prompt}
                </pre>
              ) : (
                <div className={styles.emptyPrompt}>
                  <p>Detailed prompt will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <p>API Endpoint for Automations (Make.com): <code className={styles.code}>POST /api/generate</code></p>
        </footer>
      </div>
    </main>
  );
}
