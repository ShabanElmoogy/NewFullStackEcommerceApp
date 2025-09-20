import { LucideIcon } from 'lucide-react-native';

export interface CarouselSlideData {
  id: string;
  // Support both direct text and translation keys
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  // Translation keys (preferred)
  titleKey?: string;
  subtitleKey?: string;
  descriptionKey?: string;
  buttonTextKey?: string;
  icon: LucideIcon;
  image: string;
}

export interface HeroCarouselProps {
  onNavigate: (route: string) => void;
  slides?: CarouselSlideData[];
  autoSlideInterval?: number;
  className?: string;
}