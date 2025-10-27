import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_Key, convertValue } from "../../data.js";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_Key}`;
        const response = await fetch(videoDetails_url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setApiData(data.items[0]);
        } else {
          setApiData(null);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (!apiData) return; // Prevent calling before data exists

    const fetchChannelAndComments = async () => {
      try {
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_Key}`;
        const channelResponse = await fetch(channelData_url);
        const channelData = await channelResponse.json();

        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_Key}`;
        const commentResponse = await fetch(comment_url);
        const commentData = await commentResponse.json();

        if (channelData.items) setChannelData(channelData.items[0]);
        if (commentData.items) setCommentData(commentData.items);
      } catch (error) {
        console.error("Error fetching channel/comments data:", error);
      }
    };

    fetchChannelAndComments();
  }, [apiData]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData?.snippet?.title || "Video Title"}</h3>
      <div className="play-video-info">
        <p>
          {convertValue(apiData?.statistics?.viewCount || 0)} views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="like" />
            {convertValue(apiData?.statistics?.likeCount || 0)}
          </span>
          <span>
            <img src={dislike} alt="dislike" /> 2
          </span>
          <span>
            <img src={share} alt="share" /> Share
          </span>
          <span>
            <img src={save} alt="save" /> Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || ""}
          alt="channel"
        />
        <div>
          <p>{apiData?.snippet?.channelTitle || "Channel Name"}</p>
          <span>
            {convertValue(channelData?.statistics?.subscriberCount || 0)}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        {apiData?.snippet?.description?.slice(0, 250) || ""}
        <hr />
        <h4>{convertValue(apiData?.statistics?.commentCount || 0)} Comments</h4>
        {commentData.map((item) => (
          <div key={item.id} className="comment">
            <img
              src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
              alt="comment-author"
            />
            <div>
              <h3>
                {item.snippet.topLevelComment.snippet.authorDisplayName}
                <span>1 day ago</span>
              </h3>
              <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="like" />
                <span>
                  {convertValue(item.snippet.topLevelComment.snippet.likeCount)}
                </span>
                <img src={dislike} alt="dislike" />
                <span>2</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
