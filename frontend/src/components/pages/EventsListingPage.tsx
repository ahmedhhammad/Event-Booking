import { Link, useSearchParams, useNavigate } from 'react-router';
import { Search, Calendar, MapPin, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { eventsApi, EventDto } from '@/api/eventsApi';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['All', 'Music', 'Technology', 'Food', 'Art', 'Sports', 'Entertainment', 'Business'];
const SORT_OPTIONS = [
  { value: 'date', label: 'Date (Earliest)' },
  { value: 'price', label: 'Price (Low to High)' },
];
const CATEGORY_IMAGES: Record<string, string> = {
  Music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  Art: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
  Sports: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
  Entertainment: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
  Business: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
};

export function EventsListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [events, setEvents] = useState<EventDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const category = searchParams.get('category') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'date';
  const page = parseInt(searchParams.get('page') ?? '1');
  const PAGE_SIZE = 6;

  const [localSearch, setLocalSearch] = useState(searchTerm);

  const loadEvents = useCallback(() => {
    setLoading(true);
    eventsApi.getEvents({
      searchTerm: searchTerm || undefined,
      category: category && category !== 'All' ? category : undefined,
      sortBy, page, pageSize: PAGE_SIZE,
    })
      .then(res => { setEvents(res.items); setTotalCount(res.totalCount); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm, category, sortBy, page]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const EventCard = ({ ev }: { ev: EventDto }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <ImageWithFallback src={ev.imageUrl || (CATEGORY_IMAGES[ev.category] ?? '')} alt={ev.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">${ev.price}</div>
      </div>
      <div className="p-5">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">{ev.category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{ev.title}</h3>
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="size-4" />
            <span>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="size-4" />
            <span>{ev.venue}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/events/${ev.eventId}`} className="flex-1 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
            View Details
          </Link>
          {user?.role === 'Attendee' && (
            <Link to={`/booking/${ev.eventId}`} className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium">
              Book
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Events</h1>
          <form onSubmit={(e) => { e.preventDefault(); updateParam('searchTerm', localSearch); }}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <Search className="size-5 text-gray-400" />
            <input type="text" placeholder="Search events..."
              className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none"
              value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 space-y-6">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <SlidersHorizontal className="size-5" /> Filters
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={(category || 'All') === cat}
                        onChange={() => updateParam('category', cat === 'All' ? '' : cat)}
                        className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                <select value={sortBy} onChange={e => updateParam('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <button onClick={() => setSearchParams({})} className="w-full text-sm text-blue-600 hover:text-blue-700 text-center">
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Events Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                {loading ? 'Loading…' : `${totalCount} event${totalCount !== 1 ? 's' : ''} found`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><Grid className="size-5" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><List className="size-5" /></button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'}>
                {events.map(ev => <EventCard key={ev.eventId} ev={ev} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => updateParam('page', String(page - 1))} disabled={page <= 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                  <ChevronLeft className="size-5" />
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button onClick={() => updateParam('page', String(page + 1))} disabled={page >= totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-40 hover:bg-gray-50">
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
