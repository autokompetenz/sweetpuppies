import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { puppyAPI } from '../services/api';
import { formatEuro } from '../utils/helpers';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';
import { useBreakpoint } from '../hooks';
import PuppyCard from '../components/PuppyCard';

const SERVICES = [
  { icon:'🐶', fr:'Chiots de race', nl:'Rashonden', en:'Purebred puppies',
    descFr:'Pedigree LOSH, parents sélectionnés, santé garantie.', descNl:'Stamboom LOSH, geselecteerde ouders, gezondheid gegarandeerd.', descEn:'LOSH Pedigree, selected parents, guaranteed health.' },
  { icon:'📋', fr:'Vaccins & Puce', nl:'Vaccins & Chip', en:'Vaccines & Microchip',
    descFr:'Vaccins à jour, puce électronique, vermifuge, carnet de santé.', descNl:'Vaccinaties up-to-date, microchip, ontworming, gezondheidsboekje.', descEn:'Up-to-date vaccines, microchip, deworming, health record.' },
  { icon:'🐶', fr:'Réservation simple', nl:'Eenvoudig reserveren', en:'Easy reservation',
    descFr:'Acompte de 30%, solde à la remise. Pas de compte nécessaire.', descNl:'30% aanbetaling, saldo bij levering. Geen account nodig.', descEn:'30% deposit, balance on delivery. No account needed.' },
  { icon:'💉', fr:'Suivi en ligne', nl:'Online volgen', en:'Online tracking',
    descFr:'Suivez votre réservation en temps réel avec votre numéro unique.', descNl:'Volg uw reservering in realtime met uw unieke nummer.', descEn:'Track your reservation in real time with your unique number.' },
  { icon:'💶', fr:'Garantie santé', nl:'Gezondheidsgarantie', en:'Health guarantee',
    descFr:'Tous nos chiots partent avec un certificat de bonne santé vétérinaire.', descNl:'Al onze puppy’s krijgen een veterinair gezondheidscertificaat.', descEn:'All our puppies come with a veterinary health certificate.' },
  { icon:'📦', fr:'Livraison possible', nl:'Bezorging mogelijk', en:'Delivery possible',
    descFr:'Livraison sécurisée en Belgique et pays limitrophes.', descNl:'Veilige levering in België en buurlanden.', descEn:'Secure delivery in Belgium and neighboring countries.' },
];

function CookieBanner({ lang }) {
  const [visible, setVisible] = useState(!localStorage.getItem('sp_cookies'));
  if (!visible) return null;
  const accept  = () => { localStorage.setItem('sp_cookies', '1'); setVisible(false); };
  const decline = () => { localStorage.setItem('sp_cookies', '0'); setVisible(false); };
  const msg = { fr:'Nous utilisons des cookies pour améliorer votre expérience.', nl:'We gebruiken cookies om uw ervaring te verbeteren.', en:'We use cookies to improve your experience.' };
  return (
    <div className="cookie-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
      <p style={{ fontSize:14, color:'var(--text-2)', flex:1 }}>🐶 {msg[lang] || msg.fr}</p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={decline} style={{ padding:'9px 18px', background:'var(--bg-card2)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-3)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>{lang==='nl'?'Weigeren':lang==='en'?'Decline':'Refuser'}</button>
        <button onClick={accept} className="btn-primary" style={{ fontSize:13, padding:'9px 20px' }}>{lang==='nl'?'Accepteren':lang==='en'?'Accept':'Accepter'}</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackNum, setTrackNum] = useState('');
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const l = lang || 'fr';
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroY = useTransform(scrollYProgress, [0,1], ['0%','25%']);
  const heroO = useTransform(scrollYProgress, [0,0.7], [1,0]);

  useEffect(() => {
    setLoading(true);
    puppyAPI.getAll({ featured:'true', limit:8 })
      .then(r => { setFeatured(r.data.puppies||[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackNum.trim()) navigate(`/track/${trackNum.trim().toUpperCase()}`);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <section ref={heroRef} style={{ position:'relative', height: isMobile ? '100svh' : '100vh', minHeight:580, display:'flex', alignItems:'center', overflow:'hidden' }}>
        <motion.div style={{ position:'absolute', inset:0, y:heroY }}>
          <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1800&q=80&auto=format"
            alt="Hero" style={{ width:'100%', height:'110%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.3) 100%)' }} />
        </motion.div>

        <motion.div style={{ position:'relative', zIndex:2, padding: isMobile ? '0 5%' : '0 7%', maxWidth:780, opacity:heroO }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(201,118,46,0.15)', border:'1px solid rgba(201,118,46,0.3)', borderRadius:4, padding:'7px 16px', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#C9762E', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.8)' }}>
                {t('hero_badge', l)}
              </span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.2 }}
            style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 'clamp(38px,10vw,56px)' : 'clamp(52px,6vw,88px)', color:'#fff', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:22 }}>
            Sweet<br/><span style={{ color:'#C9762E' }}>Puppies</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.35 }}
            style={{ fontSize: isMobile ? 15 : 18, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:36, maxWidth:520 }}>
            {t('hero_subtitle', l)}
          </motion.p>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.5 }}
            style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link to="/catalog" className="btn-primary" style={{ fontSize: isMobile ? 13 : 14 }}>
              {t('hero_cta1', l)} →
            </Link>
            <Link to="/catalog" className="btn-ghost" style={{ fontSize: isMobile ? 13 : 14, borderColor:'rgba(255,255,255,0.3)', color:'rgba(255,255,255,0.85)' }}>
              {t('hero_cta2', l)}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.6 }}
          style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,0.08)', padding: isMobile ? '16px 5%' : '22px 7%', display:'flex', justifyContent:'space-around', gap:16, flexWrap:'wrap' }}>
          {[
            { value:'8+', label:t('hero_stat1', l) },
            { value:'4.9 ★', label:t('hero_stat2', l) },
            { value:'150+', label:t('hero_stat3', l) },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize: isMobile ? 22 : 30, color:'#C9762E', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize: isMobile ? 10 : 12, color:'rgba(255,255,255,0.45)', marginTop:4, fontWeight:600, letterSpacing:'0.05em' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <div style={{ background:'var(--bg-card2)', borderBottom:'1px solid var(--border)', padding: isMobile ? '20px 5%' : '24px 7%' }}>
        <form onSubmit={handleTrack} style={{ maxWidth:640, margin:'0 auto', display:'flex', gap:10 }}>
          <input value={trackNum} onChange={e => setTrackNum(e.target.value)}
            placeholder={t('track_ph', l)}
            className="input-luxury"
            style={{ flex:1, fontSize: isMobile ? 14 : 15 }} />
          <button type="submit" className="btn-primary" style={{ padding:'13px 20px', fontSize:13, whiteSpace:'nowrap', flexShrink:0 }}>
            {t('track_order', l)}
          </button>
        </form>
      </div>

      {/* Featured puppies */}
      <section style={{ background:'var(--bg)', borderBottom:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 36 : 52 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>
              {l==='fr'?'Nos chiots disponibles':l==='nl'?'Onze beschikbare puppy’s':l==='en'?'Our available puppies':'Nos chiots disponibles'}
            </div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,52px)', color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:12 }}>
              {l==='fr'?'Disponibles\nà la réservation':l==='nl'?'Beschikbaar\nvoor reservering':l==='en'?'Available\nfor reservation':'Disponibles à la réservation'}
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(270px,1fr))', gap: isMobile ? 14 : 22 }}>
            {featured.map((p, i) => <PuppyCard key={p.id} puppy={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ background:'var(--bg-card2)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('services_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              {l==='fr'?'Une adoption en toute confiance':l==='nl'?'Een adoptie met vertrouwen':l==='en'?'Adoption with confidence':'Une adoption en toute confiance'}
            </h2>
            <p style={{ fontSize:16, color:'var(--text-3)', marginTop:12, maxWidth:560, margin:'12px auto 0' }}>{t('services_sub', l)}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 20 }}>
            {SERVICES.map((s, i) => {
              const title = s[l] || s.fr;
              const desc = s[`desc${l.charAt(0).toUpperCase()+l.slice(1)}`] || s.descFr;
              return (
                <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:8 }}>{title}</h3>
                  <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.65 }}>{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ background:'var(--bg)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-eyebrow" style={{ justifyContent:'center' }}>{t('reviews_label', l)}</div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(26px,4vw,50px)', color:'var(--text)', letterSpacing:'-0.02em' }}>
              {l==='fr'?'Ce que disent nos familles':l==='nl'?'Wat onze families zeggen':l==='en'?'What our families say':'Ce que disent nos familles'}
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 14 : 22 }}>
            {[
              { rating:5, content:'Un accueil chaleureux et professionnel. Notre petite Luna est en pleine forme et s\'est parfaitement adaptée à sa nouvelle maison. La livraison s\'est faite dans les conditions idéales.', author:'Sophie M.', city:'Arlon', puppy:'Luna' },
              { rating:5, content:'Éleveur sérieux, chiots en parfaite santé. Les conseils donnés étaient très utiles. La livraison a été rapide et sécurisée. Je recommande vivement.', author:'Thomas D.', city:'Luxembourg', puppy:'Oscar' },
              { rating:5, content:'Nous avons réservé notre Oscar il y a 3 mois. Tout s\'est passé exactement comme prévu. Communication parfaite et livraison impeccable.', author:'Maria L.', city:'Namur', puppy:'Oscar' },
              { rating:5, content:'Charlie est arrivé en pleine forme, bien sociabilisé et déjà propre. Le suivi après la livraison est excellent, on se sent vraiment accompagné.', author:'Pierre H.', city:'Bruxelles', puppy:'Charlie' },
              { rating:4, content:'Très contente de notre expérience. La livraison a été bien organisée et Nala était en pleine santé. Je retire juste une étoile car nous aurions aimé plus de photos avant la réservation.', author:'Julie V.', city:'Liège', puppy:'Nala' },
              { rating:5, content:'Rocky est un amour ! Livré à domicile dans les temps, avec son carnet de santé et tous les papiers. Éleveur à l\'écoute et très professionnel.', author:'Marc B.', city:'Charleroi', puppy:'Rocky' },
              { rating:4, content:'Cookie est adorable et bien dans ses pattes. La livraison a pris un peu de retard mais l\'éleveur nous a prévenus à l\'avance. Bon suivi global.', author:'Céline R.', city:'Mons', puppy:'Cookie' },
              { rating:5, content:'De la réservation à la livraison, tout a été parfait. Notre Titan est un chiot magnifique, bien dans sa tête et dans son corps. Merci pour votre professionnalisme.', author:'Antoine G.', city:'Namur', puppy:'Titan' },
              { rating:5, content:'Nous avons pu venir chercher Milo directement à l\'élevage. Accueil chaleureux, installation impeccable. Le chiot était déjà habitué aux caresses et aux enfants.', author:'Emma S.', city:'Bastogne', puppy:'Milo' },
              { rating:3, content:'Plume est en bonne santé mais nous avons eu un petit souci de communication sur la date de livraison. Récupéré in extremis. Le chiot est parfait cela dit.', author:'Luc P.', city:'Bruxelles', puppy:'Plume' },
              { rating:4, content:'Simba est un amour, très joueur et déjà bien éduqué. La livraison s\'est bien passée. Seul bémol : le dossier de suivi en ligne pourrait être plus détaillé.', author:'Sarah W.', city:'Liège', puppy:'Simba' },
              { rating:5, content:'Duke est arrivé avec tout son nécessaire : carnet de santé, pedigree, puce. Livraison transfrontalière sans aucun problème. Éleveur très réactif par email.', author:'David K.', city:'Luxembourg', puppy:'Duke' },
              { rating:4, content:'Bella est en pleine forme et très câline. La livraison a été faite avec soin. Je recommande pour le sérieux et la qualité du suivi post-livraison.', author:'Nathalie T.', city:'Namur', puppy:'Bella' },
              { rating:5, content:'Nous recommandons les yeux fermés. De la réservation à la livraison, tout a été clair et transparent. Notre Max est un chiot en pleine santé, bien élevé.', author:'François M.', city:'Arlon', puppy:'Max' },
              { rating:3, content:'Chanel est magnifique et bien portante. Cependant le délai de livraison annoncé n\'a pas été respecté (2 jours de retard). L\'équipe s\'est excusée et a offert un petit panier de bienvenue.', author:'Laura D.', city:'Bruxelles', puppy:'Chanel' },
              { rating:4, content:'Buddy est un chiot extraordinaire, très sociable. Livraison bien organisée avec un suivi SMS appréciable. Juste un petit délai sur la réponse à notre premier message.', author:'Hugo L.', city:'Mons', puppy:'Buddy' },
              { rating:5, content:'Neige est arrivée dans un état parfait, propre et déjà habituée à la propreté. L\'éleveur a pris le temps de tout nous expliquer. Livraison douce et sécurisée.', author:'Camille J.', city:'Liège', puppy:'Neige' },
              { rating:4, content:'Sunny est un rayon de soleil ! Très bonne expérience globale. La livraison s\'est bien passée. Nous aurions juste aimé un suivi photo plus régulier avant la réservation.', author:'Romain F.', city:'Charleroi', puppy:'Sunny' },
              { rating:5, content:'Apollo s\'est intégré à la maison comme s\'il avait toujours vécu ici. Livraison parfaite, chiot en pleine santé. Un grand merci pour l\'accompagnement et les conseils.', author:'Valérie P.', city:'Bastogne', puppy:'Apollo' },
              { rating:3, content:'Fripon est en bonne santé et très joueur. La livraison a été correcte mais le suivi des papiers a pris plus de temps que prévu. Satisfait du chiot malgré tout.', author:'Benoît C.', city:'Luxembourg', puppy:'Fripon' },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {Array.from({length:5}).map((_,j)=><span key={j} style={{ color:j<r.rating?'#FFAA00':'var(--border-2)', fontSize:18 }}>★ </span>)}
                </div>
                <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.7, marginBottom:16 }}>"{r.content}"</p>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{r.author}</p>
                <p style={{ fontSize:11, color:'var(--text-3)' }}>{r.city} &middot; {r.puppy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section style={{ background:'var(--bg-card2)', borderTop:'1px solid var(--border)' }} className="section-pad">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 60 }}>
            <div>
              <div className="section-eyebrow">{t('contact_label', l)}</div>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(24px,3vw,42px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:12 }}>
                {l==='fr'?'Envie de nous rencontrer ?':l==='nl'?'Wil je ons ontmoeten?':l==='en'?'Want to meet us?':'Envie de nous rencontrer ?'}
              </h2>
              <p style={{ fontSize:15, color:'var(--text-3)', lineHeight:1.7, marginBottom:24 }}>
                {l==='fr'?'Nous sommes situés à Bastogne, au cœur de la province de Luxembourg. Visites sur rendez-vous uniquement. Contactez-nous pour organiser une rencontre avec nos chiots.':
                  l==='nl'?'We zijn gevestigd in Bastogne, in het hart van de provincie Luxemburg. Bezoek alleen op afspraak. Neem contact met ons op om een ontmoeting met onze puppy’s te regelen.':
                  'We are located in Bastogne, in the heart of Luxembourg province. Visits by appointment only. Contact us to arrange a meeting with our puppies.'}
              </p>
              <div style={{ display:'flex', gap:12, marginBottom:24 }}>
                <a href="https://wa.me/32471234567" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:13, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
                  🐶 {t('whatsapp_btn', l)}
                </a>
                <a href="mailto:contact@sweetpuppies.be" className="btn-ghost" style={{ fontSize:13, textDecoration:'none' }}>
                  📧 Email
                </a>
              </div>
              <button className="btn-ghost" style={{ fontSize:13 }}>{t('contact_appt', l)}</button>
            </div>

            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'28px 24px', boxShadow:'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:20 }}>{t('contact_hours', l)}</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { day: t('mon_fri', l), hours: '09:00 à 18:00' },
                  { day: t('saturday', l), hours: '10:00 à 16:00' },
                  { day: t('sunday', l), hours: 'Fermé ' + t('closed', l) },
                ].map(({day, hours}) => (
                  <div key={day} style={{ display:'flex', justifyContent:'space-between', paddingBottom:12, borderBottom:'1px solid var(--border)' }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{day}</span>
                    <span style={{ fontSize:14, color:'var(--text-2)' }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CookieBanner lang={l} />
    </div>
  );
}
