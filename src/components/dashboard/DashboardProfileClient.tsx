'use client';

import { useLanguage } from '@/lib/i18n/context';
import { User, Mail, Phone, Shield } from 'lucide-react';

interface BirthProfileItem {
  id: string;
  birthCity: string;
  birthCountry: string;
  timeOfBirth: string;
  dateOfBirth: string;
  gender?: string | null;
}

interface FullUser {
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  birthProfiles: BirthProfileItem[];
}

export default function DashboardProfileClient({ user }: { user: FullUser }) {
  const { t, language } = useLanguage();

  const getGenderDisplay = (gender?: string | null) => {
    if (!gender) return '';
    if (language === 'hi') {
      switch (gender.toLowerCase()) {
        case 'male':
          return t('genderMale');
        case 'female':
          return t('genderFemale');
        case 'other':
          return t('genderOther');
        default:
          return gender;
      }
    }
    return gender;
  };

  const getRoleDisplay = (role: string) => {
    if (language === 'hi') {
      return role === 'ADMIN' ? 'एडमिन (व्यवस्थापक)' : 'ग्राहक (पंजीकृत)';
    }
    return role;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 font-heading">
          {t('accountProfileTitle')}
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <span className="text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4 text-gold-400" />
              <span>{t('fullNameLabel')}</span>
            </span>
            <strong className="text-white">{user.name}</strong>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <span className="text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-400" />
              <span>{t('emailLabel')}</span>
            </span>
            <strong className="text-white">{user.email}</strong>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <span className="text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-400" />
              <span>{t('summaryWhatsApp')}</span>
            </span>
            <strong className="text-white">{user.phone || '—'}</strong>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-navy-800">
            <span className="text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-400" />
              <span>{t('accountType')}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
              {getRoleDisplay(user.role)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 font-heading">
          {t('savedBirthProfiles')}
        </h2>
        {user.birthProfiles.length === 0 ? (
          <p className="text-xs text-gray-400">{t('noSavedProfiles')}</p>
        ) : (
          <div className="space-y-3">
            {user.birthProfiles.map((bp) => (
              <div
                key={bp.id}
                className="p-4 rounded-2xl bg-navy-950/60 border border-navy-800 text-xs text-gray-300 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white font-semibold">
                    {bp.birthCity}, {bp.birthCountry}
                  </strong>
                  <span className="text-[11px] text-gold-400 font-medium">
                    {bp.timeOfBirth}
                  </span>
                </div>
                <div className="text-gray-400 text-[11px]">
                  {t('summaryDob')} {bp.dateOfBirth} {bp.gender ? `• ${t('genderLabel')}: ${getGenderDisplay(bp.gender)}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
