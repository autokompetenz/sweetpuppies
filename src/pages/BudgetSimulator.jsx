import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLangStore, useThemeStore } from '../store';
import { t } from '../utils/i18n';
import { formatEuro, getAgeString } from '../utils/helpers';
import { useBreakpoint } from '../hooks';

export default function BudgetSimulator() {
  const { lang } = useLangStore();
  const { theme } = useThemeStore();
  const { isMobile } = useBreakpoint();
  const isDark = theme === 'dark';
  const l = lang || 'fr';

  const [budget, setBudget] = useState(1500);
  const [includeAccessories, setIncludeAccessories] = useState(true);

  const ACCESSORIES_COST = 300;
  const VET_COST = 200;
  const deductions = (includeAccessories ? ACCESSORIES_COST : 0) + VET_COST;
  const effectiveBudget = Math.max(0, budget - deductions);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 72 }}>
      <div style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', padding: isMobile ? '36px 4% 28px' : '52px 6% 36px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(30px,5vw,64px)', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            {t('budget_title', l)}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-3)', maxWidth: 560, margin: '0 auto' }}>
            {t('budget_sub', l)}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: isMobile ? '24px 4%' : '40px 6%' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? 24 : 32, boxShadow: 'var(--shadow-md)' }}>
          
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              {t('budget_puppy', l)} : <strong style={{ color: 'var(--primary)', fontSize: 24 }}>{formatEuro(budget)}</strong>
            </label>
            <input type="range" min={500} max={5000} step={50} value={budget} onChange={e => setBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#C9762E' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
              <span>{formatEuro(500)}</span>
              <span>{formatEuro(5000)}</span>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={includeAccessories} onChange={e => setIncludeAccessories(e.target.checked)}
                style={{ accentColor: '#C9762E', width: 18, height: 18 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t('include_accessories', l)}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{t('accessories_detail', l)}</p>
              </div>
            </label>
          </div>

          <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
              {l==='fr'?'Déductions':l==='nl'?'Aftrekkingen':l==='en'?'Deductions':'Déductions'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-2)' }}>{t('accessories_detail', l)}</span>
                <span style={{ color: includeAccessories ? '#DC2626' : 'var(--text-3)', fontWeight: 700 }}>
                  {includeAccessories ? `− ${formatEuro(ACCESSORIES_COST)}` : formatEuro(0)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-2)' }}>{t('vet_cost_detail', l)}</span>
                <span style={{ color: '#DC2626', fontWeight: 700 }}>− {formatEuro(VET_COST)}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-2)' }}>{t('effective_budget', l)}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 20 }}>
                  {formatEuro(effectiveBudget)}
                </span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.6 }}>
            {l==='fr'?'Ce simulateur est indicatif. Le budget réel peut varier selon les accessoires choisis.':
              l==='nl'?'Deze calculator is indicatief. Het werkelijke budget kan variëren afhankelijk van de gekozen accessoires.':
              l==='en'?'This simulator is indicative. The actual budget may vary depending on the chosen accessories.':'Ce simulateur est indicatif. Le budget r?el peut varier selon les accessoires choisis.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
