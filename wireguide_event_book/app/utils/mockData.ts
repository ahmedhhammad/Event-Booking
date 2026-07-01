export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  description: string;
  image: string;
  availableSeats: number;
  totalSeats: number;
  featured?: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  time: string;
  venue: string;
  tickets: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2026',
    category: 'Music',
    date: '2026-06-15',
    time: '18:00',
    venue: 'Central Park Arena',
    location: 'New York',
    price: 89,
    description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances across multiple stages with food trucks and craft beverages.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    availableSeats: 450,
    totalSeats: 2000,
    featured: true,
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    category: 'Technology',
    date: '2026-04-22',
    time: '09:00',
    venue: 'Convention Center',
    location: 'San Francisco',
    price: 299,
    description: 'Discover the latest in technology and innovation. Network with industry leaders, attend workshops, and explore cutting-edge products from leading tech companies.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    availableSeats: 120,
    totalSeats: 500,
    featured: true,
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: '2026-05-10',
    time: '12:00',
    venue: 'Riverside Plaza',
    location: 'Chicago',
    price: 65,
    description: 'Indulge in culinary delights from world-renowned chefs. Sample exquisite wines, gourmet dishes, and artisanal foods in a beautiful outdoor setting.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    availableSeats: 280,
    totalSeats: 800,
    featured: true,
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    category: 'Art',
    date: '2026-04-05',
    time: '19:00',
    venue: 'Modern Art Museum',
    location: 'Los Angeles',
    price: 45,
    description: 'Celebrate contemporary art with an exclusive gallery opening featuring emerging and established artists. Enjoy cocktails, live music, and guided tours.',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    availableSeats: 95,
    totalSeats: 150,
  },
  {
    id: '5',
    title: 'Marathon Championship',
    category: 'Sports',
    date: '2026-07-20',
    time: '07:00',
    venue: 'City Center',
    location: 'Boston',
    price: 55,
    description: 'Watch elite runners compete in this prestigious marathon event. Cheer on participants as they race through scenic city routes.',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    availableSeats: 1200,
    totalSeats: 5000,
  },
  {
    id: '6',
    title: 'Comedy Night Live',
    category: 'Entertainment',
    date: '2026-04-18',
    time: '20:00',
    venue: 'Laugh Factory',
    location: 'New York',
    price: 39,
    description: 'An evening of non-stop laughter with some of the funniest comedians in the country. Get ready for stand-up, improv, and interactive comedy.',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    availableSeats: 75,
    totalSeats: 200,
  },
  {
    id: '7',
    title: 'Business Leadership Conference',
    category: 'Business',
    date: '2026-05-28',
    time: '08:30',
    venue: 'Grand Hotel',
    location: 'Miami',
    price: 399,
    description: 'Learn from top business leaders and entrepreneurs. Attend keynote speeches, panel discussions, and networking sessions designed to elevate your business acumen.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    availableSeats: 180,
    totalSeats: 300,
  },
  {
    id: '8',
    title: 'Jazz & Blues Night',
    category: 'Music',
    date: '2026-06-02',
    time: '19:30',
    venue: 'Blue Note Club',
    location: 'New Orleans',
    price: 55,
    description: 'Experience smooth jazz and soulful blues performed by talented musicians in an intimate club setting. A perfect night for music lovers.',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    availableSeats: 45,
    totalSeats: 120,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    eventId: '1',
    eventTitle: 'Summer Music Festival 2026',
    date: '2026-06-15',
    time: '18:00',
    venue: 'Central Park Arena',
    tickets: 2,
    totalPrice: 178,
    status: 'confirmed',
    bookingDate: '2026-03-10',
  },
  {
    id: 'B002',
    eventId: '3',
    eventTitle: 'Food & Wine Festival',
    date: '2026-05-10',
    time: '12:00',
    venue: 'Riverside Plaza',
    tickets: 3,
    totalPrice: 195,
    status: 'confirmed',
    bookingDate: '2026-03-12',
  },
];

export const categories = [
  'All',
  'Music',
  'Technology',
  'Food',
  'Art',
  'Sports',
  'Entertainment',
  'Business',
];

export const locations = [
  'All Locations',
  'New York',
  'San Francisco',
  'Chicago',
  'Los Angeles',
  'Boston',
  'Miami',
  'New Orleans',
];
