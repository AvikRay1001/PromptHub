"use client"

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setsearchText] = useState('');
  const [searchTimeout, setsearchTimeout] = useState(null);
  const [searchedResults, setsearchedResults] = useState([]);
  const [posts, setposts] = useState([]);

  const filterPrompts = () => {
    const regex = new RegExp(searchText,"i");
    return posts.filter((item) => 
      regex.test(item.creator.username) ||
      regex.test(item.prompt) ||
      regex.test(item.tag)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setsearchText(e.target.value);

    //debounce method
    setsearchTimeout(
      setTimeout(() => {
        const searchResults = filterPrompts(e.target.value);
        setsearchedResults(searchResults);
      },500)
    );
  };

  const handleTagClick = (tagName) => {
    setsearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setsearchedResults(searchResult);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('api/prompt');
      const data = await response.json();

      setposts(data);
    }

    fetchPosts();
  },[]);

  return(
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>


    { searchText ? (
      <PromptCardList
        data={searchedResults}
        handleTagClick={handleTagClick}
      /> ) : (
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
        />
      )
    }

    </section>
  )
}


export default Feed