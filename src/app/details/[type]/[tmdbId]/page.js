"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRequest } from "@/api/getRequest";
import { toast } from "react-toastify";
import { FaLink } from "react-icons/fa6";
import { SiImdb } from "react-icons/si";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const DetailPage = () => {
  const { type, tmdbId } = useParams();

  const [item, setItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const endpoint = type === "movie" ? "movies" : "tv";
        const itemRes = await getRequest(`/tmdb/${endpoint}/details/${tmdbId}`);
        const castRes = await getRequest(
          `/tmdb/${type === "movie" ? "movies" : "tv-series"}/${tmdbId}/casts`
        );

        setItem(itemRes);
        setCast(Array.isArray(castRes) ? castRes : []);
      } catch (error) {
        console.log("error");
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (type && tmdbId) {
      fetchDetails();
    }
  }, [type, tmdbId]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!item) return <div className="text-white p-4">Item not found.</div>;

  const getYear = (date) => {
    try {
      return new Date(date).getFullYear();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="bg-[#10141E] min-h-screen px-4 py-10 md:px-20 text-white">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Poster */}
        <img
          src={
            item.posterPath
              ? `${IMAGE_BASE_URL}${item.posterPath}`
              : "/fallback-image.jpg"
          }
          alt={item.title || item.name}
          className="w-full md:w-[300px] mr-15 rounded-lg object-cover shadow-md"
        />

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            {item.title || item.name}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            {item.rating || "4.2"} ★★★★☆
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm text-white mb-6">
            <div>
              <span className="font-semibold text-gray-400">Length</span>
              <br />
              <br />
              {Math.floor(item.popularity) || "N/A"} min.
            </div>
            <div>
              <span className="font-semibold text-gray-400">Language</span>
              <br />
              <br />
              {item.language || "English"}
            </div>
            <div>
              <span className="font-semibold text-gray-400">Year</span>
              <br />
              <br />
              {getYear(item.releaseDate)}
            </div>
            <div>
              <span className="font-semibold text-gray-400">Status</span>
              <br />
              <br />
              {item.status || "N/A"}
            </div>
          </div>

          {/* Genres */}
          {item.genres?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {item.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-black px-3 py-1 text-xs font-bold rounded-sm"
                  >
                    {typeof genre === "string" ? genre : genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          {item.overview && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Synopsis</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {item.overview}
              </p>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Casts</h3>
              <div className="flex flex-wrap gap-2">
                {cast.map((actor) => (
                  <span
                    key={actor._id}
                    className="text-white font-bold border border-white/80 px-3 py-1 rounded-sm text-sm"
                  >
                    {actor.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-6">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5A698F] hover:bg-[#6C7BA5] transition-colors px-6 py-2 rounded-md text-sm flex items-center gap-2 font-semibold"
              >
                Website
                <FaLink size={16} />
              </a>
            )}

            <a
              href={`https://www.imdb.com/find?q=${encodeURIComponent(
                item.title || item.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5A698F] hover:bg-[#6C7BA5] transition-colors px-6 py-2 rounded-md text-sm flex items-center gap-2 font-semibold"
            >
              IMDB
              <SiImdb size={16} color="white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;