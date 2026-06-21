import { useState, useEffect } from 'react';
import { useBreakpoint } from '../hooks';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { puppyAPI, reservationAPI } from '../services/api';
import { useToastStore, useLangStore, useThemeStore } from '../store';
import { formatEuro, getAgeString, formatDate } from '../utils/helpers';
import { Loader } from '../components/UI';
import { t } from '../utils/i18n';

const INFO_TITLE = {
  fr: 'À propos de ce chiot',
  nl: 'Over deze puppy',
  en: 'About this puppy',
};

export default function PuppyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { lang } = useLangStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [puppy, setPuppy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showReserve, setShowReserve] = useState(false);
  const [reserving, setReserving] = useState(false);

  const { isMobile } = useBreakpoint();

  const C = {
    bg:      isDark ? '#0a0a0a'                  : '#f5f5f5',
    card:    isDark ? '#141414'                  : '#ffffff',
    card2:   isDark ? '#1a1a1a'                  : '#ececec',
    border:  isDark ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.1)',
    text:    isDark ? '#ffffff'                  : '#111111',
    text2:   isDark ? 'rgba(255,255,255,0.65)'   : '#444444',
    text3:   isDark ? 'rgba(255,255,255,0.35)'   : '#888888',
    primary: '#C9762E',
    shadow:  isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
  };

  useEffect(() => {
    setLoading(true);
    puppyAPI.getById(id)
      .then(r => { setPuppy(r.data.puppy); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/catalog'); });
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 100, background: C.bg, minHeight: '100vh' }}>
      <Loader text="Chargement..." />
    </div>
  );
  if (!puppy) return null;

  const images = [puppy.imageUrl, puppy.imageUrl2, puppy.imageUrl3, puppy.imageUrl4, puppy.imageUrl5].filter(Boolean);
  const l = lang || 'fr';
  const isAvailable = puppy.status === 'available';

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 76 }}>
      <div style={{ padding: '18px 6%', borderBottom: `1px solid ${C.border}`, background: C.card2 }}>
        <p style={{ fontSize: 13, color: C.text3 }}>
          <Link to="/" style={{ color: C.text3, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = C.primary}
            onMouseOut={e => e.target.style.color = C.text3}>
            {l==='fr'?'Accueil':l==='nl'?'Home':l==='en'?'Home':'Accueil'}
          </Link>
          <span style={{ margin: '0 10px', opacity: 0.3 }}>▸</span>
          <Link to="/catalog" style={{ color: C.text3, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = C.primary}
            onMouseOut={e => e.target.style.color = C.text3}>
            {l==='fr'?'Catalogue':l==='nl'?'Catalogus':l==='en'?'Catalog':'Catalogue'}
          </Link>
          <span style={{ margin: '0 10px', opacity: 0.3 }}>▸</span>
          <span style={{ color: C.text2 }}>{puppy.name}</span>
        </p>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: isMobile ? '28px 4%' : '52px 6%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64 }}>
          <div>
            <motion.div key={activeImg} initial={{ opacity: 0.7, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3', background: C.card, boxShadow: C.shadow }}>
              <img src={images[activeImg] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80'}
                alt={puppy.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)', gap: 10, marginTop: 16 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: `2.5px solid ${activeImg === i ? C.primary : C.border}`, opacity: activeImg === i ? 1 : 0.6, cursor: 'pointer', transition: 'all 0.25s ease', padding: 0, background: C.card, transform: activeImg === i ? 'scale(1.02)' : 'scale(1)' }}
                    onMouseOver={e => { if (activeImg !== i) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.borderColor='rgba(201,118,46,0.4)'; }}}
                    onMouseOut={e => { if (activeImg !== i) { e.currentTarget.style.opacity='0.6'; e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.borderColor=C.border; }}}>
                    <img src={img} alt={`Vue ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.primary }}>
                {puppy.breed}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: isMobile ? 36 : 52, color: C.text, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 20 }}>
              {puppy.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 40, color: C.text, letterSpacing: '-0.02em' }}>
                {formatEuro(puppy.price)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { label: l==='fr'?'Sexe':l==='nl'?'Geslacht':l==='en'?'Gender':'Sexe', value: puppy.gender === 'male' ? t('male', l) : t('female', l), icon: puppy.gender === 'male' ? '♂' : '♀' },
                { label: t('birth_date', l), value: puppy.birthDate ? formatDate(puppy.birthDate) + ' (' + getAgeString(puppy.birthDate, l) : 'N/A', icon: '📅' },
                { label: t('color_label', l), value: puppy.color || 'N/A', icon: '🎨' },
                { label: t('weight', l), value: puppy.weight ? `${puppy.weight} kg` : 'N/A', icon: '⚖' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? '14px 16px' : '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24, opacity: 0.8 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: C.text }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {puppy.description && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: isMobile ? 20 : 24, color: C.text, letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.2 }}>
                  {INFO_TITLE[l] || INFO_TITLE.fr}
                </h3>
                <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.75, borderLeft: '3px solid rgba(201,118,46,0.4)', paddingLeft: 18 }}>
                  {puppy.description}
                </p>
              </div>
            )}

            {isAvailable ? (
              <button onClick={() => setShowReserve(!showReserve)}
                style={{
                  width: '100%', padding: isMobile ? '18px' : '20px', borderRadius: 12,
                  fontFamily: "'Outfit',sans-serif", fontSize: isMobile?14:15, fontWeight:800,
                  letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg,#C9762E,#A8652A)',
                  color: '#fff', boxShadow: '0 4px 16px rgba(201,118,46,0.3)',
                }}
                onMouseOver={e => { e.currentTarget.style.background='linear-gradient(135deg,#A8652A,#8B5522)'; e.currentTarget.style.transform='scale(1.02)'; }}
                onMouseOut={e => { e.currentTarget.style.background='linear-gradient(135deg,#C9762E,#A8652A)'; e.currentTarget.style.transform='scale(1)'; }}>
                🐶 {t('reserve_btn', l)}
              </button>
            ) : (
              <div style={{
                width: '100%', padding: isMobile ? '18px' : '20px', borderRadius: 12,
                textAlign: 'center', fontSize: 15, fontWeight: 700,
                background: C.card2, color: C.text3, border: `1px solid ${C.border}`,
              }}>
                {puppy.status === 'reserved' ? t('status_reserved', l) : t('status_sold', l)}
              </div>
            )}

            {/* Reservation form */}
            {showReserve && isAvailable && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 6 }}>
                  {t('reservation_title', l)}
                </h3>
                <p style={{ fontSize: 13, color: C.text3, marginBottom: 20 }}>
                  {t('reservation_sub', l)} • {t('deposit_info', l)} {formatEuro(puppy.price * 0.3)} (30%)
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  try {
                    setReserving(true);
                    const data = Object.fromEntries(fd);
                    const res = await reservationAPI.create({ puppyId: puppy.id, name: data.name, email: data.email, phone: data.phone, notes: data.notes });
                    addToast(t('reservation_confirm', l), 'success');
                    navigate(`/track/${res.data.reservationNumber}`);
                  } catch (err) {
                    addToast(err.response?.data?.error || 'Erreur', 'error');
                  } finally { setReserving(false); }
                }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input name="name" required placeholder={t('name_label', l)} className="input-luxury" />
                  <input name="email" type="email" required placeholder={t('email_label', l)} className="input-luxury" />
                  <input name="phone" type="tel" required placeholder={t('phone_label', l)} className="input-luxury" />
                  <textarea name="notes" rows={3} placeholder={t('notes_ph', l)} className="input-luxury" />
                  <button type="submit" disabled={reserving} className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
                    {reserving ? '⏳...' : `🐶 ${t('confirm_reservation', l)}`}
                  </button>
                </form>
              </motion.div>
            )}

            {puppy.availableFrom && (
              <p style={{ textAlign:'center', fontSize:12, color: C.text3, marginTop: 12 }}>
                {t('available_from', l)} : {formatDate(puppy.availableFrom)}
              </p>
            )}
          </div>
        </div>

        {/* Health & pedigree section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginTop: isMobile ? 48 : 72 }}>
          <div style={{ marginBottom: isMobile ? 24 : 32 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.primary }}>
              {l==='fr'?'Santé & Origine':l==='nl'?'Gezondheid & Herkomst':l==='en'?'Health & Origin':'Santé & Origine'}
            </span>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: isMobile ? 28 : 42, color: C.text, letterSpacing: '-0.02em', marginTop: 8 }}>
              {l==='fr'?'Tous nos chiots sont en parfaite santé':l==='nl'?'Al onze puppy’s zijn in perfecte gezondheid':l==='en'?'All our puppies are in perfect health':'Tous nos chiots sont en parfaite santé'}
            </h2>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: isMobile ? 24 : 32, marginBottom: 24, boxShadow: C.shadow }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: '📜', title: t('pedigree', l), value: puppy.pedigree || l==='fr'?'Inclus LOSH':l==='nl'?'Inclusief LOSH':l==='en'?'LOSH included':'Inclus LOSH' },
                { icon: '📋', title: t('vaccination', l), desc: puppy.vaccinationDetails || l==='fr'?'Vaccins à jour (CHPPiLR)':l==='nl'?'Vaccinaties up-to-date (CHPPiLR)':l==='en'?'Up-to-date vaccines (CHPPiLR)':'Vaccins à jour (CHPPiLR)' },
                { icon: '🐶', title: t('deworming', l), desc: puppy.dewormingDetails || l==='fr'?'Vermifuge régulier':l==='nl'?'Regelmatige ontworming':l==='en'?'Regular deworming':'Vermifuge régulier' },
                { icon: '💜', title: t('microchip', l), value: puppy.microchip || l==='fr'?'Puce électronique incluse':l==='nl'?'Microchip inbegrepen':l==='en'?'Microchip included':'Puce électronique incluse' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '20px', background: C.card2, borderRadius: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,rgba(201,118,46,0.15),rgba(201,118,46,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h5 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.title}</h5>
                    <p style={{ fontSize: 14, color: C.text3, lineHeight: 1.5 }}>{item.value || item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Parents */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div style={{ background: C.card2, borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginBottom: 8 }}>{t('mother', l)}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{puppy.motherName || 'N/A'}</p>
                {puppy.motherBreed && <p style={{ fontSize: 13, color: C.text3 }}>{puppy.motherBreed}</p>}
              </div>
              <div style={{ background: C.card2, borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text3, marginBottom: 8 }}>{t('father', l)}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{puppy.fatherName || 'N/A'}</p>
                {puppy.fatherBreed && <p style={{ fontSize: 13, color: C.text3 }}>{puppy.fatherBreed}</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
