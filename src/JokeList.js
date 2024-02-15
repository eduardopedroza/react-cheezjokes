import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList() {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getJokes();
  }, []);

  async function getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let newJokes = [];
      let seenJokes = new Set();

      while (newJokes.length < 5) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  }

  const vote = (id, delta) => {
    setJokes( prevJokes => 
      prevJokes.map(joke => 
        joke.id === id ? { ...joke, votes: joke.votes+ delta } : joke
      )
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
    <button
      className="JokeList-getmore"
      onClick={generateNewJokes}
    >
      Get New Jokes
    </button>

    {sortedJokes.map(j => (
      <Joke
        text={j.joke}
        key={j.id}
        id={j.id}
        votes={j.votes}
        vote={vote}
      />
    ))}
    </div>
  );
  
}

export default JokeList;
