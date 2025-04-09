'use client';
import React from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { MdLocalMovies, MdTv } from 'react-icons/md';
import { postRequest } from '@/api/postRequest';
import { deleteRequest } from '@/api/deleteReqest';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const TrendingSlider = ({
  title,
  items,
  type = 'movie',
  bookmarkedItems = [],
  setBookmarkedItems,
}) => {
  const router = useRouter();

  const toggleBookmark = async (item) => {
    const isBookmarked = bookmarkedItems.some(
      (bookmark) => String(bookmark.itemId) === String(item.tmdbId)
    );

    if (isBookmarked) {
      try {
        const res = await deleteRequest(`/bookmarks/${item.tmdbId}`);
        setBookmarkedItems((prev) =>
          prev.filter((b) => String(b.itemId) !== String(item.tmdbId))
        );
        toast.success(res.message || 'Bookmark removed!');
      } catch (error) {
        if (error.data?.message === 'Bookmark not found') {
          toast.error('Bookmark already removed');
        } else {
          toast.error('Failed to remove bookmark');
        }
      }
    } else {
      const newBookmark = {
        itemId: item.tmdbId,
        itemType: type,
        title: item.title || item.name,
        posterPath: item.posterPath,
      };

      try {
        const res = await postRequest('/bookmark', newBookmark);
        setBookmarkedItems((prev) => [...prev, newBookmark]);
        toast.success(res.data.message || 'Bookmarked!');
      } catch (error) {
        if (error.data?.message === 'Already bookmarked') {
          toast.error('Already bookmarked');
        } else {
          toast.error('Failed to add bookmark');
        }
      }
    }
  };

  const handleCardClick = (item) => {
    const encodedItem = encodeURIComponent(JSON.stringify(item));
    router.push(`/details/${item.type || type}/${item.tmdbId}?data=${encodedItem}`);
  };

  return (
    <div className="mb-6 sm:mt-[50px] md:mt-0 lg:mt-0">
      <h2 className="text-lg md:text-2xl mb-4 text-white">{title}</h2>
      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
        {items.map((item, index) => {
          const year = item.releaseDate?.split('-')[0] || item.firstAirDate?.split('-')[0] || 'N/A';
          const isBookmarked = bookmarkedItems.some(
            (b) => String(b.itemId) === String(item.tmdbId || item.id)
          );

          return (
            <div
              key={item._id || index}
              onClick={() => handleCardClick(item)}
              className="cursor-pointer flex-shrink-0 group rounded-lg overflow-hidden relative transition-all duration-300"
              style={{ width: '350px', height: '170px' }}
            >
              {/* Background Image */}
              <img
                src={
                  item.posterPath
                    ? `${IMAGE_BASE_URL}${item.posterPath}`
                    : '/fallback-image.jpg'
                }
                alt={type === 'movie' ? item.title : item.name}
                className="object-cover w-full h-full"
              />

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(item);
                }}
                className={`p-2 rounded-full absolute top-2 right-2 z-20 transition ${
                  isBookmarked
                    ? 'bg-white text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {isBookmarked ? (
                  <FaBookmark size={16} />
                ) : (
                  <FaRegBookmark size={16} />
                )}
              </button>

              {/* Hover Play Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <button className="flex items-center gap-2 text-white font-medium rounded-full px-3 pr-4 py-1.5 text-xs bg-white/15 hover:bg-white/30 transition-transform transform group-hover:scale-105">
                  <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-black/50"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>Play</span>
                </button>
              </div>

              {/* Info at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 flex flex-col justify-end z-0">
                <div className="flex items-center text-white text-xs gap-2 mb-1 opacity-80">
                  <span>{year}</span>
                  <span className="flex items-center gap-1">
                    · {type === 'movie' ? <MdLocalMovies /> : <MdTv />}
                    {type === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md">
                    {item.rating || 'PG'}
                  </span>
                </div>
                <p className="text-white text-[18px] pb-2">
                  {item.title || item.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSlider;
