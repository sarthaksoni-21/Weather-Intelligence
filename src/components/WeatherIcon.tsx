import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
  Compass,
  Shirt,
  Activity,
  HeartPulse,
  Car,
  MapPin,
  Search,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Navigation,
  Umbrella,
  Check,
  AlertTriangle,
  LucideProps,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/wmoCodes';

interface WeatherIconProps extends LucideProps {
  name?: string;
  code?: number;
  isDay?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  code,
  isDay = 1,
  className = 'w-6 h-6',
  ...props
}) => {
  let iconKey = name;

  if (code !== undefined && !iconKey) {
    const info = getWeatherCondition(code);
    iconKey = info.iconName;
    if (code === 0 && isDay === 0) {
      iconKey = 'SunDim'; // or moon equivalent
    }
  }

  switch (iconKey) {
    case 'Sun':
      return <Sun className={className} {...props} />;
    case 'SunDim':
      return <SunDim className={className} {...props} />;
    case 'CloudSun':
      return <CloudSun className={className} {...props} />;
    case 'Cloud':
      return <Cloud className={className} {...props} />;
    case 'CloudFog':
      return <CloudFog className={className} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} {...props} />;
    case 'CloudRain':
      return <CloudRain className={className} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={className} {...props} />;
    case 'CloudHail':
      return <CloudHail className={className} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={className} {...props} />;
    case 'Snowflake':
      return <Snowflake className={className} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={className} {...props} />;
    case 'Wind':
      return <Wind className={className} {...props} />;
    case 'Droplets':
      return <Droplets className={className} {...props} />;
    case 'Eye':
      return <Eye className={className} {...props} />;
    case 'Gauge':
      return <Gauge className={className} {...props} />;
    case 'Thermometer':
      return <Thermometer className={className} {...props} />;
    case 'Sunrise':
      return <Sunrise className={className} {...props} />;
    case 'Sunset':
      return <Sunset className={className} {...props} />;
    case 'Compass':
      return <Compass className={className} {...props} />;
    case 'Shirt':
      return <Shirt className={className} {...props} />;
    case 'Activity':
      return <Activity className={className} {...props} />;
    case 'HeartPulse':
      return <HeartPulse className={className} {...props} />;
    case 'Car':
      return <Car className={className} {...props} />;
    case 'MapPin':
      return <MapPin className={className} {...props} />;
    case 'Search':
      return <Search className={className} {...props} />;
    case 'RotateCcw':
      return <RotateCcw className={className} {...props} />;
    case 'Sparkles':
      return <Sparkles className={className} {...props} />;
    case 'Calendar':
      return <Calendar className={className} {...props} />;
    case 'Clock':
      return <Clock className={className} {...props} />;
    case 'ArrowUp':
      return <ArrowUp className={className} {...props} />;
    case 'ArrowDown':
      return <ArrowDown className={className} {...props} />;
    case 'ChevronDown':
      return <ChevronDown className={className} {...props} />;
    case 'ChevronUp':
      return <ChevronUp className={className} {...props} />;
    case 'Navigation':
      return <Navigation className={className} {...props} />;
    case 'Umbrella':
      return <Umbrella className={className} {...props} />;
    case 'Check':
      return <Check className={className} {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} {...props} />;
    default:
      return <Cloud className={className} {...props} />;
  }
};
