'use client';

import React, { useState, useEffect } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { MdLocalMovies } from 'react-icons/md';
import { PiTelevisionBold } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { postRequest } from '@/api/postRequest';
import { deleteRequest } from '@/api/deleteReqest';
import { useRouter } from 'next/navigation';

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const Recommended = ({ title, items, layout = "grid", context = "default", bookmarks = [] }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    const mapped =
      context === "bookmarkPage"
        ? items.map((item) => ({ itemId: item.tmdbId }))
        : bookmarks;
    setBookmarkedItems(mapped);
  }, [items, bookmarks, context]);

  const toggleBookmark = async (item) => {
    const isBookmarked = bookmarkedItems.some(
      (b) => String(b.itemId) === String(item.tmdbId)
    );

    if (isBookmarked) {
      try {
        const res = await deleteRequest(`/bookmarks/${item.tmdbId}`);
        setBookmarkedItems((prev) =>
          prev.filter((b) => String(b.itemId) !== String(item.tmdbId))
        );
        toast.success(res.message || 'Bookmark removed!');
      } catch (error) {
        toast.error(error.data?.message || 'Failed to remove bookmark');
      }
    } else {
      const newBookmark = {
        itemId: item.tmdbId,
        itemType: item.type,
        title: item.title || item.name,
        posterPath: item.posterPath,
      };

      try {
        const res = await postRequest('/bookmark', newBookmark);
        setBookmarkedItems((prev) => [...prev, newBookmark]);
        toast.success(res.data.message || 'Bookmarked!');
      } catch (error) {
        toast.error(error.data?.message || 'Failed to add bookmark');
      }
    }
  };

  return (
    <div className="mt-6 mr-6">
      <h2 className="text-lg md:text-2xl mb-4 text-white">{title}</h2>
      <div
        className={`${
          layout === "grid"
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6"
            : "flex gap-2 overflow-x-auto scrollbar-hide"
        }`}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <RecommendedCard
              key={item.tmdbId}
              item={item}
              isBookmarked={bookmarkedItems.some(
                (b) => String(b.itemId) === String(item.tmdbId)
              )}
              toggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <p className="text-gray-400">No items available</p>
        )}
      </div>
    </div>
  );
};

const RecommendedCard = ({ item, isBookmarked, toggleBookmark }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [isRemoving, setIsRemoving] = useState(false); // State to track if removing a bookmark
  const year =
    item.type === 'movie'
      ? item.releaseDate?.split('-')[0] || 'N/A'
      : item.firstAirDate?.split('-')[0] || 'N/A';

  const router = useRouter();

  const handleCardClick = () => {
    const encodedItem = encodeURIComponent(JSON.stringify(item));
    router.push(`/details/${item.type}/${item.tmdbId}?data=${encodedItem}`);
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the bookmark
    setIsLoading(true); // Start loading
    setIsRemoving(isBookmarked); // Set removing state based on current bookmark status
    await toggleBookmark(item); // Wait for the toggleBookmark function to complete
    setIsLoading(false); // Stop loading
    setIsRemoving(false); // Reset removing state
  };

  return (
    <div
      className="flex flex-col w-[160px] sm:w-[180px] md:w-[200px] group"
      onClick={handleCardClick}
    >
      <div className="relative rounded-lg overflow-hidden w-full h-[200px] sm:h-[220px] md:h-[240px] transition-all duration-300">
        <img
          src={
            item.posterPath
              ? `${IMAGE_BASE_URL}${item.posterPath}`
              : '/fallback-image.jpg'
          }
          alt={item.title || item.name}
          className="object-cover w-full h-full rounded-lg"
        />

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className={`p-2 rounded-full absolute top-2 right-2 z-20 transition ${
            isBookmarked
              ? 'bg-white text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <div
              className={`loader w-4 h-4 border-2 ${
                isRemoving
                  ? 'border-black border-t-transparent' // Black loader for removing
                  : 'border-white border-t-transparent' // White loader for adding
              } rounded-full animate-spin`}
            ></div>
          ) : isBookmarked ? (
            <FaBookmark size={14} />
          ) : (
            <FaRegBookmark color="white" size={14} />
          )}
        </button>

        {/* Hover Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <button className="flex items-center gap-2 text-white font-medium rounded-full px-3 pr-4 py-1.5 text-xs bg-white/15 hover:bg-white/30 transition-transform transform group-hover:scale-105">
            <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 text-black/40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span>Play</span>
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-2 text-white">
        <div className="flex items-center text-gray-400 text-xs gap-2 opacity-80">
          <span>{year}</span>
          <span className="flex items-center gap-1">
            · {item.type === 'movie' ? (
              <MdLocalMovies size={12} />
            ) : (
              <PiTelevisionBold size={12} />
            )}
            {item.type === 'movie' ? 'Movie' : 'TV Series'}
          </span>
          <span className="px-1 rounded-md">· {item.rating || 'PG'}</span>
        </div>
        <p className="text-white text-[13px] mt-1 truncate">
          {item.title || item.name}
        </p>
      </div>
    </div>
  );
};

export default Recommended;
