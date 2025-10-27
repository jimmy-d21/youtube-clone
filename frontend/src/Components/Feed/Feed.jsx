import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_Key, convertValue } from "../../data.js";
import moment from "moment";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  /*
  const fetchData = async () => {
    const videoList_url = https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_Key};
    await fetch(videoList_url)
      .then((response) => response.json())
      .then((data) => setData(data.items));
    console.log(data);
  };
  */

  const fetchData = async () => {
    try {
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_Key}`;

      const response = await fetch(videoList_url);
      const result = await response.json();

      if (result.items) {
        setData(result.items);
      } else {
        setData([]); // Ensure it's an empty array if no data is received
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {data.map((item, index) => {
        return (
          <Link
            key={index}
            to={`video/${item.snippet.categoryId}/${item.id}`}
            className="card"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>{item.snippet.localized.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {convertValue(item.statistics.viewCount)} views &bull;{" "}
              {item.snippet.publishedAt
                ? moment(item.snippet.publishedAt).fromNow()
                : "Unknown date"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
