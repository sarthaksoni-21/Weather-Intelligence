import { CurrentWeatherData, DailyWeatherData, RecommendationCategory } from '../types';

export function generateRecommendations(
  current: CurrentWeatherData,
  daily?: DailyWeatherData
): RecommendationCategory[] {
  const categories: RecommendationCategory[] = [];
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const wind = current.wind_speed_10m;
  const humidity = current.relative_humidity_2m;
  const code = current.weather_code;
  const precip = current.precipitation;

  // Max UV today if daily is provided
  const maxUvToday = daily && daily.uv_index_max && daily.uv_index_max.length > 0 ? daily.uv_index_max[0] : 3;
  const maxRainProb = daily && daily.precipitation_probability_max && daily.precipitation_probability_max.length > 0 ? daily.precipitation_probability_max[0] : (precip > 0 ? 90 : 10);

  // 1. Clothing & Accessories
  const clothingDetails: string[] = [];
  let clothingAdvice = '';
  let clothingBadge = 'Casual';
  let clothingColor = 'bg-sky-500/20 text-sky-200 border-sky-400/30';

  if (feelsLike <= 0) {
    clothingAdvice = 'Heavy winter attire required. Layer up thoroughly!';
    clothingBadge = 'Extreme Cold';
    clothingColor = 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30';
    clothingDetails.push('Thermal base layer & heavy insulated parka');
    clothingDetails.push('Warm beanie, neck gaiter, and insulated gloves');
    clothingDetails.push('Waterproof insulated boots with thermal socks');
  } else if (feelsLike < 12) {
    clothingAdvice = 'Chilly weather. A warm jacket or sweater is recommended.';
    clothingBadge = 'Cool';
    clothingColor = 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    clothingDetails.push('Medium jacket, fleece layer, or wool trench coat');
    clothingDetails.push('Long pants and closed-toe sneakers/shoes');
  } else if (feelsLike <= 22) {
    clothingAdvice = 'Pleasant & mild. Perfect for comfortable light layering.';
    clothingBadge = 'Mild & Pleasant';
    clothingColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
    clothingDetails.push('Light cardigan, denim jacket, or long-sleeve top');
    clothingDetails.push('Comfortable jeans or chinos');
  } else if (feelsLike <= 30) {
    clothingAdvice = 'Warm and sunny! Breathable, lightweight clothing recommended.';
    clothingBadge = 'Warm';
    clothingColor = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    clothingDetails.push('Cotton or linen shirt, t-shirt, and shorts/skirt');
    clothingDetails.push('Breathable footwear or sandals');
  } else {
    clothingAdvice = 'Hot temperatures! Wear ultra-lightweight, loose-fitting clothing.';
    clothingBadge = 'Hot Weather';
    clothingColor = 'bg-rose-500/20 text-rose-200 border-rose-400/30';
    clothingDetails.push('Moisture-wicking loose apparel');
    clothingDetails.push('Wide-brim hat and high-SPF UV protection');
  }

  if (code >= 51 || precip > 0 || maxRainProb > 50) {
    clothingDetails.push('☔ Don\'t forget an umbrella or waterproof raincoat!');
  }
  if (maxUvToday >= 6) {
    clothingDetails.push('🕶️ Bring UV-rated sunglasses and SPF 30+ sunscreen.');
  }

  categories.push({
    title: 'Clothing & Gear',
    icon: 'Shirt',
    badge: clothingBadge,
    badgeColor: clothingColor,
    advice: clothingAdvice,
    details: clothingDetails,
  });

  // 2. Outdoor Activities
  const activityDetails: string[] = [];
  let activityAdvice = '';
  let activityBadge = 'Favorable';
  let activityColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';

  if (code >= 95) {
    activityAdvice = 'Thunderstorms detected! Stay indoors away from windows.';
    activityBadge = 'Dangerous';
    activityColor = 'bg-rose-500/30 text-rose-200 border-rose-500/40';
    activityDetails.push('❌ Postpone all outdoor sports and swimming');
    activityDetails.push('🏠 Indoor activities recommended (Reading, Board games, Gym)');
  } else if (precip > 1.5 || code >= 61) {
    activityAdvice = 'Rainy conditions outside. Great day for indoor pursuits.';
    activityBadge = 'Wet Conditions';
    activityColor = 'bg-sky-500/20 text-sky-200 border-sky-400/30';
    activityDetails.push('🏃 Indoor gym workouts or treadmills preferred');
    activityDetails.push('☕ Indoor cafe visit or museum trip recommended');
  } else if (wind > 35) {
    activityAdvice = 'Breezy to high wind speeds. Exercise caution outdoors.';
    activityBadge = 'High Winds';
    activityColor = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    activityDetails.push('🚴 Cycling may face strong headwinds');
    activityDetails.push('🪁 Great for kite flying, but secure loose outdoor patio items');
  } else if (temp >= 15 && temp <= 25 && precip < 0.2) {
    activityAdvice = 'Prime conditions for sports, running, hiking, and patio dining!';
    activityBadge = 'Ideal Outdoor Day';
    activityColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
    activityDetails.push('🏃 High suitability for jogging & cycling');
    activityDetails.push('🏕️ Great opportunity for parks, picnics, or outdoor dining');
    activityDetails.push('📷 Crisp lighting for outdoor photography');
  } else if (temp > 28) {
    activityAdvice = 'Warm weather ideal for water sports or evening strolls.';
    activityBadge = 'Summer Vibes';
    activityColor = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    activityDetails.push('🏊 Swimming & beach activities highly recommended');
    activityDetails.push('🌅 Early morning or late evening outdoor sessions best');
  } else {
    activityAdvice = 'Moderate weather. Outdoor activities are fine with proper layers.';
    activityBadge = 'Moderate';
    activityColor = 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    activityDetails.push('🚶 Brisk walks or light outdoor jogs');
    activityDetails.push('🧤 Keep hands covered if temperature drops');
  }

  categories.push({
    title: 'Outdoor Activities',
    icon: 'Activity',
    badge: activityBadge,
    badgeColor: activityColor,
    advice: activityAdvice,
    details: activityDetails,
  });

  // 3. Health & UV Safety
  const healthDetails: string[] = [];
  let healthAdvice = '';
  let healthBadge = 'Normal';
  let healthColor = 'bg-sky-500/20 text-sky-200 border-sky-400/30';

  if (maxUvToday >= 8) {
    healthAdvice = 'Very high UV levels! Skin damage can occur quickly.';
    healthBadge = 'High UV Alert';
    healthColor = 'bg-purple-500/20 text-purple-200 border-purple-400/30';
    healthDetails.push('☀️ Apply broad-spectrum SPF 50+ sunscreen every 2 hours');
    healthDetails.push('🧢 Limit sun exposure between 10 AM and 4 PM');
  } else if (maxUvToday >= 5) {
    healthAdvice = 'Moderate UV index. Sun protection advised.';
    healthBadge = 'Moderate UV';
    healthColor = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    healthDetails.push('☀️ Wear SPF 30+ sunscreen outdoors');
  } else {
    healthAdvice = 'Low UV exposure expected today.';
    healthBadge = 'Low UV';
    healthColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
    healthDetails.push('✅ Minimal sun hazard for standard daily routines');
  }

  if (humidity >= 80 && temp >= 22) {
    healthAdvice += ' Muggy air humidity levels.';
    healthDetails.push('💧 Drink extra electrolyte fluids to stay hydrated');
  } else if (humidity <= 25) {
    healthDetails.push('🌵 Dry air detected. Consider using lip balm and skin moisturizer');
  }

  if (wind >= 25 && temp < 10) {
    healthDetails.push('🥶 Wind chill factor: Wind will make it feel noticeably colder!');
  }

  categories.push({
    title: 'Health & Hydration',
    icon: 'HeartPulse',
    badge: healthBadge,
    badgeColor: healthColor,
    advice: healthAdvice,
    details: healthDetails,
  });

  // 4. Travel & Commute
  const travelDetails: string[] = [];
  let travelAdvice = '';
  let travelBadge = 'Good Roads';
  let travelColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';

  if (code >= 95 || code === 82 || code === 65) {
    travelAdvice = 'Severe precipitation and low visibility. Exercise extreme care on highways.';
    travelBadge = 'Hazardous Driving';
    travelColor = 'bg-rose-500/30 text-rose-200 border-rose-400/40';
    travelDetails.push('🚗 Maintain extra braking distance behind vehicles');
    travelDetails.push('💡 Turn on low-beam headlights for visibility');
  } else if (code === 45 || code === 48) {
    travelAdvice = 'Foggy conditions reducing road visibility.';
    travelBadge = 'Low Visibility';
    travelColor = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    travelDetails.push('🌫️ Use fog lights and drive at reduced speeds');
  } else if (code >= 71 || code === 56 || code === 66) {
    travelAdvice = 'Icy or snow-covered road hazard.';
    travelBadge = 'Icy Roads';
    travelColor = 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30';
    travelDetails.push('❄️ Beware of black ice on bridges and overpasses');
    travelDetails.push('🚗 Ensure tire pressure & windshield washer fluid are filled');
  } else {
    travelAdvice = 'Favorable driving and transit conditions across the area.';
    travelBadge = 'Clear Commute';
    travelColor = 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
    travelDetails.push('🟢 Smooth travel expected on highways and city transit');
  }

  categories.push({
    title: 'Travel & Commute',
    icon: 'Car',
    badge: travelBadge,
    badgeColor: travelColor,
    advice: travelAdvice,
    details: travelDetails,
  });

  return categories;
}
