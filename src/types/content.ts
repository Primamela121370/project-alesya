export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface SiteSettings {
  id: number;
  site_name: string;
  footer_text: string;
  city: string;
  telegram_url: string;
  whatsapp_url: string;
  email: string;
  phone: string;
  updated_at: string;
}

export interface HeroContent {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  quote_text: string;
  quote_author: string;
  updated_at: string;
}

export interface Section {
  id: number;
  key: string;
  tag: string;
  title: string;
  description: string;
  type: string;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
}

export interface SectionItem {
  id: number;
  section_id: number;
  title: string;
  subtitle: string;
  text: string;
  value: string;
  label: string;
  image_url: string;
  sort_order: number;
  is_published: boolean;
}

export interface Result {
  id: number;
  student_name: string;
  exam_type: string;
  score: string;
  short_text: string;
  duration: string;
  note: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string;
  text: string;
  stars: number;
  avatar_url: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface SeoSettings {
  id: number;
  page_key: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  favicon_url: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  name: string;
  contact: string;
  student_grade: string;
  goal: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export interface PublicContent {
  settings: SiteSettings;
  hero: HeroContent;
  sections: Section[];
  sectionItems: SectionItem[];
  results: Result[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  seo: SeoSettings;
}

export interface DashboardData {
  leadsCount: number;
  testimonialsCount: number;
  resultsCount: number;
  recentLeads: Lead[];
}

export type TableName =
  | 'site_settings'
  | 'hero_content'
  | 'sections'
  | 'section_items'
  | 'results'
  | 'testimonials'
  | 'faq'
  | 'seo_settings'
  | 'leads';
