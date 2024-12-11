import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Presentation, Lightbulb, BookOpen, Network, Music, Ticket, Trophy } from 'lucide-react';
import { CategoryInfo, EventCategory } from '../../types/event';
import { useNavigate } from 'react-router-dom';

export const eventCategories: CategoryInfo[] = [
  {
    id: 'corporate',
    name: 'Corporate Events',
    description: 'Professional gatherings, team building, and business meetings',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'conference',
    name: 'Conferences',
    description: 'Large-scale professional gatherings and industry events',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'exhibition',
    name: 'Exhibitions',
    description: 'Product showcases, trade shows, and art exhibitions',
    icon: Presentation,
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'workshop',
    name: 'Workshops',
    description: 'Interactive learning and skill development sessions',
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'seminar',
    name: 'Seminars',
    description: 'Educational presentations and knowledge sharing',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'networking',
    name: 'Networking Events',
    description: 'Professional networking and social gatherings',
    icon: Network,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'cultural',
    name: 'Cultural Events',
    description: 'Cultural celebrations and traditional performances',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'concert',
    name: 'Concerts',
    description: 'Live music performances and entertainment shows',
    icon: Ticket,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: 'sports',
    name: 'Sports Events',
    description: 'Sporting events and athletic competitions',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  }
];

interface EventCategoriesProps {
  selectedCategory: EventCategory | null;
  onSelectCategory: (category: EventCategory | null) => void;
}

export const EventCategories: React.FC<EventCategoriesProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: EventCategory) => {
    if (selectedCategory === categoryId) {
      onSelectCategory(null);
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-200'}`}
            >
              <div className="relative h-40">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{category.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};