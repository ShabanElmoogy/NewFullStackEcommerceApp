import { Sparkles, Star, Crown } from 'lucide-react-native';
import { CarouselSlideData } from './types';

// Default slides content shown by the carousel. Extend/modify to add or remove slides.
// Uses translation keys that will be resolved by the component
export const defaultSlides: CarouselSlideData[] = [
  {
    id: '1',
    titleKey: 'heroCarousel.slides.summerSale.title',
    subtitleKey: 'heroCarousel.slides.summerSale.subtitle',
    descriptionKey: 'heroCarousel.slides.summerSale.description',
    buttonTextKey: 'heroCarousel.slides.summerSale.buttonText',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center'
  },
  {
    id: '2',
    titleKey: 'heroCarousel.slides.newArrivals.title',
    subtitleKey: 'heroCarousel.slides.newArrivals.subtitle',
    descriptionKey: 'heroCarousel.slides.newArrivals.description',
    buttonTextKey: 'heroCarousel.slides.newArrivals.buttonText',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop&crop=center'
  },
  {
    id: '3',
    titleKey: 'heroCarousel.slides.techDeals.title',
    subtitleKey: 'heroCarousel.slides.techDeals.subtitle',
    descriptionKey: 'heroCarousel.slides.techDeals.description',
    buttonTextKey: 'heroCarousel.slides.techDeals.buttonText',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop&crop=center'
  }
];