'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';

/* ────────────────────────────────────────────────────────────
   Inline-style tokens (no CSS vars — safe for all contexts)
──────────────────────────────────────────────────────────── */
const C = {
  bg:     '#FDF6EC',
  card:   '#FFFCF5',
  ink:    '#0A0A0A',
  purple: '#7B2FFF',
  yellow: '#FFE644',
  pink:   '#FF6EB0',
  red:    '#FF3333',
  muted:  '#6B6B6B',
};

function Badge({ children, color = C.yellow }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block',
      background: color,
      border: `2.5px solid ${C.ink}`,
      borderRadius: 100,
      padding: '4px 16px',
      fontWeight: 900,
      fontSize: 13,
      color: C.ink,
      boxShadow: `3px 3px 0 ${C.ink}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function HardCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card,
      border: `3px solid ${C.ink}`,
      borderRadius: 20,
      boxShadow: `6px 6px 0 ${C.ink}`,
      padding: '24px 28px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function CtaButton({ href, variant = 'purple', children }: { href: string; variant?: 'purple' | 'yellow' | 'white'; children: React.ReactNode }) {
  const bg = variant === 'purple' ? C.purple : variant === 'yellow' ? C.yellow : C.card;
  const fg = variant === 'purple' ? '#fff' : C.ink;
  return (
    <Link href={href} style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      color: fg,
      border: `3px solid ${C.ink}`,
      borderRadius: 100,
      padding: '14px 32px',
      fontFamily: "'Cairo', sans-serif",
      fontWeight: 900,
      fontSize: 17,
      boxShadow: `5px 5px 0 ${C.ink}`,
      textDecoration: 'none',
      transition: 'transform 0.08s, box-shadow 0.08s',
      cursor: 'pointer',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `7px 7px 0 ${C.ink}`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${C.ink}`; }}
    >
      {children}
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero comic illustration — SVG cards
──────────────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 420, height: 380, margin: '0 auto' }}>
      {/* Background blob purple */}
      <div style={{ position: 'absolute', top: 20, right: 20, width: 220, height: 220, borderRadius: '50%', background: 'rgba(123,47,255,0.12)', filter: 'blur(40px)' }} />
      {/* Background blob yellow */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,230,68,0.25)', filter: 'blur(30px)' }} />

      {/* Main message card */}
      <div style={{
        position: 'absolute', top: 30, right: 10,
        background: C.card, border: `3px solid ${C.ink}`, borderRadius: 20,
        boxShadow: `7px 7px 0 ${C.ink}`, padding: '20px 24px', width: 260,
        transform: 'rotate(2deg)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, fontFamily: 'Cairo,sans-serif', letterSpacing: 1 }}>
          رسالة مجهولة 👀
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, lineHeight: 1.5, fontFamily: 'Cairo,sans-serif', direction: 'rtl' }}>
          "يا صاحبي انت من أجمل الناس اللي قابلتها في حياتي 🥹"
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Badge color={C.yellow}>من: مجهول 🔒</Badge>
        </div>
      </div>

      {/* OMG sticker */}
      <div style={{
        position: 'absolute', top: 10, left: 30,
        background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 14,
        boxShadow: `5px 5px 0 ${C.ink}`, padding: '10px 18px',
        transform: 'rotate(-8deg)',
        fontFamily: 'Space Grotesk, Arial, sans-serif', fontWeight: 900, fontSize: 28, color: '#fff',
        letterSpacing: -1,
      }}>
        OMG!
      </div>

      {/* Chat bubble 1 */}
      <div style={{
        position: 'absolute', bottom: 110, left: 10,
        background: C.purple, border: `3px solid ${C.ink}`, borderRadius: '18px 18px 18px 4px',
        boxShadow: `4px 4px 0 ${C.ink}`, padding: '12px 18px', maxWidth: 180,
        fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 14, color: '#fff',
        direction: 'rtl',
      }}>
        عايز تتكلم أكتر؟ 💬
      </div>

      {/* Chat bubble 2 */}
      <div style={{
        position: 'absolute', bottom: 50, left: 40,
        background: C.yellow, border: `3px solid ${C.ink}`, borderRadius: '18px 18px 4px 18px',
        boxShadow: `4px 4px 0 ${C.ink}`, padding: '12px 18px', maxWidth: 170,
        fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 14, color: C.ink,
        direction: 'rtl',
      }}>
        افتح شات خاص ✨
      </div>

      {/* Share card sticker */}
      <div style={{
        position: 'absolute', bottom: 40, right: 15,
        background: C.pink, border: `3px solid ${C.ink}`, borderRadius: 12,
        boxShadow: `4px 4px 0 ${C.ink}`, padding: '8px 14px',
        transform: 'rotate(4deg)',
        fontFamily: 'Cairo,sans-serif', fontWeight: 900, fontSize: 13, color: '#fff',
      }}>
        🃏 شارك ككارت
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Steps
──────────────────────────────────────────────────────────── */
const STEPS = [
  { num: '١', emoji: '📝', title: 'اعمل حساب', desc: 'سجّل في ثوانٍ بإيميلك' },
  { num: '٢', emoji: '🔗', title: 'شارك لينكك', desc: 'شارك الرابط مع أصحابك على أي منصة' },
  { num: '٣', emoji: '💌', title: 'استقبل رسائل مجهولة', desc: 'الرسائل تيجيلك بدون ما تعرف مين بعتها' },
  { num: '٤', emoji: '🃏', title: 'شارك أو افتح شات', desc: 'شارك الرسالة ككارت أو افتح شات خاص مع المرسل' },
];

/* ────────────────────────────────────────────────────────────
   Features
──────────────────────────────────────────────────────────── */
const FEATURES = [
  { emoji: '🔒', title: 'رسائل مجهولة', desc: 'المرسل مجهول تماماً — حتى لو فتحت شات', color: C.purple },
  { emoji: '💬', title: 'شات خاص ١:١', desc: 'افتح محادثة سرية مع المرسل المجهول', color: C.pink },
  { emoji: '🃏', title: 'شارك ككارت', desc: 'صدّر الرسالة كصورة جاهزة للسوشيال ميديا', color: C.yellow },
  { emoji: '📨', title: 'رسائلك المرسلة', desc: 'شوف كل الرسائل اللي بعتها من حسابك', color: C.purple },
  { emoji: '🛡️', title: 'بلّغ وبلوك', desc: 'بلّغ أو حظر أي محادثة في أي وقت', color: C.pink },
];

/* ────────────────────────────────────────────────────────────
   Main page component
──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const ctaHref = accessToken ? '/home' : '/register';

  return (
    <div style={{ background: C.bg, minHeight: '100vh', direction: 'rtl', fontFamily: "'Cairo', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ── GRID BACKGROUND ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.055) 1px,transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══════════════════════════════════════════════
            NAV
        ══════════════════════════════════════════════ */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 64, maxWidth: 1100, margin: '0 auto',
        }}>
          {/* Logo */}
          <div style={{
            background: C.purple, border: `3px solid ${C.ink}`, borderRadius: 12,
            padding: '6px 16px', boxShadow: `4px 4px 0 ${C.ink}`,
            fontFamily: 'Space Grotesk, Arial, sans-serif', fontWeight: 900, fontSize: 22,
            color: '#fff', letterSpacing: -1, flexShrink: 0,
          }}>
            OMG!
          </div>

          {/* Nav links — hidden on mobile */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="landing-nav-links">
            {[
              { label: 'عن التطبيق', href: '#about' },
              { label: 'إزاي يشتغل', href: '#how' },
              { label: 'الأمان', href: '#safety' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{
                fontWeight: 700, fontSize: 14, color: C.ink, textDecoration: 'none',
              }}>{l.label}</a>
            ))}
            <Link href="/login" style={{ fontWeight: 700, fontSize: 14, color: C.muted, textDecoration: 'none' }}>
              سجّل دخول
            </Link>
          </div>

          {/* Nav CTA */}
          <Link href={ctaHref} style={{
            background: C.purple, color: '#fff',
            border: `3px solid ${C.ink}`, borderRadius: 100,
            padding: '10px 22px', fontWeight: 900, fontSize: 14,
            boxShadow: `4px 4px 0 ${C.ink}`, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            اعمل لينكك 🔗
          </Link>
        </nav>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Text side */}
            <div style={{ flex: '1 1 340px', maxWidth: 560 }}>
              <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Badge color={C.yellow}>🔥 مجاني 100%</Badge>
                <Badge color={C.purple + '22'}>جديد</Badge>
              </div>

              <h1 style={{
                fontFamily: "'Cairo', sans-serif", fontWeight: 900,
                fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1.15,
                color: C.ink, margin: '0 0 24px',
                letterSpacing: -1,
              }}>
                استقبل رسائل مجهولة…{' '}
                <span style={{
                  background: C.yellow, borderRadius: 8, padding: '0 8px',
                  display: 'inline-block', border: `3px solid ${C.ink}`,
                  boxShadow: `4px 4px 0 ${C.ink}`,
                }}>
                  وافتح شات لو حبيت
                </span>
              </h1>

              <p style={{
                fontSize: 18, color: C.muted, lineHeight: 1.75,
                fontWeight: 600, margin: '0 0 36px', maxWidth: 460,
              }}>
                شارك لينكك، استقبل رسائل من غير ما تعرف مين بعتها،
                شاركها ككارت، أو افتح شات خاص لمدة محدودة.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <CtaButton href={ctaHref} variant="purple">
                  اعمل لينكك 🚀
                </CtaButton>
                <CtaButton href="/login" variant="white">
                  سجّل دخول
                </CtaButton>
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>🔒 المرسل مجهول دايماً</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>⚡ اشتغل في ثواني</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>🛡️ بلوك وبلاغ متاح</span>
              </div>
            </div>

            {/* Illustration side */}
            <div style={{ flex: '1 1 300px', maxWidth: 440 }}>
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section id="how" style={{ background: C.ink, padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Badge color={C.yellow}>إزاي يشتغل؟</Badge>
              <h2 style={{
                fontFamily: "'Cairo', sans-serif", fontWeight: 900,
                fontSize: 'clamp(28px, 5vw, 48px)', color: '#fff',
                margin: '16px 0 0', letterSpacing: -1,
              }}>
                أربع خطوات بس 🎯
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{
                  background: i % 2 === 0 ? C.yellow : C.purple,
                  border: `3px solid ${i % 2 === 0 ? C.ink : '#fff'}`,
                  borderRadius: 20, boxShadow: `6px 6px 0 ${i % 2 === 0 ? C.ink : 'rgba(255,255,255,0.3)'}`,
                  padding: '28px 24px', flex: '1 1 200px', maxWidth: 240, textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, Arial, sans-serif', fontWeight: 900,
                    fontSize: 42, lineHeight: 1,
                    color: i % 2 === 0 ? C.ink : 'rgba(255,255,255,0.3)',
                    marginBottom: 8,
                  }}>{step.num}</div>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{step.emoji}</div>
                  <div style={{
                    fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 18,
                    color: i % 2 === 0 ? C.ink : '#fff', marginBottom: 8,
                  }}>{step.title}</div>
                  <div style={{
                    fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: 13,
                    color: i % 2 === 0 ? C.muted : 'rgba(255,255,255,0.75)', lineHeight: 1.5,
                  }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════ */}
        <section id="about" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Badge color={C.pink}>الميزات</Badge>
              <h2 style={{
                fontFamily: "'Cairo', sans-serif", fontWeight: 900,
                fontSize: 'clamp(28px, 5vw, 48px)', color: C.ink,
                margin: '16px 0 0', letterSpacing: -1,
              }}>
                كل حاجة في مكان واحد 📦
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
              {FEATURES.map((f, i) => (
                <HardCard key={i} style={{ flex: '1 1 200px', maxWidth: 220, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{f.emoji}</div>
                  <div style={{
                    fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 17,
                    color: C.ink, marginBottom: 8,
                  }}>{f.title}</div>
                  <div style={{
                    fontFamily: "'Cairo', sans-serif", fontWeight: 600, fontSize: 13,
                    color: C.muted, lineHeight: 1.6,
                  }}>{f.desc}</div>
                </HardCard>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SAFETY
        ══════════════════════════════════════════════ */}
        <section id="safety" style={{ background: 'rgba(123,47,255,0.06)', padding: '80px 24px', borderTop: `3px solid ${C.ink}`, borderBottom: `3px solid ${C.ink}` }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Badge color={C.purple} >🛡️ الأمان</Badge>
              <h2 style={{
                fontFamily: "'Cairo', sans-serif", fontWeight: 900,
                fontSize: 'clamp(26px, 4vw, 42px)', color: C.ink,
                margin: '16px 0 8px', letterSpacing: -1,
              }}>
                الأمان مش اختياري
              </h2>
              <p style={{ fontWeight: 600, color: C.muted, fontSize: 16 }}>بنيناه في الأساس</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { icon: '🔒', title: 'هوية المرسل مخفية', desc: 'المستلم مش بيشوف أي معلومة عن المرسل — مجهول بالكامل' },
                { icon: '🔐', title: 'تسجيل دخول مطلوب للإرسال', desc: 'النظام بيعرف مين المرسل — بس المستلم ميعرفش — للحماية من الإساءة' },
                { icon: '🚫', title: 'بلوك وبلاغ', desc: 'قدر تحظر أو تبلّغ عن أي محادثة في أي وقت' },
                { icon: '🗑️', title: 'حذف الحساب', desc: 'تقدر تحذف حسابك وكل بياناتك من الإعدادات في أي وقت' },
                { icon: '⚖️', title: 'الإساءة ممنوعة', desc: 'استخدام التطبيق للتحرش أو الأذى ينتهك شروط الخدمة ومحظور صراحةً' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  background: C.card, border: `2.5px solid ${C.ink}`,
                  borderRadius: 16, padding: '18px 20px',
                  boxShadow: `4px 4px 0 ${C.ink}`,
                  flex: '1 1 340px',
                }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 15, color: C.ink, marginBottom: 4, fontFamily: "'Cairo', sans-serif" }}>{s.title}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.muted, lineHeight: 1.6, fontFamily: "'Cairo', sans-serif" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STUDIO NOTE
        ══════════════════════════════════════════════ */}
        <section style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              background: C.ink, color: '#fff',
              border: `3px solid ${C.ink}`, borderRadius: 16,
              padding: '6px 18px', marginBottom: 20,
              fontFamily: 'Space Grotesk, Arial, sans-serif', fontWeight: 900, fontSize: 14,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>
              OMG Studio
            </div>
            <p style={{
              fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 16,
              color: C.muted, lineHeight: 1.8, margin: 0,
            }}>
              OMG هو ملعب رقمي مصري — بنبني تطبيقات اجتماعية، ألعاب، وتجارب إبداعية على الإنترنت.
              <br />
              <span style={{ color: C.purple, fontWeight: 900 }}>OMG! Anonymous Chat</span> هو أول منتجاتنا الحية.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section style={{
          background: C.purple, padding: '80px 24px', textAlign: 'center',
          borderTop: `4px solid ${C.ink}`,
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              background: C.yellow, color: C.ink,
              border: `3px solid ${C.ink}`, borderRadius: 100,
              padding: '6px 20px', marginBottom: 24,
              fontWeight: 900, fontSize: 14, boxShadow: `4px 4px 0 ${C.ink}`,
            }}>
              🎉 ابدأ دلوقتي — مجاناً
            </div>
            <h2 style={{
              fontFamily: "'Cairo', sans-serif", fontWeight: 900,
              fontSize: 'clamp(32px, 6vw, 60px)', color: '#fff',
              margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.2,
            }}>
              جاهز تقول OMG؟
            </h2>
            <p style={{
              fontFamily: "'Cairo', sans-serif", fontWeight: 700,
              fontSize: 17, color: 'rgba(255,255,255,0.75)',
              margin: '0 0 40px', lineHeight: 1.7,
            }}>
              اعمل لينكك واستقبل أول رسالة مجهولة في ثواني
            </p>
            <Link href={ctaHref} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: C.yellow, color: C.ink,
              border: `4px solid ${C.ink}`, borderRadius: 100,
              padding: '18px 48px',
              fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 20,
              boxShadow: `6px 6px 0 ${C.ink}`, textDecoration: 'none',
            }}>
              اعمل لينكك دلوقتي 🔗
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer style={{
          background: C.ink, color: '#fff',
          padding: '32px 24px',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', gap: 16,
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, Arial, sans-serif', fontWeight: 900,
              fontSize: 20, letterSpacing: -1, color: C.yellow,
            }}>
              OMG!
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { label: 'الخصوصية', href: '/privacy' },
                { label: 'الشروط', href: '/terms' },
                { label: 'الدعم', href: '/support' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{
                  color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
              OMG © 2026 · Made in Egypt 🇪🇬
            </div>
          </div>
        </footer>

      </div>

      {/* ── Mobile nav links hide via CSS ── */}
      <style>{`
        @media (max-width: 640px) {
          .landing-nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
