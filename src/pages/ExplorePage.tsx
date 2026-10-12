import React from 'react';
import { Compass, Sparkles, MapPin, ArrowRight, IndianRupee, Sun } from 'lucide-react';

interface ExplorePageProps {
  onSelectDestination: (destination: string) => void;
}

const DESTINATION_CARDS = [
  {
    name: 'Goa, India',
    tagline: 'Sunsets, Portuguese Heritage & Bohemian Coastlines',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    duration: '3 - 5 Days',
    budgetEstimate: '₹12,000 - ₹25,000',
    tags: ['Beaches', 'Water Sports', 'Sunset Forts', 'Veg Cafes'],
  },
  {
    name: 'Jaipur, Rajasthan, India',
    tagline: 'The Pink City: Palaces, Forts & Royal Rajasthani Thalis',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    duration: '3 - 4 Days',
    budgetEstimate: '₹14,000 - ₹30,000',
    tags: ['Amber Fort', 'Hawa Mahal', 'Artisan Bazaars', 'Pure Veg Thali'],
  },
  {
    name: 'Kochi & Munnar, Kerala, India',
    tagline: 'God’s Own Country: Tea Hills, Chinese Nets & Backwaters',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    duration: '4 - 6 Days',
    budgetEstimate: '₹18,000 - ₹35,000',
    tags: ['Tea Plantations', 'Houseboats', 'Ayurveda', 'Spice Gardens'],
  },
  {
    name: 'Manali, Himachal Pradesh, India',
    tagline: 'Snow-Capped Peaks, Solang Valley & Pine Forests',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    duration: '4 - 5 Days',
    budgetEstimate: '₹15,000 - ₹28,000',
    tags: ['Solang Adventure', 'Old Manali Cafes', 'Jogini Falls', 'Mountain Pass'],
  },
  {
    name: 'Bali, Indonesia',
    tagline: 'Tropical Temples, Sacred Waterfalls & Serene Rice Terraces',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    duration: '5 - 7 Days',
    budgetEstimate: '₹45,000 - ₹75,000',
    tags: ['Ubud Terraces', 'Cliff Temples', 'Beach Clubs', 'Volcano Views'],
  },
  {
    name: 'Tokyo, Japan',
    tagline: 'Neon Metropolis, Ancient Shrines & Precision Rail Routes',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    duration: '6 - 8 Days',
    budgetEstimate: '₹80,000 - ₹1,40,000',
    tags: ['Shibuya Crossing', 'Shinjuku', 'Historic Asakusa', 'Ramen Alleys'],
  },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectDestination }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Explore Destinations</h1>
        <p className="text-xs text-stone-500 mt-1">
          Select an inspiring destination to generate a customized AI itinerary in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATION_CARDS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-stone-900 backdrop-blur-md">
                  {item.duration}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-xs text-stone-200 line-clamp-1">{item.tagline}</p>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">
                    Est. Budget
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{item.budgetEstimate}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDestination(item.name)}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
