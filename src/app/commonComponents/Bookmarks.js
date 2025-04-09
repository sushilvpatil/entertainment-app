import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Recommended from "./RecommendedCard";
import { getRequest } from "@/api/getRequest";

const Bookmarks = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getRequest("/bookmarks");
        const updatedData = data.map((item) => ({
          ...item,
          type: item.itemType,
        }));
        setBookmarkedItems(updatedData);
      } catch (error) {
        console.log(error);
        if (error.data?.message) {
          toast.error(error.data.message);
          return;
        }
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading bookmarks...</div>;
  }

  if (bookmarkedItems.length === 0) {
    return <div className="text-white text-center">No bookmarks found.</div>;
  }

  const bookmarkedMovies = bookmarkedItems.filter(
    (item) => item.itemType === "movie"
  );
  const bookmarkedTVShows = bookmarkedItems.filter(
    (item) => item.itemType === "tv"
  );

  return (
    <div className="p-4">

      {bookmarkedMovies.length > 0 && (
        <div className="mb-8">
         
          <Recommended
            title="Bookmarked Movies"
            items={bookmarkedMovies}
            layout="grid"
            context="bookmarkPage"
          />
        </div>
      )}

      {bookmarkedTVShows.length > 0 && (
        <div>
          <Recommended
            title="Bookmarked TV Series"
            items={bookmarkedTVShows}
            layout="grid"
            context="bookmarkPage"
          />
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
