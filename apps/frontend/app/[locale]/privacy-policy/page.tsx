'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const t = useTranslations('privacy');

  const sections = [
    'scope',
    'dataCollection',
    'dataProtection',
    'externalLinks',
    'dataSharing',
    'cookies',
    'policyUpdates',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Link 
          href="/main/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {t('title')}
        </h1>
      </div>
      
      <p className="text-lg text-muted-foreground">
        {t('welcome')}
      </p>

      {sections.map((section) => (
        <section key={section} className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {t(`sections.${section}.title`)}
          </h2>
          
          <p className="text-base text-muted-foreground">
            {t(`sections.${section}.content`)}
          </p>

          {t.raw(`sections.${section}`) && (
            <ul className="list-disc pl-6 space-y-2">
              {Array.isArray(t.raw(`sections.${section}`)) && 
                t.raw(`sections.${section}`).map((point: string, index: number) => (
                  <li key={index} className="text-base text-muted-foreground">
                    {point}
                  </li>
                ))
              }
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}