import React, { useEffect, useState } from "react";
import "./Recommended.css";
import { API_Key, convertValue } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    try {
      const related_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&videoCategoryId=${categoryId}&key=${API_Key}`;
      const response = await fetch(related_url);
      const data = await response.json();

      if (data.items) {
        setApiData(data.items);
      } else {
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]); // Re-fetch data when categoryId changes

  return (
    <div className="recommended">
      {apiData.map((item) => (
        <Link
          to={`/video/${categoryId}/${item.id}`}
          key={item.id}
          className="side-video-list"
        >
          <img
            src={item.snippet?.thumbnails?.medium?.url || "default-thumbnail.jpg"}
            alt={item.snippet?.title || "Video Thumbnail"}
          />
          <div className="vid-info">
            <h4>{item.snippet?.title || "Untitled Video"}</h4>
            <p>{item.snippet?.channelTitle || "Unknown Channel"}</p>
            <p>{convertValue(item.statistics?.viewCount || 0)} Views</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recommended;