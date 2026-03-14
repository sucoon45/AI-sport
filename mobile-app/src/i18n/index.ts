import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      "welcome": "Good Morning",
      "home": "Home",
      "leagues": "Leagues",
      "predictions": "Predictions",
      "profile": "Profile",
      "wallet": "Wallet",
      "notifications": "Notifications",
      "vip_upgrade": "Upgrade to VIP",
      "accuracy_msg": "Get 95% accuracy AI predictions",
      "top_predictions": "Top Predictions",
      "ai_analytics": "AI Analytics",
      "live_now": "Live Now",
      "upcoming": "Upcoming Matches",
      "deposit": "Deposit",
      "withdraw": "Withdraw",
      "settings": "Account Settings",
      "affiliate_program": "Affiliate Program",
      "refer_earn": "Refer & Earn",
      "refer_desc": "Invite your friends and earn 10% on every deposit they make!",
      "your_code": "YOUR REFERRAL CODE",
      "invite_friends": "Invite Friends",
      "total_referrals": "Total Referrals",
      "total_earned": "Total Earned",
      "how_it_works": "How it works",
      "step_1": "Share your unique referral code with friends.",
      "step_2": "They join and verify their account.",
      "step_3": "Earn instant bonuses on their transactions.",
    }
  },
  fr: {
    translation: {
      "welcome": "Bonjour",
      "home": "Accueil",
      "leagues": "Ligues",
      "predictions": "Pronostics",
      "profile": "Profil",
      "wallet": "Portefeuille",
      "notifications": "Notifications",
      "vip_upgrade": "Passer en VIP",
      "accuracy_msg": "Obtenez des pronostics IA précis à 95%",
      "top_predictions": "Meilleurs Pronostics",
      "ai_analytics": "Analyses IA",
      "deposit": "Dépôt",
      "withdraw": "Retrait",
      "settings": "Paramètres du compte",
    }
  },
  pt: {
    translation: {
      "welcome": "Bom Dia",
      "home": "Início",
      "leagues": "Ligas",
      "predictions": "Palpites",
      "profile": "Perfil",
      "wallet": "Carteira",
      "notifications": "Notificações",
      "vip_upgrade": "Atualizar para VIP",
      "accuracy_msg": "Obtenha palpites de IA com 95% de precisão",
      "top_predictions": "Principais Palpites",
      "ai_analytics": "Análise de IA",
      "deposit": "Depósito",
      "withdraw": "Saque",
      "settings": "Configurações da Conta",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
