"use client";
import React, { useState, useEffect } from "react";
import { getRequest } from "@/api/getRequest";
import { toast } from "react-toastify";
import TrendingSlider from "./commonComponents/TrendingSlider";
import Recommended from "./commonComponents/RecommendedCard";
import { FaSearch } from "react-icons/fa";
import Sidebar from "./commonComponents/SlideBar";
import Bookmarks from "./commonComponents/Bookmarks";
import { useRouter } from "next/navigation";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [isFocused, setIsFocused] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [UserData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if token is not present
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
      return; // Stop further execution
    }
  
    const fetchTrendingData = async () => {
      try {
        const movies = await getRequest("/tmdb/movies/trending");
        const tvShows = await getRequest("/tmdb/tv/trending");
        const userData = await getRequest("/users/profile");
        setUserData(userData);
        setTrendingMovies(movies);
        setTrendingTVShows(tvShows);
      } catch (error) {
        toast.error("Failed to load trending data");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchBookmarks = async () => {
      try {
        const data = await getRequest("/bookmarks");
        const updatedData = data.map((item) => ({
          ...item,
          type: item.itemType,
        }));
        setBookmarkedItems(updatedData);
      } catch (error) {
       // toast.error(error?.data?.message || "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookmarks();
    fetchTrendingData();
  }, [router]);
  

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const results =
      activeView === "movies"
        ? trendingMovies.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : activeView === "tv"
        ? trendingTVShows.filter((tv) =>
            tv.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [...trendingMovies, ...trendingTVShows].filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

    setSearchResults(results);
    setIsSearching(true);
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="p-4 mt-1  md:p-8 bg-[#0F111A] w-screen h-screen  lg:ml-19  md:ml-0 sm:ml-0 scrollbar-hide">
      {/* Sidebar */}
      <Sidebar  onNavigate={(view) => setActiveView(view)} user={UserData?.user} />

      {/* Search Bar */}
      <div className="mb-6 ">
        <div className="flex items-center gap-2">
          <FaSearch className="text-white mb-2" size={16} />
          <div
            className={`flex-1 border-b-2 ${
              isFocused ? "border-gray-500" : "border-[#0F111A]"
            }`}
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="text"
              placeholder="Search for movies or TV series"
              className="bg-transparent text-white outline-none w-full pb-1 caret-red-500"
            />
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {isSearching ? (
        <div>
          <h2 className="text-white text-xl font-bold mb-4">
            Found {searchResults.length} results for '{searchQuery}'
          </h2>
          <Recommended
            title=""
            items={searchResults}
            bookmarks={bookmarkedItems}
            layout="grid"
          />
        </div>
      ) : (
        <>
          {activeView === "home" && (
            <>
             <TrendingSlider
  title="Trending"
  items={trendingMovies}
  isLoading={loading} // Pass loading state
  bookmarkedItems={bookmarkedItems}
  setBookmarkedItems={setBookmarkedItems}
/>

<Recommended
  title="Recommended for you"
  items={trendingMovies}
  isLoading={loading} // Pass loading state
  bookmarks={bookmarkedItems}
  layout="grid"
/>
              <Recommended
                title="Movies"
                items={trendingMovies}
                layout="grid"
                bookmarks={bookmarkedItems}
              />
              <Recommended
                title="TV series"
                items={trendingTVShows}
                layout="grid"
                bookmarks={bookmarkedItems}
              />
            </>
          )}
          {activeView === "movies" && (
            <Recommended
              title="Movies"
              items={trendingMovies}
              layout="grid"
              bookmarks={bookmarkedItems}
            />
          )}
          {activeView === "tv" && (
            <Recommended
              title="TV Series"
              items={trendingTVShows}
              layout="grid"
              bookmarks={bookmarkedItems}
            />
          )}
          {activeView === "bookmark" && <Bookmarks />}
          {activeView === "profile" && router.push("/profile")}
        </>
      )}
    </div>
  );
}